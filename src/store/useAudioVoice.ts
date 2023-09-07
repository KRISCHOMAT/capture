import { create } from "zustand";
import { useAppState } from "./useAppState";
import { UseBoundStore, StoreApi } from "zustand";
import constants from "../utils/constants";

export interface VoiceStore {
  sources: AudioBufferSourceNode[] | null;
  gain: GainNode | null;
  semitone: number;
  isPlaying: boolean;

  startPlaying: () => void;
  stopPlaying: () => void;
  setSemitone: (semitone: number) => void;
}

const createStore = () => {
  return create<VoiceStore>((set, get) => ({
    sources: null,
    gain: null,
    masterGain: null,
    isPlaying: false,
    semitone: 0,

    startPlaying: () => {
      const ctx = useAppState.getState().ctx;
      const sources: AudioBufferSourceNode[] = [];

      const gain = get().gain || ctx.createGain();
      const semitone = get().semitone;

      for (let i = 0; i < constants.NUM_SAMPLES; i++) {
        sources[i] = get().sources?.[i] || ctx.createBufferSource();
        sources[i].loop = true;
        sources[i].loopStart =
          useAppState.getState().startPoints[i] *
          useAppState.getState().loopLength;
        sources[i].loopEnd =
          useAppState.getState().endPoints[i] *
          useAppState.getState().loopLength;
        if (!sources[i].buffer) {
          sources[i].buffer = useAppState.getState().recordings[i];
        }
        sources[i].playbackRate.value = Math.pow(2, semitone / 12);
        sources[i].connect(gain);
      }

      const attack = useAppState.getState().attack;

      gain.connect(ctx.destination);
      const currentGain = get().isPlaying ? gain.gain.value : 0;
      gain.gain.setValueAtTime(currentGain, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(1, ctx.currentTime + attack);

      set({ gain, sources });

      if (get().isPlaying) {
        clearTimeout(useAppState.getState().timeout as number);
      } else {
        sources.forEach((source) => {
          source.start(ctx.currentTime, source.loopStart);
        });
      }
      set({ isPlaying: true });
    },
    stopPlaying: () => {
      const ctx = useAppState.getState().ctx;
      const gain = get().gain;

      const sources = get().sources;

      const release = useAppState.getState().release;
      const currentGain = gain?.gain.value as number;

      gain?.gain.setValueAtTime(currentGain, ctx.currentTime);
      gain?.gain.linearRampToValueAtTime(0, ctx.currentTime + release);

      const timeout = setTimeout(() => {
        sources?.forEach((source) => {
          source.stop();
          source.buffer = null;
          source.stop();
          source.disconnect();
          set({ sources: null });
        });
        set({ isPlaying: false });
      }, release * 1000);
      useAppState.setState({ timeout });
    },
    setSemitone: (semitone: number) => {
      set({ semitone });
      const sources = get().sources;
      if (sources) {
        sources.forEach((source) => {
          source.playbackRate.value = Math.pow(2, semitone / 12);
        });
      }
    },
  }));
};

const voices: UseBoundStore<StoreApi<VoiceStore>>[] = [];

for (let i = 0; i < constants.NUM_VOICES; i++) {
  voices.push(createStore());
}

export { voices };
