"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Review_1 = __importDefault(require("../models/Review"));
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
    async addReview(data) {
        const review = new Review_1.default(data);
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
    async getReviewsByPexelsId(pexelsId) {
        return await Review_1.default.find({ pexelsId }).sort({ createdAt: -1 });
    }
    /**
     * Retrieves a single review made by a specific user for a given movie.
     *
     * @async
     * @param {string} userId - The ID of the user.
     * @param {string} pexelsId - The ID of the movie.
     * @returns {Promise<IReview | null>} The matching review document or `null` if not found.
     */
    async getUserReview(userId, pexelsId) {
        return await Review_1.default.findOne({ userId, pexelsId });
    }
    /**
     * Updates a review by its review ID.
     *
     * @async
     * @param {string} reviewId - The ID of the review to update.
     * @param {Partial<IReview>} data - The updated review fields.
     * @returns {Promise<IReview | null>} The updated review document or `null` if not found.
     */
    async updateReview(reviewId, data) {
        return await Review_1.default.findByIdAndUpdate(reviewId, data, { new: true });
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
    async updateReviewByUser(pexelsId, userId, data) {
        return await Review_1.default.findOneAndUpdate({ pexelsId, userId }, data, { new: true });
    }
    /**
     * Deletes a review by its review ID and the associated user ID.
     *
     * @async
     * @param {string} reviewId - The ID of the review to delete.
     * @param {string} userId - The ID of the user who owns the review.
     * @returns {Promise<IReview | null>} The deleted review document or `null` if not found.
     */
    async deleteReview(reviewId, userId) {
        return await Review_1.default.findOneAndDelete({ _id: reviewId, userId });
    }
    /**
     * Deletes a review using both the user ID and the movie’s `pexelsId`.
     *
     * @async
     * @param {string} pexelsId - The ID of the movie.
     * @param {string} userId - The ID of the user.
     * @returns {Promise<IReview | null>} The deleted review document or `null` if not found.
     */
    async deleteReviewByUser(pexelsId, userId) {
        return await Review_1.default.findOneAndDelete({ pexelsId, userId });
    }
}
exports.default = new ReviewDAO();
//# sourceMappingURL=ReviewDAO.js.map