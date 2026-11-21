import React, { useEffect, useRef, useState } from "react";
import "@fontsource/fraunces/400-italic.css";
import "./languages-page.css";
import { profile } from "../content/profile";
import { tx, hasArabic } from "../content/i18n";
import { reducedMotion } from "./art";

const WIDTH = 0.075;   // how far either side of a station you can still hear it (dial fraction)

// Each language is a station on an old radio dial. Tune in to hear it.
export default function LanguagesPage({ t, language }) {
  const langs = profile.languages.map((l) => ({ ...l, name: tx(l.name, language), note: tx(l.note, language), hello: tx(l.hello, language) }));
  const spots = langs.map((_, i) => (langs.length === 1 ? 0.5 : 0.16 + (i * 0.68) / (langs.length - 1)));
  const [dial, setDial] = useState(0.02);
  const dialRef = useRef(dial);
  const anim = useRef(0);
  const screen = useRef(null);
  const noise = useRef(null);
  const glass = useRef(null);

  // Signal strength: 1 on a station, fading to 0 between stations.
  let nearest = 0, signal = 0;
  spots.forEach((s, i) => {
    const k = Math.max(0, 1 - Math.abs(dial - s) / WIDTH);
    if (k > signal) { signal = k; nearest = i; }
  });
  const lang = langs[nearest];
  const locked = signal > 0.92;

  const setTo = (value) => { dialRef.current = Math.min(1, Math.max(0, value)); setDial(dialRef.current); };
  // Glide the needle to a position (used for snapping and the opening sweep).
  const glide = (to, duration = 650) => {
    cancelAnimationFrame(anim.current);
    const from = dialRef.current, start = performance.now();
    if (reducedMotion()) return setTo(to);
    const step = (now) => {
      const k = Math.min(1, (now - start) / duration);
      setTo(from + (to - from) * (1 - Math.pow(1 - k, 3)));
      if (k < 1) anim.current = requestAnimationFrame(step);
    };
    anim.current = requestAnimationFrame(step);
  };
  const snap = () => {
    const i = spots.reduce((best, s, j) => (Math.abs(s - dialRef.current) < Math.abs(spots[best] - dialRef.current) ? j : best), 0);
    if (Math.abs(spots[i] - dialRef.current) < WIDTH * 1.2) glide(spots[i], 320);
  };

  // On open, sweep across the band and settle on the first station.
  useEffect(() => {
    const timer = setTimeout(() => glide(spots[0], 1400), 350);
    return () => { clearTimeout(timer); cancelAnimationFrame(anim.current); };
  }, []);

  // Static on the display, louder the further you are from a station.
  useEffect(() => {
    const c = noise.current, ctx = c.getContext("2d");
    const w = 160, h = 60;
    c.width = w; c.height = h;
    const img = ctx.createImageData(w, h);
    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const amount = Number(screen.current?.style.getPropertyValue("--static") || 0);
      if (amount < 0.02) { ctx.clearRect(0, 0, w, h); return; }
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 255;
        img.data[i] = v; img.data[i + 1] = v * 0.92; img.data[i + 2] = v * 0.8;
        img.data[i + 3] = Math.random() * 255 * amount;
      }
      ctx.putImageData(img, 0, 0);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Turning: drag the knob (any direction) or the needle, scroll, or use the arrow keys.
  function dragKnob(event) {
    event.preventDefault();
    cancelAnimationFrame(anim.current);
    const start = { x: event.clientX, y: event.clientY, v: dialRef.current };
    const move = (e) => setTo(start.v + ((e.clientX - start.x) - (e.clientY - start.y)) / 900);
    const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); snap(); };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }
  function dragNeedle(event) {
    if (event.target.closest("button")) return;
    cancelAnimationFrame(anim.current);
    const box = glass.current.getBoundingClientRect();
    const at = (e) => setTo((e.clientX - box.left - 24) / (box.width - 48));
    at(event);
    const up = () => { window.removeEventListener("pointermove", at); window.removeEventListener("pointerup", up); snap(); };
    window.addEventListener("pointermove", at);
    window.addEventListener("pointerup", up);
  }
  useEffect(() => {
    const key = (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      const dir = event.key === "ArrowRight" ? 1 : -1;
      const sorted = dir > 0 ? spots.filter((s) => s > dialRef.current + 0.01) : spots.filter((s) => s < dialRef.current - 0.01).reverse();
      if (sorted.length) glide(sorted[0], 500);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  const wheelTimer = useRef(0);
  function wheel(event) {
    cancelAnimationFrame(anim.current);
    setTo(dialRef.current + (event.deltaY || event.deltaX) / 3000);
    clearTimeout(wheelTimer.current);
    wheelTimer.current = setTimeout(snap, 220);
  }

  const mhz = (f) => (88 + f * 20).toFixed(1);
  return <div className="page radio-room" style={{ "--sig": signal.toFixed(3) }}>
    <section className="broadcast" ref={screen} style={{ "--static": (1 - signal).toFixed(3) }} aria-live="polite">
      <canvas ref={noise} className="broadcast-static" aria-hidden="true" />
      <div className="broadcast-body" style={{ opacity: Math.pow(signal, 1.6) }}>
        <p className={"broadcast-hello" + (hasArabic(lang.hello) ? " is-arabic" : "")} dir="auto">{lang.hello}</p>
        <p className="broadcast-name">{lang.name}</p>
        <div className="broadcast-meta">
          <span className="fluency" aria-label={`${t.ui.fluency}: ${lang.level} / 5`}>
            {[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= lang.level ? "on" : ""} style={{ "--h": n }} />)}
          </span>
          <span>{lang.note}</span>
        </div>
      </div>
      {signal < 0.35 && <p className="broadcast-searching">{t.ui.searching}</p>}
    </section>

    <div className="radio" onWheel={wheel}>
      <div className="radio-top" aria-hidden="true" />
      <div className="radio-face">
        <div className="speaker" aria-hidden="true">
          <div className="speaker-cloth" />
          <span className="speaker-badge">AH</span>
        </div>
        <div className="dial-panel">
          <div className="dial-glass" ref={glass} onPointerDown={dragNeedle}>
            <div className="dial-scale" aria-hidden="true">
              {Array.from({ length: 11 }, (_, i) => <span key={i} style={{ left: `calc(24px + (100% - 48px) * ${i / 10})` }}>{88 + i * 2}</span>)}
            </div>
            {langs.map((l, i) => <button key={i} className={"dial-station" + (i === nearest && locked ? " is-on" : "")}
              style={{ left: `calc(24px + (100% - 48px) * ${spots[i]})` }} onClick={() => glide(spots[i], 600)}>{l.name}</button>)}
            <div className="dial-needle" style={{ left: `calc(24px + (100% - 48px) * ${dial})` }} aria-hidden="true" />
            <span className="dial-freq" aria-hidden="true">{mhz(dial)} MHz</span>
          </div>
          <div className="dial-controls">
            <span className="magic-eye" style={{ "--eye": `${(1 - signal) * 70 + 4}deg` }} aria-hidden="true" />
            <span className="dial-label">{locked ? lang.name : t.ui.searching}</span>
            <button className="knob" style={{ "--turn": `${dial * 720}deg` }} onPointerDown={dragKnob}
              aria-label={t.ui.tuneHint} onKeyDown={(e) => e.key === "Enter" && glide(spots[(nearest + 1) % spots.length], 500)}>
              <span />
            </button>
          </div>
        </div>
      </div>
      <div className="radio-feet" aria-hidden="true"><i /><i /></div>
    </div>
    <p className="radio-hint">{t.ui.tuneHint}</p>
  </div>;
}
