import { create } from "zustand";

export interface SampleStore {
  mediaRecorder: MediaRecorder | null;
  audioBuffer: AudioBuffer | null;
  displayData: number[];
  isRecording: boolean;
  start: number;
  end: number;
  trig: number;
  att: number;
  rel: number;
}

const createSampleStore = () => {
  return create<SampleStore>(() => ({
    mediaRecorder: null,
    audioBuffer: null,
    displayData: [],
    isRecording: false,
    start: 0,
    end: 1,
    trig: 0.5,
    att: 0,
    rel: 0,
  }));
};

export default createSampleStore;
