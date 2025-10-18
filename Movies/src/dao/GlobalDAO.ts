import { Model, Document, FilterQuery, UpdateQuery } from "mongoose";

/**
 * Clase genérica GlobalDAO<T>
 *
 * Proporciona operaciones CRUD reutilizables para cualquier modelo de Mongoose.
 * Se puede extender en DAOs específicos para cada entidad (UserDAO, MovieDAO, etc.).
 */
export default class GlobalDAO<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  /** Crear un nuevo documento */
  async create(data: Partial<T>): Promise<T> {
    try {
      const document = new this.model(data);
      return await document.save();
    } catch (error: any) {
      throw new Error(`Error creating document: ${error.message}`);
    }
  }

  /** Obtener un documento por ID */
  async read(id: string): Promise<T> {
    try {
      const document = await this.model.findById(id);
      if (!document) throw new Error("Document not found");
      return document;
    } catch (error: any) {
      throw new Error(`Error getting document by ID: ${error.message}`);
    }
  }

  /** Actualizar un documento por ID */
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

  /** Eliminar un documento por ID */
  async delete(id: string): Promise<T> {
    try {
      const deleted = await this.model.findByIdAndDelete(id);
      if (!deleted) throw new Error("Document not found");
      return deleted;
    } catch (error: any) {
      throw new Error(`Error deleting document by ID: ${error.message}`);
    }
  }

  /** Obtener todos los documentos (opcionalmente con un filtro) */
  async getAll(filter: FilterQuery<T> = {}): Promise<T[]> {
    try {
      return await this.model.find(filter);
    } catch (error: any) {
      throw new Error(`Error getting documents: ${error.message}`);
    }
  }
}
