import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import ReviewDAO from "../dao/ReviewDAO";

interface AuthRequest extends Request {
  user?: { id: string };
}

// 🔍 Extrae el userId desde el token
function getUserIdFromToken(req: AuthRequest): mongoose.Types.ObjectId | null {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id?: string; userId?: string };
    const realId = decoded.userId || decoded.id;
    if (!realId) return null;
    return new mongoose.Types.ObjectId(realId);
  } catch (error) {
    console.error("❌ Token inválido:", error);
    return null;
  }
}

const ReviewController = {
  // ➕ Crear reseña
  async addReview(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = getUserIdFromToken(req);
      if (!userId)
        return res.status(401).json({ message: "Token inválido o ausente" });

      const { pexelsId, rating, comment, userName } = req.body;
      if (!pexelsId || !comment) {
        return res
          .status(400)
          .json({ message: "Faltan datos obligatorios (pexelsId o comment)" });
      }

      const existing = await ReviewDAO.getUserReview(
        userId.toString(),
        pexelsId
      );
      if (existing) {
        return res
          .status(409)
          .json({ message: "Ya has dejado una reseña para esta película" });
      }

      const newReview = await ReviewDAO.addReview({
        userId,
        pexelsId,
        userName,
        rating: rating ?? 0,
        comment,
        hasRating: rating !== undefined,
      } as any);

      return res.status(201).json(newReview);
    } catch (error) {
      console.error("❌ Error al crear reseña:", error);
      return res.status(500).json({ message: "Error al crear la reseña" });
    }
  },

  // 📜 Obtener reseñas por película
  async getReviewsByPexelsId(
    req: AuthRequest,
    res: Response
  ): Promise<Response> {
    try {
      const { pexelsId } = req.params;
      if (!pexelsId)
        return res.status(400).json({ message: "Falta el ID de la película" });

      const reviews = await ReviewDAO.getReviewsByPexelsId(pexelsId);
      return res.status(200).json(reviews);
    } catch (error) {
      console.error("❌ Error al obtener reseñas:", error);
      return res.status(500).json({ message: "Error al obtener las reseñas" });
    }
  },

  // ✏️ Actualizar reseña (por película + usuario)
  async updateReview(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = getUserIdFromToken(req);
      if (!userId)
        return res.status(401).json({ message: "Token inválido o ausente" });

      const { pexelsId } = req.params;
      const { comment, rating } = req.body;

      const updated = await ReviewDAO.updateReviewByUser(
        pexelsId,
        userId.toString(),
        { comment, rating }
      );

      if (!updated) {
        return res
          .status(404)
          .json({ message: "Reseña no encontrada o no te pertenece" });
      }

      return res
        .status(200)
        .json({ message: "Reseña actualizada correctamente", review: updated });
    } catch (error) {
      console.error("❌ Error al actualizar reseña:", error);
      return res.status(500).json({ message: "Error al actualizar la reseña" });
    }
  },

  // ❌ Eliminar reseña (por película + usuario)
  async deleteReview(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = getUserIdFromToken(req);
      if (!userId)
        return res.status(401).json({ message: "Token inválido o ausente" });

      const { pexelsId } = req.params;
      const deleted = await ReviewDAO.deleteReviewByUser(
        pexelsId,
        userId.toString()
      );

      if (!deleted) {
        return res
          .status(404)
          .json({ message: "Reseña no encontrada o no te pertenece" });
      }

      return res.status(200).json({ message: "Reseña eliminada correctamente" });
    } catch (error) {
      console.error("❌ Error al eliminar reseña:", error);
      return res.status(500).json({ message: "Error al eliminar la reseña" });
    }
  },
};

export default ReviewController;
