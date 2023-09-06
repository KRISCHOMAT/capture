export class Sample {
  name: string;
  start: number;
  end: number;
  rate: number;
  ctx: AudioContext;
  buffer: AudioBuffer | null;
  constructor(ctx: AudioContext, name: string) {
    this.name = name;
    this.start = 5;
    this.end = 0.75;
    this.rate = 1;
    this.ctx = ctx;
    this.buffer = null;
  }
  greeting() {
    console.log("hello from ", this.name);
  }

  setStart(start: number) {
    this.start = start;
  }

  setEnd(end: number) {
    this.end = end;
  }

  setRate(rate: number) {
    this.rate = rate;
  }

  setBuffer(buffer: AudioBuffer) {
    this.buffer = buffer;
  }
}

export class Sampler {
  ctx: AudioContext;
  sampleA: Sample;
  sampleB: Sample;
  sampleC: Sample;
  attack: number;
  release: number;
  isPlaying: boolean;
  constructor() {
    this.ctx = new AudioContext();
    this.sampleA = new Sample(this.ctx, "A");
    this.sampleB = new Sample(this.ctx, "B");
    this.sampleC = new Sample(this.ctx, "C");
    this.attack = 0;
    this.release = 0;
    this.isPlaying = false;
  }
  hello() {
    console.log("hello");
  }

  startPlaying() {
    this.isPlaying = true;
  }

  stopPlaying() {
    this.isPlaying = false;
  }
}

const sampler = new Sampler();

export default sampler;
