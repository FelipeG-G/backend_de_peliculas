import Movie, { IMovie } from "../models/Movie";

class MovieDAO {
  async create(data: Partial<IMovie>): Promise<IMovie> {
    const movie = new Movie(data);
    return await movie.save();
  }

  async read(id: string): Promise<IMovie | null> {
    return await Movie.findById(id);
  }

  async update(id: string, data: Partial<IMovie>): Promise<IMovie | null> {
    return await Movie.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<IMovie | null> {
    return await Movie.findByIdAndDelete(id);
  }

  async getAll(): Promise<IMovie[]> {
    return await Movie.find().sort({ createdAt: -1 });
  }
}

export default new MovieDAO();
