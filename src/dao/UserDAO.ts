// src/dao/UserDAO.ts
import GlobalDAO from "./GlobalDAO";
import User, { IUser } from "../models/User"; // El modelo de Usuario

class UserDAO extends GlobalDAO<IUser> {
  constructor() {
    super(User); // Pasar el modelo de Usuario al GlobalDAO
  }

  /**
   * Busca un usuario por su correo electrónico.
   * @param email - Correo del usuario a buscar.
   * @returns El documento del usuario o `null` si no existe.
   */
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }
}

export default new UserDAO(); // Instancia única para evitar instancias redundantes
