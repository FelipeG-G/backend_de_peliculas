import { Router } from "express";

import userRoutes from "./userRoutes";
import movieRoutes from "./movieRoutes";
import authRoutes from "./authRoutes";
import passwordRoutes from "./passwordRoutes";
import favoriteRoutes from "./favoriteRoutes";


const router = Router();

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
router.use("/users", userRoutes);
router.use("/movies", movieRoutes);
router.use("/auth", authRoutes);
router.use("/password", passwordRoutes);
router.use("/favorites", favoriteRoutes);


export default router;
