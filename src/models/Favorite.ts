import mongoose, { Schema, Document } from "mongoose";

export interface IFavorite extends Document {
  userId: mongoose.Types.ObjectId;
  movieId?: mongoose.Types.ObjectId;
  pexelsId?: string;
  title: string;
  thumbnail?: string;
  createdAt: Date;
}

const FavoriteSchema: Schema = new Schema<IFavorite>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  movieId: { type: Schema.Types.ObjectId, ref: "Movie" },
  pexelsId: { type: String, index: true }, // más rápido buscar por pexelsId
  title: { type: String, required: true },
  thumbnail: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IFavorite>("Favorite", FavoriteSchema);
