import React, { useEffect, useRef, useState } from "react";
import styles from "./slider.module.css";

interface Props {
  setter?: (val: number) => void;
  initVal?: number;
  label?: string;
}

const Slider = ({ setter, initVal, label }: Props) => {
  const [isMouseDown, setIsMouseDown] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const posIndicatorRef = useRef<HTMLDivElement>(null);
  const progressIndicatorRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (clientY: number) => {
    if (
      !isMouseDown ||
      !wrapperRef.current ||
      !posIndicatorRef.current ||
      !progressIndicatorRef.current
    )
      return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const y = clientY - rect.top;
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
  }, [initVal]);

  useEffect(() => {
    document.addEventListener("mouseup", () => {
      setIsMouseDown(false);
    });
    document.addEventListener("touchend", () => {
      setIsMouseDown(false);
    });
    document.addEventListener("touchcancel", () => {
      setIsMouseDown(false);
    });

    return () => {
      document.removeEventListener("mouseup", () => {
        setIsMouseDown(false);
      });
      document.removeEventListener("touchend", () => {
        setIsMouseDown(false);
      });
      document.removeEventListener("touchcancel", () => {
        setIsMouseDown(false);
      });
    };
  }, []);

  return (
    <div
      className={styles.wrapper}
      onMouseDown={() => {
        setIsMouseDown(true);
      }}
      onTouchStart={() => {
        setIsMouseDown(true);
      }}
      onMouseMove={(e: React.MouseEvent) => {
        e.preventDefault();
        const clientY = e.clientX;
        handleMouseMove(clientY);
      }}
      onTouchMove={(e: React.TouchEvent) => {
        e.preventDefault();
        const clientY = e.touches[0].clientY;
        handleMouseMove(clientY);
      }}
      ref={wrapperRef}
    >
      <div className={styles.container}>
        <div className={styles.posIndicator} ref={posIndicatorRef}></div>
        <div
          className={styles.progressIndicator}
          ref={progressIndicatorRef}
        ></div>
      </div>
      <span>{label}</span>
    </div>
  );
};

export default Slider;
