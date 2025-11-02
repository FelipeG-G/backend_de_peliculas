import { Request, Response } from "express";

/**
 * @file GlobalController.ts
 * @description Generic controller that provides reusable CRUD operations 
 * (Create, Read, Update, Delete) for any entity in the system. 
 * It relies on a DAO object that implements the corresponding 
 * data access operations.
 *
 * @template T Generic type representing the entity managed by the controller.
 */
export default class GlobalController<T> {
  private dao: any;

  /**
   * Creates a new instance of the global controller.
   * @param {any} dao - Data Access Object (DAO) that implements CRUD methods.
   */
  constructor(dao: any) {
    this.dao = dao;
  }

  /**
   * Creates a new document in the database.
   *
   * @async
   * @param {Request} req - HTTP request object containing data to create in `req.body`.
   * @param {Response} res - HTTP response object used to return the result.
   * @returns {Promise<void>} Sends a response with the created document or an error.
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
   * Retrieves a document by its ID.
   *
   * @async
   * @param {Request} req - HTTP request object containing the ID in `req.params.id`.
   * @param {Response} res - HTTP response object.
   * @returns {Promise<void>} Sends the found document or a 404 error if not found.
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
   * Updates a document by its ID.
   *
   * @async
   * @param {Request} req - HTTP request object containing the ID in `req.params.id` 
   * and the updated data in `req.body`.
   * @param {Response} res - HTTP response object.
   * @returns {Promise<void>} Sends the updated document or an error.
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
   * Deletes a document by its ID.
   *
   * @async
   * @param {Request} req - HTTP request object containing the ID in `req.params.id`.
   * @param {Response} res - HTTP response object.
   * @returns {Promise<void>} Sends the deleted document or a 404 error if not found.
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
   * Retrieves all stored documents (may include filters via query parameters).
   *
   * @async
   * @param {Request} req - HTTP request object, possibly containing filters in `req.query`.
   * @param {Response} res - HTTP response object.
   * @returns {Promise<void>} Sends a list of documents or an error.
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
