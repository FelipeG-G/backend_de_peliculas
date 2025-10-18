import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Middleware para verificar si el usuario está autenticado
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Obtener el token del encabezado Authorization
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "❌ No se proporcionó un token" });
  }

  try {
    // Verificar el token y decodificarlo
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded; // Establecer la información del usuario en la solicitud
    next();
  } catch (error) {
    return res.status(401).json({ message: "❌ Token no válido" });
  }
};

export default authMiddleware;
