"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRoutes_1 = __importDefault(require("./userRoutes"));
const movieRoutes_1 = __importDefault(require("./movieRoutes"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const passwordRoutes_1 = __importDefault(require("./passwordRoutes"));
const router = (0, express_1.Router)();
/**
 * Mount user-related routes.
 *
 * All routes defined in {@link userRoutes} will be accessible under `/users`.
 * Example:
 *   - GET  /users        → Get all users
 *   - POST /users        → Create a new user
 *   - GET  /users/:id    → Get a user by ID
 *   - PUT  /users/:id    → Update a user by ID
 *   - DELETE /users/:id  → Delete a user by ID
 */
router.use("/users", userRoutes_1.default);
router.use("/movies", movieRoutes_1.default);
router.use("/auth", authRoutes_1.default);
router.use("/password", passwordRoutes_1.default);
exports.default = router;
//# sourceMappingURL=routes.js.map