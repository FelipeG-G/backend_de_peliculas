"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/dao/UserDAO.ts
const GlobalDAO_1 = __importDefault(require("./GlobalDAO"));
const User_1 = __importDefault(require("../models/User")); // User model
/**
 * @file UserDAO.ts
 * @description Data Access Object (DAO) responsible for handling user-related database operations.
 * Extends the generic `GlobalDAO` to inherit standard CRUD functionality and adds custom user queries.
 */
class UserDAO extends GlobalDAO_1.default {
    constructor() {
        super(User_1.default); // Pass the User model to the GlobalDAO
    }
    /**
     * Finds a user by their email address.
     *
     * @async
     * @param {string} email - The email of the user to search for.
     * @returns {Promise<IUser | null>} Returns the user document if found, or `null` otherwise.
     *
     * @example
     * const user = await UserDAO.findByEmail("example@email.com");
     * if (user) console.log(user.name);
     */
    async findByEmail(email) {
        return await User_1.default.findOne({ email });
    }
}
exports.default = new UserDAO(); // Singleton instance to prevent redundant instantiations
//# sourceMappingURL=UserDAO.js.map