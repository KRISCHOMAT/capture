import { useEffect, useRef, useState } from "react";
import styles from "./waveform.module.css";
import useMediaRecorder from "../hooks/useMediaRecorder";
import { useAppState } from "../store/useAppState";
import { shallow } from "zustand/shallow";

interface Props {
  name: string;
  index: number;
}

const WaveForm = ({ name, index }: Props) => {
  const isPlaying = useAppState((state) => state.isPlaying);
  const { setStart, setEnd, setRecording } = useAppState(
    (state) => ({
      setStart: state.setStart,
      setEnd: state.setEnd,
      setRecording: state.setRecording,
    }),
    shallow
  );

  const { rec, filteredData, audioBuffer } = useMediaRecorder();

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [valueStart, setValueStart] = useState(50);
  const [valueEnd, setValueEnd] = useState(70);
  const [context, setContext] = useState<CanvasRenderingContext2D>();

  const startRef = useRef(null);
  const endRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleClick = () => {
    console.log("hello");
  };

  const handleMouseMove = (
    e: React.MouseEvent,
    ref: React.RefObject<HTMLDivElement>,
    setter: React.Dispatch<React.SetStateAction<number>>
  ) => {
    if (!wrapperRef.current || !ref.current || !isMouseDown) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pos = (x / rect.width) * 100;
    if (pos <= 0 || pos >= 100) return;
    ref.current.style.left = `${pos}%`;
    setter(pos);
  };

  const startRec = () => {
    rec();
  };

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

    canvas.width = 500;
    canvas.height = 80; // Set your desired canvas height here
    context.strokeStyle = "white";

    context.lineWidth = 0.5;
    setContext(context);
  };

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

    createContext();

    return () => {
      document.removeEventListener("mouseup", () => {
        setIsMouseDown(false);
      });
    };
  }, []);

  return (
    <div
      className={styles.wrapper}
      ref={wrapperRef}
      style={{
        border: isPlaying ? "2px solid #f46d6d" : "2px solid transparent",
        opacity: 1,
      }}
    >
      <canvas ref={canvasRef}></canvas>
      <div className={styles.controls}>
        <div className={styles.rec} onClick={startRec}></div>
        <div className={styles.name} onClick={handleClick}>
          {name}
        </div>
      </div>
      <div
        className={styles.indicatorContainerStart}
        style={{ left: `${valueStart}%` }}
        onMouseDown={() => {
          setIsMouseDown(true);
        }}
        onMouseMove={(e: React.MouseEvent) => {
          handleMouseMove(e, startRef, setValueStart);
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
          handleMouseMove(e, endRef, setValueEnd);
        }}
        ref={endRef}
      >
        <div className={styles.endIndicator}></div>
      </div>
    </div>
  );
};
export default WaveForm;
