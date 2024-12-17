// models/Character.js
import mongoose from "mongoose";

// Define the schema for the character
const characterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, required: true },
  archetype: { type: [String], required: true },
  birthplace: { type: String, required: true },
  firstAppearance: { type: String, required: true },
});

// Create the model from the schema
const Character = mongoose.model("Character", characterSchema);

export type CharacterType = mongoose.InferSchemaType<typeof characterSchema>;

export default Character;
