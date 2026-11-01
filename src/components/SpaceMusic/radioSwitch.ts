export const RADIO_SWITCH_SECONDS = 4.4;

const VOLUME = 0.6;

const SOURCES = [1, 2, 3, 4].map((n) => `/music/radio-${n}.mp3`);

let ctx: AudioContext | null = null;
let current: AudioBufferSourceNode | null = null;
let lastIndex = -1;
const files = new Map<string, Promise<ArrayBuffer | null>>();
const buffers = new Map<string, Promise<AudioBuffer | null>>();

const fetchFile = (src: string) => {
  if (!files.has(src)) {
    files.set(
      src,
      fetch(src)
        .then((response) => response.arrayBuffer())
        .catch(() => null),
    );
  }
  return files.get(src)!;
};

const pickSource = () => {
  let index = Math.floor(Math.random() * SOURCES.length);
  if (index === lastIndex) index = (index + 1) % SOURCES.length;
  lastIndex = index;
  return SOURCES[index];
};

export const preloadRadioSwitch = () => {
  SOURCES.forEach(fetchFile);
};

export const stopRadioSwitch = () => {
  const source = current;
  current = null;
  try {
    source?.stop();
  } catch {
    return;
  }
};

export const playRadioSwitch = async () => {
  const { audioSession } = navigator as Navigator & {
    audioSession?: { type: string };
  };
  if (audioSession) audioSession.type = "playback";
  stopRadioSwitch();
  const context = (ctx ??= new AudioContext());
  context.resume();
  const src = pickSource();
  if (!buffers.has(src)) {
    buffers.set(
      src,
      fetchFile(src).then((data) =>
        data ? context.decodeAudioData(data.slice(0)).catch(() => null) : null,
      ),
    );
  }
  const source = context.createBufferSource();
  current = source;
  const decoded = await buffers.get(src)!;
  if (!decoded || current !== source) return;
  source.buffer = decoded;
  const gain = context.createGain();
  gain.gain.value = VOLUME;
  source.connect(gain).connect(context.destination);
  source.start();
};
