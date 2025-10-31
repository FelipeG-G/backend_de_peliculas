// src/controllers/FavoriteController.ts
import { Request, Response } from "express";
import mongoose from "mongoose";
import FavoriteDAO from "../dao/FavoriteDAO";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: { id: string };
}

/**
 * Extrae userId desde header Authorization Bearer <token>.
 * Devuelve null si token inválido o ausente.
 */
function getUserIdFromToken(req: AuthRequest): mongoose.Types.ObjectId | null {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id?: string; userId?: string };
    const realId = decoded.userId || decoded.id;
    if (!realId) return null;

    return new mongoose.Types.ObjectId(realId);
  } catch (err) {
    console.error("❌ Error verificando token:", err);
    return null;
  }
}

const FavoriteController = {
  // POST /api/v1/favorites
  async addFavorite(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = getUserIdFromToken(req);
      if (!userId) {
        res.status(401).json({ message: "Token inválido o ausente" });
        return;
      }

      const { id, title, image, thumbnail, pexelsId: bodyPexelsId } = req.body;
      const pexelsId = String(id ?? bodyPexelsId ?? "").trim();
      const thumb = thumbnail || image || "";

      if (!pexelsId || !title) {
        res.status(400).json({ message: "Faltan datos obligatorios (id/pexelsId o title)" });
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
        thumbnail: thumb,
      } as any);

      res.status(201).json(newFavorite);
    } catch (error: any) {
      console.error("❌ Error agregando favorito:", error);
      if (error?.code === 11000) {
        res.status(409).json({ message: "Favorito duplicado" });
      } else {
        res.status(500).json({ message: "Error al agregar el favorito" });
      }
    }
  },

  // GET /api/v1/favorites
  async getUserFavorites(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = getUserIdFromToken(req);
      if (!userId) {
        res.status(401).json({ message: "Token inválido o ausente" });
        return;
      }

      const favorites = await FavoriteDAO.getUserFavorites(userId.toString());

      const transformed = favorites.map((fav) => ({
        id: Number(fav.pexelsId) || fav.pexelsId,
        title: fav.title,
        image: fav.thumbnail || "",
        genre: "Favoritos",
        year: 2024,
        duration: "N/A",
        rating: 5.0,
        videoUrl: "",
        pexelsId: fav.pexelsId,
      }));

      res.status(200).json(transformed);
    } catch (error) {
      console.error("❌ Error obteniendo favoritos:", error);
      res.status(500).json({ message: "Error al obtener los favoritos" });
    }
  },

  // DELETE /api/v1/favorites/:pexelsId
  async removeFavorite(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = getUserIdFromToken(req);
      if (!userId) {
        res.status(401).json({ message: "Token inválido o ausente" });
        return;
      }

      const { pexelsId } = req.params;
      const realPexelsId = String(pexelsId ?? "").trim();

      if (!realPexelsId) {
        res.status(400).json({ message: "Falta el ID del favorito a eliminar (pexelsId)" });
        return;
      }

      const deleted = await FavoriteDAO.removeFavoriteByPexelsId(userId.toString(), realPexelsId);
      if (!deleted) {
        res.status(404).json({ message: "Favorito no encontrado" });
        return;
      }

      res.status(200).json({ message: "Favorito eliminado correctamente" });
    } catch (error) {
      console.error("❌ Error eliminando favorito:", error);
      res.status(500).json({ message: "Error al eliminar el favorito" });
    }
  },
};

export default FavoriteController;
