import { Request, Response } from "express";
import GlobalController from "./GlobalController"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User"; // Asegúrate de importar el modelo de usuario
import nodemailer from "nodemailer"; // Para enviar correos electrónicos
import crypto from "crypto"; // Para generar un token único de restablecimiento
import UserDAO from "../dao/UserDAO"; // Importa UserDAO, que extiende GlobalDAO

// Función para enviar correo de restablecimiento de contraseña
const sendResetEmail = async (email: string, token: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // Puedes usar cualquier otro servicio de correo
    auth: {
      user: process.env.EMAIL_USER, // Tu dirección de correo electrónico
      pass: process.env.EMAIL_PASS, // Tu contraseña de correo electrónico (mejor usar contraseñas de aplicación)
    },
  });

  const resetUrl = `http://localhost:5173/reset-password/${token}`; // URL para el restablecimiento de contraseña

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Restablecimiento de contraseña",
    text: `Haga clic en el siguiente enlace para restablecer su contraseña: ${resetUrl}`,
  };

  await transporter.sendMail(mailOptions);
};

// Ruta para solicitar el restablecimiento de contraseña
export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "❌ El correo no está registrado" });
    }

    // Generar un token de restablecimiento único
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Guardar el token en la base de datos
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora de validez
    await user.save();

    // Enviar el correo de restablecimiento
    const resetUrl = `http://localhost:5173/#/new-password/${resetToken}`;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Restablecimiento de contraseña",
      text: `Haga clic en el siguiente enlace para restablecer su contraseña: ${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "✅ Se ha enviado un correo para restablecer la contraseña" });
  } catch (error) {
    return res.status(500).json({ message: "❌ Error al enviar el correo", error });
  }
};

// Ruta para restablecer la contraseña
export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "❌ El token ha expirado o no es válido" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "✅ Contraseña restablecida correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "❌ Error al restablecer la contraseña", error });
  }
};

// Función de registro
export const registerUser = async (req: Request, res: Response) => {
  const { username, lastname, birthdate, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "❌ Este correo ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      lastname,
      birthdate,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({ message: "✅ Registro exitoso" });
  } catch (error: any) {
    return res
      .status(500)
      .json({
        message: "❌ Error al registrar el usuario",
        error: error.message,
      });
  }
};

// Función de inicio de sesión
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "❌ Usuario o contraseña incorrectos" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "❌ Usuario o contraseña incorrectos" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "✅ Inicio de sesión exitoso",
      token,
    });
  } catch (error:any) {
    console.error("Error en login:", error);
    return res.status(500).json({
      message: "❌ Error al intentar iniciar sesión",
      error: error.message,
    });
  }
};

// Obtener el perfil del usuario logueado
export const getProfile = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Token no proporcionado" });

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret no configurado" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret) as unknown as { userId: string };
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ user });
  } catch (error: any) {
    res.status(401).json({ message: "Token inválido o expirado", error: error.message });
  }
};


// ✅ Editar perfil del usuario logueado (sin pedir id)
export const updateProfile = async (req: Request, res: Response) => {
  try {
    // el front debe mandar el email o token decodificado
    const { email, username, lastname, birthdate, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "❌ Usuario no encontrado" });
    }

    // Actualizar los campos recibidos
    if (username) user.username = username;
    if (lastname) user.lastname = lastname;
    if (birthdate) user.birthdate = birthdate;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (email) user.email =email;
    await user.save();

    return res.status(200).json({
      message: "✅ Perfil actualizado correctamente",
      user,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "❌ Error al actualizar perfil",
      error: error.message,
    });
  }
};
// ✅ Eliminar cuenta del usuario logueado
export const deleteProfile = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token no proporcionado" });

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret no configurado" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret) as { userId: string };
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    await user.deleteOne();

    return res.status(200).json({ message: "✅ Cuenta eliminada correctamente" });
  } catch (error: any) {
    console.error("Error al eliminar cuenta:", error);
    return res.status(500).json({ message: "❌ Error al eliminar cuenta", error: error.message });
  }
};


// Combina los métodos genéricos de GlobalController + específicos
const globalController = new GlobalController(UserDAO);
const UserController = {
  create: globalController.create.bind(globalController),
  read: globalController.read.bind(globalController),
  update: globalController.update.bind(globalController),
  delete: globalController.delete.bind(globalController),
  getAll: globalController.getAll.bind(globalController),
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
  getProfile,
  updateProfile,
  deleteProfile
};

export default UserController;
