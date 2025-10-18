"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = __importDefault(require("../controllers/UserController"));
const router = (0, express_1.Router)();
/**
 * @route GET /users
 * @description Obtener todos los usuarios.
 */
router.get("/", (req, res) => UserController_1.default.getAll(req, res));
/**
 * @route POST /users/register
 * @description Registrar un nuevo usuario.
 */
router.post("/register", (req, res) => UserController_1.default.registerUser(req, res));
/**
 * @route POST /users/login
 * @description Iniciar sesión de usuario.
 */
router.post("/login", (req, res) => UserController_1.default.loginUser(req, res));
/**
 * @route GET /users/:id
 * @description Obtener un usuario por ID.
 */
router.get("/:id", (req, res) => UserController_1.default.read(req, res));
/**
 * @route POST /users
 * @description Crear un usuario.
 */
router.post("/", (req, res) => UserController_1.default.create(req, res));
/**
 * @route PUT /users/:id
 * @description Actualizar un usuario existente.
 */
router.put("/:id", (req, res) => UserController_1.default.update(req, res));
/**
 * @route DELETE /users/:id
 * @description Eliminar un usuario.
 */
router.delete("/:id", (req, res) => UserController_1.default.delete(req, res));
exports.default = router;
//# sourceMappingURL=userRoutes.js.map