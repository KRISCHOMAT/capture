import { create } from "zustand";
import useMasterStore from "./useMasterStore";

export interface SampleStore {
  env: GainNode | null;
  mediaRecorder: MediaRecorder | null;
  audioBuffer: AudioBuffer | null;
  displayData: number[];
  isRecording: boolean;
  start: number;
  end: number;
  trig: number;
  att: number;
  rel: number;
  vol: number;
  rec: () => void;
  getMediaRecorder: () => Promise<MediaRecorder>;
  setStart: (start: number) => void;
  setEnd: (end: number) => void;
  setTrig: (trig: number) => void;
  setAtt: (att: number) => void;
  setRel: (rel: number) => void;
  setVol: (vol: number) => void;
}

const createSampleStore = () => {
  return create<SampleStore>((set, get) => ({
    env: null,
    mediaRecorder: null,
    audioBuffer: null,
    displayData: [],
    isRecording: false,
    start: 0,
    end: 1,
    trig: 0.5,
    att: 0,
    rel: 0,
    vol: 0,
    rec: async () => {
      let mediaRecorder = get().mediaRecorder;
      // init media recorder if null
      if (!mediaRecorder) {
        mediaRecorder = await get().getMediaRecorder();
      }
      set({ isRecording: true });

      mediaRecorder?.start();
      // stop recording after sampleLength
      setTimeout(() => {
        set({ isRecording: false });
        mediaRecorder?.stop();
      }, useMasterStore.getState().sampleLength);
    },
    getMediaRecorder: async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const ctx = useMasterStore.getState().ctx || new AudioContext();
      mediaRecorder.ondataavailable = async (e: BlobEvent) => {
        const raw = e.data;
        const arrayBuffer = await raw.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        const channelData = audioBuffer.getChannelData(0);
        const displayData = createDisplayData(channelData);
        set({ audioBuffer, displayData });
      };
      set({ mediaRecorder });
      return mediaRecorder;
    },
    setAtt: (att: number) => {
      set({ att });
    },
    setRel: (rel: number) => {
      set({ rel });
    },
    setStart: (start: number) => {
      set({ start });
    },
    setEnd: (end: number) => {
      set({ end });
    },
    setTrig: (trig: number) => {
      set({ trig });
    },
    setVol: (vol: number) => {
      set({ vol });
    },
  }));
};

const createDisplayData = (dataArray: Float32Array) => {
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

  // normalize
  const multiplier = Math.pow(Math.max(...filteredData), -1);
  const displayData = filteredData.map((n) => n * multiplier);

  return displayData;
};

export default createSampleStore;
