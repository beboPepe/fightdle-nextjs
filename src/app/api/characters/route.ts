import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db"; // Adjust the path if necessary
import Character from "@/models/Character"; // Character is now `Character.ts`

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Fetch all characters from the database
    const characters = await Character.find();

    // Return characters as a JSON response
    return NextResponse.json(characters);
  } catch (error) {
    console.error("Error fetching characters:", error);
    return NextResponse.json(
      { error: "Failed to fetch characters" },
      { status: 500 }
    );
  }
}
