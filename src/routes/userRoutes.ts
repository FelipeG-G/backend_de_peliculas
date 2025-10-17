import { Router, Request, Response } from "express";
import UserController from "../controllers/UserController";
import UserDAO from "../dao/UserDAO"; // si lo usas en algún método

const router = Router();

/**
 * @route GET /users
 * @description Obtener todos los usuarios.
 */
router.get("/", (req: Request, res: Response) => UserController.getAll(req, res));

/**
 * @route POST /users/register
 * @description Registrar un nuevo usuario.
 */
router.post("/register", (req: Request, res: Response) => UserController.registerUser(req, res));

/**
 * @route POST /users/login
 * @description Iniciar sesión de usuario.
 */
router.post("/login", (req: Request, res: Response) => UserController.loginUser(req, res));

/**
 * @route GET /users/:id
 * @description Obtener un usuario por ID.
 */
router.get("/:id", (req: Request, res: Response) => UserController.read(req, res));

/**
 * @route POST /users
 * @description Crear un usuario.
 */
router.post("/", (req: Request, res: Response) => UserController.create(req, res));

/**
 * @route PUT /users/:id
 * @description Actualizar un usuario existente.
 */
router.put("/:id", (req: Request, res: Response) => UserController.update(req, res));

/**
 * @route DELETE /users/:id
 * @description Eliminar un usuario.
 */
router.delete("/:id", (req: Request, res: Response) => UserController.delete(req, res));

export default router;
