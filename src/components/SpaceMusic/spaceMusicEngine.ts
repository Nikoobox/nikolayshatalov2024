// Generative 80s sci-fi music (original, not a copy), built from Web Audio
// nodes so there's no audio file to host or license. A sequencer arpeggio
// behind a dark resonant filter that drifts slowly, a pulsing bass and soft
// analog pads, with a short reverb and ping-pong echoes. It loops endlessly;
// pausing just suspends the audio, so it picks up where it left off.

const A2 = 110;
const BPM = 108;
const STEP = 60 / BPM / 4;
const STEPS_PER_CHORD = 32;

// Am - F - Dm - E, two bars each; tones in semitones above the root
const CHORDS: { root: number; tones: number[] }[] = [
  { root: 0, tones: [0, 3, 7, 12, 15, 19] },
  { root: -4, tones: [0, 4, 7, 12, 16, 19] },
  { root: -7, tones: [0, 3, 7, 12, 15, 19] },
  { root: -5, tones: [0, 4, 7, 12, 16, 19] },
];
// which chord tone the arpeggio plays on each 16th of a bar
const PATTERN = [0, 2, 4, 2, 1, 3, 5, 3, 0, 2, 4, 5, 4, 2, 1, 3];

const VOLUME = 0.8;
// lifts the mix to a quiet background level after the compressor
const OUTPUT_GAIN = 1.6;
const FADE_IN = 3;
const FADE_OUT = 1.5;
const SCHEDULE_EVERY_MS = 250;
const LOOKAHEAD = 1.2;

const semitone = (hz: number, steps: number) => hz * 2 ** (steps / 12);

// short, dark room reverb
const makeImpulse = (ctx: AudioContext, seconds = 4) => {
  const length = Math.floor(ctx.sampleRate * seconds);
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 2.5;
    }
  }
  return impulse;
};

interface Send {
  pan?: number;
  reverb?: number;
  echo?: number;
}

export class SpaceMusicEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private reverb: ConvolverNode | null = null;
  private echo: DelayNode | null = null;
  private arpBus: GainNode | null = null;
  private sources: AudioScheduledSourceNode[] = [];
  private timer = 0;
  private step = 0;
  private nextStepAt = 0;
  playing = false;

  private setup() {
    const ctx = new AudioContext();
    const output = ctx.createGain();
    output.gain.value = OUTPUT_GAIN;
    output.connect(ctx.destination);
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -16;
    compressor.ratio.value = 3;
    compressor.connect(output);

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(compressor);

    const reverb = ctx.createConvolver();
    reverb.buffer = makeImpulse(ctx);
    const wet = ctx.createGain();
    wet.gain.value = 0.45;
    reverb.connect(wet).connect(master);

    // ping-pong echo on the dotted eighth: left repeat, then right, darkening
    const left = ctx.createDelay(2);
    const right = ctx.createDelay(2);
    left.delayTime.value = (60 / BPM) * 0.75;
    right.delayTime.value = (60 / BPM) * 0.75;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.35;
    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 3000;
    left.connect(right);
    right.connect(tone).connect(feedback).connect(left);
    const merger = ctx.createChannelMerger(2);
    left.connect(merger, 0, 0);
    right.connect(merger, 0, 1);
    const echoLevel = ctx.createGain();
    echoLevel.gain.value = 0.5;
    merger.connect(echoLevel);
    echoLevel.connect(master);
    echoLevel.connect(reverb);

    this.ctx = ctx;
    this.master = master;
    this.reverb = reverb;
    this.echo = left;
    this.startArpFilter();
  }

  private out(node: AudioNode, { pan = 0, reverb = 0.5, echo = 0 }: Send) {
    const ctx = this.ctx!;
    const panner = ctx.createStereoPanner();
    panner.pan.value = pan;
    node.connect(panner).connect(this.master!);
    if (reverb) {
      const send = ctx.createGain();
      send.gain.value = reverb;
      panner.connect(send).connect(this.reverb!);
    }
    if (echo) {
      const send = ctx.createGain();
      send.gain.value = echo;
      panner.connect(send).connect(this.echo!);
    }
  }

  // one resonant lowpass for the whole arpeggio, drifting between ~400Hz and
  // ~900Hz every 32s so it stays dark and never opens up
  private startArpFilter() {
    const ctx = this.ctx!;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.Q.value = 7;
    filter.frequency.value = 650;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 1 / 32;
    const depth = ctx.createGain();
    depth.gain.value = 250;
    lfo.connect(depth).connect(filter.frequency);
    lfo.start();
    const bus = ctx.createGain();
    bus.connect(filter);
    this.out(filter, { reverb: 0.35, echo: 0.45 });
    this.arpBus = bus;
    this.sources.push(lfo);
  }

  private arpNote(at: number, hz: number, accent: boolean) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = hz;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, at);
    gain.gain.linearRampToValueAtTime(accent ? 0.11 : 0.07, at + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, at + STEP * 0.95);
    osc.connect(gain).connect(this.arpBus!);
    osc.start(at);
    osc.stop(at + STEP);
  }

  // short plucked saw bass with a closing filter, on every eighth
  private bass(at: number, hz: number) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = hz;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.Q.value = 4;
    filter.frequency.setValueAtTime(700, at);
    filter.frequency.exponentialRampToValueAtTime(180, at + STEP * 1.8);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, at);
    gain.gain.linearRampToValueAtTime(0.2, at + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, at + STEP * 1.9);
    osc.connect(filter).connect(gain);
    this.out(gain, { reverb: 0.05 });
    osc.start(at);
    osc.stop(at + STEP * 2);
  }

  // analog pad: detuned saws through a lowpass that opens on the attack, with
  // vibrato fading in (CS-80 style)
  private pad(at: number, length: number, hz: number, pan: number) {
    const ctx = this.ctx!;
    const attack = 1.5;
    const release = 2;
    const end = at + length + release;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.Q.value = 2.5;
    filter.frequency.setValueAtTime(350, at);
    filter.frequency.exponentialRampToValueAtTime(1400, at + attack * 1.4);
    filter.frequency.exponentialRampToValueAtTime(900, at + attack * 1.4 + 1.5);
    filter.frequency.setValueAtTime(900, at + length);
    filter.frequency.exponentialRampToValueAtTime(350, end);
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, at);
    env.gain.linearRampToValueAtTime(0.035, at + attack);
    env.gain.setValueAtTime(0.035, at + length);
    env.gain.linearRampToValueAtTime(0, end);
    filter.connect(env);
    this.out(env, { pan, reverb: 0.6 });

    const vibrato = ctx.createOscillator();
    vibrato.frequency.value = 5.2;
    const depth = ctx.createGain();
    depth.gain.setValueAtTime(0, at);
    depth.gain.linearRampToValueAtTime(4, at + attack + 1);
    vibrato.connect(depth);
    const oscs = [-9, 9].map((detune) => {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = hz;
      osc.detune.value = detune;
      depth.connect(osc.detune);
      osc.connect(filter);
      return osc;
    });
    [...oscs, vibrato].forEach((osc) => {
      osc.start(at);
      osc.stop(end + 0.05);
    });
  }

  private scheduleStep(step: number, at: number) {
    const chord = Math.floor(step / STEPS_PER_CHORD) % CHORDS.length;
    const { root, tones } = CHORDS[chord];
    const rootHz = semitone(A2, root);
    this.arpNote(at, semitone(rootHz, tones[PATTERN[step % 16]]), step % 4 === 0);
    if (step % 2 === 0) this.bass(at, rootHz / 2);
    if (step % STEPS_PER_CHORD === 0) {
      [12, 19, 24].forEach((steps, k) =>
        this.pad(
          at,
          STEP * STEPS_PER_CHORD - 0.3,
          semitone(rootHz, steps - 12),
          (k - 1) * 0.5,
        ),
      );
    }
  }

  private schedule = () => {
    const ctx = this.ctx;
    if (!ctx) return;
    while (this.nextStepAt < ctx.currentTime + LOOKAHEAD) {
      this.scheduleStep(this.step, this.nextStepAt);
      this.step++;
      this.nextStepAt += STEP;
    }
  };

  async play() {
    if (this.playing) return;
    const isFirstPlay = !this.ctx;
    if (isFirstPlay) this.setup();
    const ctx = this.ctx!;
    await ctx.resume();
    this.playing = true;
    const now = ctx.currentTime;
    if (isFirstPlay) this.nextStepAt = now + 0.1;
    this.master!.gain.cancelScheduledValues(now);
    this.master!.gain.setValueAtTime(this.master!.gain.value, now);
    this.master!.gain.linearRampToValueAtTime(VOLUME, now + FADE_IN);
    this.schedule();
    this.timer = window.setInterval(this.schedule, SCHEDULE_EVERY_MS);
  }

  pause() {
    const ctx = this.ctx;
    if (!this.playing || !ctx) return;
    this.playing = false;
    window.clearInterval(this.timer);
    const now = ctx.currentTime;
    this.master!.gain.cancelScheduledValues(now);
    this.master!.gain.setValueAtTime(this.master!.gain.value, now);
    this.master!.gain.linearRampToValueAtTime(0, now + FADE_OUT);
    // suspending freezes the audio clock, so playback resumes in place
    window.setTimeout(
      () => {
        if (!this.playing) ctx.suspend();
      },
      FADE_OUT * 1000 + 100,
    );
  }

  dispose() {
    window.clearInterval(this.timer);
    this.sources.forEach((source) => source.stop());
    this.ctx?.close();
    this.ctx = null;
    this.playing = false;
  }
}
