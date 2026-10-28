export class FileTrack {
  private audio: HTMLAudioElement | null = null;
  playing = false;

  constructor(private src: string) {}

  async play() {
    if (this.playing) return;
    this.audio ??= Object.assign(new Audio(this.src), { loop: true });
    this.playing = true;
    try {
      await this.audio.play();
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
    this.audio = null;
    this.playing = false;
  }
}
