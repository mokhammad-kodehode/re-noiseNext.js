"use client"

import React, { useRef, useState, useEffect } from 'react';
import styles from './styles.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay,faClock, faPause, faVolumeUp, faVolumeMute,faCompress,faExpand } from '@fortawesome/free-solid-svg-icons';

interface VideoPlayerProps {
    isPlaying: boolean;
    videoSource: string;
    soundSource: string;
    onPlayPauseClick: () => void;
    onMuteClick: () => void;
    volume: number;
    onVolumeChange: (volume: number) => void;
    title: string;
  }
  
  const VideoPlayer: React.FC<VideoPlayerProps> = ({
    isPlaying,
    videoSource,
    onPlayPauseClick,
    onMuteClick,
    soundSource,
    title,
    volume,
    onVolumeChange,
  }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false)
    const [isMuted, setIsMuted] = useState(false); // Состояние для отслеживания включен/выключен звук
    const [currentVolume, setCurrentVolume] = useState(volume);

    const toggleMute = () => {
      if (audioRef.current) {
        audioRef.current.muted = !isMuted; // Включение/выключение звука
        setIsMuted(!isMuted); // Обновление состояния
        onMuteClick(); // Вызов колбэка
      }
    };
    

    const toggleFullScreen = () => {
      const videoContainer = document.querySelector(`.${styles.videoContainer}`) as HTMLElement;
  
      if (videoContainer) {
        if (!document.fullscreenElement) {
          if (videoContainer.requestFullscreen) {
            videoContainer.requestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
      }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(e.target.value) / 100; // Преобразование в диапазон от 0 до 1
      setCurrentVolume(newVolume); // Обновляем состояние громкости
      onVolumeChange(newVolume);
    };

    useEffect(() => {
      if (videoRef.current && audioRef.current) {
        // Загрузка новых источников для видео и аудио
        videoRef.current.load();
        audioRef.current.load();
    
        // Автоматически начать воспроизведение, если isPlaying === true
        if (isPlaying) {
          videoRef.current.play();
          audioRef.current.play();
          setIsVideoPlaying(true);
          setIsAudioPlaying(true);
        }
      }
    }, [videoSource, soundSource, isPlaying]);
  
    useEffect(() => {
      if (audioRef.current) {
        audioRef.current.volume = currentVolume; // Обновляем громкость аудио
      }
  
      if (videoRef.current) {
        videoRef.current.volume = currentVolume; // Обновляем громкость видео
      }
    }, [currentVolume])

    useEffect(() => {
      const handleFullScreenChange = () => {
        setIsFullScreen(!!document.fullscreenElement);
      };
  
      document.addEventListener('fullscreenchange', handleFullScreenChange);
  
      return () => {
        document.removeEventListener('fullscreenchange', handleFullScreenChange);
      };
    }, []);
  
    useEffect(() => {
        if (videoRef.current) {
          if (isPlaying) {
            videoRef.current.play();
            setIsVideoPlaying(true);
          } else {
            videoRef.current.pause();
            setIsVideoPlaying(false);
          }
        }
    
        if (audioRef.current) {
          if (isPlaying) {
            audioRef.current.play(); // Воспроизводим аудио, если видео играет
            setIsAudioPlaying(true);
          } else {
            audioRef.current.pause(); // Приостанавливаем аудио, если видео не играет
            setIsAudioPlaying(false);
          }
        }
      }, [isPlaying]);

      
  
      const handlePlayPauseClick = () => {
        if (videoRef.current) {
          if (isVideoPlaying) {
            videoRef.current.pause();
          } else {
            videoRef.current.play();
          }
          setIsVideoPlaying(!isVideoPlaying);
        }
    
        if (audioRef.current) {
          if (isAudioPlaying) {
            audioRef.current.pause();
          } else {
            audioRef.current.play();
          }
          setIsAudioPlaying(!isAudioPlaying);
        }
    
        onPlayPauseClick();
      };
  

  
    return (
      <div className={styles.videoPlayer}>
        <div className={styles.videoContainer}>
          <video 
          className={styles.video} 
          ref={videoRef} 
          src={videoSource} 
          autoPlay 
          loop 
          muted
          playsInline
          preload="auto">
            Your browser does not support the video tag.
          </video>
        </div>
        <div className={styles.audioContainer}>
          <audio ref={audioRef} src={soundSource} loop />
        </div>
        <div className={styles.media_section}>
          <div className={styles.player}>
            <button className={styles.playButton} onClick={handlePlayPauseClick}>
              <FontAwesomeIcon
                icon={isVideoPlaying ? faPause : faPlay}
                className={styles.play}
              />
            </button>
            {isPlaying && (
              <div className={styles.videoTitle}>{title}</div>
            )} 
            <div className={styles.volume}>
                <button className={styles.audioButton} >
                  <FontAwesomeIcon
                    icon={isMuted ? faVolumeMute : faVolumeUp}
                    className={styles.audio}
                    onClick={toggleMute}
                  />
                </button>
                  <input
                    className={styles.volumeSlider}
                    type="range"
                    min="0"
                    max="100"
                    onChange={handleVolumeChange}
                  />
            </div>
            <div className={styles.clock}>
                    <FontAwesomeIcon icon={faClock} className={styles.clockIcon} />
            </div>
            <button className={styles.fullScreenButton} onClick={toggleFullScreen}>
              <FontAwesomeIcon
                icon={isFullScreen ? faCompress : faExpand} 
                className={styles.fullScreenIcon}
              />
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default VideoPlayer;