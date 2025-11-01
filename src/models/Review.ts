import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  pexelsId: string;
  userName: string;
  rating: number;
  comment: string;
  hasRating: boolean;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  pexelsId: { type: String, required: true },
  userName: { type: String, required: true },
  rating: { type: Number, default: 0 },
  comment: { type: String, required: true },
  hasRating: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IReview>("Review", ReviewSchema);
