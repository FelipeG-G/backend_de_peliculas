import { Router } from "express";
import AverageController from "../controllers/AverageController";

const router = Router();

router.get("/:pexelsId", (req, res) => AverageController.getAverage(req, res));

export default router;
