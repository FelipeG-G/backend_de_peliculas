import mongoose, { Schema, Document } from "mongoose";

/**
 * @interface IAverage
 * @description Represents the average rating data for a specific movie identified by its `pexelsId`.
 */
export interface IAverage extends Document {
  pexelsId: string;
  averageRating: number;
  totalReviews: number;
  updatedAt: Date;
}

/**
 * @schema AverageSchema
 * @description Defines the schema for storing average movie ratings and review counts.
 */
const AverageSchema = new Schema<IAverage>({
  pexelsId: { type: String, required: true, unique: true },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

/**
 * @model Average
 * @description Mongoose model for the Average collection, used to store rating averages per movie.
 */
export default mongoose.model<IAverage>("Average", AverageSchema);
