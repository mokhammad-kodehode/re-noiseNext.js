"use client"

import React, { useState, useEffect } from 'react';
import styles from './mixes.module.css';
import { SoundData } from '@/data/soundData';


interface SavedMix {
  name: string;
  sounds: string[];
}

interface SavedMixesProps {
  onPlaySavedMix: (mixIndex: number) => void;
}

const SavedMixes: React.FC<SavedMixesProps> = ({ onPlaySavedMix }) => {
  const [mixName, setMixName] = useState<string>("");
  const [localSavedMixes, setLocalSavedMixes] = useState<SavedMix[]>(() => {
    const savedMixesFromLocalStorage = localStorage.getItem('savedMixes');
    return savedMixesFromLocalStorage ? JSON.parse(savedMixesFromLocalStorage) : [];
  });

  useEffect(() => {
    // Save mixes to local storage whenever localSavedMixes changes
    localStorage.setItem('savedMixes', JSON.stringify(localSavedMixes));
  }, [localSavedMixes]);

  const handleSaveMix = () => {
    if (mixName.trim() !== "") {
      const newMix: SavedMix = { name: mixName, sounds: [] }; // Add active sounds here if needed
      setLocalSavedMixes((prevSavedMixes) => [...prevSavedMixes, newMix]);
      setMixName("");
    }
  };

  

  const handleDeleteMix = (index: number) => {
    const updatedMixes = [...localSavedMixes];
    updatedMixes.splice(index, 1);
    setLocalSavedMixes(updatedMixes);
  };

  return (
    <div>
      <h2>Saved Mixes</h2>

      {/* Input field for mix name */}
      <input
        type="text"
        placeholder="Enter mix name"
        value={mixName}
        onChange={(e) => setMixName(e.target.value)}
      />

      {/* Button to save mix */}
      <button onClick={handleSaveMix} disabled={mixName.trim() === ""}>
        Save Mix
      </button>

      {/* List of saved mixes */}
      <ul>
        {localSavedMixes.map((mix, index) => (
          <li key={index}>
            <button onClick={() => onPlaySavedMix(index)}>
              Play Mix {index + 1}: {mix.name}
            </button>
            <button onClick={() => handleDeleteMix(index)}>
              Delete Mix
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedMixes;