import React, { useEffect, useMemo, useRef, useState } from "react";
import "@fontsource/bebas-neue";
import "./experience.css";
import { profile } from "../content/profile";
import { tx, hasArabic } from "../content/i18n";
import { reducedMotion } from "./art";

const W = 1200, H = 400;
const FLAPS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-/.&";

// Departure-board text that clatters through letters before settling.
function SplitFlap({ text, size }) {
  const target = text.toUpperCase().padEnd(size).slice(0, size);
  const [shown, setShown] = useState(target);
  useEffect(() => {
    if (reducedMotion()) { setShown(target); return; }
    const left = [...target].map((_, i) => 3 + (i % 6) + Math.floor(Math.random() * 4));
    const timer = setInterval(() => {
      let busy = false;
      setShown([...target].map((ch, i) => {
        if (left[i] <= 0) return ch;
        left[i]--; busy = true;
        return FLAPS[Math.floor(Math.random() * FLAPS.length)];
      }).join(""));
      if (!busy) clearInterval(timer);
    }, 55);
    return () => clearInterval(timer);
  }, [target]);
  return <span className="flap-row" aria-label={text}>
    {[...shown].map((ch, i) => <span key={i} className="flap" aria-hidden="true"><span key={ch}>{ch}</span></span>)}
  </span>;
}

// Arabic letters join up, so they can't sit one per flap: the whole line is one
// panel that flips over when it changes.
function FlapStrip({ text }) {
  return <span className="flap-strip" dir="rtl"><span key={text}>{text}</span></span>;
}

const Flap = ({ text, size }) => (hasArabic(text) ? <FlapStrip text={text} /> : <SplitFlap text={text} size={size} />);

export default function Experience({ t, language }) {
  const rtl = language === "ar";
  // Oldest job first along the line, then the open "next stop".
  const jobs = useMemo(() => [...profile.experience].reverse().map((job) => ({
    ...job,
    role: tx(job.role, language), place: tx(job.place, language),
    period: tx(job.period, language), text: tx(job.text, language),
  })), [language]);
  const stops = useMemo(() => [...jobs, { next: true, role: t.ui.nextStopTitle, place: "—", period: "—", text: t.ui.nextStopText }], [jobs, t]);

  // Lay the line out metro-style: horizontal runs joined by 45° diagonals.
  const { points, stations, total, solid } = useMemo(() => {
    const n = stops.length;
    const xs = stops.map((_, i) => 110 + (i * (W - 220)) / Math.max(1, n - 1));
    const ys = stops.map((_, i) => (i % 2 ? 268 : 140));
    const pts = [[xs[0], ys[0]]];
    const at = [0];
    let len = 0;
    for (let i = 1; i < n; i++) {
      const [px, py] = [xs[i - 1], ys[i - 1]];
      const dx = xs[i] - px, dy = ys[i] - py, diag = Math.abs(dy);
      const flat = Math.max(0, (dx - diag) / 2);
      pts.push([px + flat, py], [px + flat + diag, ys[i]], [xs[i], ys[i]]);
      len += flat * 2 + diag * Math.SQRT2;
      at.push(len);
    }
    return {
      points: pts,
      stations: stops.map((s, i) => ({ ...s, x: xs[i], y: ys[i], at: at[i] })),
      total: len,
      solid: pts.slice(0, 1 + Math.max(0, n - 2) * 3), // up to the last real job; the rest is dashed
    };
  }, [stops]);

  // Start on the current job (or the latest one); the train drives there from the first station.
  const currentIndex = jobs.findIndex((j) => j.current);
  const [selected, setSelected] = useState(currentIndex >= 0 ? currentIndex : Math.max(0, jobs.length - 1));
  const path = useRef(null);
  const train = useRef(null);
  const travel = useRef({ s: 0, target: 0 });

  // Drive the train along the line to the selected station.
  useEffect(() => {
    const state = travel.current;
    // Pull in just beside the platform so the station marker doesn't hide the train.
    const at = stations[selected].at;
    state.target = at > 34 ? at - 34 : at + 34;
    const from = state.s, to = state.target;
    const duration = reducedMotion() ? 0 : Math.min(2200, 500 + Math.abs(to - from) * 2.2);
    const start = performance.now();
    let frame = 0;
    const place = () => {
      const el = path.current, car = train.current;
      if (!el || !car) return;
      const p = el.getPointAtLength(state.s);
      const q = el.getPointAtLength(Math.min(total, state.s + 1));
      const r = el.getPointAtLength(Math.max(0, state.s - 1));
      const angle = (Math.atan2(q.y - r.y, q.x - r.x) * 180) / Math.PI;
      car.setAttribute("transform", `translate(${p.x} ${p.y}) rotate(${angle})`);
    };
    const step = (now) => {
      const k = duration ? Math.min(1, (now - start) / duration) : 1;
      const ease = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      state.s = from + (to - from) * ease;
      place();
      if (k < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [selected, stations, total]);

  // ← → move along the line (mirrored in Arabic, where the line runs right to left).
  useEffect(() => {
    const key = (event) => {
      const forward = rtl ? "ArrowLeft" : "ArrowRight", back = rtl ? "ArrowRight" : "ArrowLeft";
      if (event.key === forward) setSelected((i) => Math.min(stations.length - 1, i + 1));
      if (event.key === back) setSelected((i) => Math.max(0, i - 1));
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [stations.length, rtl]);

  const stop = stations[selected];
  const line = (pts) => pts.map((p) => p.join(",")).join(" ");
  const size = Math.max(16, ...stops.map((s) => s.role.length));
  const left = (x) => ((rtl ? W - x : x) / W) * 100 + "%";

  return <div className="page metro">
    <div className="metro-badge" aria-hidden="true"><b>L1</b><span>{t.ui.careerLine}</span></div>

    <div className="metro-map">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <g transform={rtl ? `translate(${W} 0) scale(-1 1)` : undefined}>
          <path className="metro-river" d="M-20 360 C 200 300, 330 390, 520 330 S 860 250, 1000 300 S 1180 380, 1240 330" />
          <polyline className="metro-line-glow" points={line(solid)} />
          <polyline className="metro-line" points={line(solid)} />
          <polyline className="metro-line metro-line--future" points={line(points.slice(solid.length - 1))} />
          <polyline ref={path} points={line(points)} fill="none" stroke="none" />
          <g ref={train} className="metro-train">
            <rect x="-22" y="-8" width="44" height="16" rx="8" />
            <rect className="metro-window" x="-14" y="-4" width="7" height="6" rx="1.5" />
            <rect className="metro-window" x="-4" y="-4" width="7" height="6" rx="1.5" />
            <rect className="metro-window" x="6" y="-4" width="7" height="6" rx="1.5" />
            <circle className="metro-lamp" cx="20" cy="0" r="2.4" />
          </g>
        </g>
      </svg>
      {stations.map((s, i) => <button key={i}
        className={"station" + (s.next ? " station--next" : "") + (s.current ? " station--current" : "") + (i === selected ? " is-selected" : "") + (s.y < 200 ? " station--up" : "")}
        style={{ left: left(s.x), top: (s.y / H) * 100 + "%", "--d": i }}
        onClick={() => setSelected(i)} aria-pressed={i === selected}>
        <span className="station-dot" aria-hidden="true" />
        <span className="station-label">
          <strong>{s.role}</strong>
          <small>{s.next ? t.ui.nextStop : `${s.place} · ${s.period}`}</small>
          {s.current && <em>{t.ui.hereNow}</em>}
        </span>
      </button>)}
    </div>

    <section className="board" aria-live="polite">
      <header className="board-head">
        <span>{t.ui.departures}</span>
        <span className="board-no">{String(selected + 1).padStart(2, "0")} / {String(stations.length).padStart(2, "0")}</span>
      </header>
      <dl className="board-rows">
        <div><dt>{t.ui.destination}</dt><dd><Flap text={stop.role} size={size} /></dd></div>
        <div><dt>{t.ui.operator}</dt><dd><Flap text={stop.place} size={Math.max(14, ...stops.map((s) => s.place.length))} /></dd></div>
        <div><dt>{t.ui.service}</dt><dd><Flap text={stop.period} size={14} /></dd></div>
      </dl>
      <p className="board-note" key={selected + language}>{stop.text}</p>
    </section>
  </div>;
}
