"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MovieController_1 = __importDefault(require("../controllers/MovieController"));
const router = (0, express_1.Router)();
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
router.get("/", (req, res) => MovieController_1.default.getAll(req, res));
/**
 * GET /movies/:id
 * Retrieve a single movie by its unique identifier.
 */
router.get("/:id", (req, res) => MovieController_1.default.read(req, res));
/**
 * POST /movies
 * Create a new movie and persist it in the database.
 */
router.post("/", (req, res) => MovieController_1.default.create(req, res));
/**
 * PUT /movies/:id
 * Update an existing movie by its unique identifier.
 */
router.put("/:id", (req, res) => MovieController_1.default.update(req, res));
/**
 * DELETE /movies/:id
 * Permanently delete a movie by its unique identifier.
 */
router.delete("/:id", (req, res) => MovieController_1.default.delete(req, res));
exports.default = router;
//# sourceMappingURL=movieRoutes.js.map