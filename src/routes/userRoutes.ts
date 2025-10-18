import { Router, Request, Response } from "express";
import { loginUser, registerUser, requestPasswordReset, resetPassword} from "../controllers/UserController"; // Importa las funciones de UserController
import UserController from "../controllers/UserController";

const router = Router();

// Ruta para iniciar sesión
router.post("/login", loginUser);


router.get("/profile", (req: Request, res: Response) => UserController.getProfile(req, res));
router.put("/profile", (req: Request, res: Response) => UserController.updateProfile(req, res));

router.delete("/profile", (req: Request, res: Response) => UserController.deleteProfile(req, res));

// Ruta para registrar usuario
router.post("/register", registerUser);

// Ruta para solicitar el restablecimiento de contraseña
router.post("/request-password-reset", requestPasswordReset);

// Ruta para restablecer la contraseña
router.post("/reset-password", resetPassword);

export default router;  // Aquí exportamos correctamente el router
