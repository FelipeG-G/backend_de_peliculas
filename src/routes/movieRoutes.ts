import { Router, Request, Response } from "express";
import MovieController from "../controllers/MovieController";
import { searchVideos } from "../services/pexelsService";


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

// Extras
router.get("/genre/:genre", (req: Request, res: Response) =>MovieController.getMoviesByGenre(req, res));
router.get("/search/title",(req: Request, res: Response) => MovieController.searchMovies(req, res));


router.post("/import", (req, res) => MovieController.importMovieFromPexels(req, res));
router.get("/pexels/search", async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    if (!query || typeof query !== "string") {
      return res.status(400).json({ message: "Falta el parámetro 'query'" });
    }

    const videos = await searchVideos(query, 5); // trae 5 resultados
    res.status(200).json(videos);
  } catch (error) {
    console.error("Error en ruta de prueba Pexels:", error);
    res.status(500).json({ message: "Error al obtener videos desde Pexels" });
  }
});
export default router;
