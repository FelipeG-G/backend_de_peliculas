import { Request, Response } from "express";
import GlobalController from "./GlobalController";
import MovieDAO from "../dao/MovieDAO";
import { IMovie } from "../models/Movie";
import { searchVideos } from "../services/pexelsService";

class MovieController extends GlobalController<IMovie> {
  constructor() {
    super(MovieDAO);
  }

  // 📌 Crear película
  async create(req: Request, res: Response): Promise<void> {
    try {
      const data: Partial<IMovie> = req.body;
      if (!data.title || !data.genre || !data.releaseDate) {
        res.status(400).json({ message: "Faltan campos obligatorios" });
        return;
      }

      const newMovie = await MovieDAO.create(data);
      res.status(201).json(newMovie);
    } catch (error) {
      console.error("Error creando película:", error);
      res.status(500).json({ message: "Error al crear la película" });
    }
  }

  // 📌 Obtener todas las películas
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const movies = await MovieDAO.getAll();
      res.status(200).json(movies);
    } catch (error) {
      console.error("Error obteniendo películas:", error);
      res.status(500).json({ message: "Error al obtener las películas" });
    }
  }

  // 📌 Obtener película por ID
  async read(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const movie = await MovieDAO.read(id);
      if (!movie) {
        res.status(404).json({ message: "Película no encontrada" });
        return;
      }
      res.status(200).json(movie);
    } catch (error) {
      console.error("Error obteniendo película:", error);
      res.status(500).json({ message: "Error al obtener la película" });
    }
  }

  // 📌 Actualizar película
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data: Partial<IMovie> = req.body;
      const updated = await MovieDAO.update(id, data);

      if (!updated) {
        res.status(404).json({ message: "Película no encontrada" });
        return;
      }

      res.status(200).json(updated);
    } catch (error) {
      console.error("Error actualizando película:", error);
      res.status(500).json({ message: "Error al actualizar la película" });
    }
  }

  // 📌 Eliminar película
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
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

  // 📌 Buscar películas por género
  async getMoviesByGenre(req: Request, res: Response): Promise<void> {
    try {
      const { genre } = req.params;
      const movies = await MovieDAO.findByGenre(genre);
      res.status(200).json(movies);
    } catch (error) {
      console.error("Error obteniendo películas por género:", error);
      res.status(500).json({ message: "Error al obtener las películas" });
    }
  }

  // 📌 Buscar películas por título
  async searchMovies(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        res.status(400).json({ message: "Debe proporcionar un término de búsqueda" });
        return;
      }

      const movies = await MovieDAO.searchByTitle(q);
      res.status(200).json(movies);
    } catch (error) {
      console.error("Error buscando películas:", error);
      res.status(500).json({ message: "Error al buscar películas" });
    }
  }

  // 🎥 Importar película desde Pexels
  async importMovieFromPexels(req: Request, res: Response): Promise<void> {
    try {
      const { query } = req.body;
      if (!query) {
        res.status(400).json({ message: "Debe proporcionar un término de búsqueda para Pexels" });
        return;
      }

      const videos = await searchVideos(query, 1);
      if (!videos.length) {
        res.status(404).json({ message: "No se encontraron videos en Pexels" });
        return;
      }

      const video = videos[0];
      const newMovie = await MovieDAO.importFromPexels({
        title: query,
        genre: "Desconocido",
        releaseDate: new Date(),
        image: video.image,
        url: video.url,
        videoFiles: video.videoFiles,
        duration: video.duration,
        user: video.user,
        source: "pexels",
      });

      res.status(201).json(newMovie);
    } catch (error) {
      console.error("Error importando película desde Pexels:", error);
      res.status(500).json({ message: "Error al importar la película desde Pexels" });
    }
  }
}

export default new MovieController();
