import { Request, Response } from "express";
import AverageDAO from "../dao/AverageDAO";

/**
 * @file AverageController.ts
 * @description Controller responsible for retrieving the average rating
 * for a specific movie based on its `pexelsId`.
 * This controller interacts with `AverageDAO` to access database data.
 */

/**
 * Controller for handling movie average ratings.
 * Contains methods related to calculating and retrieving movie rating averages.
 *
 * @namespace AverageController
 */
const AverageController = {
  /**
   * Retrieves the average rating and total number of reviews for a movie
   * identified by its `pexelsId`.
   *
   * @async
   * @function getAverage
   * @memberof AverageController
   * @param {Request} req - HTTP request object that must include the `pexelsId` parameter.
   * @param {Response} res - HTTP response object used to send back the result.
   * @returns {Promise<Response>} Returns an object containing the average, total reviews, and last update timestamp.
   *
   * @example
   * // GET /api/v1/average/12345
   * {
   *   "pexelsId": "12345",
   *   "averageRating": "4.5",
   *   "totalReviews": 12,
   *   "updatedAt": "2025-10-28T03:00:00.000Z"
   * }
   */
  async getAverage(req: Request, res: Response): Promise<Response> {
    try {
      const { pexelsId } = req.params;
      if (!pexelsId) {
        return res.status(400).json({ message: "Missing movie ID" });
      }

      const averageData = await AverageDAO.getAverageByMovie(pexelsId);

      if (!averageData) {
        return res.status(404).json({ message: "No ratings found for this movie" });
      }

      return res.status(200).json({
        pexelsId: averageData.pexelsId,
        averageRating: averageData.averageRating.toFixed(1),
        totalReviews: averageData.totalReviews,
        updatedAt: averageData.updatedAt,
      });
    } catch (error) {
      console.error("❌ Error retrieving average:", error);
      return res.status(500).json({ message: "Error retrieving average" });
    }
  },
};

export default AverageController;
