import Review, { IReview } from "../models/Review";

class ReviewDAO {
  async addReview(data: Partial<IReview>): Promise<IReview> {
    const review = new Review(data);
    return await review.save();
  }

  async getReviewsByPexelsId(pexelsId: string): Promise<IReview[]> {
    return await Review.find({ pexelsId }).sort({ createdAt: -1 });
  }

  async getUserReview(userId: string, pexelsId: string): Promise<IReview | null> {
    return await Review.findOne({ userId, pexelsId });
  }

  async updateReview(reviewId: string, data: Partial<IReview>): Promise<IReview | null> {
    return await Review.findByIdAndUpdate(reviewId, data, { new: true });
  }

  // Nuevo método basado en userId + pexelsId
  async updateReviewByUser(pexelsId: string, userId: string, data: Partial<IReview>): Promise<IReview | null> {
    return await Review.findOneAndUpdate({ pexelsId, userId }, data, { new: true });
  }

  async deleteReview(reviewId: string, userId: string): Promise<IReview | null> {
    return await Review.findOneAndDelete({ _id: reviewId, userId });
  }

  // Nuevo método para eliminar con userId + pexelsId
  async deleteReviewByUser(pexelsId: string, userId: string): Promise<IReview | null> {
    return await Review.findOneAndDelete({ pexelsId, userId });
  }
}

export default new ReviewDAO();
