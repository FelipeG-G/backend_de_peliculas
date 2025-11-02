import { Model, Document, FilterQuery, UpdateQuery } from "mongoose";

/**
 * @file GlobalDAO.ts
 * @description Generic Data Access Object (DAO) class that provides reusable CRUD operations
 * for any Mongoose model. It can be extended in specific DAOs for each entity (e.g., UserDAO, MovieDAO, etc.).
 *
 * @template T - The type representing the Mongoose document.
 */
export default class GlobalDAO<T extends Document> {
  protected model: Model<T>;

  /**
   * Creates a new instance of the GlobalDAO for the provided Mongoose model.
   *
   * @param {Model<T>} model - The Mongoose model to operate on.
   */
  constructor(model: Model<T>) {
    this.model = model;
  }

  /**
   * Creates a new document in the database.
   *
   * @async
   * @param {Partial<T>} data - The data to create the new document.
   * @returns {Promise<T>} The created document.
   * @throws {Error} If there is an issue creating the document.
   */
  async create(data: Partial<T>): Promise<T> {
    try {
      const document = new this.model(data);
      return await document.save();
    } catch (error: any) {
      throw new Error(`Error creating document: ${error.message}`);
    }
  }

  /**
   * Retrieves a document by its ID.
   *
   * @async
   * @param {string} id - The ID of the document to retrieve.
   * @returns {Promise<T>} The found document.
   * @throws {Error} If the document is not found or if an error occurs.
   */
  async read(id: string): Promise<T> {
    try {
      const document = await this.model.findById(id);
      if (!document) throw new Error("Document not found");
      return document;
    } catch (error: any) {
      throw new Error(`Error getting document by ID: ${error.message}`);
    }
  }

  /**
   * Updates a document by its ID.
   *
   * @async
   * @param {string} id - The ID of the document to update.
   * @param {UpdateQuery<T>} updateData - The data to update in the document.
   * @returns {Promise<T>} The updated document.
   * @throws {Error} If the document is not found or if an update error occurs.
   */
  async update(id: string, updateData: UpdateQuery<T>): Promise<T> {
    try {
      const updated = await this.model.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
      if (!updated) throw new Error("Document not found");
      return updated;
    } catch (error: any) {
      throw new Error(`Error updating document by ID: ${error.message}`);
    }
  }

  /**
   * Deletes a document by its ID.
   *
   * @async
   * @param {string} id - The ID of the document to delete.
   * @returns {Promise<T>} The deleted document.
   * @throws {Error} If the document is not found or if a deletion error occurs.
   */
  async delete(id: string): Promise<T> {
    try {
      const deleted = await this.model.findByIdAndDelete(id);
      if (!deleted) throw new Error("Document not found");
      return deleted;
    } catch (error: any) {
      throw new Error(`Error deleting document by ID: ${error.message}`);
    }
  }

  /**
   * Retrieves all documents that match an optional filter.
   *
   * @async
   * @param {FilterQuery<T>} [filter={}] - Optional filter to apply to the query.
   * @returns {Promise<T[]>} An array of documents.
   * @throws {Error} If there is an issue retrieving the documents.
   */
  async getAll(filter: FilterQuery<T> = {}): Promise<T[]> {
    try {
      return await this.model.find(filter);
    } catch (error: any) {
      throw new Error(`Error getting documents: ${error.message}`);
    }
  }
}
