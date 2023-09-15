import { UseBoundStore, StoreApi, create } from "zustand";
import createSampleStore, { SampleStore } from "./useSampleStore";
import createVoiceStore, { VoiceStore } from "./useVoiceStore";

interface MasterStore {
  ctx: AudioContext | null;
  env: GainNode | null;
  vol: number;
  att: number;
  rel: number;
  numSamples: number;
  numVoices: number;
  samples: UseBoundStore<StoreApi<SampleStore>>[];
  voices: UseBoundStore<StoreApi<VoiceStore>>[];
}

const useMasterStore = create<MasterStore>((_, get) => ({
  ctx: null,
  env: null,
  vol: 0,
  att: 0,
  rel: 0,
  numSamples: 2,
  numVoices: 3,
  samples: Array.from({ length: get().numSamples }).map(() =>
    createSampleStore()
  ),
  voices: Array.from({ length: get().numVoices }).map(() => createVoiceStore()),
}));

export default useMasterStore;
