"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ReviewController_1 = __importDefault(require("../controllers/ReviewController"));
// import AverageController from "../controllers/AverageController";
const router = (0, express_1.Router)();
/**
 * @file ReviewRoutes.ts
 * @description Defines all routes related to movie reviews (CRUD operations).
 * Each route calls the corresponding method in the `ReviewController`.
 */
/**
 * @route POST /
 * @description Creates a new review for a movie.
 * @access Public or protected depending on authentication middleware.
 */
router.post("/", (req, res) => ReviewController_1.default.addReview(req, res));
/**
 * @route GET /:pexelsId
 * @description Retrieves all reviews for a specific movie by its `pexelsId`.
 * @param {string} pexelsId - The ID of the movie from Pexels.
 */
router.get("/:pexelsId", (req, res) => ReviewController_1.default.getReviewsByPexelsId(req, res));
/**
 * @route PUT /:pexelsId
 * @description Updates an existing review by movie `pexelsId`.
 * @param {string} pexelsId - The ID of the movie whose review will be updated.
 */
router.put("/:pexelsId", (req, res) => ReviewController_1.default.updateReview(req, res));
/**
 * @route DELETE /:pexelsId
 * @description Deletes a review for a specific movie by its `pexelsId`.
 * @param {string} pexelsId - The ID of the movie whose review will be deleted.
 */
router.delete("/:pexelsId", (req, res) => ReviewController_1.default.deleteReview(req, res));
exports.default = router;
//# sourceMappingURL=reviewRoutes.js.map