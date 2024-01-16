import { useAudioContext } from '@/app/context/AudioContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faCirclePlay } from '@fortawesome/free-solid-svg-icons';

import styles from './styles.module.css';

const GlobalAudioControl = () => {
  const { isPlaying, handlePlayPause } = useAudioContext();

  return (
    <button className={styles.playButton} onClick={handlePlayPause}>
        <FontAwesomeIcon icon={isPlaying ? faPause : faCirclePlay} className={styles.play} />
    </button>
  );
}

export default GlobalAudioControl ;