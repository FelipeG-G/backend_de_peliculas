import { Router } from "express";
import { loginUser, registerUser,  requestPasswordReset, resetPassword } from "../controllers/UserController"; // Importa las funciones de UserController

const router = Router();

// Ruta para iniciar sesión
router.post("/login", loginUser);  // Asegúrate de que esta ruta esté bien configurada

// Ruta para registrar usuario
router.post("/register", registerUser); // Asegúrate de que esta ruta esté bien configurada

// Ruta para solicitar el restablecimiento de la contraseña
router.post("/request-password-reset", requestPasswordReset);

// Ruta para restablecer la contraseña
router.post("/reset-password", resetPassword);

export default router;
