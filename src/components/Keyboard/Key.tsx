import styles from "./key.module.css";
import { VoiceStore } from "../../store/useVoiceStore";
import { useEffect, useRef } from "react";

interface Props {
  voice: VoiceStore;
}

const Key = ({ voice }: Props) => {
  const {
    play,
    stop,
    pitch,
    setPitch,
    isPlaying,
    isLatchMode,
    isActive,
    setIsLatchMode,
  } = voice;
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handlePreventDefault = (e: TouchEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.ontouchmove = handlePreventDefault;
      wrapperRef.current.ontouchstart = handlePreventDefault;
      wrapperRef.current.ontouchcancel = handlePreventDefault;
    }
  }, [wrapperRef]);

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.key} ${isPlaying && styles.playing} ${
          isActive && isPlaying && styles.active
        }`}
        onMouseDown={play}
        onMouseUp={() => {
          stop();
        }}
        onTouchStart={play}
        onTouchEnd={() => stop()}
        onTouchCancel={() => stop()}
        ref={wrapperRef}
      ></div>
      <div className={styles.pitch}>
        <button
          onClick={() => {
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
        >
          {">"}
        </button>
      </div>
      <div className={`${styles.latch} `}>
        latch
        <button
          className={isLatchMode ? styles.isLatch : ""}
          onClick={setIsLatchMode}
        ></button>
      </div>
    </div>
  );
};

export default Key;
