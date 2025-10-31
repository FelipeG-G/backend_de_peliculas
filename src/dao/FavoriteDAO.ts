// src/dao/FavoriteDAO.ts
import Favorite, { IFavorite } from "../models/Favorite";

class FavoriteDAO {
  async addFavorite(data: Partial<IFavorite>): Promise<IFavorite> {
    const favorite = new Favorite(data);
    return await favorite.save();
  }

  async getUserFavorites(userId: string): Promise<IFavorite[]> {
    return await Favorite.find({ userId }).sort({ createdAt: -1 });
  }

  async removeFavoriteByPexelsId(userId: string, pexelsId: string): Promise<IFavorite | null> {
    return await Favorite.findOneAndDelete({ userId, pexelsId });
  }

  async isAlreadyFavorite(userId: string, pexelsId: string): Promise<boolean> {
    const exists = await Favorite.exists({ userId, pexelsId });
    return !!exists;
  }
}

export default new FavoriteDAO();
