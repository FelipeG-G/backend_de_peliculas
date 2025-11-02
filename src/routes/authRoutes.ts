import { Router, Request, Response } from "express";
import AverageController from "../controllers/AverageController";

const router = Router();

/**
 * Average Routes
 *
 * Handles endpoints related to movie rating averages.
 *
 * @module api/routes/averageRoutes
 */

/**
 * GET /average/:pexelsId
 * Retrieve the average rating and total reviews for a specific movie.
 */
router.get("/:pexelsId", (req: Request, res: Response) =>
  AverageController.getAverage(req, res)
);

export default router;
