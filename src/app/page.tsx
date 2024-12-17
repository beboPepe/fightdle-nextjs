import GuessChar from "./GuessChar"; // Changed from "../models/GuessChar"

const Page = async () => {
  let characters = [];

  try {
    const response = await fetch("http://localhost:3000/api/characters", {
      next: { revalidate: 3600 }, // Optional: Cache the data and revalidate every hour
    });

    if (!response.ok) {
      throw new Error("Failed to fetch characters");
    }

    characters = await response.json();
  } catch (error) {
    console.error("Error fetching characters:", error);
  }

  return (
    <div>
      <GuessChar characters={characters} />
    </div>
  );
};

export default Page;
