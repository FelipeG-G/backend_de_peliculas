import mongoose, { Schema, Document } from "mongoose";

export interface IFavorite extends Document {
  userId: mongoose.Types.ObjectId;
  pexelsId: string;
  title: string;
  thumbnail?: string;
  createdAt: Date;
}

const FavoriteSchema: Schema = new Schema<IFavorite>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  pexelsId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  thumbnail: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// 🔒 Evita duplicados por usuario
FavoriteSchema.index({ userId: 1, pexelsId: 1 }, { unique: true });

export default mongoose.model<IFavorite>("Favorite", FavoriteSchema);
