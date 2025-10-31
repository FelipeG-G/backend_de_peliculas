// src/routes/favoriteRoutes.ts
import { Router } from "express";
import FavoriteController from "../controllers/FavoriteController";

const router = Router();

// Obtener favoritos
router.get("/", (req, res) => FavoriteController.getUserFavorites(req, res));

// Agregar favorito
router.post("/", (req, res) => FavoriteController.addFavorite(req, res));

// Eliminar favorito (el front usa /favorites/:movieId)
router.delete("/:pexelsId", (req, res) => FavoriteController.removeFavorite(req, res));

export default router;
