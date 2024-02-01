"use client"

import React, { useState,useEffect} from 'react';
import videoData from '@/data/videoData';
import VideoPlayer from '@/components/videoPlayeer/VideoPlayeer';
import styles from './styles.module.css';

const VideoPage: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedSoundSource, setSelectedSoundSource] = useState<string>('');
  const [selectedTitle, setSelectedTitle] = useState<string>('');
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isMouseActive, setIsMouseActive] = useState(true);

  useEffect(() => {
    const handleMouseMove = () => {
      setIsMouseActive(true);
      if (isPlaying) {
        // Если видео воспроизводится и двигается мышь, сбросить таймер скрытия
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
          setIsMouseActive(false);
        }, 5000); // Скрывать через 3 секунды неактивности
      }
    };

    let hideTimeout: NodeJS.Timeout;

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearTimeout(hideTimeout);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isPlaying]);

  useEffect(() => {
    // Устанавливаем первое видео после монтирования компонента
    const firstVideoKey = Object.keys(videoData)[0];
    const firstVideo = videoData[firstVideoKey];
    setSelectedVideo(firstVideo.videoSource);
    setSelectedSoundSource(firstVideo.soundSource);
  }, []);

  const handleVideoClick = (videoKey: string) => {
    const video = videoData[videoKey];
    setSelectedVideo(video.videoSource);
    setSelectedSoundSource(video.soundSource);
    setSelectedTitle(video.title);
    setIsPlaying(true);
  };

  const handlePlayPauseClick = () => {
    setIsPlaying(!isPlaying);
    setIsAudioPlaying(!isAudioPlaying);
  };

  const handleMuteClick = () => {
  
  };

  const handleVolumeChange = (volume: number) => {
    // Вызов функции из VideoPlayer, чтобы управлять громкостью

  };
  
  return (
    <div className={styles.videoCardContainer}>
     <div className={styles.videoCardList} style={{ display: isMouseActive ? 'flex' : 'none' }}>
        {Object.keys(videoData).map((key) => {
          const video = videoData[key];
          return (
            <div className={styles.videoCard} key={key} onClick={() => handleVideoClick(key)}>
              <h2>{video.title}</h2>
            </div>
          );
        })}
      </div>
      {selectedVideo && (
        <VideoPlayer
          isPlaying={isPlaying}
          videoSource={selectedVideo}
          soundSource={selectedSoundSource}
          onPlayPauseClick={handlePlayPauseClick}
          onMuteClick={handleMuteClick}
          title={selectedTitle}
          volume={1} // Предполагается, что громкость изначально установлена на максимум
          onVolumeChange={handleVolumeChange}
        />
      )}
    </div>
  );
};

export default VideoPage;
