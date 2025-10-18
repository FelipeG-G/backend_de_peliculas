"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController"); // Importa las funciones de UserController
const router = (0, express_1.Router)();
// Ruta para iniciar sesión
router.post("/login", UserController_1.loginUser); // Asegúrate de que esta ruta esté bien configurada
// Ruta para registrar usuario
router.post("/register", UserController_1.registerUser); // Asegúrate de que esta ruta esté bien configurada
// Ruta para solicitar el restablecimiento de la contraseña
router.post("/request-password-reset", UserController_1.requestPasswordReset);
// Ruta para restablecer la contraseña
router.post("/reset-password", UserController_1.resetPassword);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map