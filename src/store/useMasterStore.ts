import { UseBoundStore, StoreApi, create } from "zustand";
import createSampleStore, { SampleStore } from "./useSampleStore";
import createVoiceStore, { VoiceStore } from "./useVoiceStore";

interface MasterStore {
  ctx: AudioContext | null;
  vol: number;
  att: number;
  rel: number;
  numSamples: number;
  numVoices: number;
  sampleLength: number;
  samples: UseBoundStore<StoreApi<SampleStore>>[];
  voices: UseBoundStore<StoreApi<VoiceStore>>[];
  setVol: (vol: number) => void;
  setAtt: (att: number) => void;
  setRel: (rel: number) => void;
}

const useMasterStore = create<MasterStore>((set) => {
  const numSamples = 2;
  const numVoices = 4;
  return {
    ctx: null,
    vol: 0,
    att: 0,
    rel: 0,
    numSamples,
    numVoices,
    sampleLength: 5000, // 5 sec
    samples: Array.from({ length: numSamples }).map(() => createSampleStore()),
    voices: Array.from({ length: numVoices }).map(() => createVoiceStore()),
    setVol: (vol: number) => {
      set({ vol });
    },
    setAtt: (att: number) => {
      if (att === 0) {
        att = 0.01;
      }
      set({ att });
    },
    setRel: (rel: number) => {
      if (rel === 0) {
        rel = 0.01;
      }
      set({ rel });
    },
  };
});

export default useMasterStore;
