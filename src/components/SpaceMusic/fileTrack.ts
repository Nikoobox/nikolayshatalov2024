const FADE_IN = 2.5;

export class FileTrack {
  private audio: HTMLAudioElement | null = null;
  private ctx: AudioContext | null = null;
  private gain: GainNode | null = null;
  playing = false;

  constructor(private src: string) {}

  private setup() {
    const audio = Object.assign(new Audio(this.src), { loop: true });
    const ctx = new AudioContext();
    const gain = ctx.createGain();
    ctx.createMediaElementSource(audio).connect(gain).connect(ctx.destination);
    this.audio = audio;
    this.ctx = ctx;
    this.gain = gain;
  }

  async play() {
    if (this.playing) return;
    const { audioSession } = navigator as Navigator & {
      audioSession?: { type: string };
    };
    if (audioSession) audioSession.type = "playback";
    if (!this.ctx) this.setup();
    const ctx = this.ctx!;
    const now = ctx.currentTime;
    this.gain!.gain.cancelScheduledValues(now);
    this.gain!.gain.setValueAtTime(0.35, now);
    this.gain!.gain.linearRampToValueAtTime(1, now + FADE_IN);
    this.playing = true;
    try {
      await ctx.resume();
      await this.audio!.play();
    } catch {
      this.playing = false;
    }
  }

  pause() {
    if (!this.playing) return;
    this.playing = false;
    this.audio?.pause();
  }

  dispose() {
    this.audio?.pause();
    this.ctx?.close();
    this.audio = null;
    this.ctx = null;
    this.gain = null;
    this.playing = false;
  }
}
