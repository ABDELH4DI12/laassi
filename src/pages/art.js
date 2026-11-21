// Shared helpers for generated artwork and seeded randomness.

export function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(str) {
  let h = 2166136261;
  for (const c of String(str)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

// A generated cover: soft colour fields in a hue family, for items without an image.
export function coverStyle(hue = 200, seed = 1) {
  const r = rng(seed * 7919 + hue);
  const a = Math.round(r() * 60 + 10), b = Math.round(r() * 60 + 30);
  return {
    backgroundImage: [
      `radial-gradient(110% 80% at ${a}% ${Math.round(r() * 30)}%, hsl(${hue} 85% 62% / .95), transparent 58%)`,
      `radial-gradient(90% 70% at ${100 - a}% ${b + 50}%, hsl(${(hue + 50) % 360} 80% 46% / .9), transparent 62%)`,
      `radial-gradient(55% 45% at ${b}% ${a}%, hsl(${(hue + 320) % 360} 90% 72% / .55), transparent 70%)`,
      `linear-gradient(${Math.round(r() * 360)}deg, hsl(${hue} 45% 13%), hsl(${(hue + 40) % 360} 50% 6%))`,
    ].join(","),
  };
}

export const grain = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
