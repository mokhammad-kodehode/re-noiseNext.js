"use client";

import React, { createContext, useContext, useState } from "react";
import { Howl } from "howler";

import soundsData from "@/data/soundData";
import {
  SoundData,
  MixData,
  AudioContextType,
} from "./AudioContextTypes";

/* ---------- Создаём контекст ---------- */
const AudioContext = createContext<AudioContextType | undefined>(undefined);

/* ---------- Провайдер ---------- */
export const AudioContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [audioPlayers, setAudioPlayers] = useState<Record<string, Howl>>({});
  const [activeSounds, setActiveSounds] = useState<string[]>([]);
  const [savedSounds, setSavedSounds] = useState<string[]>([]);
  const [mixName, setMixName] = useState<string>("");
  const [savedMixes, setSavedMixes] = useState<string[]>([]);
  const [activeMix, setActiveMix] = useState<string | null>(null);
  const [isMixesContainerOpen, setIsMixesContainerOpen] = useState(false);
  const [loadingSounds, setLoadingSounds] = useState<{ [key: string]: boolean }>(
    {}
  );

  /* ---------- helpers ---------- */
  const toggleMixesContainer = () => {
    setIsMixesContainerOpen(!isMixesContainerOpen);
  };

  const stopAllSounds = () => {
    Object.values(audioPlayers).forEach((player) => {
      if (player) {
        player.stop();
        player.seek(0);
      }
    });
    setActiveSounds([]);
    console.log("All sounds stopped");
  };

  const loadMix = (mixName: string) => {
    try {
      const storedMixes = localStorage.getItem("mixes");
      const mixes = storedMixes ? (JSON.parse(storedMixes) as MixData[]) : [];
      const mixToLoad = mixes.find((m) => m.mixName === mixName);

      if (mixToLoad) {
        stopAllSounds();
        setActiveSounds(mixToLoad.activeSounds);

        mixToLoad.activeSounds.forEach((title) => {
          const soundData = Object.values(soundsData).find(
            (s) => s.title === title
          );
          if (!soundData) return console.error(`No sound "${title}" in data`);

          let player =
            audioPlayers[title] ||
            new Howl({
              src: [soundData.soundSource],
              loop: true,
              preload: true,
            });

          player.volume(mixToLoad.volumes[title] ?? 0);
          player.play();

          setAudioPlayers((prev) => ({ ...prev, [title]: player }));
        });
      }
    } catch (err) {
      console.error("loadMix error:", err);
    }
  };

  const toggleMix = (name: string) => {
    if (activeMix === name) {
      stopAllSounds();
      setActiveMix(null);
    } else {
      setSavedSounds(activeSounds);
      if (activeSounds.length) stopAllSounds();
      loadMix(name);
      setActiveMix(name);
    }
  };

  /* ---------- обработчики звука ---------- */
  const handleSoundClick = (sound: SoundData) => {
    if (!audioPlayers[sound.title]) {
      setLoadingSounds((p) => ({ ...p, [sound.title]: true }));

      const player = new Howl({
        src: [sound.soundSource],
        loop: true,
        preload: true,
        onload: () =>
          setLoadingSounds((p) => ({ ...p, [sound.title]: false })),
      });

      player.play();

      setAudioPlayers((prev) => ({ ...prev, [sound.title]: player }));
      setActiveSounds((prev) => [...prev, sound.title]);
    } else {
      const player = audioPlayers[sound.title];
      if (activeSounds.includes(sound.title)) {
        player.pause();
        setActiveSounds((prev) =>
          prev.filter((title) => title !== sound.title)
        );
      } else {
        player.play();
        setActiveSounds((prev) => [...prev, sound.title]);
      }
    }
    setMixName("");
  };

  const handlePlayPause = () => {
    const anyPlaying = activeSounds.length > 0;
    if (anyPlaying) {
      setSavedSounds(activeSounds);
      activeSounds.forEach((t) => {
        audioPlayers[t].pause();
        audioPlayers[t].seek(0);
      });
      setActiveSounds([]);
    } else {
      setActiveSounds(savedSounds);
      savedSounds.forEach((t) => audioPlayers[t].play());
    }
  };

  const handleVolumeChange = (sound: SoundData, v: number) => {
    const player = audioPlayers[sound.title];
    if (player) {
      player.volume(v);
      setAudioPlayers((p) => ({ ...p, [sound.title]: player }));
    }
  };

  const handleVolumeChangeAll = (v: number) =>
    activeSounds.forEach((t) => audioPlayers[t]?.volume(v));

  const handleMuteAll = () =>
    activeSounds.forEach((t) => audioPlayers[t]?.volume(0));

  /* ---------- value контекста ---------- */
  const value: AudioContextType = {
    audioPlayers,
    setAudioPlayers,
    activeSounds,
    setActiveSounds,       // ★ важное добавление
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
    loadingSounds,
    setLoadingSounds,
  };

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
};

/* ---------- Хук доступа ---------- */
export const useAudioContext = () => {
  const ctx = useContext(AudioContext);
  if (!ctx)
    throw new Error("useAudioContext must be used within an AudioContextProvider");
  return ctx;
};
