// src/dao/UserDAO.ts
import GlobalDAO from "./GlobalDAO";
import User, { IUser } from "../models/User"; // User model

/**
 * @file UserDAO.ts
 * @description Data Access Object (DAO) responsible for handling user-related database operations.
 * Extends the generic `GlobalDAO` to inherit standard CRUD functionality and adds custom user queries.
 */
class UserDAO extends GlobalDAO<IUser> {
  constructor() {
    super(User); // Pass the User model to the GlobalDAO
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
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }
}

export default new UserDAO(); // Singleton instance to prevent redundant instantiations
