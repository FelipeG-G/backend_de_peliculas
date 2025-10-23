import { Router, Request, Response } from "express";
import FavoriteController from "../controllers/FavoriteController";

const router = Router();

router.get("/:userId", (req: Request, res: Response) => FavoriteController.getUserFavorites (req, res));
router.post("/",(req: Request, res: Response) =>  FavoriteController.addFavorite (req, res));
router.put("/:favoriteId", (req: Request, res: Response) => FavoriteController.updateFavorite(req, res));
router.delete("/:userId",(req: Request, res: Response) =>  FavoriteController.removeFavorite (req, res));

export default router;

