import React, { useEffect, useMemo, useRef, useState } from "react";
import "./skills.css";
import { profile } from "../content/profile";
import { tx } from "../content/i18n";
import { rng, hashString, reducedMotion } from "./art";
import { techIcon, brightBrand } from "./techIcons";

const TOP = 50, BOTTOM = 92, MIN_GAP = 84;
// Star size by level: the orb holding the technology's icon grows and brightens.
const orb = (level) => 10 + level * 1.7;
// A small four-pointed sparkle for skills without an icon.
const SPARKLE = "M0 -7C.6 -2 2 -.6 7 0C2 .6 .6 2 0 7C-.6 2 -2 .6 -7 0C-2 -.6 -.6 -2 0 -7Z";

// Each skill group becomes a constellation; each skill a star (its technology's
// icon in a glowing orb) whose size and brightness show its level.
function layoutSky(groups, w, h) {
  const cols = Math.max(1, Math.min(groups.length, Math.floor(w / 230)));
  const rows = Math.ceil(groups.length / cols);
  const height = Math.max(h, TOP + BOTTOM + rows * 300);
  const cw = (w - 60) / cols, ch = (height - TOP - BOTTOM) / rows;
  return {
    height,
    groups: groups.map((g, gi) => {
      const c = gi % cols, r = Math.floor(gi / cols);
      // Seeded by the group's English name, so stars keep their places in every language.
      const rand = rng(hashString(g.key) + gi * 977);
      const lift = rows === 1 && cols > 1 ? (c % 2 ? 36 : -24) : 0;
      const x0 = 30 + c * cw, y0 = TOP + r * ch + lift, pad = 46;
      const stars = [];
      for (const skill of g.skills) {
        // Best-candidate sampling: try many spots, keep the one with the most room
        // around it (labels sit centred under the orbs, so stars side by side need
        // a label's width between them, stars above each other an orb and a label).
        let spot = null, best = -1;
        for (let k = 0; k < 48; k++) {
          const c = { x: x0 + pad + rand() * Math.max(10, cw - pad * 2), y: y0 + pad + rand() * (ch - pad * 2 - 44) };
          const room = stars.reduce((m, o) => Math.min(m, Math.max(
            Math.hypot(o.x - c.x, o.y - c.y) / MIN_GAP,
            Math.abs(o.y - c.y) / 62,
            Math.abs(o.x - c.x) / 96)), 9);
          if (room > best) { best = room; spot = c; }
          if (room >= 1.4) break;
        }
        stars.push({ ...skill, ...spot });
      }
      // Join the stars nearest-neighbour style, starting from the leftmost.
      const order = [stars.reduce((best, s, i) => (s.x < stars[best].x ? i : best), 0)];
      const used = new Set(order);
      while (used.size < stars.length) {
        const from = stars[order[order.length - 1]];
        let next = -1, dist = Infinity;
        stars.forEach((s, i) => {
          const d = Math.hypot(s.x - from.x, s.y - from.y);
          if (!used.has(i) && d < dist) { dist = d; next = i; }
        });
        used.add(next);
        order.push(next);
      }
      const edges = order.slice(1).map((b, k) => [order[k], b]);
      if (stars.length >= 4) edges.push([order[0], order[2]]);
      return {
        ...g, stars, edges,
        label: { x: stars.reduce((a, s) => a + s.x, 0) / stars.length, y: Math.max(...stars.map((s) => s.y + orb(s.level))) + 46 },
      };
    }),
  };
}

export default function Skills({ t, language }) {
  const page = useRef(null);
  const canvas = useRef(null);
  const [size, setSize] = useState({ w: 1200, h: 760 });
  const [hover, setHover] = useState(null);   // [groupIndex, starIndex]

  const groups = useMemo(() => profile.skills.map((g, gi) => ({
    key: tx(g.group, "en") || String(gi),
    name: tx(g.group, language),
    skills: g.items.map((s) => {
      const item = typeof s === "string" ? { name: s, level: 3 } : s;
      const icon = techIcon(tx(item.name, "en"), item.icon);
      return { ...item, name: tx(item.name, language), icon, brand: icon ? brightBrand(icon.hex) : "#dfe8ff" };
    }),
  })), [language]);
  const sky = useMemo(() => layoutSky(groups, size.w, size.h), [groups, size]);

  useEffect(() => {
    const ro = new ResizeObserver(([entry]) => setSize({ w: entry.contentRect.width, h: entry.contentRect.height }));
    ro.observe(page.current);
    return () => ro.disconnect();
  }, []);

  // Background: twinkling field stars, the odd shooting star, gentle parallax.
  useEffect(() => {
    const el = page.current, c = canvas.current, ctx = c.getContext("2d");
    const reduce = reducedMotion();
    let stars = [], frame = 0, w = 0, h = 0, shoot = null, nextShoot = performance.now() + 2500;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const resize = () => {
      const d = Math.min(devicePixelRatio || 1, 2);
      w = el.clientWidth; h = el.clientHeight;
      c.width = w * d; c.height = h * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      const rand = rng(42);
      stars = Array.from({ length: Math.round((w * h) / 4200) }, () => ({
        x: rand() * w, y: rand() * h, r: rand() * 1.1 + 0.2, p: rand() * 6.3, s: rand() * 1.5 + 0.4, z: rand() * 0.8 + 0.2,
      }));
    };
    const move = (event) => {
      const box = el.getBoundingClientRect();
      pointer.tx = (event.clientX - box.left) / box.width - 0.5;
      pointer.ty = (event.clientY - box.top) / box.height - 0.5;
    };
    const tick = (now) => {
      frame = requestAnimationFrame(tick);
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      el.style.setProperty("--px", (pointer.x * -14).toFixed(2) + "px");
      el.style.setProperty("--py", (pointer.y * -10).toFixed(2) + "px");
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const a = reduce ? 0.7 : 0.45 + 0.45 * Math.sin(now / 1000 * s.s + s.p);
        ctx.fillStyle = `rgba(220, 230, 255, ${a * (0.4 + s.z * 0.6)})`;
        ctx.beginPath();
        ctx.arc(s.x - pointer.x * 30 * s.z, s.y - pointer.y * 22 * s.z, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduce && !shoot && now > nextShoot) {
        shoot = { x: Math.random() * w * 0.7 + w * 0.15, y: Math.random() * h * 0.3, t: now, a: 0.5 + Math.random() * 0.4 };
      }
      if (shoot) {
        const k = (now - shoot.t) / 900;
        if (k >= 1) { shoot = null; nextShoot = now + 4000 + Math.random() * 6000; }
        else {
          const x = shoot.x + Math.cos(shoot.a) * 420 * k, y = shoot.y + Math.sin(shoot.a) * 420 * k;
          const g = ctx.createLinearGradient(x, y, x - Math.cos(shoot.a) * 120, y - Math.sin(shoot.a) * 120);
          g.addColorStop(0, `rgba(255,255,255,${1 - k})`);
          g.addColorStop(1, "rgba(255,255,255,0)");
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x - Math.cos(shoot.a) * 120, y - Math.sin(shoot.a) * 120);
          ctx.stroke();
        }
      }
    };
    resize();
    el.addEventListener("pointermove", move);
    window.addEventListener("resize", resize);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", move);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const active = hover ? sky.groups[hover[0]].stars[hover[1]] : null;
  return <div className="page sky" ref={page}>
    <canvas className="sky-field" ref={canvas} aria-hidden="true" />
    <div className="sky-scroll">
      <svg className="sky-chart" width={size.w} height={sky.height} aria-hidden="true">
        <defs>
          <radialGradient id="star-halo">
            <stop offset="0" stopColor="#dfe8ff" stopOpacity=".55" />
            <stop offset=".4" stopColor="#9fbaff" stopOpacity=".22" />
            <stop offset="1" stopColor="#6f8fff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="star-orb" cx=".38" cy=".32" r=".75">
            <stop offset="0" stopColor="#2a3f7e" />
            <stop offset=".6" stopColor="#132050" />
            <stop offset="1" stopColor="#0a1132" />
          </radialGradient>
        </defs>
        {sky.groups.map((g, gi) => <g key={gi} className={"constellation" + (hover && hover[0] !== gi ? " is-dim" : "") + (hover?.[0] === gi ? " is-lit" : "")}>
          {g.edges.map(([a, b], k) => {
            const A = g.stars[a], B = g.stars[b];
            return <line key={k} x1={A.x} y1={A.y} x2={B.x} y2={B.y} pathLength="1" style={{ "--d": gi * 0.35 + k * 0.12 }} />;
          })}
          {g.stars.map((s, si) => {
            const R = orb(s.level), icon = R * 1.12;
            return <g key={si} className={"star" + (hover?.[0] === gi && hover?.[1] === si ? " is-hover" : "")}
              transform={`translate(${s.x} ${s.y})`}
              style={{ "--tw": (si * 0.7 + gi) % 4 + "s", "--d": gi * 0.35 + si * 0.1, "--brand": s.brand, "--lvl": s.level }}
              onPointerEnter={() => setHover([gi, si])} onPointerLeave={() => setHover(null)}>
              <circle className="star-hit" r={R + 12} />
              <circle className="star-halo" r={R * 2.5} fill="url(#star-halo)" />
              <circle className="star-brand" r={R * 1.3} />
              {s.level >= 4 && <path className="star-flare" d={`M${-R * 2.4} 0H${R * 2.4}M0 ${-R * 2.4}V${R * 2.4}`} />}
              <circle className="star-orb" r={R} fill="url(#star-orb)" />
              {s.icon
                ? <path className="star-icon" d={s.icon.path} transform={`translate(${-icon / 2} ${-icon / 2}) scale(${icon / 24})`} />
                : <path className="star-spark" d={SPARKLE} transform={`scale(${R / 12})`} />}
              <text className="star-name" y={R + 16} textAnchor="middle">{s.name}</text>
            </g>;
          })}
          <text className="constellation-name" x={g.label.x} y={g.label.y} textAnchor="middle">{g.name}</text>
        </g>)}
      </svg>
      {active && <div className="sky-tip" style={{ left: active.x, top: active.y, "--r": orb(active.level) + "px", "--brand": active.brand }}>
        <strong>{active.name}</strong>
        <span className="sky-level" aria-label={`${active.level} / 5`}>
          {[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= active.level ? "on" : ""} />)}
        </span>
      </div>}
    </div>
    <div className="sky-legend">
      <span>{t.ui.magnitude}</span>
      <span className="sky-scale" aria-hidden="true">{[1, 2, 3, 4, 5].map((n) => <i key={n} style={{ "--s": n }} />)}</span>
      <span className="sky-ends"><small>{t.ui.learning}</small><small>{t.ui.expert}</small></span>
    </div>
    {/* The same content as a list, for screen readers. */}
    <ul className="visually-hidden">
      {groups.map((g) => <li key={g.name}>{g.name}: {g.skills.map((s) => `${s.name} (${s.level}/5)`).join(", ")}</li>)}
    </ul>
  </div>;
}
