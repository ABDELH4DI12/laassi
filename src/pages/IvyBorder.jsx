import React, { useEffect, useMemo, useRef, useState } from "react";
import "./ivy.css";
import { LEAF } from "../Vine";
import { rng } from "./art";

// Glowing ivy (the dock's vines) grown at random around a box's border.
// Used by the Terminal window and the Works screenshot frame.

// Smooth a list of points into one SVG path (Catmull-Rom as cubic Béziers).
export function smooth(pts) {
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c = (v) => v.toFixed(1);
    d += ` C${c(p1[0] + (p2[0] - p0[0]) / 6)} ${c(p1[1] + (p2[1] - p0[1]) / 6)} ${c(p2[0] - (p3[0] - p1[0]) / 6)} ${c(p2[1] - (p3[1] - p1[1]) / 6)} ${c(p2[0])} ${c(p2[1])}`;
  }
  return d;
}

// A point on the edge, walked clockwise around a rounded rectangle inset by `m`
// (starting just after the top-left corner): [x, y, inward-normal-x, inward-normal-y].
function perimeter(w, h, m, r) {
  const a = Math.max(0, w - 2 * m - 2 * r), b = Math.max(0, h - 2 * m - 2 * r), q = (Math.PI * r) / 2;
  const arc = (cx, cy, th) => [cx + r * Math.cos(th), cy + r * Math.sin(th), -Math.cos(th), -Math.sin(th)];
  const segments = [
    [a, (s) => [m + r + s, m, 0, 1]],
    [q, (s) => arc(w - m - r, m + r, -Math.PI / 2 + s / r)],
    [b, (s) => [w - m, m + r + s, -1, 0]],
    [q, (s) => arc(w - m - r, h - m - r, s / r)],
    [a, (s) => [w - m - r - s, h - m, 0, -1]],
    [q, (s) => arc(m + r, h - m - r, Math.PI / 2 + s / r)],
    [b, (s) => [m, h - m - r - s, 1, 0]],
    [q, (s) => arc(m + r, m + r, Math.PI + s / r)],
  ];
  const total = segments.reduce((sum, [len]) => sum + len, 0);
  return {
    total,
    at(t) {
      t = ((t % total) + total) % total;
      for (const [len, f] of segments) { if (t <= len) return f(t); t -= len; }
      return segments[0][1](0);
    },
  };
}

// Strands creep along the edge (round the corners too), drifting a little in and
// out, overlapping here and leaving gaps there. Each has its own brightness,
// leaves, a curl or two reaching inward, and buds at the tips.
// Options:
//   inset, radius  where the edge runs and how round its corners are
//   strands        explicit strands [{ at, length, dir }] (fractions of the perimeter);
//                  otherwise about one strand per `spacing` px, spread round the edge
//   length         [min, max] strand length as a fraction of the perimeter
//   band           how far strands wander in from the edge (1 = Terminal size)
export function growBorderIvy(seed, w, h, { inset = 5, radius = 26, strands: fixed, spacing = 430, length = [0.08, 0.25], band = 1 } = {}) {
  const rand = rng(seed);
  const k = Math.max(0.6, Math.min(1, w / 900)) * band;
  const edge = perimeter(w, h, inset, radius);
  const P = edge.total, STEP_ALONG = 18;
  const count = fixed ? fixed.length : Math.max(5, Math.round(P / spacing));
  const strands = [];
  for (let n = 0; n < count; n++) {
    const spec = fixed?.[n];
    // Random starts are spread round the edge (with jitter) so there are no big bare stretches.
    const start = spec ? spec.at * P : ((n + rand() * 0.85) / count) * P + P * 0.03;
    const dir = spec?.dir ?? (rand() < 0.5 ? 1 : -1);
    const span = spec?.length ?? (length[0] + rand() * (length[1] - length[0]));
    const steps = Math.max(5, Math.round((P * span) / STEP_ALONG));
    const base = (5 + rand() * 11) * k, amp1 = (4 + rand() * 8) * k, amp2 = (1.5 + rand() * 4) * k;
    const f1 = 0.004 + rand() * 0.006, f2 = 0.014 + rand() * 0.012, p1 = rand() * 6.3, p2 = rand() * 6.3;
    const pts = [], normals = [];
    for (let i = 0; i <= steps; i++) {
      const s = i * STEP_ALONG;
      const [bx, by, nx, ny] = edge.at(start + dir * s);
      const off = Math.max(2, base + amp1 * Math.sin(s * f1 + p1) + amp2 * Math.sin(s * f2 + p2));
      pts.push([bx + nx * off, by + ny * off]);
      normals.push([nx, ny]);
    }
    const leaves = [], curls = [], buds = [pts[0], pts[pts.length - 1]];
    let side = rand() < 0.5 ? -1 : 1;
    for (let i = 1; i < pts.length - 1; i++) {
      const heading = Math.atan2(pts[i + 1][1] - pts[i - 1][1], pts[i + 1][0] - pts[i - 1][0]);
      if (i % 3 === 0 && rand() < 0.85) {
        leaves.push([pts[i][0], pts[i][1], ((heading + side * (0.9 + rand() * 0.6)) * 180) / Math.PI, (1.1 + rand() * 0.5) * k]);
        side = -side;
      }
      if (curls.length < 2 && i > 3 && i < pts.length - 4 && rand() < 0.06) {
        const [nx, ny] = normals[i];
        const turn = (nx * Math.sin(heading) - ny * Math.cos(heading)) > 0 ? -1 : 1;  // curl towards the inside
        let t = Math.atan2(ny, nx) - turn * 0.5, cx = pts[i][0], cy = pts[i][1];
        const curl = [[cx, cy]];
        for (let j = 0; j < 6; j++) {
          t += turn * (0.42 + j * 0.2);
          cx += Math.cos(t) * (9 - j) * k;
          cy += Math.sin(t) * (9 - j) * k;
          curl.push([cx, cy]);
        }
        curls.push(smooth(curl));
        buds.push([cx, cy]);
      }
    }
    strands.push({ d: smooth(pts), leaves, curls, buds, glow: 0.5 + rand() * 0.45 });
  }
  return strands;
}

// Fills its positioned parent. Without a `seed`, a new arrangement grows each time it mounts.
export function IvyBorder({ seed: fixedSeed, className = "", ...options }) {
  const box = useRef(null);
  const [size, setSize] = useState(null);
  const [seed] = useState(() => fixedSeed ?? ((Math.random() * 2 ** 31) | 0));
  const optionsKey = JSON.stringify(options);
  useEffect(() => {
    const ro = new ResizeObserver(([entry]) => setSize({ w: Math.round(entry.contentRect.width), h: Math.round(entry.contentRect.height) }));
    ro.observe(box.current);
    return () => ro.disconnect();
  }, []);
  const strands = useMemo(() => (size ? growBorderIvy(seed, size.w, size.h, options) : []), [seed, size, optionsKey]);
  return <div className={"ivy-border " + className} ref={box} aria-hidden="true">
    {size && <svg width={size.w} height={size.h}>
      {strands.map((s, i) => <g key={i} style={{ opacity: s.glow }}>
        <path className="ivy-stem" d={s.d} />
        {s.curls.map((d, k) => <path key={k} className="ivy-curl" d={d} />)}
        {s.leaves.map(([x, y, deg, k], j) => <path key={j} className="ivy-leaf" d={LEAF}
          transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${deg.toFixed(0)}) scale(${k.toFixed(2)})`} />)}
        {s.buds.map(([x, y], j) => <circle key={j} className="ivy-bud" cx={x.toFixed(1)} cy={y.toFixed(1)} r="1.5" />)}
      </g>)}
    </svg>}
  </div>;
}
