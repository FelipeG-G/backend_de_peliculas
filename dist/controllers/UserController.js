"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = exports.resetPassword = exports.requestPasswordReset = void 0;
const GlobalController_1 = __importDefault(require("./GlobalController"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User")); // Asegúrate de importar el modelo de usuario
const nodemailer_1 = __importDefault(require("nodemailer")); // Para enviar correos electrónicos
const crypto_1 = __importDefault(require("crypto")); // Para generar un token único de restablecimiento
const UserDAO_1 = __importDefault(require("../dao/UserDAO")); // Importa UserDAO, que extiende GlobalDAO
// Función para enviar correo de restablecimiento de contraseña
const sendResetEmail = async (email, token) => {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail", // Puedes usar cualquier otro servicio de correo
        auth: {
            user: process.env.EMAIL_USER, // Tu dirección de correo electrónico
            pass: process.env.EMAIL_PASS, // Tu contraseña de correo electrónico (mejor usar contraseñas de aplicación)
        },
    });
    const resetUrl = `http://localhost:8080/reset-password/${token}`; // URL para el restablecimiento de contraseña
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Restablecimiento de contraseña",
        text: `Haga clic en el siguiente enlace para restablecer su contraseña: ${resetUrl}`,
    };
    await transporter.sendMail(mailOptions);
};
// Ruta para solicitar el restablecimiento de contraseña
const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "❌ El correo no está registrado" });
        }
        // Generar un token de restablecimiento único
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        // Guardar el token en la base de datos (en este ejemplo, en el modelo User)
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000);
        // El token será válido por 1 hora
        await user.save();
        // Enviar el correo de restablecimiento
        await sendResetEmail(email, resetToken);
        return res.status(200).json({ message: "✅ Hemos enviado un correo para restablecer la contraseña" });
    }
    catch (error) {
        console.error("Error al enviar el correo:", error);
        return res.status(500).json({ message: "❌ Error al enviar el correo", error });
    }
};
exports.requestPasswordReset = requestPasswordReset;
// Ruta para restablecer la contraseña
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const user = await User_1.default.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }, // Verifica si el token no ha expirado
        });
        if (!user) {
            return res.status(400).json({ message: "❌ El token de restablecimiento es inválido o ha expirado" });
        }
        // Encriptar la nueva contraseña
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        // Actualizar la contraseña del usuario
        user.password = hashedPassword;
        user.resetPasswordToken = undefined; // Limpiar el token de restablecimiento
        user.resetPasswordExpires = undefined; // Limpiar la expiración del token
        await user.save();
        return res.status(200).json({ message: "✅ Contraseña restablecida correctamente" });
    }
    catch (error) {
        console.error("Error al restablecer la contraseña:", error);
        return res.status(500).json({ message: "❌ Error al restablecer la contraseña", error });
    }
};
exports.resetPassword = resetPassword;
// Función de registro
const registerUser = async (req, res) => {
    const { username, lastname, birthdate, email, password } = req.body;
    try {
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "❌ Este correo ya está registrado" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = new User_1.default({
            username,
            lastname,
            birthdate,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        return res.status(201).json({ message: "✅ Registro exitoso" });
    }
    catch (error) {
        return res
            .status(500)
            .json({
            message: "❌ Error al registrar el usuario",
            error: error.message,
        });
    }
};
exports.registerUser = registerUser;
// Función de inicio de sesión
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ message: "❌ Usuario o contraseña incorrectos" });
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res
                .status(400)
                .json({ message: "❌ Usuario o contraseña incorrectos" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return res.status(200).json({
            message: "✅ Inicio de sesión exitoso",
            token,
        });
    }
    catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({
            message: "❌ Error al intentar iniciar sesión",
            error: error.message,
        });
    }
};
exports.loginUser = loginUser;
// Combina los métodos genéricos de GlobalController + específicos
const globalController = new GlobalController_1.default(UserDAO_1.default);
const UserController = {
    create: globalController.create.bind(globalController),
    read: globalController.read.bind(globalController),
    update: globalController.update.bind(globalController),
    delete: globalController.delete.bind(globalController),
    getAll: globalController.getAll.bind(globalController),
    registerUser: exports.registerUser,
    loginUser: exports.loginUser,
    requestPasswordReset: exports.requestPasswordReset,
    resetPassword: exports.resetPassword,
};
exports.default = UserController;
//# sourceMappingURL=UserController.js.map