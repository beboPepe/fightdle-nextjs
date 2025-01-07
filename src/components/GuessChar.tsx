"use client";

import React, { useState } from "react";
import Character, { CharacterType } from "@/models/Character"; // Adjust the path if needed

const GuessingGame: React.FC<{ characters: CharacterType[] }> = ({
  characters,
}) => {
  const [winningCharacter, setWinningCharacter] =
    useState<CharacterType | null>(null);
  const [feedback, setFeedback] = useState<string[][]>([]);
  const [guess, setGuess] = useState<string>("");

  const [suggestions, setSuggestions] = useState<CharacterType[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Initialize winning character once characters are loaded
  React.useEffect(() => {
    if (characters.length > 0 && !winningCharacter) {
      setWinningCharacter(
        characters.find((character) => character.name === "Ryu") ||
          characters[0]
      );
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
        ["Character not found. Try again!"],
      ]);
      return;
    }

    // Check if the guessed character is the winning character
    if (guessedCharacter.name === winningCharacter?.name) {
      setFeedback((prevFeedback) => [
        ...prevFeedback,
        ["Correct! You guessed the winning character."],
      ]);
    } else {
      // Compare attributes and generate feedback
      const feedbackList: string[] = [];

      // Gender check
      if (guessedCharacter.gender === winningCharacter?.gender) {
        feedbackList.push("Gender matches!");
      } else {
        feedbackList.push("Gender does not match.");
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
        feedbackList.push("Archetype fully matches!");
      } else if (partialArchetypeMatch) {
        feedbackList.push("Archetype partially matches.");
      } else {
        feedbackList.push("Archetype does not match.");
      }

      // Birthplace check
      if (guessedCharacter.birthplace === winningCharacter?.birthplace) {
        feedbackList.push("Birthplace matches!");
      } else {
        feedbackList.push("Birthplace does not match.");
      }

      // First appearance check
      if (
        guessedCharacter.firstAppearance === winningCharacter?.firstAppearance
      ) {
        feedbackList.push("First Appearance matches!");
      } else {
        feedbackList.push("First Appearance does not match.");
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
        <table>
          <thead>
            <tr>
              <th>Guess #</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {[...feedback].reverse().map((guessFeedback, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{guessFeedback.join("///")}</td>
                {/* Adjust formatting as needed */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GuessingGame;
