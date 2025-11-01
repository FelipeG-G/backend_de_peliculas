import mongoose, { Schema, Document } from "mongoose";

export interface IAverage extends Document {
  pexelsId: string;
  averageRating: number;
  totalReviews: number;
  updatedAt: Date;
}

const AverageSchema = new Schema<IAverage>({
  pexelsId: { type: String, required: true, unique: true },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IAverage>("Average", AverageSchema);
