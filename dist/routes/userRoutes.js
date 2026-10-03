"use strict";
/**
 * @fileoverview Defines user-related API routes such as authentication,
 * profile management, and password recovery.
 * @module routes/userRoutes
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const UserController_2 = __importDefault(require("../controllers/UserController"));
const router = (0, express_1.Router)();
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
router.post("/login", UserController_1.loginUser);
/**
 * @route GET /api/v1/users/profile
 * @description Retrieve the profile of the currently authenticated user.
 * @access Private
 */
router.get("/profile", (req, res) => UserController_2.default.getProfile(req, res));
/**
 * @route PUT /api/v1/users/profile
 * @description Update profile data (e.g., username, email, avatar) for the logged-in user.
 * @access Private
 */
router.put("/profile", (req, res) => UserController_2.default.updateProfile(req, res));
/**
 * @route DELETE /api/v1/users/profile
 * @description Permanently delete the authenticated user’s profile and related data.
 * @access Private
 */
router.delete("/profile", (req, res) => UserController_2.default.deleteProfile(req, res));
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
router.post("/register", UserController_1.registerUser);
/**
 * @route POST /api/v1/users/request-password-reset
 * @description Send a password reset email to the user.
 * @access Public
 */
router.post("/request-password-reset", UserController_1.requestPasswordReset);
/**
 * @route POST /api/v1/users/reset-password
 * @description Reset user’s password using the provided token and new password.
 * @access Public
 */
router.post("/reset-password", UserController_1.resetPassword);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map