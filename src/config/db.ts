import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/biblioteca");
    console.log("MongoDB conectado");
  } catch (err) {
    console.error("Error conectando a MongoDB:", err);
    process.exit(1);
  }
};

