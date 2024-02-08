"use client"
import React, { createContext, useContext, useState,  } from 'react';
import { Howl, Howler } from 'howler';
import { SoundData } from './AudioContextTypes';
import { MixData } from './AudioContextTypes';
import { AudioContextType } from './AudioContextTypes';
import soundsData from '@/data/soundData';

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [audioPlayers, setAudioPlayers] = useState<Record<string, Howl>>({});
  const [activeSounds, setActiveSounds] = useState<string[]>([]);
  const [savedSounds, setSavedSounds] = useState<string[]>([]);
  const [mixName, setMixName] = useState<string>('');
  const [savedMixes, setSavedMixes] = useState<string[]>([]);
  const [activeMix, setActiveMix] = useState<string | null>(null);
  const [isMixesContainerOpen, setIsMixesContainerOpen] = useState(false);

  const toggleMixesContainer = () => {
    setIsMixesContainerOpen(!isMixesContainerOpen);
  };



  const loadMix = (mixName: string) => {
    try {
      const storedMixes = localStorage.getItem('mixes');
      const mixes = storedMixes ? JSON.parse(storedMixes) as MixData[] : [];
      const mixToLoad = mixes.find(mix => mix.mixName === mixName);
  
      if (mixToLoad) {
        stopAllSounds();
        setActiveSounds(mixToLoad.activeSounds);
  
        mixToLoad.activeSounds.forEach(title => {
          // Находим соответствующий звук в soundsData по его заголовку
          const soundData = Object.values(soundsData).find(sound => sound.title === title);
  
          if (soundData) {
            let audioPlayer = audioPlayers[title] || new Howl({
              src: [soundData.soundSource],
              loop: true,
              preload: true,
            });
  
            // Установка громкости
            audioPlayer.volume(mixToLoad.volumes[title] || 0);
  
            // Воспроизведение
            audioPlayer.play();
  
            setAudioPlayers(prevAudioPlayers => ({
              ...prevAudioPlayers,
              [title]: audioPlayer,
            }));
          } else {
            console.error(`Звук с названием "${title}" отсутствует в данных`);
          }
        });
      }
    } catch (error) {
      console.error("Ошибка при загрузке микса: ", error);
      // Дополнительные действия при ошибке
    }
  };

  

  const stopAllSounds = () => {
    Object.values(audioPlayers).forEach((audioPlayer) => {
      if (audioPlayer) {
        audioPlayer.stop();
        audioPlayer.seek(0); // Сброс времени воспроизведения
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

  Howler.autoUnlock = false;

  const handleSoundClick = (sound: SoundData) => {
    let audioPlayer = audioPlayers[sound.title] || new Howl({
      src: [sound.soundSource],
      loop: true,
      preload: true, // Добавьте атрибут preload для предварительной загрузки
      onplayerror: (err) => {
        if (err) {
          console.error('Playback error:', err);
        }
      }
    });
  
    if (activeSounds.includes(sound.title)) {
      audioPlayer.pause();
      audioPlayer.seek(0); // Сброс времени воспроизведения
      setActiveSounds((prevActiveSounds) => prevActiveSounds.filter((title) => title !== sound.title));
    } else {
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
        audioPlayer.seek(0);
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
      audioPlayer.volume(volume);
  
      setAudioPlayers((prevAudioPlayers) => ({
        ...prevAudioPlayers,
        [sound.title]: audioPlayer,
      }));
    }
  };

  const handleVolumeChangeAll = (volume: number) => {
    // Реализация вашей логики для изменения громкости всех звуков
    activeSounds.forEach((title) => {
      const audioPlayer = audioPlayers[title];
      if (audioPlayer) {
        audioPlayer.volume(volume);
      }
    });
  };
  
  const handleMuteAll = () => {
    activeSounds.forEach((title) => {
      const audioPlayer = audioPlayers[title];
      if (audioPlayer) {
        audioPlayer.volume(0);
      }
    });
  };
  const value = {
    audioPlayers,
    setAudioPlayers,
    activeSounds,
    setActiveSounds,
    savedSounds,
    setSavedSounds,
    mixName,
    setMixName,
    savedMixes,
    setSavedMixes,
    activeMix,
    setActiveMix,
    isMixesContainerOpen,
    setIsMixesContainerOpen,
    toggleMixesContainer,
    loadMix,
    stopAllSounds,
    toggleMix,
    handleSoundClick,
    handlePlayPause,
    handleVolumeChange,
    handleVolumeChangeAll,
    handleMuteAll,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;;
};

export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudioContext must be used within an AudioContextProvider');
  }
  return context;
};