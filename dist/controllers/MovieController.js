"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GlobalController_1 = __importDefault(require("./GlobalController"));
const MovieDAO_1 = __importDefault(require("../dao/MovieDAO"));
class MovieController extends GlobalController_1.default {
    constructor() {
        super(MovieDAO_1.default);
    }
    async deleteMovie(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ message: "ID de película requerido" });
                return;
            }
            const deleted = await MovieDAO_1.default.delete(id);
            if (!deleted) {
                res.status(404).json({ message: "Película no encontrada" });
                return;
            }
            res.status(200).json({ message: "Película eliminada correctamente" });
        }
        catch (error) {
            console.error("Error eliminando película:", error);
            res.status(500).json({ message: "Error al eliminar la película" });
        }
    }
}
exports.default = new MovieController();
//# sourceMappingURL=MovieController.js.map