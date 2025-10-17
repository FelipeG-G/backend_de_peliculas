import express from "express";
import dotenv from "dotenv";
import cors from "cors";  // Asegúrate de que CORS esté habilitado para tu frontend
import connectDB from "./config/database"; // Conexión a MongoDB
import authRoutes from "./routes/authRoutes"; // Rutas de autenticación
import routes from "./routes/routes";
dotenv.config();  // Cargar las variables de entorno

const app = express();

// Middleware
app.use(express.json());  // Para que el servidor pueda procesar datos JSON
app.use(cors({ origin: "http://localhost:5173" })); // Permite solicitudes desde el frontend (React)

// Usar rutas de autenticación
app.use("/api/auth", authRoutes);

// Conexión a la base de datos
connectDB();

/**
 * Mount API routes under /api/v1
 */
app.use("/api/v1", routes);
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

export default app;
