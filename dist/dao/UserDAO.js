"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/dao/UserDAO.ts
const GlobalDAO_1 = __importDefault(require("./GlobalDAO"));
const User_1 = __importDefault(require("../models/User")); // El modelo de Usuario
class UserDAO extends GlobalDAO_1.default {
    constructor() {
        super(User_1.default); // Pasar el modelo de Usuario al GlobalDAO
    }
    /**
     * Busca un usuario por su correo electrónico.
     * @param email - Correo del usuario a buscar.
     * @returns El documento del usuario o `null` si no existe.
     */
    async findByEmail(email) {
        return await User_1.default.findOne({ email });
    }
}
exports.default = new UserDAO(); // Instancia única para evitar instancias redundantes
//# sourceMappingURL=UserDAO.js.map