/**
 * @fileoverview Defines user-related API routes such as authentication,
 * profile management, and password recovery.
 * @module routes/userRoutes
 */

import { Router, Request, Response } from "express";
import {
  loginUser,
  registerUser,
  requestPasswordReset,
  resetPassword,
} from "../controllers/UserController";
import UserController from "../controllers/UserController";

const router = Router();

/**
 * @route POST /api/v1/users/login
 * @description Authenticate a user and return a JWT token.
 * @access Public
 * @example
 * // Request body
 * {
 *   "email": "user@example.com",
 *   "password": "123456"
 * }
 * // Response
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIs..."
 * }
 */
router.post("/login", loginUser);

/**
 * @route GET /api/v1/users/profile
 * @description Retrieve the profile of the currently authenticated user.
 * @access Private
 */
router.get("/profile", (req: Request, res: Response) =>
  UserController.getProfile(req, res)
);

/**
 * @route PUT /api/v1/users/profile
 * @description Update profile data (e.g., username, email, avatar) for the logged-in user.
 * @access Private
 */
router.put("/profile", (req: Request, res: Response) =>
  UserController.updateProfile(req, res)
);

/**
 * @route DELETE /api/v1/users/profile
 * @description Permanently delete the authenticated user’s profile and related data.
 * @access Private
 */
router.delete("/profile", (req: Request, res: Response) =>
  UserController.deleteProfile(req, res)
);

/**
 * @route POST /api/v1/users/register
 * @description Create a new user account.
 * @access Public
 * @example
 * // Request body
 * {
 *   "username": "JohnDoe",
 *   "email": "john@example.com",
 *   "password": "123456"
 * }
 */
router.post("/register", registerUser);

/**
 * @route POST /api/v1/users/request-password-reset
 * @description Send a password reset email to the user.
 * @access Public
 */
router.post("/request-password-reset", requestPasswordReset);

/**
 * @route POST /api/v1/users/reset-password
 * @description Reset user’s password using the provided token and new password.
 * @access Public
 */
router.post("/reset-password", resetPassword);

export default router;
