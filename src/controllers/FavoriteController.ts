import { Request, Response } from "express";
import mongoose from "mongoose";
import FavoriteDAO from "../dao/FavoriteDAO";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: { id: string };
}

class FavoriteController {
  // 🟩 Extrae el userId desde el token JWT
  private getUserIdFromToken(req: AuthRequest): mongoose.Types.ObjectId | null {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return null;

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
      return new mongoose.Types.ObjectId(decoded.id);
    } catch {
      return null;
    }
  }

  async addFavorite(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = this.getUserIdFromToken(req);
      if (!userId) {
        res.status(401).json({ message: "Token inválido o ausente" });
        return;
      }

      const { movieId, pexelsId, id, title, thumbnail, image } = req.body;
      const realPexelsId = pexelsId || id;
      const realThumbnail = thumbnail || image;

      if (!title || (!movieId && !realPexelsId)) {
        res.status(400).json({ message: "Faltan datos obligatorios" });
        return;
      }


      const alreadyFav = await FavoriteDAO.isAlreadyFavorite(
        userId.toString(),
        movieId,
        pexelsId
      );
      if (alreadyFav) {
        res.status(409).json({ message: "Este favorito ya existe" });
        return;
      }

      const newFavorite = await FavoriteDAO.addFavorite({
        userId,
        movieId,
        pexelsId,
        title,
        thumbnail,
      });
      res.status(201).json(newFavorite);
    } catch (error) {
      console.error("Error agregando favorito:", error);
      res.status(500).json({ message: "Error al agregar el favorito" });
    }
  }

  async getUserFavorites(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = this.getUserIdFromToken(req);
      if (!userId) {
        res.status(401).json({ message: "Token inválido o ausente" });
        return;
      }

      const favorites = await FavoriteDAO.getUserFavorites(userId.toString());
      res.status(200).json(favorites);
    } catch (error) {
      console.error("Error obteniendo favoritos:", error);
      res.status(500).json({ message: "Error al obtener los favoritos" });
    }
  }

 async removeFavorite(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = this.getUserIdFromToken(req);
    if (!userId) {
      res.status(401).json({ message: "Token inválido o ausente" });
      return;
    }

    const { movieId, pexelsId } = req.query;
    console.log("🟡 DELETE favorito recibido:", { userId, movieId, pexelsId });

    const deleted = await FavoriteDAO.removeFavorite(
      userId.toString(),
      movieId as string,
      pexelsId as string
    );

    console.log("🟢 Resultado de FavoriteDAO.removeFavorite:", deleted);

    if (!deleted) {
      res.status(404).json({ message: "Favorito no encontrado" });
      return;
    }

    res.status(200).json({ message: "Favorito eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error eliminando favorito:", error);
    res.status(500).json({ message: "Error al eliminar el favorito" });
  }
}


  async updateFavorite(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = this.getUserIdFromToken(req);
      if (!userId) {
        res.status(401).json({ message: "Token inválido o ausente" });
        return;
      }

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
