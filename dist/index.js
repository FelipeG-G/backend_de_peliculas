"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors")); // Asegúrate de que CORS esté habilitado para tu frontend
const database_1 = __importDefault(require("./config/database")); // Conexión a MongoDB
const authRoutes_1 = __importDefault(require("./routes/authRoutes")); // Rutas de autenticación
const routes_1 = __importDefault(require("./routes/routes"));
dotenv_1.default.config(); // Cargar las variables de entorno
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json()); // Para que el servidor pueda procesar datos JSON
app.use((0, cors_1.default)({ origin: "http://localhost:5173" })); // Permite solicitudes desde el frontend (React)
// Usar rutas de autenticación
app.use("/api/auth", authRoutes_1.default);
// Conexión a la base de datos
(0, database_1.default)();
/**
 * Mount API routes under /api/v1
 */
app.use("/api/v1", routes_1.default);
/**
 * Health check endpoint.
 * Provides a simple way to verify that the server is running.
 */
app.get("/", (req, res) => res.send("Server is running"));
/**
 * Start server (only if executed directly)
 */
if (require.main === module) {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(` Server running on http://localhost:${PORT}`);
    });
}
exports.default = app;
//# sourceMappingURL=index.js.map