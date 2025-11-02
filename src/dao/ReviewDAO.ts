import Review, { IReview } from "../models/Review";

/**
 * @file ReviewDAO.ts
 * @description Data Access Object (DAO) responsible for managing review-related database operations.
 * Provides methods for creating, retrieving, updating, and deleting reviews from the database.
 */
class ReviewDAO {
  /**
   * Adds a new review to the database.
   *
   * @async
   * @param {Partial<IReview>} data - The review data to be saved.
   * @returns {Promise<IReview>} The newly created review document.
   *
   * @example
   * const review = await ReviewDAO.addReview({ userId, pexelsId, rating: 5, comment: "Great movie!" });
   */
  async addReview(data: Partial<IReview>): Promise<IReview> {
    const review = new Review(data);
    return await review.save();
  }

  /**
   * Retrieves all reviews for a specific movie by its `pexelsId`.
   *
   * @async
   * @param {string} pexelsId - The ID of the movie from Pexels.
   * @returns {Promise<IReview[]>} An array of reviews sorted by creation date (descending).
   *
   * @example
   * const reviews = await ReviewDAO.getReviewsByPexelsId("12345");
   */
  async getReviewsByPexelsId(pexelsId: string): Promise<IReview[]> {
    return await Review.find({ pexelsId }).sort({ createdAt: -1 });
  }

  /**
   * Retrieves a single review made by a specific user for a given movie.
   *
   * @async
   * @param {string} userId - The ID of the user.
   * @param {string} pexelsId - The ID of the movie.
   * @returns {Promise<IReview | null>} The matching review document or `null` if not found.
   */
  async getUserReview(userId: string, pexelsId: string): Promise<IReview | null> {
    return await Review.findOne({ userId, pexelsId });
  }

  /**
   * Updates a review by its review ID.
   *
   * @async
   * @param {string} reviewId - The ID of the review to update.
   * @param {Partial<IReview>} data - The updated review fields.
   * @returns {Promise<IReview | null>} The updated review document or `null` if not found.
   */
  async updateReview(reviewId: string, data: Partial<IReview>): Promise<IReview | null> {
    return await Review.findByIdAndUpdate(reviewId, data, { new: true });
  }

  /**
   * Updates a review using both the user ID and the movie’s `pexelsId`.
   *
   * @async
   * @param {string} pexelsId - The ID of the movie.
   * @param {string} userId - The ID of the user.
   * @param {Partial<IReview>} data - The fields to update.
   * @returns {Promise<IReview | null>} The updated review document or `null` if not found.
   */
  async updateReviewByUser(pexelsId: string, userId: string, data: Partial<IReview>): Promise<IReview | null> {
    return await Review.findOneAndUpdate({ pexelsId, userId }, data, { new: true });
  }

  /**
   * Deletes a review by its review ID and the associated user ID.
   *
   * @async
   * @param {string} reviewId - The ID of the review to delete.
   * @param {string} userId - The ID of the user who owns the review.
   * @returns {Promise<IReview | null>} The deleted review document or `null` if not found.
   */
  async deleteReview(reviewId: string, userId: string): Promise<IReview | null> {
    return await Review.findOneAndDelete({ _id: reviewId, userId });
  }

  /**
   * Deletes a review using both the user ID and the movie’s `pexelsId`.
   *
   * @async
   * @param {string} pexelsId - The ID of the movie.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<IReview | null>} The deleted review document or `null` if not found.
   */
  async deleteReviewByUser(pexelsId: string, userId: string): Promise<IReview | null> {
    return await Review.findOneAndDelete({ pexelsId, userId });
  }
}

export default new ReviewDAO();
