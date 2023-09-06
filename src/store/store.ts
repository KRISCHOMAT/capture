import { create } from "zustand";

export interface AppState {
  isPlaying: boolean;
  attack: number;
  release: number;
  start: number;
  end: number;
  recordingA: AudioBuffer | null;
  recordingB: AudioBuffer | null;
  recordingC: AudioBuffer | null;
  timeout: number | null;
  loopLength: number;
  setStart: (start: number) => void;
  setEnd: (end: number) => void;
  setRecordingA: (recording: AudioBuffer) => void;
  setRecordingB: (recording: AudioBuffer) => void;
  setRecordingC: (recording: AudioBuffer) => void;
}

export interface AudioNodes {
  ctx: AudioContext;
  gain: GainNode | null;
  source: AudioBufferSourceNode | null;
  semitone: number;
  startPlaying: () => void;
  stopPlaying: () => void;
  disposeSource: () => void;
  setSemitone: (semitone: number) => void;
}

const useAppState = create<AppState>((set) => ({
  isPlaying: false,
  attack: 1,
  release: 2,
  start: 0,
  end: 1,
  recordingA: null,
  recordingB: null,
  recordingC: null,
  timeout: null,
  loopLength: 5,
  setStart: (start: number) => {
    set({ start });
    const source = useAudioNodes.getState().source;
    if (source) {
      source.loopStart = start * useAppState.getState().loopLength;
    }
  },
  setEnd: (end: number) => {
    set({ end });
    const source = useAudioNodes.getState().source;
    if (source) {
      source.loopEnd = end * useAppState.getState().loopLength;
    }
  },

  setRecordingA: (recording: AudioBuffer) => set({ recordingA: recording }),
  setRecordingB: (recording: AudioBuffer) => set({ recordingB: recording }),
  setRecordingC: (recording: AudioBuffer) => set({ recordingC: recording }),
}));

const useAudioNodes = create<AudioNodes>((set, get) => ({
  ctx: new AudioContext(),
  gain: null,
  source: null,
  semitone: 0,

  startPlaying: () => {
    const ctx = get().ctx;
    const gain = get().gain || ctx.createGain();
    const source = get().source || ctx.createBufferSource();

    const buf = useAppState.getState().recordingA;

    source.loop = true;
    source.loopStart =
      useAppState.getState().start * useAppState.getState().loopLength;
    source.loopEnd =
      useAppState.getState().end * useAppState.getState().loopLength;
    if (!source.buffer) {
      source.buffer = buf;
    }
    const semitone = get().semitone;
    console.log(semitone);

    source.playbackRate.value = Math.pow(2, semitone / 12);

    const attack = useAppState.getState().attack;

    source.connect(gain);
    gain.connect(ctx.destination);
    const currentGain = useAppState.getState().isPlaying ? gain.gain.value : 0;
    gain.gain.setValueAtTime(currentGain, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(1, ctx.currentTime + attack);

    set({ gain, source });

    if (useAppState.getState().isPlaying) {
      clearTimeout(useAppState.getState().timeout as number);
    } else {
      source.start(ctx.currentTime, source.loopStart);
    }
    useAppState.setState({ isPlaying: true });
  },
  stopPlaying: () => {
    const ctx = get().ctx;
    const gain = get().gain;
    let source = get().source;

    const release = useAppState.getState().release;

    const currentGain = gain?.gain.value as number;

    gain?.gain.setValueAtTime(currentGain, ctx.currentTime);
    gain?.gain.linearRampToValueAtTime(0, ctx.currentTime + release);

    const timeout = setTimeout(() => {
      if (source) {
        source.buffer = null;
        source.stop();
        source.disconnect();
        source = null;
        set({ source: null });
      }
      useAppState.setState({ isPlaying: false });
    }, release * 1000);

    useAppState.setState({ timeout });
  },
  disposeSource: () => {
    let source = get().source;
    if (source) {
      source.buffer = null;
      source.stop();
      source.disconnect();
      source = null;
    }
  },
  setSemitone: (semitone: number) => {
    set({ semitone });
    const source = get().source;
    if (source) {
      source.playbackRate.value = Math.pow(2, semitone / 12);
    }
  },
}));

const createAudioVoice = () => {
  return create<AudioNodes>(() => ({
    ...useAudioNodes.getState(),
  }));
};

const useAudioVoiceA = createAudioVoice();
const useAudioVoiceB = createAudioVoice();
const useAudioVoiceC = createAudioVoice();
const useAudioVoiceD = createAudioVoice();
const useAudioVoiceE = createAudioVoice();

export {
  useAppState,
  useAudioVoiceA,
  useAudioVoiceB,
  useAudioVoiceC,
  useAudioVoiceD,
  useAudioVoiceE,
};
