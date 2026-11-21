import React, { useEffect, useMemo, useRef, useState } from "react";
import "@fontsource/fraunces/600.css";
import "@fontsource/fraunces/400-italic.css";
import "./works.css";
import { works } from "../content/works";
import { tx } from "../content/i18n";
import { TechIcon, techIcon } from "./techIcons";
import { reducedMotion } from "./art";
import { IvyBorder } from "./IvyBorder";
import { JungleCover, Foliage } from "./jungle";
import { LEAF } from "../Vine";

// Works: one project at a time in a dark jungle clearing. Screenshot, title and
// links on the left; the story and the stack on the right. Moving between projects
// slides the old one out and the new one in from the side you're heading to.

const OUT_MS = 520;   // how long a leaving project lingers while the next one arrives
const pad = (n) => String(n).padStart(2, "0");
const host = (url) => { try { return new URL(url).host.replace(/^www\./, ""); } catch { return ""; } };
const slug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const GitHubMark = () => <svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" stroke="none" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>;
const Arrow = ({ dir = 1 }) => <svg viewBox="0 0 16 16" aria-hidden="true"><path d={dir > 0 ? "M3 8h10M9 4l4 4-4 4" : "M13 8H3M7 4L3 8l4 4"} /></svg>;
const Outward = () => <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 11l6-6M6 5h5v5" /></svg>;

// Renders the leaving project (fading out) and the arriving one together, stacked
// in the same grid cell so nothing jumps.
function Crossfade({ state, items, className = "", children }) {
  const { index, prev } = state;
  return <div className={"wk-xfade " + className}>
    {prev !== null && prev !== index && <div key={"out-" + prev + "-" + index} className="wk-layer is-out" aria-hidden="true">{children(items[prev], prev)}</div>}
    <div key={"in-" + index} className="wk-layer is-in">{children(items[index], index)}</div>
  </div>;
}

function LinkButton({ href, primary, label, icon, t }) {
  const ok = Boolean(href);
  return <a className={"wk-btn" + (primary ? " wk-btn--primary" : "") + (ok ? "" : " is-off")}
    href={ok ? href : undefined} target={ok ? "_blank" : undefined} rel={ok ? "noreferrer" : undefined}
    aria-disabled={ok ? undefined : "true"} title={ok ? undefined : t.ui.noLink}>
    {icon}<span>{label}</span>
  </a>;
}

// The pager: a vine running along the bottom with a leaf pair at each project and
// a glowing bud that glides to the current one.
function VinePager({ index, items, onPick }) {
  const gap = 46, width = gap * (items.length - 1) + 24;
  let stem = "M0 14";
  for (let x = 4; x <= width; x += 4) stem += ` L${x} ${(14 + Math.sin(x / 14) * 3).toFixed(1)}`;
  return <div className="wk-pager" style={{ width }}>
    <svg width={width} height="28" aria-hidden="true">
      <path className="wk-pager-stem" d={stem} />
      {items.map((_, i) => {
        const x = 12 + i * gap, y = 14 + Math.sin(x / 14) * 3;
        return <g key={i} className={i === index ? "is-on" : ""}>
          <path className="wk-pager-leaf" d={LEAF} transform={`translate(${x} ${y}) rotate(-120) scale(1.5)`} />
          <path className="wk-pager-leaf" d={LEAF} transform={`translate(${x} ${y}) rotate(-60) scale(1.5)`} />
        </g>;
      })}
    </svg>
    <span className="wk-pager-bud" aria-hidden="true"
      style={{ transform: `translate(${12 + index * gap}px, ${(Math.sin((12 + index * gap) / 14) * 3).toFixed(1)}px)` }} />
    {items.map((w, i) => <button key={i} className="wk-pager-hit" style={{ left: 12 + i * gap }} onClick={() => onPick(i)}
      aria-label={w.title} aria-current={i === index || undefined} title={w.title} />)}
  </div>;
}

export default function Works({ t, language }) {
  const page = useRef(null);
  const flies = useRef(null);
  const rtl = language === "ar";
  const [state, setState] = useState({ index: 0, prev: null, dir: 1 });
  // The projects in the current language (the address bar keeps an English slug).
  const items = useMemo(() => works.map((w) => ({
    ...w,
    title: tx(w.title, language), role: tx(w.role, language), year: tx(w.year, language),
    description: [].concat(tx(w.description || w.text || "", language)),
    slug: slug(tx(w.title, "en")),
  })), [language]);
  const work = items[state.index];

  function go(to, dir) {
    setState((s) => {
      const next = (to + works.length) % works.length;
      if (next === s.index) return s;
      return { index: next, prev: s.index, dir: dir ?? (next > s.index ? 1 : -1) };
    });
  }
  const step = (dir) => go(state.index + dir, dir);

  // Once the leaving project has faded, drop it.
  useEffect(() => {
    if (state.prev === null) return;
    const timer = setTimeout(() => setState((s) => ({ ...s, prev: null })), reducedMotion() ? 0 : OUT_MS + 80);
    return () => clearTimeout(timer);
  }, [state.index]);

  // Let the story panel scroll only when the current project's text doesn't fit.
  useEffect(() => {
    const info = page.current.querySelector(".wk-info");
    const layer = info.querySelector(".wk-layer.is-in");
    const check = () => {
      const cs = getComputedStyle(info);
      // The bottom padding can take a few pixels of text before it's worth a scrollbar.
      const room = info.clientHeight - parseFloat(cs.paddingTop);
      info.classList.toggle("is-scroll", layer.offsetHeight > room + 1);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(info);
    ro.observe(layer);
    return () => ro.disconnect();
  }, [state.index]);

  // Keyboard: ← → move between projects.
  useEffect(() => {
    const key = (event) => {
      // Next is to the right, or to the left in Arabic.
      if (event.key === "ArrowRight") { event.preventDefault(); step(rtl ? -1 : 1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); step(rtl ? 1 : -1); }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });

  // Swipe the screenshot left or right.
  const swipe = useRef(null);
  const swipeHandlers = {
    onPointerDown: (e) => { if (e.button === 0) swipe.current = { x: e.clientX, y: e.clientY }; },
    onPointerUp: (e) => {
      const s = swipe.current; swipe.current = null;
      if (!s) return;
      const dx = e.clientX - s.x, dy = e.clientY - s.y;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
    },
    onPointerCancel: () => { swipe.current = null; },
  };

  // Ambient life: fireflies drifting and blinking, and leaves that shift a little
  // with the pointer (parallax).
  useEffect(() => {
    const el = page.current, canvas = flies.current, ctx = canvas.getContext("2d");
    const reduce = reducedMotion();
    let w = 0, h = 0, frame = 0, last = performance.now();
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const bugs = Array.from({ length: 22 }, () => ({
      x: Math.random(), y: Math.random(), a: Math.random() * 6.3, s: 6 + Math.random() * 10,
      blink: 2 + Math.random() * 4, phase: Math.random() * 6.3, r: 1 + Math.random() * 1.2,
    }));
    const resize = () => {
      const d = Math.min(devicePixelRatio || 1, 2);
      w = el.clientWidth; h = el.clientHeight;
      canvas.width = w * d; canvas.height = h * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    const move = (e) => {
      const box = el.getBoundingClientRect();
      pointer.tx = ((e.clientX - box.left) / box.width - 0.5) * 2;
      pointer.ty = ((e.clientY - box.top) / box.height - 0.5) * 2;
    };
    const tick = (now) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!reduce) {
        pointer.x += (pointer.tx - pointer.x) * (1 - Math.exp(-3 * dt));
        pointer.y += (pointer.ty - pointer.y) * (1 - Math.exp(-3 * dt));
        el.style.setProperty("--mx", pointer.x.toFixed(3));
        el.style.setProperty("--my", pointer.y.toFixed(3));
      }
      ctx.clearRect(0, 0, w, h);
      for (const b of bugs) {
        if (!reduce) {
          b.a += (Math.sin(now / 1700 + b.phase) * 0.9) * dt;
          b.x += (Math.cos(b.a) * b.s * dt) / w;
          b.y += (Math.sin(b.a) * b.s * dt) / h;
          if (b.x < -0.02) b.x = 1.02; else if (b.x > 1.02) b.x = -0.02;
          if (b.y < -0.02) b.y = 1.02; else if (b.y > 1.02) b.y = -0.02;
        }
        const glow = reduce ? 0.5 : Math.max(0, Math.sin((now / 1000) * (6.3 / b.blink) + b.phase)) ** 3;
        if (glow < 0.02) continue;
        const x = b.x * w, y = b.y * h;
        const g = ctx.createRadialGradient(x, y, 0, x, y, b.r * 7);
        g.addColorStop(0, `rgba(226, 255, 150, ${0.75 * glow})`);
        g.addColorStop(0.25, `rgba(190, 240, 90, ${0.25 * glow})`);
        g.addColorStop(1, "rgba(160, 230, 70, 0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, b.r * 7, 0, Math.PI * 2); ctx.fill();
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    el.addEventListener("pointermove", move);
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); ro.disconnect(); el.removeEventListener("pointermove", move); };
  }, []);

  // --dir: which side the next project arrives from (mirrored in Arabic).
  return <div className="page wk" ref={page} style={{ "--hue": work.hue ?? 140, "--dir": state.dir * (rtl ? -1 : 1) }}>
    <div className="wk-bg" aria-hidden="true">
      <div className="wk-rays" />
      <div className="wk-glow" />
      <Foliage corner="tl" seed={3} size={300} className="wk-leaves wk-leaves--far" />
      <Foliage corner="br" seed={7} size={420} className="wk-leaves wk-leaves--near" />
      <Foliage corner="tr" seed={11} size={260} className="wk-leaves wk-leaves--far" />
      <Foliage corner="bl" seed={5} size={340} className="wk-leaves wk-leaves--near" />
    </div>
    <canvas className="wk-flies" ref={flies} aria-hidden="true" />

    <section className="wk-left">
      <div className="wk-shot-area">
        <figure className="wk-frame" {...swipeHandlers}>
          <div className="wk-bar" aria-hidden="true">
            <i /><i /><i />
            <Crossfade state={state} items={items} className="wk-url">{(w) => <span>{host(w.link) || w.slug + ".dev"}</span>}</Crossfade>
          </div>
          <Crossfade state={state} items={items} className="wk-screens">
            {(w, i) => w.image
              ? <img className="wk-shot" src={w.image} alt={w.title} draggable="false" />
              : <JungleCover hue={w.hue} seed={i + 1} title={w.title} />}
          </Crossfade>
          <div className="wk-frame-ivy" aria-hidden="true">
            <IvyBorder seed={42} inset={9} radius={16} band={0.75}
              strands={[{ at: 0.9, length: 0.17, dir: 1 }, { at: 0.4, length: 0.15, dir: 1 }, { at: 0.64, length: 0.06, dir: -1 }]} />
          </div>
        </figure>
      </div>
      <div className="wk-head">
        <Crossfade state={state} items={items} className="wk-titles">
          {(w) => <>
            <h2 className="wk-title">{w.title}</h2>
            <p className="wk-meta">{[w.role, w.year].filter(Boolean).map((part, k) => <React.Fragment key={k}>
              {k > 0 && <i aria-hidden="true">·</i>}{part}
            </React.Fragment>)}</p>
          </>}
        </Crossfade>
        <div className="wk-actions">
          <LinkButton t={t} href={work.github} label={t.ui.github} icon={<GitHubMark />} />
          <LinkButton t={t} href={work.link} primary label={t.ui.visit} icon={<Outward />} />
        </div>
      </div>
    </section>

    <section className="wk-right">
      <Crossfade state={state} items={items} className="wk-info">
        {(w, i) => <>
          <div className="wk-count" style={{ "--i": 0 }}>
            <span className="wk-num">{pad(i + 1)}</span>
            <span className="wk-of">/ {pad(works.length)}</span>
          </div>
          <h3 className="wk-label" style={{ "--i": 1 }}>{t.ui.theProject}</h3>
          <div className="wk-desc" style={{ "--i": 2 }}>
            {w.description.map((p, k) => <p key={k}>{p}</p>)}
          </div>
          <h3 className="wk-label" style={{ "--i": 3 }}>{t.ui.stack}</h3>
          <ul className="wk-stack" style={{ "--i": 4 }}>
            {(w.stack || w.tags || []).map((s, k) => <li key={k} style={{ "--c": k }}>
              {techIcon(s) ? <TechIcon name={s} /> : <i aria-hidden="true" />}{s}
            </li>)}
          </ul>
        </>}
      </Crossfade>
    </section>

    <nav className="wk-nav" aria-label={t.apps.Works[0]}>
      <button className="wk-arrow" onClick={() => step(-1)} aria-label={t.ui.prevWork} title={t.ui.prevWork}><Arrow dir={-1} /></button>
      <VinePager index={state.index} items={items} onPick={(i) => go(i)} />
      <button className="wk-arrow" onClick={() => step(1)} aria-label={t.ui.nextWork} title={t.ui.nextWork}><Arrow dir={1} /></button>
    </nav>
  </div>;
}
