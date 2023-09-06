import { useEffect, useState } from "react";

const useMediaRecorder = () => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();
  const [audioCtx, setAudioCtx] = useState<AudioContext>();
  const [bufDecode, setBufDecode] = useState<Float32Array>();
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer>();
  const [filteredData, setFilteredData] = useState<number[]>([]);

  const rec = async () => {
    if (!audioCtx) {
      setAudioCtx(new AudioContext());
    }
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

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream: MediaStream) => {
        setMediaRecorder(new MediaRecorder(stream));
      });
  }, []);

  useEffect(() => {
    if (mediaRecorder && audioCtx) {
      mediaRecorder.ondataavailable = async function (e: BlobEvent) {
        const raw = e.data;
        const arrayBuffer = await raw.arrayBuffer();
        const newBuf = await audioCtx.decodeAudioData(arrayBuffer);
        const channelData = newBuf.getChannelData(1);
        setAudioBuffer(newBuf);
        setBufDecode(channelData);
        setFilteredData(filterData(channelData));
      };
    }
  }, [mediaRecorder, audioCtx]);

  return { rec, bufDecode, filteredData, audioBuffer };
};

export default useMediaRecorder;
