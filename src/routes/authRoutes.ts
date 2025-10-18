import { Router } from "express";
import { loginUser, registerUser } from "../controllers/UserController"; // Importa las funciones de UserController

const router = Router();

// Ruta para iniciar sesión
router.post("/login", loginUser);  // Asegúrate de que esta ruta esté bien configurada

// Ruta para registrar usuario
router.post("/register", registerUser); // Asegúrate de que esta ruta esté bien configurada

export default router;
