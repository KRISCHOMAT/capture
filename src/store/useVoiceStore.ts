import { create } from "zustand";
import useMasterStore from "./useMasterStore";

export interface VoiceStore {
  sources: AudioBufferSourceNode[] | null;
  env: GainNode | null;
  pitch: number;
  isPlaying: boolean;
  timeout: number;
  setPitch: (pitch: number) => void;
  play: () => void;
  stop: () => void;
  _playSample: (index: number) => void;
}

const createVoiceStore = () => {
  return create<VoiceStore>((set, get) => ({
    sources: [],
    env: null,
    pitch: 0,
    isPlaying: false,
    timeout: 0,
    setPitch: (pitch: number) => {
      if (pitch > 12) {
        set({ pitch: -12 });
      } else if (pitch < -12) {
        set({ pitch: 12 });
      } else {
        set({ pitch });
      }
    },
    play: () => {
      // create auio context if null
      if (!useMasterStore.getState().ctx) {
        const ctx = new AudioContext();
        useMasterStore.setState({ ctx });
      }

      // create env if null
      if (!get().env) {
        const ctx = useMasterStore.getState().ctx as AudioContext;
        const env = ctx.createGain();
        env.connect(ctx.destination);
        env.gain.setValueAtTime(0, ctx.currentTime);
        set({ env });
      }

      // resume if is Playing
      if (get().isPlaying) {
        clearTimeout(get().timeout);
        const env = get().env as GainNode;
        const ctx = useMasterStore.getState().ctx as AudioContext;
        const att = useMasterStore.getState().att;
        const currentGain = env.gain.value;
        env.gain.cancelScheduledValues(ctx.currentTime);
        env.gain.setValueAtTime(currentGain, ctx.currentTime);
        env.gain.linearRampToValueAtTime(1, ctx.currentTime + att);
        //else start loop
      } else {
        const env = get().env as GainNode;
        const ctx = useMasterStore.getState().ctx as AudioContext;
        const att = useMasterStore.getState().att;
        env.gain.setValueAtTime(0, ctx.currentTime);
        env.gain.linearRampToValueAtTime(1, ctx.currentTime + att);
        set({ isPlaying: true });
        for (let i = 0; i < useMasterStore.getState().numSamples; i++) {
          get()._playSample(i);
        }
      }
    },
    _playSample: (index: number) => {
      const sample = useMasterStore.getState().samples[index];

      const buf = sample.getState().audioBuffer;
      if (!buf) return;

      const ctx = useMasterStore.getState().ctx as AudioContext;
      const env = get().env as GainNode;

      const source = ctx.createBufferSource();
      source.loop = false;
      source.loopStart = sample.getState().start * buf.duration;
      source.loopEnd = sample.getState().end * buf.duration;
      const loopLength = source.loopEnd - source.loopStart;
      source.buffer = buf;
      source.playbackRate.value = Math.pow(2, get().pitch / 12);
      source.start(ctx.currentTime, sample.getState().start * buf.duration);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);

      source.connect(gain);
      gain.connect(env);

      gain.gain.linearRampToValueAtTime(
        sample.getState().vol,
        ctx.currentTime +
          (loopLength * sample.getState().att) / source.playbackRate.value
      );

      // ramp down
      const releaseTime = loopLength * (1 - sample.getState().rel);
      setTimeout(() => {
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + releaseTime);
      }, releaseTime * 1000);

      // clear source
      setTimeout(() => {
        source.stop();
        source.disconnect();
      }, loopLength * 1000);

      setTimeout(() => {
        if (get().isPlaying) {
          get()._playSample(index);
        }
      }, loopLength * 1000 * sample.getState().trig);
    },
    stop: () => {
      const env = get().env;
      const ctx = useMasterStore.getState().ctx;
      const rel = useMasterStore.getState().rel;

      if (!env || !ctx) return;
      const currentGain = env.gain.value;
      env.gain.cancelScheduledValues(ctx.currentTime);
      env.gain.setValueAtTime(currentGain, ctx.currentTime);
      env.gain.linearRampToValueAtTime(0, ctx.currentTime + rel);

      const timeout = setTimeout(() => {
        set({ isPlaying: false });
      }, rel * 1000);
      set({ timeout });
    },
  }));
};

export default createVoiceStore;
