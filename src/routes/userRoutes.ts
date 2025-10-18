import { Router } from "express";
import { loginUser, registerUser, requestPasswordReset, resetPassword, getUserProfile } from "../controllers/UserController"; // Importa las funciones de UserController
import authMiddleware from "../middleware/authMiddleware"; // Importa el middleware de autenticación

const router = Router();

// Ruta para iniciar sesión
router.post("/login", loginUser);

// Ruta para registrar usuario
router.post("/register", registerUser);

// Ruta para solicitar el restablecimiento de contraseña
router.post("/request-password-reset", requestPasswordReset);

// Ruta para restablecer la contraseña
router.post("/reset-password", resetPassword);

// Ruta para obtener los datos del perfil de usuario (protegida)
router.get("/", authMiddleware, getUserProfile);  // Ruta protegida para obtener el perfil del usuario

export default router;  // Aquí exportamos correctamente el router
