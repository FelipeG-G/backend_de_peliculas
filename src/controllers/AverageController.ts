import { Request, Response } from "express";
import AverageDAO from "../dao/AverageDAO";

const AverageController = {
  // 📊 Obtener el promedio de calificaciones de una película
  async getAverage(req: Request, res: Response): Promise<Response> {
    try {
      const { pexelsId } = req.params;
      if (!pexelsId) {
        return res.status(400).json({ message: "Falta el ID de la película" });
      }

      const averageData = await AverageDAO.getAverageByMovie(pexelsId);

      if (!averageData) {
        return res.status(404).json({ message: "No hay calificaciones para esta película" });
      }

      return res.status(200).json({
        pexelsId: averageData.pexelsId,
        averageRating: averageData.averageRating.toFixed(1),
        totalReviews: averageData.totalReviews,
        updatedAt: averageData.updatedAt,
      });
    } catch (error) {
      console.error("❌ Error al obtener promedio:", error);
      return res.status(500).json({ message: "Error al obtener el promedio" });
    }
  },
};

export default AverageController;
