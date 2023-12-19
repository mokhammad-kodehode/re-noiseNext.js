"use client"

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import soundsData, { SoundData } from '../../data/soundData';
import Playeer from '@/components/playeer/playeer';
import styles from './soundcard.module.css';

interface MixData {
  mixName: string;
  activeSounds: string[];
  volumes: Record<string, number>;
}

const RelaxSoundsMap: React.FC = () => {
  const [audioPlayers, setAudioPlayers] = useState<Record<string, HTMLAudioElement>>({});
  const [activeSounds, setActiveSounds] = useState<string[]>([]);
  const [savedSounds, setSavedSounds] = useState<string[]>([]);
  const [mixName, setMixName] = useState<string>('');
  const [savedMixes, setSavedMixes] = useState<string[]>([]);
  const [activeMix, setActiveMix] = useState<string | null>(null);;
  
  useEffect(() => {
    // При монтировании компонента загрузите сохраненные миксы из локального хранилища
    const mixes = JSON.parse(localStorage.getItem('mixes') || '[]') as MixData[];
    const mixNames = mixes.map((mix) => mix.mixName);
    setSavedMixes(mixNames);
  }, []);

  // Обработчик изменения имени микса
  const handleMixNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMixName(event.target.value);
  };

  // Сохранение текущего микса в локальное хранилище
  const saveMix = () => {
    const mixToSave = {
      mixName,
      activeSounds,
      volumes: Object.fromEntries(
        activeSounds.map((title) => [title, audioPlayers[title]?.volume || 0])
      ),
    };

    // Сохранение микса в локальное хранилище
    const mixes = JSON.parse(localStorage.getItem('mixes') || '[]');
    mixes.push(mixToSave);
    localStorage.setItem('mixes', JSON.stringify(mixes));

    // Обновление списка сохраненных миксов
    setSavedMixes((prevSavedMixes) => [...prevSavedMixes, mixToSave.mixName]);
  };

  // Загрузка сохраненного микса из локального хранилища
  const loadMix = (mixName: string) => {
    const mixes = JSON.parse(localStorage.getItem('mixes') || '[]') as MixData[];
    const mixToLoad = mixes.find((mix) => mix.mixName === mixName);
  
    if (mixToLoad) {
      // Остановка всех текущих звуков
      stopAllSounds();
  
      // Загрузка сохраненного микса
      setActiveSounds(mixToLoad.activeSounds);
  
      // Установка громкости для каждого звука в миксе
      mixToLoad.activeSounds.forEach((title) => {
        const audioPlayer = audioPlayers[title];
  
        // Проверка, что audioPlayer существует и имеет метод play
        if (audioPlayer && typeof audioPlayer.play === 'function') {
          audioPlayer.volume = mixToLoad.volumes[title] || 0;
        }
      });
  
      // Воспроизведение звуков в миксе
      mixToLoad.activeSounds.forEach((title) => {
        const audioPlayer = audioPlayers[title];
  
        // Проверка, что audioPlayer существует и имеет метод play
        if (audioPlayer && typeof audioPlayer.play === 'function') {
          audioPlayer.play();
        }
      });
    }
  };



  // Удаление сохраненного микса
  const deleteMix = (mixName: string) => {
    const updatedMixes = savedMixes.filter((name) => name !== mixName);
    setSavedMixes(updatedMixes);
  
    // Удаление микса из локального хранилища
    const mixes = JSON.parse(localStorage.getItem('mixes') || '[]') as { mixName: string }[];
    const updatedMixesData = mixes.filter((mix) => mix.mixName !== mixName);
    localStorage.setItem('mixes', JSON.stringify(updatedMixesData));
  };
  

const stopAllSounds = () => {
  Object.values(audioPlayers).forEach((audioPlayer) => {
    if (audioPlayer) {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
    }
  });
  setActiveSounds([]);
  console.log('All sounds stopped');
};

   // Переключение воспроизведения/остановки при нажатии на название микса
   const toggleMix = (mixName: string) => {
    const mixIndex = savedMixes.indexOf(mixName);
    const isMixPlaying = activeSounds.length > 0 && mixIndex !== -1;
  
    if (isMixPlaying) {
      if (activeMix === mixName) {
        // Если текущий микс уже активен, остановите его
        stopAllSounds();
        setActiveMix(null);
      } else {
        // Сохранение текущего активного микса
        setSavedSounds(activeSounds);
  
        // Остановка всех текущих звуков
        stopAllSounds();
  
        // Воспроизведение нового микса
        loadMix(mixName);
        setActiveMix(mixName);
      }
    } else {
      // Воспроизведение сохраненного микса
      loadMix(mixName);
      setActiveMix(mixName);
    }
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
      <div>
        <input
          type="text"
          placeholder="Text name of mixe"
          value={mixName}
          onChange={handleMixNameChange}
        />
        <button onClick={saveMix}>Save mix</button>
      </div>
      <div>
        <p>Saves mixes:</p>
        {savedMixes.map((mixName) => (
          // Изменено: Переключение воспроизведения/остановки при нажатии на название микса
          <div key={mixName} onClick={() => toggleMix(mixName)} style={{ cursor: 'pointer' }}>
            {mixName}
            {/* Добавлено: Кнопка удаления микса */}
            <button onClick={() => deleteMix(mixName)}>Remove</button>
          </div>
        ))}
      </div>
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
      // selectedSound={selectedSound}
       />
       
    </div>
  );
};

export default RelaxSoundsMap;