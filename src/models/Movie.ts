import mongoose, { Schema, Document } from "mongoose";

/**
 * @interface IVideoFile
 * @description Represents a single video file version with its quality, format, and metadata.
 */
export interface IVideoFile {
  id: number;
  quality: string;
  file_type: string;
  width: number;
  height: number;
  link: string;
}

/**
 * @interface IMovie
 * @description Represents a movie document stored in MongoDB.
 * Includes metadata such as title, genre, duration, and source information.
 */
export interface IMovie extends Document {
  title: string;
  description?: string;
  genre: string;
  releaseDate: Date;
  rating?: number;
  duration?: number; // duration in seconds
  director?: string;
  image?: string; // thumbnail or cover image
  url?: string; // video link (from Pexels or local source)
  videoFiles?: IVideoFile[]; // different video resolutions
  source?: string; // "pexels" or "local"
  user?: string; // creator's name (if from Pexels)
  createdAt: Date;
}

/**
 * @schema VideoFileSchema
 * @description Defines the subdocument schema for video files.
 */
const VideoFileSchema = new Schema<IVideoFile>({
  id: Number,
  quality: String,
  file_type: String,
  width: Number,
  height: Number,
  link: String,
});

/**
 * @schema MovieSchema
 * @description Defines the MongoDB schema for movies.
 */
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

/**
 * @model Movie
 * @description Mongoose model for the Movie collection.
 */
export default mongoose.model<IMovie>("Movie", MovieSchema);
