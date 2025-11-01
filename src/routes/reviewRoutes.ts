import { Router, Request, Response } from "express";
import ReviewController from "../controllers/ReviewController";
import AverageController from "../controllers/AverageController";

const router = Router();

// 📊 Promedios
router.get("/average/:pexelsId",(req: Request, res: Response) => AverageController.getAverage(req, res));

// Crear reseña
router.post("/", (req: Request, res: Response) => ReviewController.addReview(req, res));

// Obtener todas las reseñas de una película
router.get("/:pexelsId", (req: Request, res: Response) => ReviewController.getReviewsByPexelsId(req, res));

// Actualizar reseña (por película)
router.put("/:pexelsId", (req: Request, res: Response) => ReviewController.updateReview(req, res));

// Eliminar reseña (por película)
router.delete("/:pexelsId", (req: Request, res: Response) => ReviewController.deleteReview(req, res));

export default router;
