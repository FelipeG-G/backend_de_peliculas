"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/favoriteRoutes.ts
const express_1 = require("express");
const FavoriteController_1 = __importDefault(require("../controllers/FavoriteController"));
const router = (0, express_1.Router)();
/**
 *  Favorite Routes
 *
 * Gestiona los favoritos de los usuarios (agregar, obtener y eliminar películas favoritas).
 */
/**
 * @route GET /favorites
 * @description Obtiene todos los favoritos del usuario autenticado.
 */
router.get("/", (req, res) => FavoriteController_1.default.getUserFavorites(req, res));
/**
 * @route POST /favorites
 * @description Agrega una película a los favoritos del usuario.
 * @body {string} pexelsId - ID de la película en Pexels
 * @body {string} title - Título de la película
 * @body {string} [thumbnail] - Imagen miniatura opcional
 */
router.post("/", (req, res) => FavoriteController_1.default.addFavorite(req, res));
/**
 * @route DELETE /favorites/:pexelsId
 * @description Elimina una película de los favoritos del usuario.
 * @param {string} pexelsId - ID de la película en Pexels
 */
router.delete("/:pexelsId", (req, res) => FavoriteController_1.default.removeFavorite(req, res));
exports.default = router;
//# sourceMappingURL=favoriteRoutes.js.map