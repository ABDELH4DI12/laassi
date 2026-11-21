import React, { useEffect, useRef, useState } from "react";
import "@fontsource/caveat/400.css";
import "@fontsource/caveat/700.css";
import "./education.css";
import { profile } from "../content/profile";
import { tx } from "../content/i18n";
import { grain } from "./art";

const CHALKS = { white: "#f4f3ea", yellow: "#ffe58a", pink: "#ff9ec7", blue: "#9fd3ff" };

// Text that appears as if being written in chalk, one line after another.
const Write = ({ as: Tag = "span", delay, className = "", children }) =>
  <Tag className={"chalk-write " + className} style={{ "--w": delay + "s" }}>{children}</Tag>;

export default function Education({ t, language }) {
  const board = useRef(null);
  const canvas = useRef(null);
  const [chalk, setChalk] = useState("white");
  const [wiping, setWiping] = useState(false);
  const chalkRef = useRef(chalk);
  chalkRef.current = chalk;
  // Oldest first, left to right, like notes on a board.
  const entries = [...profile.education].reverse().map((e) => ({
    degree: tx(e.degree, language), school: tx(e.school, language), period: tx(e.period, language), text: tx(e.text, language),
  }));
  const today = new Date().toLocaleDateString(language, { weekday: "long", day: "numeric", month: "long" });

  // Draw on the board with grainy chalk strokes.
  useEffect(() => {
    const el = board.current, c = canvas.current, ctx = c.getContext("2d");
    let last = null;
    const resize = () => {
      const d = Math.min(devicePixelRatio || 1, 2);
      const keep = c.width ? ctx.getImageData(0, 0, c.width, c.height) : null;
      c.width = el.clientWidth * d; c.height = el.clientHeight * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      if (keep) ctx.putImageData(keep, 0, 0);
    };
    const point = (event) => {
      const box = c.getBoundingClientRect();
      return { x: event.clientX - box.left, y: event.clientY - box.top };
    };
    const stroke = (a, b) => {
      ctx.fillStyle = CHALKS[chalkRef.current];
      const steps = Math.max(1, Math.hypot(b.x - a.x, b.y - a.y) / 1.2);
      for (let i = 0; i <= steps; i++) {
        const x = a.x + ((b.x - a.x) * i) / steps, y = a.y + ((b.y - a.y) * i) / steps;
        for (let k = 0; k < 4; k++) {
          ctx.globalAlpha = 0.25 + Math.random() * 0.6;
          ctx.fillRect(x + (Math.random() - 0.5) * 4.2, y + (Math.random() - 0.5) * 4.2, 1.3, 1.3);
        }
      }
      ctx.globalAlpha = 1;
    };
    const down = (event) => {
      if (event.button !== 0) return;
      c.setPointerCapture(event.pointerId);
      last = point(event);
      stroke(last, last);
    };
    const move = (event) => {
      if (!last) return;
      const p = point(event);
      stroke(last, p);
      last = p;
    };
    const up = () => { last = null; };
    resize();
    c.addEventListener("pointerdown", down);
    c.addEventListener("pointermove", move);
    c.addEventListener("pointerup", up);
    c.addEventListener("pointercancel", up);
    window.addEventListener("resize", resize);
    return () => {
      c.removeEventListener("pointerdown", down);
      c.removeEventListener("pointermove", move);
      c.removeEventListener("pointerup", up);
      c.removeEventListener("pointercancel", up);
      window.removeEventListener("resize", resize);
    };
  }, []);

  function wipe() {
    setWiping(true);
    setTimeout(() => {
      const c = canvas.current;
      c.getContext("2d").clearRect(0, 0, c.width, c.height);
      setWiping(false);
    }, 650);
  }

  let delay = 0.3;
  const next = (step) => (delay += step);

  return <div className="page classroom">
    <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
      <filter id="chalk-grain" x="-5%" y="-10%" width="110%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="4" result="noise" />
        <feColorMatrix in="noise" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -1.6 1.45" result="holes" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.8" xChannelSelector="R" yChannelSelector="G" result="rough" />
        <feComposite in="rough" in2="holes" operator="in" />
      </filter>
    </svg>

    <div className="board-frame">
      <div className="chalkboard" ref={board} style={{ "--grain": grain }}>
        <div className="chalk-text" key={language}>
          <header className="chalk-head">
            <h2><Write delay={delay}>{t.sections.education}</Write>
              <svg className="doodle doodle-underline" viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">
                <path pathLength="1" d="M4 12 C 50 4, 90 18, 140 10 S 230 6, 296 12" style={{ "--w": next(0.9) + "s" }} />
              </svg>
            </h2>
            <Write delay={next(0.3)} className="chalk-date">{today}</Write>
          </header>

          <div className="chalk-entries">
            {entries.map((e, i) => {
              const start = next(i ? 0.6 : 0.5);
              return <section key={i} className="chalk-entry">
                <span className="chalk-period">
                  <Write delay={start}>{e.period}</Write>
                  <svg className="doodle doodle-circle" viewBox="0 0 200 70" preserveAspectRatio="none" aria-hidden="true">
                    <path pathLength="1" d="M30 12 C 70 0, 170 2, 190 30 S 120 70, 60 64 S 2 40, 22 18 S 70 4, 110 6" style={{ "--w": start + 0.6 + "s" }} />
                  </svg>
                </span>
                <Write as="h3" delay={next(0.6)}>{e.degree}</Write>
                <Write as="p" delay={next(0.6)} className="chalk-school">{e.school}</Write>
                <Write as="p" delay={next(0.5)} className="chalk-note">{e.text}</Write>
                {i < entries.length - 1 && <svg className="doodle doodle-arrow" viewBox="0 0 90 40" aria-hidden="true">
                  <path pathLength="1" d="M4 26 C 30 10, 55 10, 82 20 M70 9 L 84 20 L 68 30" style={{ "--w": next(0.4) + "s" }} />
                </svg>}
                {i === entries.length - 1 && <svg className="doodle doodle-star" viewBox="0 0 40 40" aria-hidden="true">
                  <path pathLength="1" d="M20 3 L25 15 L38 16 L28 24 L31 37 L20 30 L9 37 L12 24 L2 16 L15 15 Z" style={{ "--w": next(0.4) + "s" }} />
                </svg>}
              </section>;
            })}
          </div>
          <Write delay={next(0.6)} className="chalk-hint">{t.ui.drawHint} ✎</Write>
        </div>
        <canvas ref={canvas} className={"chalk-canvas" + (wiping ? " is-wiping" : "")} aria-hidden="true" />
        {wiping && <span className="eraser-sweep" aria-hidden="true" />}
      </div>
      <div className="chalk-tray">
        {Object.entries(CHALKS).map(([name, color]) => <button key={name} className={"chalk-stick" + (chalk === name ? " is-picked" : "")}
          style={{ "--c": color }} aria-label={t.ui.chalk[name]} title={t.ui.chalk[name]} aria-pressed={chalk === name} onClick={() => setChalk(name)} />)}
        <button className="chalk-eraser" onClick={wipe} aria-label={t.ui.erase} title={t.ui.erase}><span /></button>
      </div>
    </div>
  </div>;
}
