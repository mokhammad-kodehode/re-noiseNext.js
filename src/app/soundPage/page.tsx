"use client"

import React, { useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import soundsData, { SoundData } from '../../data/soundData';
import Playeer from '@/components/playeer/playeer';
import styles from './soundcard.module.css';
import { useAudioContext } from '../context/AudioContext';
import { MixData } from '../context/AudioContextTypes';

const RelaxSoundsMap: React.FC = () => {
  const [mixName, setMixName] = useState<string>('');
  const [savedMixes, setSavedMixes] = useState<string[]>([]);
  


  useEffect(() => {
    try {
      const storedMixes = localStorage.getItem('mixes');
      const mixes = storedMixes ? JSON.parse(storedMixes) as MixData[] : [];
      const mixNames = mixes.map(mix => mix.mixName);
      setSavedMixes(mixNames);
    } catch (error) {
      console.error("Ошибка при загрузке миксов: ", error);
      // Дополнительные действия при ошибке, например, уведомление пользователя
    }
  }, []);


  const {
    audioPlayers,
    activeSounds,
    isMixesContainerOpen,
    handleSoundClick,
    handleVolumeChange,
    handlePlayPause,
    handleVolumeChangeAll,
    handleMuteAll,
    stopAllSounds,
    toggleMix,
    activeMix,
    toggleMixesContainer
    
  } = useAudioContext();
  
  const saveMix = () => {
    console.log(mixName)
    try {
      const mixToSave = {
        mixName,
        activeSounds,
        volumes: Object.fromEntries(
          activeSounds.map((title) => [title, audioPlayers[title]?.volume || 0])
        ),
      };

      const storedMixes = localStorage.getItem('mixes');
      const mixes = storedMixes ? JSON.parse(storedMixes) as MixData[] : [];
      mixes.push(mixToSave);
      localStorage.setItem('mixes', JSON.stringify(mixes));
      

      setSavedMixes((prevSavedMixes) => [...prevSavedMixes, mixToSave.mixName]);
    } catch (error) {
      console.error("Ошибка при сохранении микса: ", error);
      // Дополнительные действия при ошибке
    }
  };

  const deleteMix = (mixName: string) => {
    try {
      const updatedMixes = savedMixes.filter(name => name !== mixName);
      setSavedMixes(updatedMixes);
  
      const storedMixes = localStorage.getItem('mixes');
      const mixes = storedMixes ? JSON.parse(storedMixes) as MixData[] : [];
      const updatedMixesData = mixes.filter(mix => mix.mixName !== mixName);
      localStorage.setItem('mixes', JSON.stringify(updatedMixesData));
    } catch (error) {
      console.error("Ошибка при удалении микса: ", error);
      // Дополнительные действия при ошибке
    }
  };



  const handleMixNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMixName(event.target.value);
    console.log(mixName)
    
  };


  const handleKeyPress = (event: React.KeyboardEvent) => {
    // Проверка нажатия клавиши Enter
    if (event.key === 'Enter') {
      saveMix();
    }
  };



  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Relax Sounds</h1>
        {isMixesContainerOpen && <div className={styles.container_mixes}>
            <div className={styles.container_mixes_save}>
                <input
                  type="text"
                  placeholder="Text name of mixe"
                  value={mixName}
                  onChange={handleMixNameChange}
                  className={styles.container_mixes_input}
                  onKeyDown={handleKeyPress}
                />
                <button className={styles.container_mixes_btn} onClick={saveMix}>Save mix</button>
            </div>
            <div className={styles.container_my_mixes}>
                    {savedMixes.map((mixName, index) => (
                  <div key={`${mixName}_${index}`} onClick={() => toggleMix(mixName)} className={styles.mix_play}>
                    {mixName}
                    <button className={styles.remove_btn} onClick={() => deleteMix(mixName)}>Remove</button>
                  </div>
           ))}
            </div>
        </div>}
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
      onIconClick={toggleMixesContainer}
      mixName={activeMix}
      // selectedSound={selectedSound}
       />
       
    </div>
  );
};

export default RelaxSoundsMap;

