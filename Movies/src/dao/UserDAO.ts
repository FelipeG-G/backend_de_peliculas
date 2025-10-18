import GlobalDAO from "./GlobalDAO";
import User, { IUser } from "../models/User";

/**
 * UserDAO - Data Access Object for the User model.
 *
 * Extiende la clase genérica {@link GlobalDAO} y agrega métodos
 * específicos para los documentos de usuario, como buscar por email.
 */
class UserDAO extends GlobalDAO<IUser> {
  constructor() {
    super(User);
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

/**
 * Exporta una instancia única de UserDAO.
 * Esto evita instancias redundantes y mantiene consistencia
 * en todas las operaciones sobre la colección de usuarios.
 */
export default new UserDAO();
