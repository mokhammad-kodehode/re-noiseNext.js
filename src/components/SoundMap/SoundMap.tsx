"use client"

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import soundsData, { SoundData } from '../../data/soundData';
import Playeer from '../playeer/playeer';
import styles from './soundcard.module.css';

const RelaxSoundsMap: React.FC = () => {
  const [audioPlayers, setAudioPlayers] = useState<Record<string, HTMLAudioElement>>({});
  const [activeSounds, setActiveSounds] = useState<string[]>([]);
  const [savedSounds, setSavedSounds] = useState<string[]>([]);
  const [selectedSound, setSelectedSound] = useState<SoundData | null>(null);
  



  const stopAllSounds = () => {
    activeSounds.forEach((title) => {
      const audioPlayer = audioPlayers[title];
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
    });
    setActiveSounds([]); 
    setSelectedSound(null);
    console.log('All sounds stopped');// Очищаем список активных звуков
  };

  

  const handleSoundClick = (sound: SoundData) => {
    const audioPlayer = audioPlayers[sound.title] || new Audio(sound.soundSource);
    

    if (activeSounds.includes(sound.title)) {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
      setActiveSounds((prevActiveSounds) => prevActiveSounds.filter((title) => title !== sound.title));
    } else {
      audioPlayer.loop = true;
      audioPlayer.play();
      setActiveSounds((prevActiveSounds) => [...prevActiveSounds, sound.title]);
    }

    setAudioPlayers((prevAudioPlayers) => ({
      ...prevAudioPlayers,
      [sound.title]: audioPlayer,
    }));

    console.log(`Play/Stop: ${sound.title}`);

    setSelectedSound(sound);
  };

  const handlePlayPause = () => {
    const isAnyPlaying = activeSounds.length > 0;

    if (isAnyPlaying) {

      setSavedSounds(activeSounds);

      activeSounds.forEach((title) => {
        const audioPlayer = audioPlayers[title];
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
      });

      setActiveSounds([]);
    } else {

      setActiveSounds(savedSounds);

      savedSounds.forEach((title) => {
        const audioPlayer = audioPlayers[title];
        audioPlayer.play();
      });
    }
  };

  const handleVolumeChange = (sound: SoundData, volume: number) => {
    const audioPlayer = audioPlayers[sound.title];

    if (audioPlayer) {
      audioPlayer.volume = volume;

      setAudioPlayers((prevAudioPlayers) => ({
        ...prevAudioPlayers,
        [sound.title]: audioPlayer,
      }));
    }
  };

  const handleVolumeChangeAll = (volume: number) => {

  
    activeSounds.forEach((title) => {
      const audioPlayer = audioPlayers[title];
      audioPlayer.volume = volume;
    });
  };

  const handleMuteAll = () => {
    activeSounds.forEach((title) => {
      const audioPlayer = audioPlayers[title];
      audioPlayer.volume = 0;
    });
  };



  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Relax Sounds</h1>
      <ul className={styles.sound_map}>
      {Object.keys(soundsData).map((key) => {
          const sound = soundsData[key];
          const isCurrentPlaying = activeSounds.includes(sound.title);

          return (
            <li key={key} className={`${styles.sound_card} ${isCurrentPlaying ? styles.sound_card_playing : ''}`}>
              <button className={styles.button} onClick={() => handleSoundClick(sound)}>
                  <FontAwesomeIcon className={styles.icon} aria-hidden="true" icon={sound.icon}  />
              </button>
              <p>{sound.title}</p>
              {isCurrentPlaying && (
                <input
                  className={styles.slider}
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={audioPlayers[sound.title]?.volume}
                  onChange={(e) => handleVolumeChange(sound, parseFloat(e.target.value))}
                />
              )}
            </li>
          );
        })}
      </ul>
      <Playeer 
      isPlaying={activeSounds.length > 0} 
      handlePlayPause={handlePlayPause}
      handleVolumeChangeAll={handleVolumeChangeAll}
      handleMuteAll={handleMuteAll}
      stopAllSounds={stopAllSounds}
      selectedSound={selectedSound}
       />
       
    </div>
  );
};

export default RelaxSoundsMap;