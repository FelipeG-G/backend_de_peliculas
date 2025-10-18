import mongoose, { Schema, Document } from "mongoose";

export interface IMovie extends Document {
  title: string;
  description?: string;
  genre: string;
  releaseDate: Date;
  rating?: number;
  duration?: number; // en minutos
  director?: string;
  createdAt: Date;
}

const MovieSchema: Schema = new Schema<IMovie>({
  title: { type: String, required: true },
  description: { type: String },
  genre: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  rating: { type: Number, min: 0, max: 10 },
  duration: { type: Number },
  director: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IMovie>("Movie", MovieSchema);
