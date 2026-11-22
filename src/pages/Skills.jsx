import React, { useEffect, useMemo, useRef, useState } from "react";
import "./grove.css";
import "./skills.css";
import { profile } from "../content/profile";
import { tx } from "../content/i18n";
import { techIcon, brightBrand } from "./techIcons";
import { LEAF } from "../Vine";
import { Fireflies } from "./Fireflies";
import { reducedMotion } from "./art";

// Skills: pick an area on the left; it blooms on the right as a glowing seed with
// vines growing out to each skill. A skill is a glass orb with its logo, ringed by
// its level. Every tool drifts past in a band along the bottom.

const CYCLE = 7000;   // ms between areas while nobody is choosing

// Line glyphs for skills that aren't a brand (keyed by English name).
const GLYPHS = {
  "Cloud hosting": "M7 18h10.5a4 4 0 0 0 .5-7.97A6 6 0 0 0 6.2 9.1 4.5 4.5 0 0 0 7 18z",
  "Agile": "M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4",
  "Responsive design": "M3 5h13v10H3zM7 19h5M18 9h3v11h-3z",
  "UML": "M4 4h7v5H4zM13 15h7v5h-7zM7.5 9v8.5H13",
};
const monogram = (name) => (name.length <= 4 ? name : name.split(/\s+/).map((w) => w[0]).join("").slice(0, 3).toUpperCase());

function Logo({ skill }) {
  const en = tx(skill.name, "en");
  const icon = techIcon(en, skill.icon);
  if (icon) return <svg viewBox="0 0 24 24" className="sk-svg"><path d={icon.path} /></svg>;
  if (GLYPHS[en]) return <svg viewBox="0 0 24 24" className="sk-svg sk-glyph"><path d={GLYPHS[en]} /></svg>;
  return <span className="sk-mono">{monogram(en)}</span>;
}
const brandOf = (skill) => {
  const icon = techIcon(tx(skill.name, "en"), skill.icon);
  return icon ? brightBrand(icon.hex) : "#c8f59a";
};

// Point and heading along a quadratic curve.
const qPoint = (a, c, b, t) => [
  (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0],
  (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1],
];
const qAngle = (a, c, b, t) => Math.atan2(
  2 * (1 - t) * (c[1] - a[1]) + 2 * t * (b[1] - c[1]),
  2 * (1 - t) * (c[0] - a[0]) + 2 * t * (b[0] - c[0])) * 180 / Math.PI;

function Bloom({ group, t, language }) {
  const box = useRef(null);
  const [size, setSize] = useState(null);
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(box.current);
    return () => ro.disconnect();
  }, []);

  const layout = useMemo(() => {
    if (!size) return null;
    const { w, h } = size, n = group.items.length;
    const orb = Math.max(56, Math.min(124, Math.min(w, h) * 0.16));
    const seed = orb * 1.55;
    const cx = w / 2, cy = h / 2;
    // Leave room for the name and level above the top orb and below the bottom one.
    const ry = Math.max(orb, h / 2 - orb / 2 - 48);
    const rx = Math.min(w / 2 - orb * 0.8, ry * 1.75);
    const start = n === 2 ? 0 : -90;
    return {
      orb, seed, cx, cy,
      items: group.items.map((skill, i) => {
        const a = ((start + (360 / n) * i) * Math.PI) / 180;
        const x = cx + rx * Math.cos(a), y = cy + ry * Math.sin(a);
        // Vine from the seed's edge to the orb's edge, bowed alternately.
        const d = Math.hypot(x - cx, y - cy) || 1, ux = (x - cx) / d, uy = (y - cy) / d;
        const A = [cx + ux * seed * 0.5, cy + uy * seed * 0.5], B = [x - ux * orb * 0.52, y - uy * orb * 0.52];
        const bend = (i % 2 ? 1 : -1) * d * 0.16;
        const C = [(A[0] + B[0]) / 2 - uy * bend, (A[1] + B[1]) / 2 + ux * bend];
        const leaves = [0.38, 0.66].map((s, k) => {
          const [px, py] = qPoint(A, C, B, s);
          return { x: px, y: py, r: qAngle(A, C, B, s) + (k ? 55 : -55) };
        });
        // Orbs well above the seed carry their name on top, so the vine never crosses it.
        return { skill, x, y, up: Math.sin(a) < -0.6, path: `M${A[0].toFixed(1)} ${A[1].toFixed(1)}Q${C[0].toFixed(1)} ${C[1].toFixed(1)} ${B[0].toFixed(1)} ${B[1].toFixed(1)}`, leaves };
      }),
    };
  }, [size, group]);

  return <div className="sk-bloom" ref={box} style={layout ? { "--orb": layout.orb + "px", "--seed": layout.seed + "px" } : undefined}>
    {layout && <>
      <svg className="sk-vines" width={size.w} height={size.h} aria-hidden="true">
        {layout.items.map((it, i) => <g key={i} style={{ "--i": i }}>
          <path className="sk-vine-glow" d={it.path} pathLength="1" />
          <path className="sk-vine" d={it.path} pathLength="1" />
          {it.leaves.map((l, k) => <path key={k} className="sk-leaf" d={LEAF}
            transform={`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${l.r.toFixed(0)}) scale(1.6)`} />)}
        </g>)}
      </svg>
      <div className="sk-seed" style={{ left: layout.cx, top: layout.cy }}>
        <span className="sk-seed-ring" aria-hidden="true" />
        <strong>{tx(group.group, language)}</strong>
        <small>{group.items.length} {t.ui.skillsTotal}</small>
      </div>
      {layout.items.map((it, i) => <div key={i} className={"sk-orb" + (it.up ? " is-up" : "")} style={{ left: it.x, top: it.y, "--i": i, "--brand": brandOf(it.skill) }}
        title={`${tx(it.skill.name, language)} · ${t.ui.lvl[it.skill.level - 1]}`}>
        <span className="sk-orb-face">
          <svg className="sk-ring" viewBox="0 0 100 100" aria-hidden="true">
            <circle className="sk-ring-track" cx="50" cy="50" r="46" pathLength="100" />
            <circle className="sk-ring-fill" cx="50" cy="50" r="46" pathLength="100" style={{ "--lvl": it.skill.level * 20 }} />
          </svg>
          <Logo skill={it.skill} />
        </span>
        <span className="sk-orb-name">{tx(it.skill.name, language)}</span>
        <span className="sk-orb-level">{t.ui.lvl[it.skill.level - 1]}</span>
      </div>)}
    </>}
  </div>;
}

export default function Skills({ t, language }) {
  const groups = profile.skills;
  const [pick, setPick] = useState(0);
  const [auto, setAuto] = useState(() => !reducedMotion());
  const [hover, setHover] = useState(false);
  const group = groups[pick];
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const all = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  // Areas take turns until someone picks one; hovering the bloom holds it.
  useEffect(() => {
    if (!auto || hover) return;
    const timer = setTimeout(() => setPick((p) => (p + 1) % groups.length), CYCLE);
    return () => clearTimeout(timer);
  }, [pick, auto, hover, groups.length]);
  const choose = (i) => { setAuto(false); setPick(i); };
  useEffect(() => {
    const key = (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); choose((pick + 1) % groups.length); }
      if (e.key === "ArrowUp") { e.preventDefault(); choose((pick - 1 + groups.length) % groups.length); }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });

  return <div className="page grove sk">
    <Fireflies count={14} />
    <div className="sk-layout">
      <aside className="sk-side">
        <header className="g-head">
          <span className="g-eyebrow">{t.sections.skills}</span>
          <h2 className="g-title">{t.ui.skillsHeadline}</h2>
          <p className="g-sub"><b>{total}</b> {t.ui.skillsTotal}</p>
        </header>
        <nav className="sk-areas" aria-label={t.sections.skills}>
          {groups.map((g, i) => <button key={g.id || i} className={i === pick ? "is-on" : ""} aria-pressed={i === pick}
            onClick={() => choose(i)} style={{ "--i": i }}>
            <span className="sk-area-name">{tx(g.group, language)}</span>
            <span className="sk-area-count">{g.items.length}</span>
            {i === pick && auto && !hover && <span className="sk-area-timer" key={pick} aria-hidden="true" />}
          </button>)}
        </nav>
        {group.note && <p className="sk-note" key={pick + language}>{tx(group.note, language)}</p>}
      </aside>
      <div className="sk-stage" onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
        <Bloom key={pick} group={group} t={t} language={language} />
      </div>
    </div>
    <div className="sk-river" aria-hidden="true">
      <div className="sk-river-track" style={{ "--n": all.length }}>
        {[0, 1].map((copy) => all.map((s, i) => <span key={copy + "-" + i} className="sk-chip" style={{ "--brand": brandOf(s) }}>
          <Logo skill={s} />{tx(s.name, language)}
        </span>))}
      </div>
    </div>
  </div>;
}
