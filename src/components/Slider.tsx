import React, { useEffect, useRef, useState } from "react";
import styles from "./slider.module.css";

interface Props {
  setter?: (val: number) => void;
  initVal?: number;
}

const Slider = ({ setter, initVal }: Props) => {
  const [isMouseDown, setIsMouseDown] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const posIndicatorRef = useRef<HTMLDivElement>(null);
  const progressIndicatorRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (
      !isMouseDown ||
      !wrapperRef.current ||
      !posIndicatorRef.current ||
      !progressIndicatorRef.current
    )
      return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const pos = (y / rect.height) * 100;
    if (pos <= 0 || pos >= 100) return;
    if (setter) {
      setter((100 - pos) / 100);
    }
    posIndicatorRef.current.style.top = `${pos}%`;
    progressIndicatorRef.current.style.height = `${100 - pos}%`;
  };

  useEffect(() => {
    if (
      posIndicatorRef.current &&
      progressIndicatorRef.current &&
      initVal &&
      setter
    ) {
      setter(initVal / 100);
      posIndicatorRef.current.style.top = `${100 - initVal}%`;
      progressIndicatorRef.current.style.height = `${initVal}%`;
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mouseup", () => {
      setIsMouseDown(false);
    });

    return () => {
      document.removeEventListener("mouseup", () => {
        setIsMouseDown(false);
      });
    };
  }, []);

  return (
    <div
      className={styles.wrapper}
      onMouseMove={handleMouseMove}
      ref={wrapperRef}
    >
      <div className={styles.container}>
        <div
          className={styles.posIndicator}
          onMouseDown={() => {
            setIsMouseDown(true);
          }}
          ref={posIndicatorRef}
        ></div>
        <div
          className={styles.progressIndicator}
          ref={progressIndicatorRef}
        ></div>
      </div>
    </div>
  );
};

export default Slider;
