import { Request, Response } from "express";
import GlobalController from "./GlobalController";
import MovieDAO from "../dao/MovieDAO";
import { IMovie } from "../models/Movie";

class MovieController extends GlobalController<IMovie> {
  constructor() {
    super(MovieDAO);
  }

  async deleteMovie(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: "ID de película requerido" });
        return;
      }

      const deleted = await MovieDAO.delete(id);
      if (!deleted) {
        res.status(404).json({ message: "Película no encontrada" });
        return;
      }

      res.status(200).json({ message: "Película eliminada correctamente" });
    } catch (error) {
      console.error("Error eliminando película:", error);
      res.status(500).json({ message: "Error al eliminar la película" });
    }
  }
}

export default new MovieController();
