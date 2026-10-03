"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/dao/FavoriteDAO.ts
const Favorite_1 = __importDefault(require("../models/Favorite"));
/**
 * @file FavoriteDAO.ts
 * @description Data Access Object (DAO) for managing user favorites.
 * Provides CRUD-like operations and specific queries for the favorites feature.
 */
class FavoriteDAO {
    /**
     * Adds a new favorite to the database.
     *
     * @param {Partial<IFavorite>} data - Favorite data (userId, pexelsId, etc.).
     * @returns {Promise<IFavorite>} The created favorite document.
     */
    async addFavorite(data) {
        try {
            const favorite = new Favorite_1.default(data);
            return await favorite.save();
        }
        catch (error) {
            throw new Error(`Error adding favorite: ${error.message}`);
        }
    }
    /**
     * Retrieves all favorites of a given user.
     *
     * @param {string} userId - The ID of the user.
     * @returns {Promise<IFavorite[]>} A list of favorite items for that user.
     */
    async getUserFavorites(userId) {
        try {
            return await Favorite_1.default.find({ userId }).sort({ createdAt: -1 });
        }
        catch (error) {
            throw new Error(`Error fetching user favorites: ${error.message}`);
        }
    }
    /**
     * Removes a favorite movie/image by its Pexels ID for a specific user.
     *
     * @param {string} userId - The user's ID.
     * @param {string} pexelsId - The Pexels image/movie ID.
     * @returns {Promise<IFavorite | null>} The deleted favorite, or null if not found.
     */
    async removeFavoriteByPexelsId(userId, pexelsId) {
        try {
            return await Favorite_1.default.findOneAndDelete({ userId, pexelsId });
        }
        catch (error) {
            throw new Error(`Error removing favorite: ${error.message}`);
        }
    }
    /**
     * Checks if a movie/image is already marked as favorite by a user.
     *
     * @param {string} userId - The user's ID.
     * @param {string} pexelsId - The Pexels image/movie ID.
     * @returns {Promise<boolean>} True if the favorite exists, otherwise false.
     */
    async isAlreadyFavorite(userId, pexelsId) {
        try {
            const exists = await Favorite_1.default.exists({ userId, pexelsId });
            return !!exists;
        }
        catch (error) {
            throw new Error(`Error checking favorite existence: ${error.message}`);
        }
    }
}
exports.default = new FavoriteDAO();
//# sourceMappingURL=FavoriteDAO.js.map