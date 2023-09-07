import { create } from "zustand";
import { voices, VoiceStore } from "./useAudioVoice";
import { UseBoundStore, StoreApi } from "zustand";
import constants from "../utils/constants";

type Recordings = {
  [id: number]: AudioBuffer;
};

export interface AppState {
  ctx: AudioContext;
  isPlaying: boolean;
  attack: number;
  release: number;
  start: number;
  end: number;
  startPoints: number[];
  endPoints: number[];
  recordings: Recordings;
  timeout: number | null;
  loopLength: number;
  voices: UseBoundStore<StoreApi<VoiceStore>>[];
  setStart: (start: number, index: number) => void;
  setEnd: (end: number, index: number) => void;

  setRecording: (recording: AudioBuffer, index: number) => void;
}

const useAppState = create<AppState>((set, get) => ({
  ctx: new AudioContext(),
  isPlaying: false,
  attack: 1,
  release: 15,
  start: 0,
  end: 1,
  startPoints: Array.from({ length: constants.NUM_SAMPLES }).map(() => 0),
  endPoints: Array.from({ length: constants.NUM_SAMPLES }).map(() => 1),
  recordings: {},
  timeout: null,
  loopLength: 5,
  voices,
  setStart: (start: number, index: number) => {
    set((state) => {
      const newStartpoints = { ...state.startPoints };
      newStartpoints[index] = start;
      const newVoices = [...state.voices];
      newVoices.forEach((voice) => {
        const source = voice.getState().sources?.[index];
        if (source) {
          source.loopStart = start * get().loopLength;
        }
      });
      return { startPoints: newStartpoints };
    });
  },
  setEnd: (end: number, index: number) => {
    set((state) => {
      const newEndpoints = { ...state.endPoints };
      newEndpoints[index] = end;
      const newVoices = [...state.voices];
      newVoices.forEach((voice) => {
        const source = voice.getState().sources?.[index];
        if (source) {
          source.loopEnd = end * get().loopLength;
        }
      });
      return { endPoints: newEndpoints };
    });
  },
  setRecording: (recording: AudioBuffer, index: number) =>
    set((state) => {
      const newRecordings = { ...state.recordings };
      newRecordings[index] = recording;
      return { recordings: newRecordings };
    }),
}));

export { useAppState };
