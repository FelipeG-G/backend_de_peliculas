"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AverageController_1 = __importDefault(require("../controllers/AverageController"));
const router = (0, express_1.Router)();
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
router.get("/:pexelsId", (req, res) => AverageController_1.default.getAverage(req, res));
exports.default = router;
//# sourceMappingURL=averageRoutes.js.map