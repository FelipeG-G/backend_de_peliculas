"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MovieController_1 = __importDefault(require("../controllers/MovieController"));
const pexelsService_1 = require("../services/pexelsService");
const router = (0, express_1.Router)();
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
router.get("/", (req, res) => MovieController_1.default.getAll(req, res));
/**
 * @route GET /movies/genre/:genre
 * @description Filtra películas por género.
 */
router.get("/genre/:genre", (req, res) => MovieController_1.default.getMoviesByGenre(req, res));
/**
 * @route GET /movies/search/title
 * @description Busca películas por título parcial o completo.
 */
router.get("/search/title", (req, res) => MovieController_1.default.searchMovies(req, res));
/**
 * @route GET /movies/:id
 * @description Obtiene una película específica por su ID.
 */
router.get("/:id", (req, res) => MovieController_1.default.read(req, res));
/**
 * @route POST /movies
 * @description Crea una nueva película.
 */
router.post("/", (req, res) => MovieController_1.default.create(req, res));
/**
 * @route PUT /movies/:id
 * @description Actualiza una película existente.
 */
router.put("/:id", (req, res) => MovieController_1.default.update(req, res));
/**
 * @route DELETE /movies/:id
 * @description Elimina una película por su ID.
 */
router.delete("/:id", (req, res) => MovieController_1.default.delete(req, res));
/**
 * @route POST /movies/import
 * @description Importa una película desde la API de Pexels.
 */
router.post("/import", (req, res) => MovieController_1.default.importMovieFromPexels(req, res));
/**
 * @route GET /movies/pexels/search
 * @description Busca videos directamente en la API de Pexels.
 * @query {string} query - Palabra clave de búsqueda.
 */
router.get("/pexels/search", async (req, res) => {
    try {
        const { query } = req.query;
        if (!query || typeof query !== "string") {
            return res.status(400).json({ message: "Falta el parámetro 'query'" });
        }
        const videos = await (0, pexelsService_1.searchVideos)(query, 5); // obtiene 5 resultados desde Pexels
        res.status(200).json(videos);
    }
    catch (error) {
        console.error("❌ Error en ruta /movies/pexels/search:", error);
        res.status(500).json({ message: "Error al obtener videos desde Pexels" });
    }
});
exports.default = router;
//# sourceMappingURL=movieRoutes.js.map