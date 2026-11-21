import React, { useEffect, useRef, useState } from "react";
import "@fontsource/fraunces/600.css";
import "@fontsource/fraunces/400-italic.css";
import "./about.css";
import { profile } from "../content/profile";
import { tx, hasArabic } from "../content/i18n";
import { reducedMotion } from "./art";

const RADIUS = 260;   // how far the lamp light reaches over the letters (px)
const PUSH = 26;      // how far a letter shies away from the light (px)

export default function About({ t, language }) {
  const page = useRef(null);
  const dust = useRef(null);
  const letters = useRef([]);
  const name = tx(profile.name, language), role = tx(profile.role, language), about = tx(profile.about, language);
  // A Latin name lights up letter by letter. Arabic letters must stay joined, so an
  // Arabic name lights up word by word.
  const arabicName = hasArabic(name);
  const parts = arabicName ? name.split(/\s+/).filter(Boolean) : [...name];
  const [typed, setTyped] = useState(reducedMotion() ? role : "");

  // The light: follows the pointer, drifts on its own when idle. Letters near it
  // fill with light and lean away from it.
  useEffect(() => {
    const el = page.current;
    const reduce = reducedMotion();
    const light = { x: el.clientWidth / 2, y: el.clientHeight * 0.28 };
    const target = { ...light };
    let idleSince = 0, frame = 0, boxes = [];
    const state = letters.current.map(() => ({ x: 0, y: 0, r: 0, g: 0 }));

    const measure = () => {
      const origin = el.getBoundingClientRect();
      const k = origin.width / el.offsetWidth || 1;   // the window may still be zooming open
      // Measure each letter's resting centre (minus its current lean).
      boxes = letters.current.map((letter, i) => {
        if (!letter) return null;
        const r = letter.getBoundingClientRect();
        return { x: (r.left - origin.left + r.width / 2) / k - state[i].x, y: (r.top - origin.top + r.height / 2) / k - state[i].y };
      });
    };
    const move = (event) => {
      const origin = el.getBoundingClientRect();
      target.x = event.clientX - origin.left;
      target.y = event.clientY - origin.top;
      idleSince = performance.now();
    };

    // Floating dust motes, brighter inside the light.
    const canvas = dust.current, ctx = canvas.getContext("2d");
    let motes = [];
    const size = () => {
      const d = Math.min(devicePixelRatio || 1, 2);
      canvas.width = el.clientWidth * d; canvas.height = el.clientHeight * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      motes = Array.from({ length: 70 }, () => ({
        x: Math.random() * el.clientWidth, y: Math.random() * el.clientHeight,
        r: Math.random() * 1.4 + 0.3, v: Math.random() * 8 + 4, p: Math.random() * Math.PI * 2,
      }));
      measure();
    };

    let last = performance.now();
    const tick = (now) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (now - idleSince > 2600) {
        // Nobody's moving the mouse: let the lamp wander slowly over the name.
        const s = now / 1000;
        target.x = el.clientWidth * (0.5 + 0.34 * Math.sin(s * 0.45));
        target.y = (boxes[0]?.y ?? el.clientHeight * 0.25) + 60 * Math.sin(s * 0.8);
      }
      const ease = 1 - Math.exp(-(reduce ? 30 : 7) * dt);
      light.x += (target.x - light.x) * ease;
      light.y += (target.y - light.y) * ease;
      el.style.setProperty("--lx", light.x + "px");
      el.style.setProperty("--ly", light.y + "px");

      letters.current.forEach((letter, i) => {
        const box = boxes[i];
        if (!letter || !box) return;
        const dx = box.x - light.x, dy = box.y - light.y;
        const d = Math.hypot(dx, dy) || 1;
        // Light reach and push scale with the letter size, so small screens stay tidy.
        const size = letter.offsetHeight || 150;
        const k = Math.max(0, 1 - d / Math.max(130, Math.min(RADIUS, size * 1.9)));
        const push = reduce ? 0 : k * k * Math.min(PUSH, size * 0.16);
        const s = state[i];
        const f = 1 - Math.exp(-10 * dt);
        s.x += ((dx / d) * push - s.x) * f;
        s.y += ((dy / d) * push * 0.6 - s.y) * f;
        s.r += ((dx / d) * k * k * (reduce ? 0 : 5) - s.r) * f;
        s.g += (k - s.g) * f;
        letter.style.transform = `translate(${s.x}px, ${s.y}px) rotate(${s.r}deg)`;
        letter.style.setProperty("--glow", s.g.toFixed(3));
      });

      ctx.clearRect(0, 0, el.clientWidth, el.clientHeight);
      for (const m of motes) {
        m.y -= m.v * dt;
        m.x += Math.sin(now / 1400 + m.p) * 6 * dt;
        if (m.y < -4) { m.y = el.clientHeight + 4; m.x = Math.random() * el.clientWidth; }
        const lit = Math.max(0, 1 - Math.hypot(m.x - light.x, m.y - light.y) / 380);
        ctx.fillStyle = `rgba(255, 214, 160, ${0.06 + lit * 0.55})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r + lit * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    size();
    document.fonts?.ready.then(measure);
    const scroller = el.querySelector(".about-scroll");
    el.addEventListener("pointermove", move);
    window.addEventListener("resize", size);
    scroller.addEventListener("scroll", measure, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", move);
      window.removeEventListener("resize", size);
      scroller.removeEventListener("scroll", measure);
    };
  }, [name]);

  // Typewriter for the role line (starts again when the language changes).
  useEffect(() => { setTyped(reducedMotion() ? role : ""); }, [role]);
  useEffect(() => {
    if (typed === role || !role.startsWith(typed)) return;
    const timer = setTimeout(() => setTyped(role.slice(0, typed.length + 1)), typed ? 38 : 700);
    return () => clearTimeout(timer);
  }, [typed, role]);

  return <div className="page about" ref={page}>
    <div className="about-light" aria-hidden="true" />
    <canvas className="about-dust" ref={dust} aria-hidden="true" />
    <div className="about-scroll">
      <h2 key={name} className={"about-name" + (arabicName ? " is-words" : "")} aria-label={name}
        style={{ "--n": arabicName ? name.length * 0.75 : parts.length }}>
        {parts.map((ch, i) => <span key={i} className="about-letter" data-ch={ch} aria-hidden="true"
          ref={(el) => (letters.current[i] = el)} style={{ "--i": i }}>{ch === " " ? "\u00a0" : ch}</span>)}
      </h2>
      <p className="about-role"><span>{typed}</span><i className="about-caret" aria-hidden="true" /></p>
      <div className="about-meta">
        <span>{tx(profile.location, language)}</span>
        {tx(profile.status, language) && <span className="about-status"><i aria-hidden="true" />{tx(profile.status, language)}</span>}
      </div>

      <div className="about-body">
        <figure className="about-portrait">
          <svg className="about-ring" viewBox="0 0 200 200" aria-hidden="true">
            <circle cx="100" cy="100" r="96" />
            {Array.from({ length: 9 }, (_, i) => {
              const a = (i / 9) * Math.PI * 2 + 0.3;
              return <path key={i} className="about-leaf" d="M0 0q4-4.6 9 0q-4.6 4.3-9 0z"
                transform={`translate(${100 + Math.cos(a) * 96} ${100 + Math.sin(a) * 96}) rotate(${(a * 180) / Math.PI + 60})`} />;
            })}
          </svg>
          <div className="about-photo">
            {profile.photo ? <img src={profile.photo} alt={name} /> : <span aria-hidden="true">{name[0]}</span>}
          </div>
        </figure>
        <div className="about-text">
          {about.map((text, i) => <p key={i} style={{ "--d": i }}>{text}</p>)}
          <dl className="about-facts">
            {profile.facts.map(([label, value], i) => <div key={i} style={{ "--d": i + about.length }}>
              <dt>{tx(label, language)}</dt><dd>{tx(value, language)}</dd>
            </div>)}
          </dl>
        </div>
      </div>
    </div>
  </div>;
}
