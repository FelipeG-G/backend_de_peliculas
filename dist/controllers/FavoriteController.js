"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const FavoriteDAO_1 = __importDefault(require("../dao/FavoriteDAO"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * @file FavoriteController.ts
 * @description Controller responsible for handling CRUD operations related to user favorites.
 * Includes functions to add, retrieve, and delete favorites, as well as validate JWT tokens.
 */
/**
 * Extracts the user ID from the JWT token provided in the `Authorization` header.
 * Returns `null` if the token is invalid or missing.
 *
 * @param {AuthRequest} req - HTTP request object.
 * @returns {mongoose.Types.ObjectId | null} The user ID as an ObjectId or `null` if invalid.
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
    catch (err) {
        console.error("❌ Error verifying token:", err);
        return null;
    }
}
/**
 * Favorites Controller.
 * Contains the main methods to manage user favorite operations.
 *
 * @namespace FavoriteController
 */
const FavoriteController = {
    /**
     * Adds a new favorite for the authenticated user.
     *
     * @async
     * @function addFavorite
     * @memberof FavoriteController
     * @param {AuthRequest} req - HTTP request with JWT token and favorite data.
     * @param {Response} res - HTTP response.
     * @returns {Promise<void>} Sends a response with the created favorite or an error message.
     */
    async addFavorite(req, res) {
        try {
            const userId = getUserIdFromToken(req);
            if (!userId) {
                res.status(401).json({ message: "Invalid or missing token" });
                return;
            }
            const { id, title, image, thumbnail, pexelsId: bodyPexelsId } = req.body;
            const pexelsId = String(id ?? bodyPexelsId ?? "").trim();
            const thumb = thumbnail || image || "";
            if (!pexelsId || !title) {
                res.status(400).json({ message: "Missing required fields (id/pexelsId or title)" });
                return;
            }
            const exists = await FavoriteDAO_1.default.isAlreadyFavorite(userId.toString(), pexelsId);
            if (exists) {
                res.status(409).json({ message: "This favorite already exists" });
                return;
            }
            const newFavorite = await FavoriteDAO_1.default.addFavorite({
                userId,
                pexelsId,
                title,
                thumbnail: thumb,
            });
            res.status(201).json(newFavorite);
        }
        catch (error) {
            console.error("❌ Error adding favorite:", error);
            if (error?.code === 11000) {
                res.status(409).json({ message: "Duplicate favorite" });
            }
            else {
                res.status(500).json({ message: "Error adding favorite" });
            }
        }
    },
    /**
     * Retrieves all favorites of the authenticated user.
     *
     * @async
     * @function getUserFavorites
     * @memberof FavoriteController
     * @param {AuthRequest} req - HTTP request with JWT token.
     * @param {Response} res - HTTP response.
     * @returns {Promise<void>} Sends an array of user favorites or an error.
     */
    async getUserFavorites(req, res) {
        try {
            const userId = getUserIdFromToken(req);
            if (!userId) {
                res.status(401).json({ message: "Invalid or missing token" });
                return;
            }
            const favorites = await FavoriteDAO_1.default.getUserFavorites(userId.toString());
            const transformed = favorites.map((fav) => ({
                id: Number(fav.pexelsId) || fav.pexelsId,
                title: fav.title,
                image: fav.thumbnail || "",
                genre: "Favorites",
                year: 2024,
                duration: "N/A",
                rating: 5.0,
                videoUrl: "",
                pexelsId: fav.pexelsId,
            }));
            res.status(200).json(transformed);
        }
        catch (error) {
            console.error("❌ Error retrieving favorites:", error);
            res.status(500).json({ message: "Error retrieving favorites" });
        }
    },
    /**
     * Deletes a favorite by its `pexelsId` for the authenticated user.
     *
     * @async
     * @function removeFavorite
     * @memberof FavoriteController
     * @param {AuthRequest} req - HTTP request with JWT token and `pexelsId` parameter.
     * @param {Response} res - HTTP response.
     * @returns {Promise<void>} Sends deletion confirmation or an error message.
     */
    async removeFavorite(req, res) {
        try {
            const userId = getUserIdFromToken(req);
            if (!userId) {
                res.status(401).json({ message: "Invalid or missing token" });
                return;
            }
            const { pexelsId } = req.params;
            const realPexelsId = String(pexelsId ?? "").trim();
            if (!realPexelsId) {
                res.status(400).json({ message: "Missing favorite ID (pexelsId) to delete" });
                return;
            }
            const deleted = await FavoriteDAO_1.default.removeFavoriteByPexelsId(userId.toString(), realPexelsId);
            if (!deleted) {
                res.status(404).json({ message: "Favorite not found" });
                return;
            }
            res.status(200).json({ message: "Favorite successfully deleted" });
        }
        catch (error) {
            console.error("❌ Error deleting favorite:", error);
            res.status(500).json({ message: "Error deleting favorite" });
        }
    },
};
exports.default = FavoriteController;
//# sourceMappingURL=FavoriteController.js.map