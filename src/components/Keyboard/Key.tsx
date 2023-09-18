import styles from "./key.module.css";
import { VoiceStore } from "../../store/useVoiceStore";

interface Props {
  voice: VoiceStore;
}

const Key = ({ voice }: Props) => {
  const { play, stop, pitch, setPitch, isPlaying } = voice;

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.key} ${isPlaying ? styles.active : ""}`}
        onMouseDown={play}
        onMouseUp={stop}
        onTouchStart={play}
        onTouchEnd={stop}
        onTouchCancel={stop}
      ></div>
      <div className={styles.pitch}>
        <button
          onClick={() => {
            setPitch(pitch - 1);
          }}
          onTouchStart={() => {
            setPitch(pitch - 1);
          }}
        >
          {"<"}
        </button>
        <span>{pitch}</span>
        <button
          onClick={() => {
            setPitch(pitch + 1);
          }}
          onTouchStart={() => {
            setPitch(pitch + 1);
          }}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default Key;
