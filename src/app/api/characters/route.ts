import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/db"; // Adjust the path if necessary
import Character from "@/models/Character"; // Character is now `Character.ts`

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      // Connect to MongoDB
      await connectDB();

      // Fetch all characters from the database
      const characters = await Character.find();

      // Return characters as a JSON response
      res.status(200).json(characters);
    } catch (error) {
      console.error("Error fetching characters:", error);
      res.status(500).json({ error: "Failed to fetch characters" });
    }
  } else {
    // If the request is not a GET, return a method not allowed error
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
