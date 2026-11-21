import React, { useId } from "react";
import { rng } from "./art";

// Jungle artwork drawn in SVG: broad leaves, fern fronds, corner foliage, and
// an illustrated placeholder cover for projects without a screenshot.

const r1 = (v) => v.toFixed(1);

// A broad leaf pointing along +x from its stalk at the origin, with a midrib and veins.
function Leaf({ x, y, angle, length: L, width: W, fill, vein }) {
  const shape = `M0 0C${r1(L * 0.22)} ${r1(-W * 1.15)} ${r1(L * 0.72)} ${r1(-W)} ${r1(L)} 0C${r1(L * 0.72)} ${r1(W)} ${r1(L * 0.22)} ${r1(W * 1.15)} 0 0Z`;
  let veins = `M0 0Q${r1(L * 0.5)} ${r1(-W * 0.06)} ${r1(L * 0.97)} 0`;
  for (let i = 1; i <= 6; i++) {
    const t = i / 7, vx = L * t, vw = W * Math.sin(Math.PI * t) * 0.85;
    veins += `M${r1(vx - W * 0.35)} 0L${r1(vx + W * 0.2)} ${r1(-vw)}M${r1(vx - W * 0.35)} 0L${r1(vx + W * 0.2)} ${r1(vw)}`;
  }
  return <g transform={`translate(${r1(x)} ${r1(y)}) rotate(${r1(angle)})`}>
    <path d={shape} fill={fill} />
    {vein && <path d={veins} fill="none" stroke={vein} strokeWidth={Math.max(0.6, W / 26)} strokeLinecap="round" />}
  </g>;
}

// A fern frond: a gently bending stem with leaflets that shrink toward the tip.
function Frond({ x, y, angle, length: L, bend, fill, stem }) {
  const cx = L / 2, cy = bend;
  const at = (t) => [(1 - t) * (1 - t) * 0 + 2 * (1 - t) * t * cx + t * t * L, 2 * (1 - t) * t * cy];
  let leaflets = "";
  const count = 15;
  for (let i = 1; i <= count; i++) {
    const t = 0.06 + (i / count) * 0.9;
    const [px, py] = at(t), [qx, qy] = at(Math.min(1, t + 0.01));
    const heading = Math.atan2(qy - py, qx - px);
    const len = L * 0.2 * (1 - t * 0.72), wid = len * 0.2;
    for (const side of [-1, 1]) {
      const a = heading + side * 1.05;
      const ex = px + Math.cos(a) * len, ey = py + Math.sin(a) * len;
      const nx = -Math.sin(a) * wid, ny = Math.cos(a) * wid;
      const mx = (px + ex) / 2, my = (py + ey) / 2;
      leaflets += `M${r1(px)} ${r1(py)}Q${r1(mx + nx)} ${r1(my + ny)} ${r1(ex)} ${r1(ey)}Q${r1(mx - nx)} ${r1(my - ny)} ${r1(px)} ${r1(py)}Z`;
    }
  }
  return <g transform={`translate(${r1(x)} ${r1(y)}) rotate(${r1(angle)})`}>
    <path d={leaflets} fill={fill} />
    <path d={`M0 0Q${r1(cx)} ${r1(cy)} ${r1(L)} 0`} fill="none" stroke={stem || fill} strokeWidth={Math.max(0.8, L / 120)} strokeLinecap="round" />
  </g>;
}

// Leaves and fronds reaching in from the edges of a w×h box, seeded.
function grow(rand, w, h, count, palette) {
  return Array.from({ length: count }, (_, i) => {
    const edge = Math.floor(rand() * 4);
    const x = edge === 1 ? w : edge === 3 ? 0 : rand() * w;
    const y = edge === 0 ? 0 : edge === 2 ? h : rand() * h;
    const inward = Math.atan2(h / 2 - y, w / 2 - x) + (rand() - 0.5) * 1.3;
    const length = Math.min(w, h) * (0.45 + rand() * 0.45);
    const kind = rand() < 0.45 ? "frond" : "leaf";
    const colour = palette[i % palette.length];
    return { kind, x, y, angle: (inward * 180) / Math.PI, length, width: length * (0.17 + rand() * 0.08), bend: (rand() - 0.5) * length * 0.3, ...colour };
  });
}
const draw = (items) => items.map((it, i) => it.kind === "frond"
  ? <Frond key={i} {...it} />
  : <Leaf key={i} {...it} />);

// Placeholder "screenshot": sunlight through layered jungle leaves in the project's hue.
export function JungleCover({ hue = 140, seed = 1, title }) {
  const id = useId().replace(/:/g, "");
  const rand = rng(seed * 7919 + hue * 31);
  const back = grow(rand, 320, 200, 6, [
    { fill: `hsl(${hue} 38% 34% / .55)`, vein: `hsl(${hue} 50% 52% / .35)` },
    { fill: `hsl(${(hue + 18) % 360} 40% 28% / .6)`, vein: `hsl(${hue} 45% 45% / .3)` },
  ]);
  const front = grow(rand, 320, 200, 5, [
    { fill: `hsl(${hue} 45% 11% / .95)`, vein: `hsl(${hue} 40% 26% / .7)` },
    { fill: `hsl(${(hue + 25) % 360} 50% 8% / .95)`, vein: `hsl(${hue} 35% 22% / .7)`, stem: `hsl(${hue} 40% 20%)` },
  ]);
  return <div className="jungle-cover" style={{ "--cover-hue": hue }}>
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={id + "bg"} x1="0" y1="0" x2=".35" y2="1">
          <stop offset="0" stopColor={`hsl(${hue} 42% 30%)`} />
          <stop offset=".55" stopColor={`hsl(${(hue + 12) % 360} 46% 16%)`} />
          <stop offset="1" stopColor={`hsl(${(hue + 24) % 360} 50% 7%)`} />
        </linearGradient>
        <radialGradient id={id + "sun"} cx=".7" cy=".05" r=".8">
          <stop offset="0" stopColor={`hsl(${(hue + 40) % 360} 85% 82%)`} stopOpacity=".55" />
          <stop offset=".5" stopColor={`hsl(${hue} 70% 60%)`} stopOpacity=".12" />
          <stop offset="1" stopColor={`hsl(${hue} 70% 50%)`} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="200" fill={`url(#${id}bg)`} />
      {draw(back)}
      <rect width="320" height="200" fill={`url(#${id}sun)`} />
      {draw(front)}
    </svg>
    {title && <span className="jungle-cover-title">{title}</span>}
  </div>;
}

// Dark foliage clustered in a corner of the page; `corner` is "tl" | "tr" | "bl" | "br".
export function Foliage({ corner = "bl", seed = 1, size = 380, className = "" }) {
  const rand = rng(seed * 104729);
  const flipX = corner.endsWith("r"), flipY = corner.startsWith("b");
  const palette = [
    { fill: "#071a10", vein: "#163d26" },
    { fill: "#0a2215", vein: "#1d4a2e" },
    { fill: "#06140c", vein: "#14321f", stem: "#123020" },
  ];
  const items = Array.from({ length: 6 }, (_, i) => {
    const kind = rand() < 0.5 ? "frond" : "leaf";
    const angle = 8 + rand() * 74;           // fan out from the corner into the page
    const length = size * (0.5 + rand() * 0.48);
    return { kind, x: rand() * size * 0.12, y: rand() * size * 0.12, angle, length, width: length * (0.16 + rand() * 0.06), bend: (rand() - 0.5) * length * 0.35, ...palette[i % 3] };
  });
  // Mirror the cluster so it grows out of the requested corner.
  const mirror = `translate(${flipX ? size : 0} ${flipY ? size : 0}) scale(${flipX ? -1 : 1} ${flipY ? -1 : 1})`;
  return <svg className={"foliage foliage--" + corner + " " + className} viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden="true">
    <g transform={mirror}>{draw(items)}</g>
  </svg>;
}
