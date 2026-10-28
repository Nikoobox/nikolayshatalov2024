// A looping song from /public, with the same play/pause/dispose shape as the
// synth engine so the player can switch between them. The files are already
// mastered down to the synth's quiet background level.
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

  // pausing keeps the position, so the song picks up where it left off
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
