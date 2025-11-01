import Average, { IAverage } from "../models/Average";
import Review from "../models/Review";

class AverageDAO {
  /**
   * Calcula y actualiza el promedio de una película según sus reviews
   */
  async updateAverageForMovie(pexelsId: string): Promise<IAverage | null> {
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
        { averageRating, totalReviews, updatedAt: new Date() },
        { upsert: true, new: true }
      );
    } else {
      // Si ya no hay reviews, elimina el promedio
      await Average.findOneAndDelete({ pexelsId });
      return null;
    }
  }

  /**
   * Obtiene el promedio de una película
   */
  async getAverageByMovie(pexelsId: string): Promise<IAverage | null> {
    return await Average.findOne({ pexelsId });
  }
}

export default new AverageDAO();
