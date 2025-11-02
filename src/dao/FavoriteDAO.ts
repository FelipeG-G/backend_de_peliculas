// src/dao/FavoriteDAO.ts
import Favorite, { IFavorite } from "../models/Favorite";

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
  async addFavorite(data: Partial<IFavorite>): Promise<IFavorite> {
    try {
      const favorite = new Favorite(data);
      return await favorite.save();
    } catch (error: any) {
      throw new Error(`Error adding favorite: ${error.message}`);
    }
  }

  /**
   * Retrieves all favorites of a given user.
   *
   * @param {string} userId - The ID of the user.
   * @returns {Promise<IFavorite[]>} A list of favorite items for that user.
   */
  async getUserFavorites(userId: string): Promise<IFavorite[]> {
    try {
      return await Favorite.find({ userId }).sort({ createdAt: -1 });
    } catch (error: any) {
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
  async removeFavoriteByPexelsId(userId: string, pexelsId: string): Promise<IFavorite | null> {
    try {
      return await Favorite.findOneAndDelete({ userId, pexelsId });
    } catch (error: any) {
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
  async isAlreadyFavorite(userId: string, pexelsId: string): Promise<boolean> {
    try {
      const exists = await Favorite.exists({ userId, pexelsId });
      return !!exists;
    } catch (error: any) {
      throw new Error(`Error checking favorite existence: ${error.message}`);
    }
  }
}

export default new FavoriteDAO();
