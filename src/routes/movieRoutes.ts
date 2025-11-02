import { Router, Request, Response } from "express";
import MovieController from "../controllers/MovieController";
import { searchVideos } from "../services/pexelsService";

const router = Router();

/**
 * 🎬 Movie Routes
 * 
 * Gestiona las operaciones CRUD relacionadas con las películas almacenadas
 * en la base de datos local, así como consultas externas a Pexels.
 */

/**
 * @route GET /movies
 * @description Obtiene todas las películas almacenadas.
 */
router.get("/", (req: Request, res: Response) => MovieController.getAll(req, res));

/**
 * @route GET /movies/genre/:genre
 * @description Filtra películas por género.
 */
router.get("/genre/:genre", (req: Request, res: Response) =>
  MovieController.getMoviesByGenre(req, res)
);

/**
 * @route GET /movies/search/title
 * @description Busca películas por título parcial o completo.
 */
router.get("/search/title", (req: Request, res: Response) =>
  MovieController.searchMovies(req, res)
);

/**
 * @route GET /movies/:id
 * @description Obtiene una película específica por su ID.
 */
router.get("/:id", (req: Request, res: Response) => MovieController.read(req, res));

/**
 * @route POST /movies
 * @description Crea una nueva película.
 */
router.post("/", (req: Request, res: Response) => MovieController.create(req, res));

/**
 * @route PUT /movies/:id
 * @description Actualiza una película existente.
 */
router.put("/:id", (req: Request, res: Response) => MovieController.update(req, res));

/**
 * @route DELETE /movies/:id
 * @description Elimina una película por su ID.
 */
router.delete("/:id", (req: Request, res: Response) => MovieController.delete(req, res));

/**
 * @route POST /movies/import
 * @description Importa una película desde la API de Pexels.
 */
router.post("/import", (req: Request, res: Response) => MovieController.importMovieFromPexels(req, res));

/**
 * @route GET /movies/pexels/search
 * @description Busca videos directamente en la API de Pexels.
 * @query {string} query - Palabra clave de búsqueda.
 */
router.get("/pexels/search", async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    if (!query || typeof query !== "string") {
      return res.status(400).json({ message: "Falta el parámetro 'query'" });
    }

    const videos = await searchVideos(query, 5); // obtiene 5 resultados desde Pexels
    res.status(200).json(videos);
  } catch (error) {
    console.error("❌ Error en ruta /movies/pexels/search:", error);
    res.status(500).json({ message: "Error al obtener videos desde Pexels" });
  }
});

export default router;
