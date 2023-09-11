import { create } from "zustand";
import { useAppState } from "./useAppState";
import { UseBoundStore, StoreApi } from "zustand";
import constants from "../utils/constants";

export interface VoiceStore {
  sources: AudioBufferSourceNode[] | null;
  volumes: GainNode[] | null;
  gain: GainNode | null;
  semitone: number;
  isPlaying: boolean;

  startPlaying: () => void;
  playSample: (source: AudioBufferSourceNode, i: number) => void;
  stopPlaying: () => void;
  setSemitone: (semitone: number) => void;
}

const createStore = () => {
  return create<VoiceStore>((set, get) => ({
    sources: [],
    volumes: null,
    gain: null,
    isPlaying: false,
    semitone: 0,

    playSample: (source: AudioBufferSourceNode, i: number) => {
      set({ isPlaying: true });
      const ctx = useAppState.getState().ctx;
      const now = ctx.currentTime;
      const env = ctx.createGain();
      const gain = get().gain as GainNode;
      const semitone = get().semitone;
      const buffer = useAppState.getState().samples[i].buf;
      env.gain.setValueAtTime(0, now);
      source.loop = true;
      source.loopStart =
        useAppState.getState().startPoints[i] *
        useAppState.getState().loopLength;
      source.loopEnd =
        useAppState.getState().endPoints[i] * useAppState.getState().loopLength;
      if (!source.buffer) {
        source.buffer = buffer;
      }
      const loopLength = source.loopEnd - source.loopStart;
      source.playbackRate.value = Math.pow(2, semitone / 12);
      source.connect(env);
      env.connect(gain);

      // TO BE IMPLEMENTED
      //const rand = Math.random() * 0.5 - 0.25;
      let trig = useAppState.getState().envs[i].trg;
      trig = Math.min(Math.max(trig, 0), 1);

      const attack = useAppState.getState().envs[i].att;
      const release = useAppState.getState().envs[i].rel;

      env.gain.linearRampToValueAtTime(1, now + loopLength * attack);

      const releaseTime = loopLength * (1 - release);

      setTimeout(() => {
        env.gain.linearRampToValueAtTime(
          0,
          now + releaseTime + loopLength * release
        );
      }, releaseTime * 1000);

      source.start(ctx.currentTime, source.loopStart);

      if (get().isPlaying) {
        setTimeout(() => {
          source.stop();
          source.disconnect();
        }, loopLength * 1000);

        setTimeout(() => {
          const newSource = ctx.createBufferSource();
          get().playSample(newSource, i);
        }, loopLength * trig * 1000);
      }
    },

    startPlaying: () => {
      const ctx = useAppState.getState().ctx;
      const sources: AudioBufferSourceNode[] = [];
      const gain = get().gain || ctx.createGain();
      const gainValue = get().isPlaying ? gain.gain.value : 0;
      gain.gain.setValueAtTime(gainValue, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(
        1,
        ctx.currentTime + useAppState.getState().attack
      );
      gain.connect(ctx.destination);

      const timeout = useAppState.getState().timeout;
      if (get().isPlaying && timeout) {
        clearTimeout(timeout);
      }

      set({ gain });

      if (!get().isPlaying) {
        for (let i = 0; i < constants.NUM_SAMPLES; i++) {
          sources[i] = get().sources?.[i] || ctx.createBufferSource();
          get().playSample(sources[i], i);
        }
      }
    },
    stopPlaying: () => {
      const ctx = useAppState.getState().ctx;
      const gain = get().gain as GainNode;
      const sources = get().sources;

      const release = useAppState.getState().release;
      const currentGain = gain.gain.value as number;

      gain.gain.setValueAtTime(currentGain, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + release);

      const timeout = setTimeout(() => {
        sources?.forEach((source) => {
          source.stop();
          source.buffer = null;
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
