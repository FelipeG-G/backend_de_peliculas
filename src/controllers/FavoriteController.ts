import { Request, Response } from "express";
import mongoose from "mongoose";
import FavoriteDAO from "../dao/FavoriteDAO";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: { id: string };
}

class FavoriteController {
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

  // 🟢 Agregar favorito
  async addFavorite(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = this.getUserIdFromToken(req);
      if (!userId) {
        res.status(401).json({ message: "Token inválido o ausente" });
        return;
      }

      // El frontend manda { id, title, image }
      const { id, title, image } = req.body;
      const pexelsId = id; // ← id del frontend = pexelsId

      if (!pexelsId || !title) {
        res.status(400).json({ message: "Faltan datos obligatorios" });
        return;
      }

      const exists = await FavoriteDAO.isAlreadyFavorite(userId.toString(), pexelsId);
      if (exists) {
        res.status(409).json({ message: "Este favorito ya existe" });
        return;
      }

      const newFavorite = await FavoriteDAO.addFavorite({
        userId,
        pexelsId,
        title,
        thumbnail: image,
      });

      res.status(201).json(newFavorite);
    } catch (error) {
      console.error("Error agregando favorito:", error);
      res.status(500).json({ message: "Error al agregar el favorito" });
    }
  }

  // 🟢 Obtener favoritos del usuario
  async getUserFavorites(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = this.getUserIdFromToken(req);
      if (!userId) {
        res.status(401).json({ message: "Token inválido o ausente" });
        return;
      }

      const favorites = await FavoriteDAO.getUserFavorites(userId.toString());
      const transformed = favorites.map((fav) => ({
        id: Number(fav.pexelsId),
        title: fav.title,
        image: fav.thumbnail,
        genre: "Favoritos",
        year: 2024,
        duration: "N/A",
        rating: 5.0,
        videoUrl: "",
        pexelsId: fav.pexelsId,
      }));

      res.status(200).json(transformed);
    } catch (error) {
      console.error("Error obteniendo favoritos:", error);
      res.status(500).json({ message: "Error al obtener los favoritos" });
    }
  }

  // 🟢 Eliminar favorito
  async removeFavorite(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = this.getUserIdFromToken(req);
      if (!userId) {
        res.status(401).json({ message: "Token inválido o ausente" });
        return;
      }

      const { id, pexelsId } = req.query;
      const realPexelsId = (pexelsId as string) || (id as string);

      if (!realPexelsId) {
        res.status(400).json({ message: "Falta el ID del favorito a eliminar" });
        return;
      }

      const deleted = await FavoriteDAO.removeFavorite(userId.toString(), realPexelsId);

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
}

export default new FavoriteController();
