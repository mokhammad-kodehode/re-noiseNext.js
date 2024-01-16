import { IconDefinition } from '@fortawesome/fontawesome-svg-core';


export interface SoundData {
    title: string;
     icon: IconDefinition;
    soundSource: string;
  }
  
  export interface MixData {
    mixName: string;
    activeSounds: string[];
    volumes: Record<string, number>;
  }
  
  export interface AudioPlayer {
    [key: string]: HTMLAudioElement;
  }
  
  export interface AudioContextType {
    audioPlayers: AudioPlayer;
    setAudioPlayers: React.Dispatch<React.SetStateAction<AudioPlayer>>;
    activeSounds: string[];
    setActiveSounds: React.Dispatch<React.SetStateAction<string[]>>;
    savedSounds: string[];
    setSavedSounds: React.Dispatch<React.SetStateAction<string[]>>;
    mixName: string;
    setMixName: React.Dispatch<React.SetStateAction<string>>;
    savedMixes: string[];
    setSavedMixes: React.Dispatch<React.SetStateAction<string[]>>;
    activeMix: string | null;
    setActiveMix: React.Dispatch<React.SetStateAction<string | null>>;
    isMixesContainerOpen: boolean;
    setIsMixesContainerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isPlaying: boolean;
    toggleMixesContainer: () => void;
    loadMix: (mixName: string) => void;
    stopAllSounds: () => void;
    toggleMix: (mixName: string) => void;
    handleSoundClick: (sound: SoundData) => void;
    handlePlayPause: () => void;
    handleVolumeChange: (sound: SoundData, volume: number) => void;
    handleVolumeChangeAll: (volume: number) => void;
    handleMuteAll: () => void;
    togglePlayPause: () => void;
    
  }