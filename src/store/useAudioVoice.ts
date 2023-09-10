import { create } from "zustand";
import { useAppState } from "./useAppState";
import { UseBoundStore, StoreApi } from "zustand";
import constants from "../utils/constants";

export interface VoiceStore {
  sources: AudioBufferSourceNode[] | null;
  gain: GainNode | null;
  volumes: GainNode[] | null;
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
    gain: null,
    volumes: null,
    isPlaying: false,
    semitone: 0,

    playSample: (source: AudioBufferSourceNode, i: number) => {
      const ctx = useAppState.getState().ctx;
      const now = ctx.currentTime;
      const env = ctx.createGain();
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
      env.connect(ctx.destination);

      const trig = 0.5;
      const attack = 0.3;
      const release = 0.3;

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
      set({ isPlaying: true });
      for (let i = 0; i < constants.NUM_SAMPLES; i++) {
        sources[i] = get().sources?.[i] || ctx.createBufferSource();
        get().playSample(sources[i], i);
      }

      // const ctx = useAppState.getState().ctx;
      // const sources: AudioBufferSourceNode[] = [];
      // const gain = get().gain || ctx.createGain();
      // const semitone = get().semitone;
      // const isPlaying = get().isPlaying;
      // const volumes: GainNode[] = [];
      // for (let i = 0; i < constants.NUM_SAMPLES; i++) {
      //   const vol = useAppState.getState().samples[i].vol;
      //   volumes[i] = get().volumes?.[i] || ctx.createGain();
      //   volumes[i].gain.value = vol;
      //   sources[i] = get().sources?.[i] || ctx.createBufferSource();
      //   sources[i].loop = true;
      //   sources[i].loopStart =
      //     useAppState.getState().startPoints[i] *
      //     useAppState.getState().loopLength;
      //   sources[i].loopEnd =
      //     useAppState.getState().endPoints[i] *
      //     useAppState.getState().loopLength;
      //   if (sources[i].buffer === null) {
      //     console.log(sources[i].buffer);
      //     sources[i].buffer = useAppState.getState().samples[i].buf;
      //   }
      //   sources[i].playbackRate.value = Math.pow(2, semitone / 12);
      //   sources[i].connect(volumes[i]);
      //   volumes[i].gain.setValueAtTime(
      //     useAppState.getState().samples[i].vol,
      //     ctx.currentTime
      //   );
      //   volumes[i].connect(gain);
      //   if (!isPlaying) {
      //     sources[i].start(ctx.currentTime, sources[i].loopStart);
      //   }
      // }
      // const attack = useAppState.getState().attack;
      // gain.connect(ctx.destination);
      // const currentGain = get().isPlaying ? gain.gain.value : 0;
      // gain.gain.setValueAtTime(currentGain, ctx.currentTime);
      // gain.gain.linearRampToValueAtTime(1, ctx.currentTime + attack);
      // if (isPlaying) {
      //   clearTimeout(useAppState.getState().timeout as number);
      // } else {
      //   set({ isPlaying: true });
      // }
      // set({ gain, sources, volumes });
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
