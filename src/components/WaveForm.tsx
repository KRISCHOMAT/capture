import { useEffect, useRef, useState } from "react";
import styles from "./waveform.module.css";
import useMediaRecorder from "../hooks/useMediaRecorder";
import { useAppState } from "../store/useAppState";

interface Props {
  name: string;
  index: number;
}

const WaveForm = ({ name, index }: Props) => {
  const setStart = useAppState((state) => state.setStart);
  const setEnd = useAppState((state) => state.setEnd);
  const setRecording = useAppState((state) => state.setRecording);
  const envs = useAppState((state) => state.envs);
  const volume = useAppState((state) => state.samples[index].vol);

  const { rec, filteredData, audioBuffer, isRecording } = useMediaRecorder();

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [valueStart, setValueStart] = useState(50);
  const [valueEnd, setValueEnd] = useState(70);
  const [context, setContext] = useState<CanvasRenderingContext2D>();

  const startRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [distance, setDistance] = useState(0);

  const handleMouseMove = (
    clientX: number,
    ref: React.RefObject<HTMLDivElement>,
    setter: React.Dispatch<React.SetStateAction<number>>
  ) => {
    if (!wrapperRef.current || !ref.current || !isMouseDown) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pos = (x / rect.width) * 100;
    if (pos <= 0 || pos >= 100) return;
    ref.current.style.left = `${pos}%`;
    setter(pos);
  };

  useEffect(() => {
    const newDistance = valueEnd - valueStart;
    setDistance(newDistance);
  }, [envs, valueStart, valueEnd]);

  const draw = () => {
    if (!context || !canvasRef.current) return;

    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    const canvasBaseline = canvasRef.current.height / 2;
    const dataLength = filteredData.length;

    for (let i = 0; i < dataLength; i++) {
      const x = (i / (dataLength - 1)) * canvasRef.current.width;
      const y = canvasBaseline + filteredData[i] * (canvasBaseline - 5);

      context.beginPath();
      context.rect(x, y, 3, 3);
      context.stroke();
    }
  };

  const createContext = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvasRef.current.getContext(
      "2d"
    ) as CanvasRenderingContext2D;

    canvas.width = wrapperRef.current?.clientWidth || 400;
    canvas.height = wrapperRef.current?.clientHeight || 80;
    context.strokeStyle = "white";
    context.lineWidth = 0.5;
    setContext(context);
  };

  const handlePreventDefault = (e: TouchEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (startRef.current && endRef.current) {
      startRef.current.ontouchmove = handlePreventDefault;
      startRef.current.ontouchstart = handlePreventDefault;
      startRef.current.ontouchcancel = handlePreventDefault;
      endRef.current.ontouchmove = handlePreventDefault;
      endRef.current.ontouchstart = handlePreventDefault;
      endRef.current.ontouchcancel = handlePreventDefault;
    }
  }, [startRef, endRef]);

  useEffect(() => {
    if (audioBuffer) {
      setRecording(audioBuffer, index);
    }
  }, [audioBuffer]);

  useEffect(() => {
    draw();
  }, [filteredData]);

  useEffect(() => {
    if (valueStart >= valueEnd - 5) {
      setValueEnd(valueStart + 5);
    }
    if (valueEnd <= valueStart + 5) {
      setValueStart(valueEnd - 5);
    }
    setStart(valueStart / 100, index);
    setEnd(valueEnd / 100, index);
  }, [valueStart, valueEnd]);

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

    createContext();

    return () => {
      document.removeEventListener("mouseup", () => {
        setIsMouseDown(false);
      });
    };
  }, []);

  return (
    <div
      className={`${styles.wrapper} ${isRecording ? styles.recording : ""}`}
      ref={wrapperRef}
      style={{
        opacity: volume * (1 - 0.2) + 0.2,
      }}
    >
      <canvas ref={canvasRef}></canvas>
      <div className={styles.controls}>
        <div className={styles.rec} onClick={rec}></div>
        <div className={styles.name}>{name}</div>
      </div>
      <div
        className={styles.trg}
        style={{ left: `${distance * envs[index].trg + valueStart}%` }}
      ></div>
      <div
        className={styles.att}
        style={{
          left: `${valueStart}%`,
          width: `${envs[index].att * distance}%`,
        }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <line
            x1="0%"
            y1="100%"
            x2="100%"
            y2="0%"
            stroke="gray"
            strokeWidth="2.5"
          />
        </svg>
      </div>
      <div
        className={styles.rel}
        style={{
          left: `${valueEnd}%`,
          width: `${envs[index].rel * distance}%`,
        }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <line
            x1="100%"
            y1="100%"
            x2="0%"
            y2="0%"
            stroke="gray"
            strokeWidth="2.5"
          />
        </svg>
      </div>
      <div
        className={styles.indicatorContainerStart}
        style={{ left: `${valueStart}%` }}
        onMouseDown={() => {
          setIsMouseDown(true);
        }}
        onTouchStart={() => {
          setIsMouseDown(true);
        }}
        onMouseMove={(e: React.MouseEvent) => {
          const clientX = e.clientX;
          handleMouseMove(clientX, startRef, setValueStart);
        }}
        onTouchMove={(e: React.TouchEvent) => {
          const clientX = e.targetTouches[0].clientX;
          handleMouseMove(clientX, startRef, setValueStart);
        }}
        ref={startRef}
      >
        <div className={styles.startIndicator}></div>
      </div>
      <div
        className={styles.indicatorContainerEnd}
        style={{ left: `${valueEnd}%` }}
        onMouseDown={() => {
          setIsMouseDown(true);
        }}
        onMouseMove={(e: React.MouseEvent) => {
          e.preventDefault();
          const clientX = e.clientX;
          handleMouseMove(clientX, endRef, setValueEnd);
        }}
        onTouchMove={(e: React.TouchEvent) => {
          e.preventDefault();
          const clientX = e.targetTouches[0].clientX;
          handleMouseMove(clientX, endRef, setValueEnd);
        }}
        onTouchStart={() => {
          setIsMouseDown(true);
        }}
        ref={endRef}
      >
        <div className={styles.endIndicator}></div>
      </div>
    </div>
  );
};
export default WaveForm;
