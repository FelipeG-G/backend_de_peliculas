import { Router } from "express";
import { loginUser, registerUser, requestPasswordReset, resetPassword, getUserProfile } from "../controllers/UserController"; // Importa todas las funciones del controlador
import authMiddleware from "../middleware/authMiddleware"; // Importa el middleware para la autenticación

const router = Router();

// Ruta para iniciar sesión
router.post("/login", loginUser);

// Ruta para registrar usuario
router.post("/register", registerUser);

// Ruta para solicitar el restablecimiento de contraseña
router.post("/request-password-reset", requestPasswordReset);

// Ruta para restablecer la contraseña
router.post("/reset-password", resetPassword);

// Ruta para obtener los datos del perfil de usuario
router.get("/", authMiddleware, getUserProfile);  // Esta es la ruta para obtener el perfil, con el middleware de autenticación

export default router;
