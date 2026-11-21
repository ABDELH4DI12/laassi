import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { siOdoo } from "simple-icons";
import "./store.css";
import { store } from "../content/store";
import { tx } from "../content/i18n";
import { reducedMotion } from "./art";
import { Foliage } from "./jungle";

// Store: my Odoo addons, laid out like Odoo's own apps (an icon tile per module,
// coloured by its category) in the dark jungle. Picking one opens its module page.

// App icon per Odoo category: [hue, stroke glyph on a 24×24 grid].
const CATEGORIES = {
  sales: [28, "M3.5 13.5l7-7.5h7v7l-7.5 7a2 2 0 0 1-2.8 0L3.5 16.3a2 2 0 0 1 0-2.8z M14.5 9.5h.01"],
  crm: [205, "M4 5h16l-6 7v5.5l-4 2V12z"],
  inventory: [150, "M4 8l8-4 8 4v8l-8 4-8-4z M4 8l8 4 8-4 M12 12v8"],
  accounting: [265, "M6.5 3h11v18h-11z M9.5 7.5h5 M9.5 11.5h5 M9.5 15.5h3"],
  hr: [340, "M12 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M5 20c.8-4 3.6-6 7-6s6.2 2 7 6"],
  website: [185, "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M3 12h18 M12 3c2.6 2.6 3.8 5.6 3.8 9S14.6 18.4 12 21 M12 3C9.4 5.6 8.2 8.6 8.2 12s1.2 6.4 3.8 9"],
  pos: [45, "M3.5 6.5h17v11h-17z M3.5 10.5h17 M7 14.5h4"],
  manufacturing: [15, "M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.1-.6-.6-2.1z"],
  project: [120, "M4 4h16v16H4z M9.5 4v16 M14.5 4v9"],
  tools: [220, "M4 7h9 M17 7h3 M15 5v4 M4 17h3 M11 17h9 M9 15v4"],
};
const cat = (key) => CATEGORIES[key] || CATEGORIES.tools;

const OdooMark = () => <svg className="st-odoo" viewBox="0 0 24 24" aria-hidden="true"><path d={siOdoo.path} /></svg>;
const Outward = () => <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 11l6-6M6 5h5v5" /></svg>;
const Close = () => <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7" /></svg>;
const GitHubMark = () => <svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" stroke="none" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>;

// An Odoo-style app icon: a rounded tile in the category's colour with its glyph.
function AppIcon({ category, size = "md" }) {
  const [hue, glyph] = cat(category);
  return <span className={"st-icon st-icon--" + size} style={{ "--hue": hue }} aria-hidden="true">
    <svg viewBox="0 0 24 24"><path d={glyph} /></svg>
  </span>;
}

const Versions = ({ list }) => <span className="st-versions">{list.map((v) => <span key={v} className="st-ver">{v}</span>)}</span>;

function Card({ item, index, onOpen, t }) {
  return <button className="st-card" style={{ "--hue": cat(item.category)[0], "--d": index }}
    onClick={(e) => onOpen(index, e.currentTarget)} aria-label={`${item.name}, ${item.price}`}>
    <span className="st-card-top">
      <AppIcon category={item.category} />
      <span className="st-card-title">
        <span className="st-name">{item.name}</span>
        <code className="st-tech">{item.technical}</code>
      </span>
      {item.featured && <span className="st-badge">{t.ui.featured}</span>}
    </span>
    <span className="st-summary">{item.summary}</span>
    <span className="st-card-foot">
      <Versions list={item.versions} />
      <span className={"st-price" + (item.free ? " is-free" : "")}>{item.price}</span>
    </span>
  </button>;
}

function LinkButton({ href, primary, icon, label, t }) {
  return href
    ? <a className={"st-link" + (primary ? " st-link--primary" : "")} href={href} target="_blank" rel="noreferrer">{icon}{label}</a>
    : <span className={"st-link is-off" + (primary ? " st-link--primary" : "")} title={t.ui.noLink}>{icon}{label}</span>;
}

function Details({ item, onClose, t }) {
  const close = useRef(null);
  const o = t.ui.odoo;
  useEffect(() => {
    close.current?.focus();
    // Escape closes the module page first, before the Store window.
    const key = (event) => { if (event.key === "Escape") { event.preventDefault(); onClose(); } };
    window.addEventListener("keydown", key, true);
    return () => window.removeEventListener("keydown", key, true);
  }, [onClose]);
  return <div className="st-shade" onClick={(e) => e.target === e.currentTarget && onClose()}>
    <aside className="st-panel" style={{ "--hue": cat(item.category)[0] }} role="dialog" aria-label={item.name}>
      <button className="st-close" ref={close} onClick={onClose} aria-label={t.ui.close} title={t.ui.close}><Close /></button>
      <header className="st-panel-head">
        <AppIcon category={item.category} size="lg" />
        <div>
          <h3>{item.name}</h3>
          <code className="st-tech">{item.technical}</code>
        </div>
      </header>
      <div className="st-buy">
        <span className="st-buy-price">{item.price}</span>
        <span className="st-buy-links">
          <LinkButton t={t} href={item.github} icon={<GitHubMark />} label={o.github} />
          <LinkButton t={t} href={item.appsUrl} primary icon={<OdooMark />} label={o.apps} />
        </span>
      </div>
      {item.image && <img className="st-shot" src={item.image} alt="" />}
      <p className="st-desc">{item.description}</p>
      {item.features.length > 0 && <>
        <h4 className="st-label">{t.ui.includes}</h4>
        <ul className="st-features">{item.features.map((f, i) => <li key={i} style={{ "--i": i }}>{f}</li>)}</ul>
      </>}
      <dl className="st-meta">
        <div><dt>{o.version}</dt><dd><Versions list={item.versions} /></dd></div>
        <div><dt>{o.category}</dt><dd>{o.cats[item.category] || item.category}</dd></div>
        <div><dt>{o.license}</dt><dd>{item.license}</dd></div>
        {item.depends.length > 0 && <div><dt>{o.depends}</dt><dd className="st-deps">{item.depends.map((d) => <code key={d}>{d}</code>)}</dd></div>}
      </dl>
    </aside>
  </div>;
}

export default function Store({ t, language }) {
  const o = t.ui.odoo;
  const items = useMemo(() => store.map((it) => ({
    ...it,
    name: tx(it.name, language), price: tx(it.price, language), free: tx(it.price, "en") === "Free",
    summary: tx(it.summary, language), description: tx(it.description, language),
    features: [].concat(tx(it.features, language) || []), depends: it.depends || [], versions: it.versions || [],
  })), [language]);
  const versions = [...new Set(items.flatMap((i) => i.versions))].sort();
  const categories = [...new Set(items.map((i) => i.category))];
  const [version, setVersion] = useState(null);
  const [category, setCategory] = useState(null);
  const [open, setOpen] = useState(null);   // { index, from }
  const shown = items.map((item, index) => ({ item, index }))
    .filter(({ item }) => (!version || item.versions.includes(version)) && (!category || item.category === category));
  const page = useRef(null);
  const flies = useRef(null);

  // Closing a module page gives focus back to its card.
  const openRef = useRef(null);
  openRef.current = open;   // also pauses the fireflies while a module page is open
  const closeDetails = useCallback(() => { openRef.current?.from?.focus(); setOpen(null); }, []);

  // Fireflies drifting over the clearing, as in Works.
  useEffect(() => {
    const el = page.current, canvas = flies.current, ctx = canvas.getContext("2d");
    const reduce = reducedMotion();
    let w = 0, h = 0, frame = 0, last = performance.now();
    const bugs = Array.from({ length: 14 }, () => ({
      x: Math.random(), y: Math.random(), a: Math.random() * 6.3, s: 6 + Math.random() * 9,
      blink: 2 + Math.random() * 4, phase: Math.random() * 6.3, r: 1 + Math.random(),
    }));
    const resize = () => {
      const d = Math.min(devicePixelRatio || 1, 2);
      w = el.clientWidth; h = el.clientHeight;
      canvas.width = w * d; canvas.height = h * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    const tick = (now) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (openRef.current) return;   // hidden under the module page: don't redraw
      ctx.clearRect(0, 0, w, h);
      for (const b of bugs) {
        if (!reduce) {
          b.a += Math.sin(now / 1700 + b.phase) * 0.9 * dt;
          b.x = (b.x + (Math.cos(b.a) * b.s * dt) / w + 1.04) % 1.04 - 0.02;
          b.y = (b.y + (Math.sin(b.a) * b.s * dt) / h + 1.04) % 1.04 - 0.02;
        }
        const glow = reduce ? 0.5 : Math.max(0, Math.sin((now / 1000) * (6.3 / b.blink) + b.phase)) ** 3;
        if (glow < 0.02) continue;
        const x = b.x * w, y = b.y * h, g = ctx.createRadialGradient(x, y, 0, x, y, b.r * 7);
        g.addColorStop(0, `rgba(226, 255, 150, ${0.7 * glow})`);
        g.addColorStop(1, "rgba(160, 230, 70, 0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, b.r * 7, 0, Math.PI * 2); ctx.fill();
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); ro.disconnect(); };
  }, []);

  return <div className="page st" ref={page}>
    <div className="st-bg" aria-hidden="true">
      <div className="st-rays" />
      <Foliage corner="tr" seed={13} size={320} className="st-leaves" />
      <Foliage corner="bl" seed={17} size={360} className="st-leaves" />
    </div>
    <canvas className="st-flies" ref={flies} aria-hidden="true" />
    <div className="st-scroll">
      <header className="st-head">
        <div className="st-brand">
          <OdooMark />
          <p>{o.intro}</p>
        </div>
        <div className="st-filters">
          <div className="st-seg" role="group" aria-label={o.version}>
            {[[null, o.allVersions], ...versions.map((v) => [v, v])].map(([key, label]) =>
              <button key={key ?? "all"} aria-pressed={version === key} onClick={() => setVersion(key)}>{label}</button>)}
          </div>
          <div className="st-cats" role="group" aria-label={o.category}>
            {[null, ...categories].map((key) => <button key={key ?? "all"} aria-pressed={category === key} onClick={() => setCategory(key)}>
              {key ? <><AppIcon category={key} size="xs" />{o.cats[key] || key}</> : o.allApps}
            </button>)}
          </div>
        </div>
      </header>
      <div className="st-grid">
        {shown.map(({ item, index }, n) => <Card key={index + "-" + (version ?? "") + (category ?? "")} item={item} index={n} t={t}
          onOpen={(_, from) => setOpen({ index, from })} />)}
      </div>
    </div>
    {open && <Details item={items[open.index]} t={t} onClose={closeDetails} />}
  </div>;
}
