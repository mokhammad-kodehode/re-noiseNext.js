import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface AudioContextType {
  audioPlayers: Record<string, HTMLAudioElement>;
  activeSounds: string[];
  playAudio: (soundTitle: string, soundSource: string) => void;
  stopAudio: (soundTitle: string) => void;
  setVolume: (soundTitle: string, volume: number) => void;
}

// Создание контекста с начальными значениями
export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
    const [audioPlayers, setAudioPlayers] = useState<Record<string, HTMLAudioElement>>({});
    const [activeSounds, setActiveSounds] = useState<string[]>([]);
    const [savedSounds, setSavedSounds] = useState<string[]>([]);
    const [mixName, setMixName] = useState<string>('');
    const [savedMixes, setSavedMixes] = useState<string[]>([]);
    const [activeMix, setActiveMix] = useState<string | null>(null);
    const [isMixesContainerOpen, setIsMixesContainerOpen] = useState(false);
    // ... и так далее для других состояний
  
 
    const toggleMixesContainer = () => {
        setIsMixesContainerOpen(!isMixesContainerOpen);
      };
    
      
      
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
    
      const handleMixNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMixName(event.target.value);
      };
    
      // Сохранение текущего микса в локальное хранилище
      const saveMix = () => {
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
    
      const handleKeyPress = (event) => {
        // Проверка нажатия клавиши Enter
        if (event.key === 'Enter') {
          saveMix();
        }
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
                let audioPlayer = audioPlayers[title];
          
                if (!audioPlayer) {
                  // Создаем новый аудиоплеер
                  audioPlayer = new Audio(soundData.soundSource);
                  audioPlayer.loop = true;
                  setAudioPlayers(prevAudioPlayers => ({
                    ...prevAudioPlayers,
                    [title]: audioPlayer
                  }));
                }
          
                // Установка громкости и воспроизведение
                audioPlayer.volume = mixToLoad.volumes[title] || 0;
                audioPlayer.play();
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
    
    // Удаление сохраненного микса
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
    
    
  
    // ... добавьте другие функции
  
    return (
        <AudioContext.Provider value={{
          audioPlayers,
          activeSounds,
          savedSounds,
          mixName,
          savedMixes,
          activeMix,
          isMixesContainerOpen,
          setAudioPlayers,
          setActiveSounds,
          setSavedSounds,
          setMixName,
          setSavedMixes,
          setActiveMix,
          setIsMixesContainerOpen,
          // Функции
          playAudio,
          stopAudio,
          saveMix,
          loadMix,
          deleteMix,
          stopAllSounds,
          toggleMix,
          handleSoundClick,
          // Другие функции и логика
        }}>
          {children}
        </AudioContext.Provider>
      );