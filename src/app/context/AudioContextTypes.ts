import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Howl } from 'howler';

/* ---------- Данные одного звука ---------- */
export interface SoundData {
  title: string;
  icon?: IconDefinition;
  imageIcon?: string;
  soundSource: string;
  category: string[];
}

/* ---------- Данные одного микса ---------- */
export interface MixData {
  mixName: string;
  activeSounds: string[];
  volumes: Record<string, number>;
}

/* ---------- Карта Howl-плееров (как раньше) ---------- */
export interface AudioPlayer {
  [key: string]: Howl;
}

/* ---------- Интерфейс значения контекста ---------- */
export interface AudioContextType {
  audioPlayers: Record<string, Howl>;
  setAudioPlayers: React.Dispatch<React.SetStateAction<Record<string, Howl>>>;

  activeSounds: string[];
  setActiveSounds: React.Dispatch<React.SetStateAction<string[]>>;   // ★ добавлено

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
  toggleMixesContainer: () => void;

  loadMix: (mixName: string) => void;
  stopAllSounds: () => void;
  toggleMix: (mixName: string) => void;

  handleSoundClick: (sound: SoundData) => void;
  handlePlayPause: () => void;
  handleVolumeChange: (sound: SoundData, volume: number) => void;
  handleVolumeChangeAll: (volume: number) => void;
  handleMuteAll: () => void;

  loadingSounds: { [key: string]: boolean };
  setLoadingSounds: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
}
