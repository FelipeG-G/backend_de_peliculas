// src/routes/favoriteRoutes.ts
import { Router, Request, Response } from "express";
import FavoriteController from "../controllers/FavoriteController";

const router = Router();

/**
 *  Favorite Routes
 *
 * Gestiona los favoritos de los usuarios (agregar, obtener y eliminar películas favoritas).
 */

/**
 * @route GET /favorites
 * @description Obtiene todos los favoritos del usuario autenticado.
 */
router.get("/", (req: Request, res: Response) =>FavoriteController.getUserFavorites(req, res));

/**
 * @route POST /favorites
 * @description Agrega una película a los favoritos del usuario.
 * @body {string} pexelsId - ID de la película en Pexels
 * @body {string} title - Título de la película
 * @body {string} [thumbnail] - Imagen miniatura opcional
 */
router.post("/", (req: Request, res: Response) =>
  FavoriteController.addFavorite(req, res)
);

/**
 * @route DELETE /favorites/:pexelsId
 * @description Elimina una película de los favoritos del usuario.
 * @param {string} pexelsId - ID de la película en Pexels
 */
router.delete("/:pexelsId", (req: Request, res: Response) =>
  FavoriteController.removeFavorite(req, res)
);

export default router;
