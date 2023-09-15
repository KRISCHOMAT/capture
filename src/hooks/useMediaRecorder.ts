import { useEffect, useState } from "react";

const useMediaRecorder = () => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer>();
  const [filteredData, setFilteredData] = useState<number[]>([]);

  const rec = async () => {
    if (mediaRecorder) {
      mediaRecorder.start();
      setTimeout(() => {
        mediaRecorder.stop();
      }, 5000);
    }
  };

  const filterData = (dataArray: Float32Array) => {
    const samples = 5000;
    const blockSize = Math.floor(dataArray.length / samples);
    const filteredData = [];

    for (let i = 0; i < samples; i++) {
      let sum = 0;

      for (let j = 0; j < blockSize; j++) {
        const index = i * blockSize + j;
        sum += dataArray[index];
      }
      const average = sum / blockSize;
      filteredData.push(average);
    }

    return normalizeData(filteredData);
  };

  const normalizeData = (filteredData: number[]) => {
    const multiplier = Math.pow(Math.max(...filteredData), -1);
    return filteredData.map((n) => n * multiplier);
  };

  const getMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = async (e: BlobEvent) => {
      const audioCtx = new AudioContext();
      const raw = e.data;
      const arrayBuffer = await raw.arrayBuffer();
      const newBuf = await audioCtx.decodeAudioData(arrayBuffer);
      const channelData = newBuf.getChannelData(0);
      setAudioBuffer(newBuf);
      setFilteredData(filterData(channelData));
    };
    recorder.onstop = async () => {
      console.log("stopped");
    };
    setMediaRecorder(recorder);
  };

  useEffect(() => {
    getMedia();
  }, []);

  return { rec, filteredData, audioBuffer };
};

export default useMediaRecorder;
