import { Request, Response } from "express";

/**
 * Generic controller providing common CRUD operations.
 * 
 * Acts as a middle layer between Express requests and DAO logic.
 * Controllers such as UserController or MovieController extend this class
 * or use it as a base to quickly implement REST endpoints.
 */
export default class GlobalController<T> {
  private dao: any;

  constructor(dao: any) {
    this.dao = dao;
  }

  /**
   * Create a new document in the database.
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
   * Retrieve a document by its ID.
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
   * Update a document by ID.
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
   * Delete a document by ID.
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
   * Retrieve all documents (optionally filtered by query).
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
