let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  audioContext ??= new AudioContext();
  if (audioContext.state === 'suspended') void audioContext.resume();
  return audioContext;
};

export const playLabSound = (kind: 'click' | 'pour' | 'heat' | 'complete'): void => {
  const context = getAudioContext();
  if (!context) return;

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;
  const settings = {
    click: { start: 520, end: 700, duration: 0.08, volume: 0.035 },
    pour: { start: 260, end: 180, duration: 0.28, volume: 0.045 },
    heat: { start: 120, end: 165, duration: 0.2, volume: 0.04 },
    complete: { start: 440, end: 880, duration: 0.32, volume: 0.05 },
  }[kind];

  oscillator.type = kind === 'pour' ? 'sine' : 'triangle';
  oscillator.frequency.setValueAtTime(settings.start, now);
  oscillator.frequency.exponentialRampToValueAtTime(settings.end, now + settings.duration);
  gain.gain.setValueAtTime(settings.volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + settings.duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + settings.duration);
};
