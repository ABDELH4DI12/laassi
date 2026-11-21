import React from "react";

// Ivy that climbs down the dock and wraps one icon. Drawn twice: a dark resting
// copy, and a lit copy whose strokes are revealed from the trunk outward on hover.
export const stems = [
  "M5 0C2 18 8 36 4 54S6 70 5 78",
  "M4.6 30C9 29 8 21 10 14S17 3 24 3.6C28 4 29 7.4 26.4 8.6",
  "M4.4 60C10 56 13 46.6 28 46C39 45.6 47 41 49 31S47 18 44 16.4",
  "M44 16.4C46 13 51 12 52 15",
];
export const leaves = [
  [6.6, 20, -40], [14, 6.6, 20], [20.4, 2.6, -18], [12, 47.4, 10],
  [21, 45.4, -10], [37, 44.6, 18], [47.8, 37, -70], [49.6, 25, -110],
  [2.6, 44, 200], [6.6, 70, -20],
];
export const buds = [[26.4, 8.6], [52, 15], [7.6, 9]];

export const LEAF = "M0 0q2.2-2.6 5 0q-2.6 2.4-5 0z";

function Ivy({ className }) {
  return <g className={className}>
    {stems.map((d, i) => <path key={i} d={d} pathLength="1" style={{ "--i": i }} />)}
    {leaves.map(([x, y, r], i) =>
      <path key={i} className="leaf" style={{ "--i": i }} d={LEAF}
        transform={`translate(${x} ${y}) rotate(${r})`} />)}
    {buds.map(([x, y], i) => <circle key={i} className="bud" style={{ "--i": i }} cx={x} cy={y} r="1.3" />)}
  </g>;
}

export function Vine() {
  return <svg className="vine" viewBox="0 0 56 78" preserveAspectRatio="none" aria-hidden="true">
    <Ivy className="vine-rest" />
    <Ivy className="vine-lit" />
  </svg>;
}
