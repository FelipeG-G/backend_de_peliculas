import { Router, Request, Response } from "express";
import ReviewController from "../controllers/ReviewController";

const router = Router();

// Crear reseña
router.post("/", (req: Request, res: Response) => ReviewController.addReview(req, res));

// Obtener todas las reseñas de una película
router.get("/:pexelsId", (req: Request, res: Response) => ReviewController.getReviewsByPexelsId(req, res));

// Actualizar reseña (por película)
router.put("/:pexelsId", (req: Request, res: Response) => ReviewController.updateReview(req, res));

// Eliminar reseña (por película)
router.delete("/:pexelsId", (req: Request, res: Response) => ReviewController.deleteReview(req, res));

export default router;
