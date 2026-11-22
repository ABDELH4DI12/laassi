import React, { useEffect, useRef } from "react";
import { reducedMotion } from "./art";

// Fireflies drifting and blinking over a page. Fills its positioned parent.
export function Fireflies({ count = 16 }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current, ctx = canvas.getContext("2d"), el = canvas.parentElement;
    const still = reducedMotion();
    let w = 0, h = 0, frame = 0, last = performance.now();
    const bugs = Array.from({ length: count }, () => ({
      x: Math.random(), y: Math.random(), a: Math.random() * 6.3, s: 5 + Math.random() * 9,
      blink: 2.5 + Math.random() * 4, phase: Math.random() * 6.3, r: 0.9 + Math.random() * 1.1,
    }));
    const resize = () => {
      const d = Math.min(devicePixelRatio || 1, 2);
      w = el.clientWidth; h = el.clientHeight;
      canvas.width = w * d; canvas.height = h * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    const tick = (now) => {
      frame = requestAnimationFrame(tick);
      if (document.hidden) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, w, h);
      for (const b of bugs) {
        if (!still) {
          b.a += Math.sin(now / 1700 + b.phase) * 0.9 * dt;
          b.x = (b.x + (Math.cos(b.a) * b.s * dt) / w + 1.04) % 1.04 - 0.02;
          b.y = (b.y + (Math.sin(b.a) * b.s * dt) / h + 1.04) % 1.04 - 0.02;
        }
        const glow = still ? 0.45 : Math.max(0, Math.sin((now / 1000) * (6.3 / b.blink) + b.phase)) ** 3;
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
  }, [count]);
  return <canvas className="g-flies" ref={ref} aria-hidden="true" />;
}

// Scale a block up as one piece when its window is much bigger than it was designed
// for (maximized), so it fills the space instead of floating in it. Sets --k on `content`.
export function useFitScale(box, content, max = 1.4) {
  useEffect(() => {
    const fit = () => {
      const b = box.current, c = content.current;
      if (!b || !c) return;
      const k = Math.min(max, (b.clientWidth - 140) / c.offsetWidth, (b.clientHeight - 90) / c.offsetHeight);
      c.style.setProperty("--k", k > 1.12 ? k.toFixed(3) : "1");
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(box.current);
    ro.observe(content.current);
    return () => ro.disconnect();
  }, [max]);
}
