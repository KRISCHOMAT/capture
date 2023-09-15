import { useEffect, useState } from "react";
import styles from "./key.module.css";

interface Props {
  startPlaying: () => void;
  stopPlaying: () => void;
  setSemitone: (semitone: number) => void;
}

const Key = ({ startPlaying, stopPlaying, setSemitone }: Props) => {
  const [pitch, setPitch] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const handlePitchUp = () => {
    if (pitch >= 12) {
      setPitch(-12);
    } else {
      setPitch(pitch + 1);
    }
  };

  const handlePitchDown = () => {
    if (pitch <= -12) {
      setPitch(12);
    } else {
      setPitch(pitch - 1);
    }
  };

  useEffect(() => {
    setSemitone(pitch);
  }, [pitch]);

  const handlePlay = () => {
    startPlaying();
    setIsActive(true);
  };

  const handleStop = () => {
    stopPlaying();
    setIsActive(false);
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.key} ${isActive ? styles.active : ""}`}
        onMouseDown={handlePlay}
        onMouseUp={handleStop}
        onTouchStart={handlePlay}
        onTouchEnd={handleStop}
        onTouchCancel={handleStop}
      ></div>
      <div className={styles.pitch}>
        <button onClick={handlePitchDown} onTouchStart={handlePitchDown}>
          {"<"}
        </button>
        <span>{pitch}</span>
        <button onClick={handlePitchUp} onTouchStart={handlePitchUp}>
          {">"}
        </button>
      </div>
    </div>
  );
};

export default Key;
