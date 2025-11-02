import { Router, Request, Response } from "express";
import ReviewController from "../controllers/ReviewController";
// import AverageController from "../controllers/AverageController";

const router = Router();

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
router.post("/", (req: Request, res: Response) => ReviewController.addReview(req, res));

/**
 * @route GET /:pexelsId
 * @description Retrieves all reviews for a specific movie by its `pexelsId`.
 * @param {string} pexelsId - The ID of the movie from Pexels.
 */
router.get("/:pexelsId", (req: Request, res: Response) => ReviewController.getReviewsByPexelsId(req, res));

/**
 * @route PUT /:pexelsId
 * @description Updates an existing review by movie `pexelsId`.
 * @param {string} pexelsId - The ID of the movie whose review will be updated.
 */
router.put("/:pexelsId", (req: Request, res: Response) => ReviewController.updateReview(req, res));

/**
 * @route DELETE /:pexelsId
 * @description Deletes a review for a specific movie by its `pexelsId`.
 * @param {string} pexelsId - The ID of the movie whose review will be deleted.
 */
router.delete("/:pexelsId", (req: Request, res: Response) => ReviewController.deleteReview(req, res));

export default router;
