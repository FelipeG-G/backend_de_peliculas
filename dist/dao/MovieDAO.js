"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Movie_1 = __importDefault(require("../models/Movie"));
/**
 * @file MovieDAO.ts
 * @description Data Access Object (DAO) responsible for handling database operations related to movies.
 * Provides methods for creating, reading, updating, deleting, and querying movie records.
 */
class MovieDAO {
    /**
     * Creates a new movie record in the database.
     *
     * @async
     * @param {Partial<IMovie>} data - The movie data to create.
     * @returns {Promise<IMovie>} The created movie document.
     *
     * @example
     * const movie = await MovieDAO.create({ title: "Inception", genre: "Sci-Fi" });
     */
    async create(data) {
        const movie = new Movie_1.default(data);
        return await movie.save();
    }
    /**
     * Retrieves a movie document by its ID.
     *
     * @async
     * @param {string} id - The movie ID.
     * @returns {Promise<IMovie | null>} The found movie or `null` if not found.
     */
    async read(id) {
        return await Movie_1.default.findById(id);
    }
    /**
     * Updates a movie document by its ID.
     *
     * @async
     * @param {string} id - The movie ID.
     * @param {Partial<IMovie>} data - The updated movie data.
     * @returns {Promise<IMovie | null>} The updated movie or `null` if not found.
     */
    async update(id, data) {
        return await Movie_1.default.findByIdAndUpdate(id, data, { new: true });
    }
    /**
     * Deletes a movie document by its ID.
     *
     * @async
     * @param {string} id - The movie ID.
     * @returns {Promise<IMovie | null>} The deleted movie or `null` if not found.
     */
    async delete(id) {
        return await Movie_1.default.findByIdAndDelete(id);
    }
    /**
     * Retrieves all movies from the database, sorted by creation date (newest first).
     *
     * @async
     * @returns {Promise<IMovie[]>} An array of all movie documents.
     */
    async getAll() {
        return await Movie_1.default.find().sort({ createdAt: -1 });
    }
    /**
     * Retrieves all movies that match a specific genre.
     *
     * @async
     * @param {string} genre - The genre to filter by.
     * @returns {Promise<IMovie[]>} An array of movies within the given genre.
     */
    async findByGenre(genre) {
        return await Movie_1.default.find({ genre }).sort({ createdAt: -1 });
    }
    /**
     * Searches for movies that match a keyword in their title (case-insensitive).
     *
     * @async
     * @param {string} keyword - The keyword to search in movie titles.
     * @returns {Promise<IMovie[]>} An array of movies whose titles match the keyword.
     */
    async searchByTitle(keyword) {
        return await Movie_1.default.find({ title: { $regex: keyword, $options: "i" } });
    }
    /**
     * Imports movie data from Pexels and saves it to the database.
     * Adds a `source` property and sets the `releaseDate` to the current date.
     *
     * @async
     * @param {Partial<IMovie>} data - The movie data imported from Pexels.
     * @returns {Promise<IMovie>} The newly created movie document.
     *
     * @example
     * await MovieDAO.importFromPexels({ title: "Nature Clip", genre: "Documentary" });
     */
    async importFromPexels(data) {
        const movie = new Movie_1.default({
            ...data,
            source: "pexels",
            releaseDate: new Date(),
        });
        return await movie.save();
    }
}
exports.default = new MovieDAO();
//# sourceMappingURL=MovieDAO.js.map