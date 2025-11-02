import mongoose, { Schema, Document } from "mongoose";

/**
 * @interface IReview
 * @description Represents a user review for a specific movie (identified by `pexelsId`).
 * Includes rating, comment, and user reference.
 */
export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  pexelsId: string;
  userName: string;
  rating: number;
  comment: string;
  hasRating: boolean;
  createdAt: Date;
}

/**
 * @schema ReviewSchema
 * @description Defines the MongoDB schema for user reviews.
 */
const ReviewSchema = new Schema<IReview>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  pexelsId: { type: String, required: true },
  userName: { type: String, required: true },
  rating: { type: Number, default: 0 },
  comment: { type: String, required: true },
  hasRating: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

/**
 * @model Review
 * @description Mongoose model for the Review collection.
 */
export default mongoose.model<IReview>("Review", ReviewSchema);
