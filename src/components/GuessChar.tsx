"use client";

import React, { useState } from "react";
import Character, { CharacterType } from "@/models/Character"; // Adjust the path if needed

const GuessingGame: React.FC<{ characters: CharacterType[] }> = ({
  characters,
}) => {
  const [winningCharacter, setWinningCharacter] =
    useState<CharacterType | null>(null);
  const [feedback, setFeedback] = useState<
    (string | { value: string; status: string })[][]
  >([]);
  const [guess, setGuess] = useState<string>("");

  const [suggestions, setSuggestions] = useState<CharacterType[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  //Creates Hash based on date to set winning character consistently across users
  function getDailyCharacter(
    characters: CharacterType[],
    date: Date
  ): CharacterType {
    // Format the date as "YYYY-MM-DD" for consistency
    const dateString = date.toISOString().split("T")[0];

    // Create a hash from the date string
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
      hash = (hash << 5) - hash + dateString.charCodeAt(i);
      hash |= 0; // Convert to 32-bit integer
    }

    // Use the hash to pick an index within the bounds of the characters array
    const index = Math.abs(hash) % characters.length;
    return characters[index];
  }

  // Initialize winning character once characters are loaded
  React.useEffect(() => {
    if (characters.length > 0) {
      const today = new Date();
      const dailyCharacter = getDailyCharacter(
        characters,
        new Date("2025-06-28")
      );
      console.log(dailyCharacter);
      setWinningCharacter(dailyCharacter);
    }
  }, [characters]);

  // Handle input changes and filter suggestions
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setGuess(query);

    if (query.length > 1) {
      const filteredSuggestions = characters.filter((character) =>
        character.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // Handle guesses
  const handleGuess = (guessedName: string) => {
    const guessedCharacter = characters.find(
      (c) => c.name.toLowerCase() === guessedName.trim().toLowerCase()
    );
    if (!guessedCharacter) {
      setFeedback((prevFeedback) => [
        ...prevFeedback,
        [
          { value: "Character not found", status: "no-match" },
          { value: "-", status: "no-match" },
          { value: "-", status: "no-match" },
          { value: "-", status: "no-match" },
          { value: "-", status: "no-match" },
        ],
      ]);
      return;
    }

    // Check if the guessed character is the winning character
    if (guessedCharacter.name === winningCharacter?.name) {
      setFeedback((prevFeedback) => [
        ...prevFeedback,
        [
          { value: guessedCharacter.name, status: "match" },
          { value: guessedCharacter.gender, status: "match" },
          { value: guessedCharacter.archetype.join(", "), status: "match" },
          { value: guessedCharacter.birthplace, status: "match" },
          { value: guessedCharacter.firstAppearance, status: "match" },
        ],
      ]);
    } else {
      // Compare attributes and generate feedback
      const feedbackList = [
        { value: guessedCharacter.name, status: "no-match" }, // Name won't match since it's not the winning character
      ];

      // Gender check
      if (guessedCharacter.gender === winningCharacter?.gender) {
        feedbackList.push({ value: guessedCharacter.gender, status: "match" });
      } else {
        feedbackList.push({
          value: guessedCharacter.gender,
          status: "no-match",
        });
      }

      // Archetype check
      const allArchetypesMatch = winningCharacter?.archetype.every(
        (archetype) => guessedCharacter.archetype.includes(archetype)
      );

      const exactArchetypeMatch =
        allArchetypesMatch &&
        guessedCharacter.archetype.length ===
          winningCharacter?.archetype.length;

      const partialArchetypeMatch =
        allArchetypesMatch ||
        guessedCharacter.archetype.some((archetype) =>
          winningCharacter?.archetype.includes(archetype)
        );

      // Checking completeness of match
      if (exactArchetypeMatch) {
        feedbackList.push({
          value: guessedCharacter.archetype.join(", "),
          status: "match",
        });
      } else if (partialArchetypeMatch) {
        feedbackList.push({
          value: guessedCharacter.archetype.join(", "),
          status: "partial",
        });
      } else {
        feedbackList.push({
          value: guessedCharacter.archetype.join(", "),
          status: "no-match",
        });
      }

      // Birthplace check
      if (guessedCharacter.birthplace === winningCharacter?.birthplace) {
        feedbackList.push({
          value: guessedCharacter.birthplace,
          status: "match",
        });
      } else {
        feedbackList.push({
          value: guessedCharacter.birthplace,
          status: "no-match",
        });
      }

      // First appearance check
      if (
        guessedCharacter.firstAppearance === winningCharacter?.firstAppearance
      ) {
        feedbackList.push({
          value: guessedCharacter.firstAppearance,
          status: "match",
        });
      } else {
        feedbackList.push({
          value: guessedCharacter.firstAppearance,
          status: "no-match",
        });
      }

      // Push feedback list
      setFeedback((prevFeedback) => [...prevFeedback, feedbackList]);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="relative">
        {/* Input Field */}
        <div className="relative flex items-center">
          <input
            type="text"
            value={guess}
            onChange={(e) => {
              setGuess(e.target.value);
              handleInputChange(e);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                // Navigate down
                setHighlightedIndex((prevIndex) =>
                  prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
                );
              } else if (e.key === "ArrowUp") {
                // Navigate up
                setHighlightedIndex((prevIndex) =>
                  prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
                );
              } else if (e.key === "Enter") {
                // Select highlighted suggestion if any
                if (highlightedIndex >= 0) {
                  const selectedCharacter = suggestions[highlightedIndex];
                  setGuess(selectedCharacter.name);
                  setSuggestions([]);
                  handleGuess(selectedCharacter.name);
                } else {
                  handleGuess(guess);
                  setSuggestions([]); // Clear suggestions
                }
              }
            }}
            placeholder="Enter character name"
            className="w-72 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
          />

          {/* Submit Button */}
          <button
            onClick={() => handleGuess(guess)}
            className="absolute left-[300px] mb-4 px-6 py-3 text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Submit
          </button>
        </div>
        {/* Suggestion Dropdown */}
        {suggestions.length > 0 && (
          <ul className="absolute top-full left-0 mt-[-14px] w-72 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            {suggestions.map((character, index) => (
              <li
                key={character.name}
                onClick={() => {
                  setGuess(character.name);
                  setSuggestions([]);
                  handleGuess(character.name);
                }}
                className={`p-2 cursor-pointer ${
                  index === highlightedIndex
                    ? "bg-gray-200"
                    : "hover:bg-gray-200"
                }`}
              >
                {character.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Feedback Section */}
      <div className="mt-4 text-center">
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Gender</th>
              <th className="border border-gray-300 px-4 py-2">Archetype</th>
              <th className="border border-gray-300 px-4 py-2">Birthplace</th>
              <th className="border border-gray-300 px-4 py-2">
                First Appearance
              </th>
            </tr>
          </thead>
          <tbody>
            {[...feedback].reverse().map((guessFeedback, index) => (
              <tr key={index} className="border border-gray-300">
                {guessFeedback.map((feedbackItem, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-4 py-2 text-center ${
                      typeof feedbackItem === "string"
                        ? "" // Handle plain strings if needed
                        : feedbackItem.status === "match"
                        ? "bg-green-200"
                        : feedbackItem.status === "partial"
                        ? "bg-yellow-200"
                        : "bg-red-200"
                    }`}
                  >
                    {typeof feedbackItem === "string"
                      ? feedbackItem
                      : feedbackItem.value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GuessingGame;
