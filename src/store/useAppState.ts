import { create } from "zustand";
import { voices, VoiceStore } from "./useAudioVoice";
import { UseBoundStore, StoreApi } from "zustand";
import constants from "../utils/constants";

interface Samples {
  buf: AudioBuffer | null;
  vol: number;
  start: number;
  end: number;
}

interface Env {
  att: number;
  rel: number;
  trg: number;
}

export interface AppState {
  ctx: AudioContext;
  attack: number;
  release: number;
  start: number;
  end: number;
  startPoints: number[];
  endPoints: number[];
  volumes: number[];
  samples: Samples[];
  envs: Env[];
  timeout: number | null;
  loopLength: number;
  voices: UseBoundStore<StoreApi<VoiceStore>>[];
  setStart: (start: number, index: number) => void;
  setEnd: (end: number, index: number) => void;
  setVolume: (volume: number, index: number) => void;
  setRecording: (recording: AudioBuffer, index: number) => void;
  setAttack: (attack: number) => void;
  setRelease: (release: number) => void;
  setEnvAtt: (att: number, index: number) => void;
  setEnvRel: (att: number, index: number) => void;
  setEnvTrg: (trg: number, index: number) => void;
}

const useAppState = create<AppState>((set, get) => ({
  ctx: new AudioContext(),
  attack: 1,
  release: 1,
  start: 0,
  end: 1,
  startPoints: Array.from({ length: constants.NUM_SAMPLES }).map(() => 0),
  endPoints: Array.from({ length: constants.NUM_SAMPLES }).map(() => 1),
  volumes: Array.from({ length: constants.NUM_SAMPLES }).map(() => 0.5),
  samples: Array.from({ length: constants.NUM_SAMPLES }).map(() => ({
    buf: null,
    vol: 0.5,
    start: 0,
    end: 1,
  })),
  envs: Array.from({ length: constants.NUM_SAMPLES }).map(() => ({
    att: 0.2,
    rel: 0,
    trg: 0.5,
  })),
  timeout: null,
  loopLength: 5,
  voices,
  setEnvAtt: (att: number, index: number) => {
    set((state) => {
      const newEnvs = { ...state.envs };
      newEnvs[index].att = att;
      return { envs: newEnvs };
    });
  },
  setEnvRel: (rel: number, index: number) => {
    set((state) => {
      const newEnvs = { ...state.envs };
      newEnvs[index].rel = rel;
      return { envs: newEnvs };
    });
  },
  setEnvTrg: (trg: number, index: number) => {
    set((state) => {
      const newEnvs = { ...state.envs };
      newEnvs[index].trg = trg;
      return { envs: newEnvs };
    });
  },
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
  setVolume: (volume: number, index: number) => {
    set((state) => {
      const samples = { ...state.samples };
      samples[index].vol = volume;
      const newVoices = [...state.voices];
      newVoices.forEach((voice) => {
        const env = voice.getState().volumes?.[index];
        if (env) {
          env.gain.setValueAtTime(volume, get().ctx.currentTime);
        }
      });
      return { samples };
    });
  },
  setRecording: (recording: AudioBuffer, index: number) =>
    set((state) => {
      const newRecordings = { ...state.samples };
      newRecordings[index].buf = recording;
      return { samples: newRecordings };
    }),
  setAttack: (attack: number) => {
    set({ attack });
  },
  setRelease: (release: number) => {
    set({ release });
  },
}));

export { useAppState };
