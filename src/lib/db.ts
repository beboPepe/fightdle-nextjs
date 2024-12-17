import mongoose from "mongoose"; // Mongoose types are inferred automatically
import dotenv from "dotenv"; // dotenv doesn't need specific types, but ensure it's installed

dotenv.config(); // Load environment variables

// Function to connect to MongoDB
const connectDB = async (): Promise<void> => {
  try {
    // `process.env.MONGODB_URI` is a string, ensure TypeScript recognizes this
    const mongoURI = process.env.MONGODB_URI as string;
    if (!mongoURI) {
      throw new Error("MONGODB_URI not defined in environment variables");
    }

    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
