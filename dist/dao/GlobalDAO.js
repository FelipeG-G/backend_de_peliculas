"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Clase genérica GlobalDAO<T>
 *
 * Proporciona operaciones CRUD reutilizables para cualquier modelo de Mongoose.
 * Se puede extender en DAOs específicos para cada entidad (UserDAO, MovieDAO, etc.).
 */
class GlobalDAO {
    constructor(model) {
        this.model = model;
    }
    /** Crear un nuevo documento */
    async create(data) {
        try {
            const document = new this.model(data);
            return await document.save();
        }
        catch (error) {
            throw new Error(`Error creating document: ${error.message}`);
        }
    }
    /** Obtener un documento por ID */
    async read(id) {
        try {
            const document = await this.model.findById(id);
            if (!document)
                throw new Error("Document not found");
            return document;
        }
        catch (error) {
            throw new Error(`Error getting document by ID: ${error.message}`);
        }
    }
    /** Actualizar un documento por ID */
    async update(id, updateData) {
        try {
            const updated = await this.model.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true,
            });
            if (!updated)
                throw new Error("Document not found");
            return updated;
        }
        catch (error) {
            throw new Error(`Error updating document by ID: ${error.message}`);
        }
    }
    /** Eliminar un documento por ID */
    async delete(id) {
        try {
            const deleted = await this.model.findByIdAndDelete(id);
            if (!deleted)
                throw new Error("Document not found");
            return deleted;
        }
        catch (error) {
            throw new Error(`Error deleting document by ID: ${error.message}`);
        }
    }
    /** Obtener todos los documentos (opcionalmente con un filtro) */
    async getAll(filter = {}) {
        try {
            return await this.model.find(filter);
        }
        catch (error) {
            throw new Error(`Error getting documents: ${error.message}`);
        }
    }
}
exports.default = GlobalDAO;
//# sourceMappingURL=GlobalDAO.js.map