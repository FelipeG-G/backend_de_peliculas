"use strict";
/**
 * @file index.ts
 * @description Main entry point for the Express server.
 * Configures environment variables, database connection,
 * global middlewares, CORS handling, and route mounting.
 *
 * @module Server
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const allowedOrigins_1 = require("./config/allowedOrigins");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors")); // Enables CORS to allow frontend requests
const database_1 = __importDefault(require("./config/database")); // MongoDB connection
const authRoutes_1 = __importDefault(require("./routes/authRoutes")); // Authentication routes
const routes_1 = __importDefault(require("./routes/routes")); // General API routes
const userRoutes_1 = __importDefault(require("./routes/userRoutes")); // User management routes
const favoriteRoutes_1 = __importDefault(require("./routes/favoriteRoutes")); // Favorite routes
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes")); // Review routes
const passwordRoutes_1 = __importDefault(require("./routes/passwordRoutes")); // Review routes
const averageRoutes_1 = __importDefault(require("./routes/averageRoutes")); // Average rating routes
dotenv_1.default.config(); // Load environment variables from .env file
/**
 * Main Express application instance.
 * @type {import('express').Application}
 */
const app = (0, express_1.default)();
/* ==========================
   🧩 GLOBAL MIDDLEWARES
   ========================== */
/**
 * Middleware to parse incoming JSON requests.
 * Allows Express to handle JSON data in request bodies.
 */
app.use(express_1.default.json());
/**
 * Whitelisted origins allowed for CORS requests.
 * Includes development and production environments (Vercel, Render, Localhost).
 * @type {string[]}
 */
/**
 * CORS Middleware.
 * Only allows requests from the origins defined in allowedOrigins.
 */
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins_1.allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.warn("Blocked by CORS:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
/* ==========================
   🧭 MAIN ROUTES
   ========================== */
/**
 * Authentication routes.
 * Prefix: `/api/auth`
 */
app.use("/api/auth", authRoutes_1.default);
/**
 * Establish MongoDB connection.
 * Executed when the server starts.
 * @function connectDB
 */
(0, database_1.default)();
/**
 * General API routes.
 * Prefix: `/api/v1`
 */
app.use("/api/v1", routes_1.default);
/**
 * User management routes.
 * Prefix: `/api/v1/users`
 */
app.use("/api/v1/users", userRoutes_1.default);
/**
 * Favorite management routes.
 * Prefix: `/api/v1/favorites`
 */
app.use("/api/v1/favorites", favoriteRoutes_1.default);
/**
 * Review management routes.
 * Prefix: `/api/v1/reviews`
 */
app.use("/api/v1/reviews", reviewRoutes_1.default);
/**
 * Average calculation routes.
 * Prefix: `/api/v1/average`
 */
app.use("/api/v1/average", averageRoutes_1.default);
app.use("/api/v1/password", passwordRoutes_1.default);
/**
 * @route GET /
 * @description Health check endpoint.
 * Verifies that the server is running correctly.
 * @returns {string} A confirmation message.
 */
app.get("/", (req, res) => res.send("Server is running"));
/**
 * Starts the server only if this file is executed directly.
 * Skipped when running unit tests or importing the module.
 */
if (require.main === module) {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
exports.default = app;
//# sourceMappingURL=index.js.map