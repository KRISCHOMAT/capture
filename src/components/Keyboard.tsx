import styles from "./keyboard.module.css";
import Key from "./Key";
import { useAppState } from "../store/useAppState";

const Keyboard = () => {
  const voices = useAppState((state) => state.voices);

  return (
    <div className={styles.wrapper}>
      {voices.map((voice, id) => {
        return (
          <Key
            setSemitone={voice((state) => state.setSemitone)}
            startPlaying={voice((state) => state.startPlaying)}
            stopPlaying={voice((state) => state.stopPlaying)}
            key={id}
          />
        );
      })}
    </div>
  );
};

export default Keyboard;
