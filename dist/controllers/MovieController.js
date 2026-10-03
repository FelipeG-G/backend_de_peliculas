"use strict";
/**
 * @file MovieController.ts
 * @description Controller responsible for managing all CRUD operations
 * related to movies within the system, including integration with the Pexels API.
 *
 * @module Controllers/MovieController
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GlobalController_1 = __importDefault(require("./GlobalController"));
const MovieDAO_1 = __importDefault(require("../dao/MovieDAO"));
const pexelsService_1 = require("../services/pexelsService");
/**
 * @class MovieController
 * @extends GlobalController<IMovie>
 * @classdesc Specialized controller for managing movies.
 * Implements CRUD operations, searches by genre or title,
 * and data import from Pexels.
 */
class MovieController extends GlobalController_1.default {
    constructor() {
        super(MovieDAO_1.default);
    }
    /**
     * @async
     * @method create
     * @description Creates a new movie in the database.
     *
     * @param {Request} req - Request object containing movie data.
     * @param {Response} res - Express response object.
     *
     * @returns {Promise<void>} Created movie or error message.
     *
     * @example
     * // POST /api/v1/movies
     * {
     *   "title": "Inception",
     *   "genre": "Science Fiction",
     *   "releaseDate": "2010-07-16"
     * }
     */
    async create(req, res) {
        try {
            const data = req.body;
            if (!data.title || !data.genre || !data.releaseDate) {
                res.status(400).json({ message: "Missing required fields" });
                return;
            }
            const newMovie = await MovieDAO_1.default.create(data);
            res.status(201).json(newMovie);
        }
        catch (error) {
            console.error("Error creating movie:", error);
            res.status(500).json({ message: "Error creating movie" });
        }
    }
    /**
     * @async
     * @method getAll
     * @description Retrieves all stored movies.
     *
     * @param {Request} req - HTTP request.
     * @param {Response} res - HTTP response.
     *
     * @returns {Promise<void>} List of movies or error message.
     *
     * @example
     * // GET /api/v1/movies
     */
    async getAll(req, res) {
        try {
            const movies = await MovieDAO_1.default.getAll();
            res.status(200).json(movies);
        }
        catch (error) {
            console.error("Error retrieving movies:", error);
            res.status(500).json({ message: "Error retrieving movies" });
        }
    }
    /**
     * @async
     * @method read
     * @description Retrieves a specific movie by its ID.
     *
     * @param {Request} req - Contains the `id` parameter of the movie.
     * @param {Response} res - Express response object.
     *
     * @returns {Promise<void>} Found movie or error message.
     *
     * @example
     * // GET /api/v1/movies/:id
     */
    async read(req, res) {
        try {
            const { id } = req.params;
            const movie = await MovieDAO_1.default.read(id);
            if (!movie) {
                res.status(404).json({ message: "Movie not found" });
                return;
            }
            res.status(200).json(movie);
        }
        catch (error) {
            console.error("Error retrieving movie:", error);
            res.status(500).json({ message: "Error retrieving movie" });
        }
    }
    /**
     * @async
     * @method update
     * @description Updates an existing movie’s information.
     *
     * @param {Request} req - HTTP request containing `id` and fields to update.
     * @param {Response} res - HTTP response.
     *
     * @returns {Promise<void>} Updated movie or not found error.
     *
     * @example
     * // PUT /api/v1/movies/:id
     * {
     *   "title": "New Title"
     * }
     */
    async update(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const updated = await MovieDAO_1.default.update(id, data);
            if (!updated) {
                res.status(404).json({ message: "Movie not found" });
                return;
            }
            res.status(200).json(updated);
        }
        catch (error) {
            console.error("Error updating movie:", error);
            res.status(500).json({ message: "Error updating movie" });
        }
    }
    /**
     * @async
     * @method delete
     * @description Deletes a movie from the database.
     *
     * @param {Request} req - Request containing the `id` parameter.
     * @param {Response} res - HTTP response.
     *
     * @returns {Promise<void>} Confirmation message or error.
     *
     * @example
     * // DELETE /api/v1/movies/:id
     */
    async delete(req, res) {
        try {
            const { id } = req.params;
            const deleted = await MovieDAO_1.default.delete(id);
            if (!deleted) {
                res.status(404).json({ message: "Movie not found" });
                return;
            }
            res.status(200).json({ message: "Movie successfully deleted" });
        }
        catch (error) {
            console.error("Error deleting movie:", error);
            res.status(500).json({ message: "Error deleting movie" });
        }
    }
    /**
     * @async
     * @method getMoviesByGenre
     * @description Retrieves all movies belonging to a specific genre.
     *
     * @param {Request} req - Contains the `genre` parameter.
     * @param {Response} res - Express response object.
     *
     * @returns {Promise<void>} List of movies filtered by genre.
     *
     * @example
     * // GET /api/v1/movies/genre/:genre
     */
    async getMoviesByGenre(req, res) {
        try {
            const { genre } = req.params;
            const movies = await MovieDAO_1.default.findByGenre(genre);
            res.status(200).json(movies);
        }
        catch (error) {
            console.error("Error retrieving movies by genre:", error);
            res.status(500).json({ message: "Error retrieving movies" });
        }
    }
    /**
     * @async
     * @method searchMovies
     * @description Searches for movies whose titles contain a specific text.
     *
     * @param {Request} req - Contains the query parameter `q` (search term).
     * @param {Response} res - Express response object.
     *
     * @returns {Promise<void>} List of matching movies.
     *
     * @example
     * // GET /api/v1/movies/search?q=batman
     */
    async searchMovies(req, res) {
        try {
            const { q } = req.query;
            if (!q || typeof q !== "string") {
                res.status(400).json({ message: "A search term must be provided" });
                return;
            }
            const movies = await MovieDAO_1.default.searchByTitle(q);
            res.status(200).json(movies);
        }
        catch (error) {
            console.error("Error searching movies:", error);
            res.status(500).json({ message: "Error searching movies" });
        }
    }
    /**
     * @async
     * @method importMovieFromPexels
     * @description Searches for videos on Pexels by a given term and imports them as movies.
     *
     * @param {Request} req - Contains the `query` field in the request body.
     * @param {Response} res - Express response object.
     *
     * @returns {Promise<void>} Newly imported movie or error message.
     *
     * @example
     * // POST /api/v1/movies/import
     * {
     *   "query": "nature"
     * }
     */
    async importMovieFromPexels(req, res) {
        try {
            const { query } = req.body;
            if (!query) {
                res.status(400).json({ message: "A search term for Pexels must be provided" });
                return;
            }
            const videos = await (0, pexelsService_1.searchVideos)(query, 1);
            if (!videos.length) {
                res.status(404).json({ message: "No videos found on Pexels" });
                return;
            }
            const video = videos[0];
            const newMovie = await MovieDAO_1.default.importFromPexels({
                title: query,
                genre: "Unknown",
                releaseDate: new Date(),
                image: video.image,
                url: video.url,
                videoFiles: video.videoFiles,
                duration: video.duration,
                user: video.user,
                source: "pexels",
            });
            res.status(201).json(newMovie);
        }
        catch (error) {
            console.error("Error importing movie from Pexels:", error);
            res.status(500).json({ message: "Error importing movie from Pexels" });
        }
    }
}
exports.default = new MovieController();
//# sourceMappingURL=MovieController.js.map