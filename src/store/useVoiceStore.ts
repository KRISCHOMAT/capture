import { create } from "zustand";

export interface VoiceStore {
  sources: AudioBufferSourceNode[] | null;
  pitch: number;
}

const createVoiceStore = () => {
  return create<VoiceStore>(() => ({
    sources: [],
    pitch: 0,
  }));
};

export default createVoiceStore;
