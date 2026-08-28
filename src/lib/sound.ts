/* Tiny WebAudio synth for cat noises. All calls are safe no-ops on failure. */

let ctx: AudioContext | null = null;
let muted = false;

export function setMuted(m: boolean) {
  muted = m;
}

export function isMuted() {
  return muted;
}

function ac(): AudioContext | null {
  try {
    if (!ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(
  type: OscillatorType,
  f0: number,
  f1: number,
  dur: number,
  peak: number,
  delay = 0
) {
  const c = ac();
  if (!c || muted) return;
  try {
    const t0 = c.currentTime + delay;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(f0, t0);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t0 + dur);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  } catch {
    /* noop */
  }
}

/** short curious "mew" */
export function meow() {
  tone("triangle", 620, 990, 0.12, 0.09);
  tone("triangle", 940, 520, 0.16, 0.08, 0.11);
}

/** soft rumble */
export function purr() {
  tone("sine", 96, 72, 0.28, 0.07);
  tone("sine", 190, 150, 0.28, 0.035, 0.02);
}

/** quick nose honk */
export function boop() {
  tone("square", 340, 130, 0.13, 0.05);
}

/** tiny chime for milestones */
export function chime() {
  tone("sine", 660, 660, 0.14, 0.055);
  tone("sine", 880, 880, 0.2, 0.055, 0.1);
  tone("sine", 1320, 1320, 0.26, 0.04, 0.2);
}
