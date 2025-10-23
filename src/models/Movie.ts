import mongoose, { Schema, Document } from "mongoose";

export interface IVideoFile {
  id: number;
  quality: string;
  file_type: string;
  width: number;
  height: number;
  link: string;
}

export interface IMovie extends Document {
  title: string;
  description?: string;
  genre: string;
  releaseDate: Date;
  rating?: number;
  duration?: number; // duración del video en segundos
  director?: string;
  image?: string; // miniatura o portada del video
  url?: string; // enlace al video (desde Pexels o fuente propia)
  videoFiles?: IVideoFile[]; // versiones del video (resoluciones)
  source?: string; // "pexels" o "local"
  user?: string; // nombre del creador (si viene de Pexels)
  createdAt: Date;
}

const VideoFileSchema = new Schema<IVideoFile>({
  id: Number,
  quality: String,
  file_type: String,
  width: Number,
  height: Number,
  link: String,
});

const MovieSchema: Schema = new Schema<IMovie>({
  title: { type: String, required: true },
  description: { type: String },
  genre: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  rating: { type: Number, min: 0, max: 10 },
  duration: { type: Number },
  director: { type: String },
  image: { type: String },
  url: { type: String },
  videoFiles: [VideoFileSchema],
  source: { type: String, default: "local" },
  user: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IMovie>("Movie", MovieSchema);
