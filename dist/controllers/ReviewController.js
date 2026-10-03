"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const ReviewDAO_1 = __importDefault(require("../dao/ReviewDAO"));
const AverageDAO_1 = __importDefault(require("../dao/AverageDAO"));
/**
 * @file ReviewController.ts
 * @description Controller responsible for managing movie reviews.
 * Provides functionality to create, retrieve, update, and delete reviews
 * associated with authenticated users. It also updates movie rating averages
 * through the `AverageDAO`.
 */
/**
 * Extracts the user's ID (`userId`) from the JWT token sent in the request headers.
 * Returns `null` if the token is invalid or missing.
 *
 * @function getUserIdFromToken
 * @param {AuthRequest} req - HTTP request object containing the `Authorization` header.
 * @returns {mongoose.Types.ObjectId | null} The user ID if the token is valid, or `null` otherwise.
 */
function getUserIdFromToken(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer "))
        return null;
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const realId = decoded.userId || decoded.id;
        if (!realId)
            return null;
        return new mongoose_1.default.Types.ObjectId(realId);
    }
    catch (error) {
        console.error("❌ Invalid token:", error);
        return null;
    }
}
/**
 * Review controller.
 * Contains methods to manage movie reviews associated with authenticated users.
 *
 * @namespace ReviewController
 */
const ReviewController = {
    /**
     * Creates a new review for a movie.
     *
     * @async
     * @function addReview
     * @memberof ReviewController
     * @param {AuthRequest} req - HTTP request containing `pexelsId`, `rating`, `comment`, and `userName`.
     * @param {Response} res - HTTP response object.
     * @returns {Promise<Response>} HTTP response with the created review or an error message.
     *
     * @example
     * POST /api/v1/reviews
     * {
     *   "pexelsId": "12345",
     *   "rating": 4,
     *   "comment": "Excellent movie",
     *   "userName": "Andrés"
     * }
     */
    async addReview(req, res) {
        try {
            const userId = getUserIdFromToken(req);
            if (!userId)
                return res.status(401).json({ message: "Invalid or missing token" });
            const { pexelsId, rating, comment, userName } = req.body;
            if (!pexelsId || !comment) {
                return res.status(400).json({
                    message: "Missing required fields (pexelsId or comment)",
                });
            }
            const existing = await ReviewDAO_1.default.getUserReview(userId.toString(), pexelsId);
            if (existing) {
                return res
                    .status(409)
                    .json({ message: "You have already left a review for this movie" });
            }
            const hasValidRating = typeof rating === "number" && !isNaN(rating) && rating >= 0;
            const newReview = await ReviewDAO_1.default.addReview({
                userId,
                pexelsId,
                userName,
                rating: hasValidRating ? rating : 0,
                comment,
                hasRating: hasValidRating,
            });
            if (newReview.hasRating) {
                await AverageDAO_1.default.updateAverageForMovie(pexelsId);
            }
            return res.status(201).json(newReview);
        }
        catch (error) {
            console.error("❌ Error creating review:", error);
            return res.status(500).json({ message: "Error creating review" });
        }
    },
    /**
     * Retrieves all reviews for a specific movie.
     *
     * @async
     * @function getReviewsByPexelsId
     * @memberof ReviewController
     * @param {AuthRequest} req - HTTP request containing the `pexelsId` parameter.
     * @param {Response} res - HTTP response object.
     * @returns {Promise<Response>} List of reviews for the specified movie.
     */
    async getReviewsByPexelsId(req, res) {
        try {
            const { pexelsId } = req.params;
            if (!pexelsId)
                return res.status(400).json({ message: "Movie ID is missing" });
            const reviews = await ReviewDAO_1.default.getReviewsByPexelsId(pexelsId);
            return res.status(200).json(reviews);
        }
        catch (error) {
            console.error("❌ Error fetching reviews:", error);
            return res.status(500).json({ message: "Error fetching reviews" });
        }
    },
    /**
     * Updates an existing review for the authenticated user.
     *
     * @async
     * @function updateReview
     * @memberof ReviewController
     * @param {AuthRequest} req - HTTP request containing `pexelsId` as a parameter and `comment`, `rating` in the body.
     * @param {Response} res - HTTP response object.
     * @returns {Promise<Response>} The updated review or an error message.
     */
    async updateReview(req, res) {
        try {
            const userId = getUserIdFromToken(req);
            if (!userId)
                return res.status(401).json({ message: "Invalid or missing token" });
            const { pexelsId } = req.params;
            const { comment, rating } = req.body;
            const updated = await ReviewDAO_1.default.updateReviewByUser(pexelsId, userId.toString(), { comment, rating });
            if (!updated) {
                return res
                    .status(404)
                    .json({ message: "Review not found or does not belong to you" });
            }
            await AverageDAO_1.default.updateAverageForMovie(pexelsId);
            return res.status(200).json({
                message: "Review successfully updated",
                review: updated,
            });
        }
        catch (error) {
            console.error("❌ Error updating review:", error);
            return res.status(500).json({ message: "Error updating review" });
        }
    },
    /**
     * Deletes a review created by the authenticated user.
     *
     * @async
     * @function deleteReview
     * @memberof ReviewController
     * @param {AuthRequest} req - HTTP request containing `pexelsId` as a parameter.
     * @param {Response} res - HTTP response object.
     * @returns {Promise<Response>} Confirmation message or an error.
     */
    async deleteReview(req, res) {
        try {
            const userId = getUserIdFromToken(req);
            if (!userId)
                return res.status(401).json({ message: "Invalid or missing token" });
            const { pexelsId } = req.params;
            const deleted = await ReviewDAO_1.default.deleteReviewByUser(pexelsId, userId.toString());
            if (!deleted) {
                return res
                    .status(404)
                    .json({ message: "Review not found or does not belong to you" });
            }
            if (deleted.hasRating) {
                await AverageDAO_1.default.updateAverageForMovie(pexelsId);
            }
            return res.status(200).json({ message: "Review successfully deleted" });
        }
        catch (error) {
            console.error("❌ Error deleting review:", error);
            return res.status(500).json({ message: "Error deleting review" });
        }
    },
};
exports.default = ReviewController;
//# sourceMappingURL=ReviewController.js.map