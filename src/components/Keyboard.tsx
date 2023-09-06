import styles from "./keyboard.module.css";
import Key from "./Key";

import {
  useAudioVoiceA,
  useAudioVoiceB,
  useAudioVoiceC,
  useAudioVoiceD,
  useAudioVoiceE,
} from "../store/store";

const Keyboard = () => {
  const { startPlayingA, stopPlayingA, setSemitoneA } = useAudioVoiceA(
    (state) => ({
      startPlayingA: state.startPlaying,
      stopPlayingA: state.stopPlaying,
      setSemitoneA: state.setSemitone,
    })
  );

  const { startPlayingB, stopPlayingB, setSemitoneB } = useAudioVoiceB(
    (state) => ({
      startPlayingB: state.startPlaying,
      stopPlayingB: state.stopPlaying,
      setSemitoneB: state.setSemitone,
    })
  );

  const { startPlayingC, stopPlayingC, setSemitoneC } = useAudioVoiceC(
    (state) => ({
      startPlayingC: state.startPlaying,
      stopPlayingC: state.stopPlaying,
      setSemitoneC: state.setSemitone,
    })
  );

  const { startPlayingD, stopPlayingD, setSemitoneD } = useAudioVoiceD(
    (state) => ({
      startPlayingD: state.startPlaying,
      stopPlayingD: state.stopPlaying,
      setSemitoneD: state.setSemitone,
    })
  );

  const { startPlayingE, stopPlayingE, setSemitoneE } = useAudioVoiceE(
    (state) => ({
      startPlayingE: state.startPlaying,
      stopPlayingE: state.stopPlaying,
      setSemitoneE: state.setSemitone,
    })
  );
  return (
    <div className={styles.wrapper}>
      <Key
        setSemitone={setSemitoneA}
        startPlaying={startPlayingA}
        stopPlaying={stopPlayingA}
      />
      <Key
        setSemitone={setSemitoneB}
        startPlaying={startPlayingB}
        stopPlaying={stopPlayingB}
      />
      <Key
        setSemitone={setSemitoneC}
        startPlaying={startPlayingC}
        stopPlaying={stopPlayingC}
      />
      <Key
        setSemitone={setSemitoneD}
        startPlaying={startPlayingD}
        stopPlaying={stopPlayingD}
      />
      <Key
        setSemitone={setSemitoneE}
        startPlaying={startPlayingE}
        stopPlaying={stopPlayingE}
      />
    </div>
  );
};

export default Keyboard;
