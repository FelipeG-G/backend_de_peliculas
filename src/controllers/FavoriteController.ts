import { Request, Response } from "express";
import FavoriteDAO from "../dao/FavoriteDAO";

class FavoriteController {
  async addFavorite(req: Request, res: Response): Promise<void> {
    try {
      const { userId, movieId, pexelsId, title, thumbnail } = req.body;

      if (!userId || (!movieId && !pexelsId)) {
        res.status(400).json({ message: "Faltan datos obligatorios" });
        return;
      }
      // Evita duplicados
      const alreadyFav = await FavoriteDAO.isAlreadyFavorite(userId, movieId, pexelsId);
      if (alreadyFav) {
        res.status(409).json({ message: "Este favorito ya existe" });
        return;
      }

      const newFavorite = await FavoriteDAO.addFavorite({ userId, movieId, pexelsId, title, thumbnail });
      res.status(201).json(newFavorite);
    } catch (error) {
      console.error("Error agregando favorito:", error);
      res.status(500).json({ message: "Error al agregar el favorito" });
    }
  }

  async getUserFavorites(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const favorites = await FavoriteDAO.getUserFavorites(userId);
      res.status(200).json(favorites);
    } catch (error) {
      console.error("Error obteniendo favoritos:", error);
      res.status(500).json({ message: "Error al obtener los favoritos" });
    }
  }

  async removeFavorite(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { movieId, pexelsId } = req.query; // ahora se usa query, no body

      const deleted = await FavoriteDAO.removeFavorite(userId, movieId as string, pexelsId as string);
      if (!deleted) {
        res.status(404).json({ message: "Favorito no encontrado" });
        return;
      }

      res.status(200).json({ message: "Favorito eliminado correctamente" });
    } catch (error) {
      console.error("Error eliminando favorito:", error);
      res.status(500).json({ message: "Error al eliminar el favorito" });
    }
  }
  async updateFavorite(req: Request, res: Response): Promise<void> {
    try {
      const { favoriteId } = req.params;
      const data = req.body;

      const updated = await FavoriteDAO.updateFavorite(favoriteId, data);
      if (!updated) {
        res.status(404).json({ message: "Favorito no encontrado" });
        return;
      }

      res.status(200).json(updated);
    } catch (error) {
      console.error("Error actualizando favorito:", error);
      res.status(500).json({ message: "Error al actualizar el favorito" });
    }
  }
}


export default new FavoriteController();
