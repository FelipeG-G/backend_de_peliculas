import { Router, Request, Response } from "express";
import MovieController from "../controllers/MovieController";
import MovieDAO from "../dao/MovieDAO";

const router = Router();

/**
 * Movie Routes
 *
 * Provides CRUD operations for movies.
 *
 * @module api/routes/movieRoutes
 */

/**
 * GET /movies
 * Retrieve all movies from the database.
 */
router.get("/", (req: Request, res: Response) => MovieController.getAll(req, res));

/**
 * GET /movies/:id
 * Retrieve a single movie by its unique identifier.
 */
router.get("/:id", (req: Request, res: Response) => MovieController.read(req, res));

/**
 * POST /movies
 * Create a new movie and persist it in the database.
 */
router.post("/", (req: Request, res: Response) => MovieController.create(req, res));

/**
 * PUT /movies/:id
 * Update an existing movie by its unique identifier.
 */
router.put("/:id", (req: Request, res: Response) => MovieController.update(req, res));

/**
 * DELETE /movies/:id
 * Permanently delete a movie by its unique identifier.
 */
router.delete("/:id", (req: Request, res: Response) => MovieController.delete(req, res));

export default router;
