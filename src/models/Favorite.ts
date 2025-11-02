// src/models/Favorite.ts
import mongoose, { Schema, Document } from "mongoose";

/**
 * @interface IFavorite
 * @description Represents a user's favorite movie entry.
 */
export interface IFavorite extends Document {
  userId: mongoose.Types.ObjectId;
  pexelsId: string;
  title: string;
  thumbnail?: string;
  createdAt: Date;
}

/**
 * @schema FavoriteSchema
 * @description Defines the schema for user favorites.
 */
const FavoriteSchema: Schema = new Schema<IFavorite>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  pexelsId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  thumbnail: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Prevents duplicate favorites per user
FavoriteSchema.index({ userId: 1, pexelsId: 1 }, { unique: true });

/**
 * @model Favorite
 * @description Mongoose model for the Favorite collection.
 */
export default mongoose.model<IFavorite>("Favorite", FavoriteSchema);
