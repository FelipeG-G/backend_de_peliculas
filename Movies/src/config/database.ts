import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Cargar las variables de entorno

const mongoURI = process.env.MONGO_URI; // Obtén el URI desde el archivo .env

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI!);

    console.log("✅ Conexión a MongoDB exitosa");
  } catch (error) {
    console.error("❌ Error de conexión a MongoDB:", error);
    process.exit(1); // Detener el servidor si no se puede conectar a la base de datos
  }
};

export default connectDB;
