import GuessChar from "@/components/GuessChar";
import { Suspense } from "react";

export const GamePage = async () => {
  const fetchCharacters = async () => {
    const response = await fetch("http://localhost:3000/api/characters", {
      //next: { revalidate: 3600 }, //Cache the data and revalidate every hour
    });

    if (!response.ok) {
      throw new Error("Failed to fetch characters");
    }

    return response.json();
  };

  try {
    const characters = await fetchCharacters();
    return (
      <Suspense fallback={<p>Loading characters...</p>}>
        <GuessChar characters={characters} />
      </Suspense>
    );
  } catch (error) {
    console.error("Error fetching characters:", error);
    return (
      <p className="text-red-500">
        Failed to load characters. Please try again later.
      </p>
    );
  }
};

export default GamePage;
