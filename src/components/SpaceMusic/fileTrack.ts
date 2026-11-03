const FADE_IN = 2.5;

export class FileTrack {
  private audio: HTMLAudioElement | null = null;
  private ctx: AudioContext | null = null;
  private gain: GainNode | null = null;
  private repeat = false;
  playing = false;
  onEnded?: () => void;

  constructor(private src: string) {}

  currentTime() {
    return this.audio?.currentTime ?? 0;
  }

  setRepeat(repeat: boolean) {
    this.repeat = repeat;
    if (this.audio) this.audio.loop = repeat;
  }

  private setup() {
    const audio = Object.assign(new Audio(this.src), { loop: this.repeat });
    audio.onended = () => {
      this.playing = false;
      this.onEnded?.();
    };
    const ctx = new AudioContext();
    const gain = ctx.createGain();
    ctx.createMediaElementSource(audio).connect(gain).connect(ctx.destination);
    this.audio = audio;
    this.ctx = ctx;
    this.gain = gain;
  }

  async play(delay = 0) {
    if (this.playing) return;
    const { audioSession } = navigator as Navigator & {
      audioSession?: { type: string };
    };
    if (audioSession) audioSession.type = "playback";
    if (!this.ctx) this.setup();
    const ctx = this.ctx!;
    const now = ctx.currentTime;
    const start = now + delay;
    const audio = this.audio!;
    const position = audio.currentTime;
    this.gain!.gain.cancelScheduledValues(now);
    this.gain!.gain.setValueAtTime(0, now);
    this.gain!.gain.setValueAtTime(0.35, start);
    this.gain!.gain.linearRampToValueAtTime(1, start + FADE_IN);
    this.playing = true;
    try {
      await Promise.all([ctx.resume(), audio.play()]);
    } catch {
      this.playing = false;
      return;
    }
    if (delay > 0) {
      window.setTimeout(
        () => {
          if (this.audio === audio && this.playing) {
            audio.currentTime = position;
          }
        },
        Math.max(0, delay * 1000 - 100),
      );
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
