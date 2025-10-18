"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Cargar las variables de entorno
const mongoURI = process.env.MONGO_URI; // Obtén el URI desde el archivo .env
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(mongoURI);
        console.log("✅ Conexión a MongoDB exitosa");
    }
    catch (error) {
        console.error("❌ Error de conexión a MongoDB:", error);
        process.exit(1); // Detener el servidor si no se puede conectar a la base de datos
    }
};
exports.default = connectDB;
//# sourceMappingURL=database.js.map