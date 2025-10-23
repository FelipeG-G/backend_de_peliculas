import Favorite, { IFavorite } from "../models/Favorite";

class FavoriteDAO {
  async addFavorite(data: Partial<IFavorite>): Promise<IFavorite> {
    const favorite = new Favorite(data);
    return await favorite.save();
  }

  async getUserFavorites(userId: string): Promise<IFavorite[]> {
    return await Favorite.find({ userId }).sort({ createdAt: -1 });
  }

  async removeFavorite(userId: string, movieId?: string, pexelsId?: string): Promise<IFavorite | null> {
    const query: any = { userId };
    if (movieId) query.movieId = movieId;
    if (pexelsId) query.pexelsId = pexelsId;
    return await Favorite.findOneAndDelete(query);
  }

  async updateFavorite(favoriteId: string, data: Partial<IFavorite>): Promise<IFavorite | null> {
    return await Favorite.findByIdAndUpdate(favoriteId, data, { new: true });
  }

  async isAlreadyFavorite(userId: string, movieId?: string, pexelsId?: string): Promise<boolean> {
    const query: any = { userId };
    if (movieId) query.movieId = movieId;
    if (pexelsId) query.pexelsId = pexelsId;
    const exists = await Favorite.exists(query);
    return !!exists;
  }
}

export default new FavoriteDAO();
