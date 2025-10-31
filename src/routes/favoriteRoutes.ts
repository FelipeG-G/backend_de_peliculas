// src/routes/favoriteRoutes.ts
import { Router } from "express";
import FavoriteController from "../controllers/FavoriteController";

const router = Router();

/**
 * Todas las rutas usan token JWT (el controlador obtiene userId desde él)
 * En Postman debes enviar el header:
 * Authorization: Bearer <tu_token_jwt>
 */

//  Obtener todos los favoritos del usuario logueado
router.get("/", (req, res) => FavoriteController.getUserFavorites(req, res));


//  Agregar un nuevo favorito
router.post("/", (req, res) => FavoriteController.addFavorite(req, res));

//  Actualizar un favorito existente
router.put("/:favoriteId", (req, res) => FavoriteController.updateFavorite(req, res));

//  Eliminar un favorito (por movieId o pexelsId)
router.delete("/", (req, res) => FavoriteController.removeFavorite(req, res));

export default router;
