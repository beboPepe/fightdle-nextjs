"use client";

import React, { useState } from "react";
import Character, { CharacterType } from "../models/Character"; // Adjust the path if needed

const GuessingGame: React.FC<{ characters: CharacterType[] }> = ({
  characters,
}) => {
  const [winningCharacter, setWinningCharacter] =
    useState<CharacterType | null>(null);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [guess, setGuess] = useState<string>("");

  const [suggestions, setSuggestions] = useState<CharacterType[]>([]);

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
      setFeedback(["Character not found. Try again!"]);
      return;
    }

    // Check if the guessed character is the winning character
    if (guessedCharacter.name === winningCharacter?.name) {
      setFeedback(["Correct! You guessed the winning character."]);
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
      setFeedback(feedbackList);
    }
  };

  return (
    <div>
      {/* Input field for the user to type their guess */}
      <input
        type="text"
        value={guess} // Controlled input, bound to the `guess` state
        onChange={(e) => {
          setGuess(e.target.value); // Update the `guess` state with the user's input
          handleInputChange(e); // Trigger a handler for additional processing (e.g., suggestions)
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleGuess(guess); // Trigger the guess submission on pressing Enter
          }
        }}
        placeholder="Enter character name"
        className="your-input-class"
      />
      {/* Button to submit the current guess */}
      <button onClick={() => handleGuess(guess)}>Submit Guess</button>

      {/* Feedback section - displays results or hints for the user's guess */}
      <div>
        {feedback.map((line, index) => (
          <p key={index}>{line}</p> // Render each feedback message
        ))}
      </div>

      {/* Suggestion dropdown - appears if there are any suggestions */}
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border rounded shadow mt-2">
          {suggestions.map((character) => (
            <li
              key={character.name} // Unique key for each suggestion (assuming `name` is unique)
              onClick={() => {
                setGuess(character.name); // Set the guess to the clicked suggestion
                setSuggestions([]); // Clear suggestions
                handleGuess(character.name); // Automatically submit
              }}
              className="p-2 hover:bg-gray-200"
            >
              {character.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GuessingGame;
