"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Movie_1 = __importDefault(require("../models/Movie"));
class MovieDAO {
    async create(data) {
        const movie = new Movie_1.default(data);
        return await movie.save();
    }
    async read(id) {
        return await Movie_1.default.findById(id);
    }
    async update(id, data) {
        return await Movie_1.default.findByIdAndUpdate(id, data, { new: true });
    }
    async delete(id) {
        return await Movie_1.default.findByIdAndDelete(id);
    }
    async getAll() {
        return await Movie_1.default.find().sort({ createdAt: -1 });
    }
}
exports.default = new MovieDAO();
//# sourceMappingURL=MovieDAO.js.map