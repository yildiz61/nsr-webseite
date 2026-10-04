export const clamp01 = (t: number) => Math.min(1, Math.max(0, t))
/** Bildet einen Teilbereich [from, to] eines Fortschritts auf 0–1 ab. */
export const segment = (p: number, from: number, to: number) => clamp01((p - from) / (to - from))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
export const easeOutCubic = (t: number) => 1 - (1 - t) ** 3
export const easeOutBack = (t: number) => 1 + 2.70158 * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2

/** Deterministischer Pseudo-Zufall (mulberry32) – gleiche Szene bei jedem Laden. */
export function seeded(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Farben linear mischen (#rrggbb). */
export function mixColor(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16)
  const pb = parseInt(b.slice(1), 16)
  const ch = (shift: number) => Math.round(lerp((pa >> shift) & 255, (pb >> shift) & 255, clamp01(t)))
  return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, '0')}`
}
