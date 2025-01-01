import mongoose from "mongoose"; // Mongoose types are inferred automatically
import dotenv from "dotenv"; // dotenv doesn't need specific types, but ensure it's installed

dotenv.config(); // Load environment variables
let isConnected = false; // Tracks connection status

// Function to connect to MongoDB
export async function connectDB() {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI || "");

    isConnected = !!db.connections[0].readyState;
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
}

export default connectDB;
