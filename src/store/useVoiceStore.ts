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

      // resume if isPlaying
      if (get().isPlaying) {
        clearTimeout(get().timeout);
        const env = get().env as GainNode;
        const ctx = useMasterStore.getState().ctx as AudioContext;
        const att = useMasterStore.getState().att;
        const currentGain = env.gain.value;
        env.gain.cancelScheduledValues(ctx.currentTime);
        env.gain.setValueAtTime(currentGain, ctx.currentTime);
        env.gain.linearRampToValueAtTime(
          useMasterStore.getState().vol,
          ctx.currentTime + att
        );
        //else start loop
      } else {
        const env = get().env as GainNode;
        const ctx = useMasterStore.getState().ctx as AudioContext;
        const att = useMasterStore.getState().att;
        env.gain.setValueAtTime(0, ctx.currentTime);
        env.gain.linearRampToValueAtTime(
          useMasterStore.getState().vol,
          ctx.currentTime + att
        );
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
      source.loopStart = sample.getState().start * 5;
      source.loopEnd = sample.getState().end * 5;
      source.buffer = buf;
      source.playbackRate.value = Math.pow(2, get().pitch / 12);
      source.start(ctx.currentTime, sample.getState().start * 5);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);

      source.connect(gain);
      gain.connect(env);

      const loopLength =
        (source.loopEnd - source.loopStart) / source.playbackRate.value;
      const att = loopLength * sample.getState().att;
      const rel = loopLength * sample.getState().rel;
      const hold = loopLength - rel;

      gain.gain.linearRampToValueAtTime(
        sample.getState().vol,
        ctx.currentTime + att
      );

      // ramp down
      setTimeout(() => {
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + hold);
      }, hold * 1000);

      // clear source
      setTimeout(() => {
        gain.gain.setTargetAtTime(0, ctx.currentTime + loopLength, 10);
        source.stop();
        source.disconnect();
      }, loopLength * 1000);

      // retrigger
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
