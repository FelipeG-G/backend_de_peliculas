"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/dao/AverageDAO.ts
const Average_1 = __importDefault(require("../models/Average"));
const Review_1 = __importDefault(require("../models/Review"));
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
    async updateAverageForMovie(pexelsId) {
        try {
            const result = await Review_1.default.aggregate([
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
                return await Average_1.default.findOneAndUpdate({ pexelsId }, {
                    averageRating,
                    totalReviews,
                    updatedAt: new Date(),
                }, { upsert: true, new: true });
            }
            else {
                // Si no hay reseñas, eliminar el registro de promedio
                await Average_1.default.findOneAndDelete({ pexelsId });
                return null;
            }
        }
        catch (error) {
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
    async getAverageByMovie(pexelsId) {
        try {
            return await Average_1.default.findOne({ pexelsId });
        }
        catch (error) {
            throw new Error(`Error retrieving average by movie: ${error.message}`);
        }
    }
}
exports.default = new AverageDAO();
//# sourceMappingURL=AverageDAO.js.map