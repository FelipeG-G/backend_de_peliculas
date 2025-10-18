import { Request, Response } from "express";

/**
 * Controlador genérico que proporciona operaciones CRUD comunes.
 */
export default class GlobalController<T> {
  private dao: any;

  constructor(dao: any) {
    this.dao = dao;
  }

  /**
   * Crear un nuevo documento en la base de datos.
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const item = await this.dao.create(req.body);
      res.status(201).json(item);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Recuperar un documento por su ID.
   */
  async read(req: Request, res: Response): Promise<void> {
    try {
      const item = await this.dao.read(req.params.id);
      res.status(200).json(item);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  /**
   * Actualizar un documento por ID.
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const item = await this.dao.update(req.params.id, req.body);
      res.status(200).json(item);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Eliminar un documento por ID.
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const item = await this.dao.delete(req.params.id);
      res.status(200).json(item);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  /**
   * Recuperar todos los documentos (opcionalmente filtrados por consulta).
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const items = await this.dao.getAll(req.query);
      res.status(200).json(items);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
