// src/dao/AverageDAO.ts
import Average, { IAverage } from "../models/Average";
import Review from "../models/Review";

/**
 * @file AverageDAO.ts
 * @description Data Access Object (DAO) para gestionar los promedios de calificación (ratings)
 * asociados a cada película. Calcula y mantiene actualizada la información
 * a partir de las reseñas en la colección `Review`.
 */
class AverageDAO {
  /**
   * Calcula y actualiza el promedio de calificaciones de una película
   * a partir de sus reseñas activas.
   *
   * @async
   * @function updateAverageForMovie
   * @param {string} pexelsId - ID de la película en Pexels.
   * @returns {Promise<IAverage | null>} El promedio actualizado o `null` si no hay reseñas.
   */
  async updateAverageForMovie(pexelsId: string): Promise<IAverage | null> {
    try {
      const result = await Review.aggregate([
        { $match: { pexelsId, hasRating: true } },
        {
          $group: {
            _id: "$pexelsId",
            averageRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
          },
        },
      ]);

      if (result.length > 0) {
        const { averageRating, totalReviews } = result[0];

        return await Average.findOneAndUpdate(
          { pexelsId },
          {
            averageRating,
            totalReviews,
            updatedAt: new Date(),
          },
          { upsert: true, new: true }
        );
      } else {
        // Si no hay reseñas, eliminar el registro de promedio
        await Average.findOneAndDelete({ pexelsId });
        return null;
      }
    } catch (error: any) {
      throw new Error(`Error updating average for movie: ${error.message}`);
    }
  }

  /**
   * Obtiene el promedio actual de una película.
   *
   * @async
   * @function getAverageByMovie
   * @param {string} pexelsId - ID de la película en Pexels.
   * @returns {Promise<IAverage | null>} Documento con los datos del promedio o `null` si no existe.
   */
  async getAverageByMovie(pexelsId: string): Promise<IAverage | null> {
    try {
      return await Average.findOne({ pexelsId });
    } catch (error: any) {
      throw new Error(`Error retrieving average by movie: ${error.message}`);
    }
  }
}

export default new AverageDAO();
