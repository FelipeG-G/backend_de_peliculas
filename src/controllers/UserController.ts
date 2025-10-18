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


// Función para obtener los datos del perfil de un usuario autenticado
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    // Suponiendo que el ID del usuario está disponible a través del middleware (req.user.id)
    const userId = req.user.id; // El ID del usuario se extrae del token JWT
    
    // Buscar al usuario por su ID en la base de datos
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "❌ Usuario no encontrado" });
    }

    // Devolver los datos del usuario
    return res.status(200).json({
      user: {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        birthdate: user.birthdate,
      }
    });
  } catch (error) {
    console.error("Error al obtener perfil de usuario:", error);
    return res.status(500).json({ message: "❌ Error al obtener el perfil" });
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
};

export default UserController;
