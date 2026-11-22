import React, { useEffect, useRef, useState } from "react";
import "./manga.css";
import { tx } from "./content/i18n";
import kingdom from "./assets/mangas/kingdom.jpg";
import vagabond from "./assets/mangas/vagabond.jpg";
import berserk from "./assets/mangas/berserk.jpg";
import climber from "./assets/mangas/the-climber.jpg";
import monster from "./assets/mangas/monster.jpg";

// Each manga: title and author, when it started, its volumes (when it's finished or
// paused) or "ongoing", genres, and a one-line pitch. Text can be { en, fr, ar }.
const G = {
  historical: { en: "Historical", fr: "Historique", ar: "تاريخي" },
  war: { en: "War", fr: "Guerre", ar: "حرب" },
  samurai: { en: "Samurai", fr: "Samouraï", ar: "ساموراي" },
  darkFantasy: { en: "Dark fantasy", fr: "Dark fantasy", ar: "فانتازيا مظلمة" },
  action: { en: "Action", fr: "Action", ar: "أكشن" },
  drama: { en: "Drama", fr: "Drame", ar: "دراما" },
  mountaineering: { en: "Mountaineering", fr: "Alpinisme", ar: "تسلّق الجبال" },
  thriller: { en: "Thriller", fr: "Thriller", ar: "إثارة" },
  mystery: { en: "Mystery", fr: "Mystère", ar: "غموض" },
};
export const mangas = [
  { title: { en: "Kingdom", ar: "كينغدم" }, author: { en: "Yasuhisa Hara", ar: "ياسوهيسا هارا" }, cover: kingdom,
    year: "2006", status: "ongoing", genres: [G.historical, G.war],
    pitch: { en: "A war orphan's dream of becoming the greatest general under the heavens, in China's Warring States era.",
      fr: "Le rêve d’un orphelin de guerre : devenir le plus grand général sous le ciel, à l’époque des Royaumes combattants.",
      ar: "حلم يتيم حرب بأن يصبح أعظم جنرال تحت السماء، في عصر الممالك المتحاربة في الصين." } },
  { title: { en: "Vagabond", ar: "فاغابوند" }, author: { en: "Takehiko Inoue", ar: "تاكيهيكو إينوي" }, cover: vagabond,
    year: "1998", volumes: 37, status: "hiatus", genres: [G.samurai, G.historical],
    pitch: { en: "The life of Miyamoto Musashi, from reckless swordsman to a man searching for what strength really means.",
      fr: "La vie de Miyamoto Musashi, du sabreur téméraire à l’homme qui cherche le vrai sens de la force.",
      ar: "حياة مياموتو موساشي، من مبارز متهوّر إلى رجل يبحث عن المعنى الحقيقي للقوة." } },
  { title: { en: "Berserk", ar: "بيرسيرك" }, author: { en: "Kentaro Miura", ar: "كينتارو ميورا" }, cover: berserk,
    year: "1989", status: "ongoing", genres: [G.darkFantasy, G.action],
    pitch: { en: "Guts, the Black Swordsman, against a fate written in blood by the friend who betrayed him.",
      fr: "Guts, le Guerrier noir, face à un destin écrit dans le sang par l’ami qui l’a trahi.",
      ar: "غاتس، المبارز الأسود، في مواجهة قدر كتبه بالدم الصديقُ الذي خانه." } },
  { title: { en: "The Climber", fr: "Ascension", ar: "المتسلّق" }, author: { en: "Shin'ichi Sakamoto", ar: "شينئيتشي ساكاموتو" }, cover: climber,
    year: "2007", volumes: 17, status: "complete", genres: [G.mountaineering, G.drama],
    pitch: { en: "A lonely teenager finds himself on the rock face, and climbs towards the summits no one has reached.",
      fr: "Un adolescent solitaire se trouve sur la paroi, et grimpe vers des sommets que personne n’a atteints.",
      ar: "مراهق وحيد يجد نفسه على الجدار الصخري، ويتسلّق نحو قمم لم يبلغها أحد." } },
  { title: { en: "Monster", ar: "مونستر" }, author: { en: "Naoki Urasawa", ar: "ناوكي أوراساوا" }, cover: monster,
    year: "1994", volumes: 18, status: "complete", genres: [G.thriller, G.mystery],
    pitch: { en: "A surgeon saves a boy's life, and spends years hunting the monster that boy became.",
      fr: "Un chirurgien sauve la vie d’un garçon, puis passe des années à traquer le monstre qu’il est devenu.",
      ar: "جرّاح ينقذ حياة صبي، ثم يقضي سنوات في مطاردة الوحش الذي صار إليه ذلك الصبي." } },
];

// The ring repeats the list so it always looks full; turning it never ends.
const REPEAT = 4;
const CARDS = mangas.length * REPEAT;
const STEP = 360 / CARDS;
const AUTO_SPEED = -6;   // deg/s: the ring never stops turning
const FRICTION = 2.2;    // per second: how fast a flick eases back to the steady turn
const GAP = 12;          // px between neighbouring cards on the ring

const wrap = (deg) => ((deg % 360) + 540) % 360 - 180;   // -> [-180, 180)

// Pixelated copy of a cover, used for the "dissolving" side cards.
function pixelate(src, cols = 16) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const rows = Math.round(cols * img.height / img.width);
      const small = document.createElement("canvas");
      small.width = cols; small.height = rows;
      small.getContext("2d").drawImage(img, 0, 0, cols, rows);
      const big = document.createElement("canvas");
      big.width = cols * 20; big.height = rows * 20;
      const ctx = big.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(small, 0, 0, big.width, big.height);
      resolve(big.toDataURL("image/png"));
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// Random block masks: which pixel blocks show on a glitching card.
function blockMask(seed, cols = 16, rows = 22) {
  let s = seed * 9301 + 49297;
  const rand = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const c = document.createElement("canvas");
  c.width = cols * 10; c.height = rows * 10;
  const ctx = c.getContext("2d");
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++) {
      // Denser towards the edges, like the image is breaking up from the sides.
      const edge = Math.abs(x / (cols - 1) - 0.5) * 2;
      if (rand() < 0.25 + edge * 0.45) { ctx.fillStyle = "#000"; ctx.fillRect(x * 10, y * 10, 10, 10); }
    }
  return c.toDataURL("image/png");
}

export default function MangaShelf({ t, language }) {
  const stage = useRef(null);
  const ring = useRef(null);
  const floor = useRef(null);
  const cards = useRef([]);
  const [current, setCurrent] = useState(0);
  const [pixels, setPixels] = useState(null);
  const [masks] = useState(() => [1, 2, 3].map((n) => blockMask(n)));

  useEffect(() => {
    let alive = true;
    Promise.all(mangas.map((m) => pixelate(m.cover))).then((list) => alive && setPixels(list));
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const el = stage.current;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cruise = reduce ? 0 : AUTO_SPEED;
    let angle = 0, speed = cruise, target = null;
    let drag = null, frame = 0, last = performance.now(), shown = -1;

    const radius = () => {
      const w = el.querySelector(".manga-card")?.offsetWidth || 220;
      return (w / 2 + GAP) / Math.tan((STEP / 2) * Math.PI / 180);
    };
    const centreIndex = () => ((Math.round(-angle / STEP) % CARDS) + CARDS) % CARDS;
    const snapTo = (index) => { target = angle + wrap(-index * STEP - angle); speed = 0; };

    function tick(now) {
      frame = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!drag) {
        if (target !== null) {
          const diff = target - angle;
          angle += diff * (1 - Math.exp(-8 * dt));
          if (Math.abs(diff) < 0.02) { angle = target; target = null; }
        } else {
          // Any flick or stop eases back into the steady turn.
          speed += (cruise - speed) * (1 - Math.exp(-FRICTION * dt));
          angle += speed * dt;
        }
      }
      const r = radius();
      ring.current.style.transform = `translateZ(${-r}px) rotateY(${angle}deg)`;
      const size = 2 * r + 80;
      Object.assign(floor.current.style, { width: size + "px", height: size + "px", marginLeft: -size / 2 + "px", marginTop: -size / 2 + "px" });
      cards.current.forEach((card, i) => {
        if (!card) return;
        card.style.transform = `rotateY(${i * STEP}deg) translateZ(${r}px)`;
        const off = Math.min(1, Math.abs(wrap(i * STEP + angle)) / 90);
        // lit: 1 at the front, falling away round the ring.
        const lit = Math.max(0, 1 - off * 1.25);
        // side: how much violet tint, scanlines and pixel breakup to show.
        const side = Math.min(1, Math.max(0, (off - 0.11) * 3.6));
        card.style.setProperty("--lit", lit.toFixed(3));
        card.style.setProperty("--side", side.toFixed(3));
        card.style.zIndex = String(Math.round(lit * 100));
      });
      const c = centreIndex() % mangas.length;
      if (c !== shown) { shown = c; setCurrent(c); }
    }

    function down(event) {
      if (event.button !== 0) return;
      drag = { x: event.clientX, start: event.clientX, t: event.timeStamp, v: 0, moved: false };
      target = null;
      el.setPointerCapture(event.pointerId);
    }
    function move(event) {
      if (!drag) return;
      const dt = Math.max((event.timeStamp - drag.t) / 1000, 0.001);
      const delta = (event.clientX - drag.x) * 0.12;
      angle += delta;
      drag.v = drag.v * 0.6 + (delta / dt) * 0.4;
      drag.x = event.clientX;
      drag.t = event.timeStamp;
      if (Math.abs(event.clientX - drag.start) > 4) drag.moved = true;
    }
    function up(event) {
      if (!drag) return;
      const { moved, v } = drag;
      drag = null;
      if (moved) { speed = Math.max(-700, Math.min(700, v)); return; }
      const card = document.elementFromPoint(event.clientX, event.clientY)?.closest(".manga-card");
      if (card) snapTo(Number(card.dataset.index));
    }
    function wheel(event) {
      event.preventDefault();
      target = null;
      angle -= (Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY) * 0.08;
    }
    function key(event) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const base = target ?? angle;
      const index = ((Math.round(-base / STEP) + (event.key === "ArrowRight" ? 1 : -1)) % CARDS + CARDS) % CARDS;
      target = base + wrap(-index * STEP - base);
    }
    // Jump to a manga from the counter: shortest way round the ring.
    el.goTo = (n) => {
      const now = centreIndex();
      const delta = ((n - (now % mangas.length)) % mangas.length + mangas.length) % mangas.length;
      const shortest = delta > mangas.length / 2 ? delta - mangas.length : delta;
      snapTo((now + shortest + CARDS) % CARDS);
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("wheel", wheel, { passive: false });
    el.addEventListener("keydown", key);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("wheel", wheel);
      el.removeEventListener("keydown", key);
    };
  }, []);

  const title = (m) => tx(m.title, language);
  const manga = mangas[current];
  return <div className="manga-shelf">
    <div className="manga-stage" ref={stage} tabIndex={0} role="listbox"
      aria-label={t.ui.mangaShelf} aria-activedescendant={"manga-" + current}>
      <div className="manga-glow" key={current} style={{ backgroundImage: `url(${manga.cover})` }} aria-hidden="true" />
      <div className="manga-room" aria-hidden="true">
        <div className="manga-ceiling" />
        <div className="manga-beam" />
        <div className="manga-stars" />
      </div>
      <div className="manga-ring" ref={ring}>
        <div className="manga-floor" ref={floor} aria-hidden="true" />
        {Array.from({ length: CARDS }, (_, i) => {
          const k = i % mangas.length;
          const m = mangas[k];
          const real = i < mangas.length;
          const mask = `url(${masks[i % masks.length]})`;
          return <div key={i} className="manga-card" data-index={i} ref={el => (cards.current[i] = el)}
            id={real ? "manga-" + i : undefined} role={real ? "option" : undefined}
            aria-selected={real ? i === current : undefined} aria-label={real ? title(m) : undefined}>
            <div className="manga-face">
              <img className="manga-cover" src={m.cover} alt="" draggable="false" />
              {pixels?.[k] && <img className="manga-pixels" src={pixels[k]} alt="" draggable="false"
                style={{ WebkitMaskImage: mask, maskImage: mask }} />}
              <span className="manga-tint" />
              <span className="manga-scan" />
            </div>
            <img className="manga-reflection" src={m.cover} alt="" draggable="false" aria-hidden="true" />
          </div>;
        })}
      </div>
    </div>
    <div className="manga-hud">
      <div className="manga-caption" aria-live="polite" key={current + language}>
        <strong>{title(manga)}</strong>
        <span className="manga-meta">
          {tx(manga.author, language)}<i>·</i>{manga.year}<i>·</i>
          {manga.volumes ? `${manga.volumes} ${t.ui.volumes}` : ""}{manga.volumes && manga.status !== "complete" ? " · " : ""}
          {manga.status !== "complete" ? t.ui.mangaStatus[manga.status] : ""}
        </span>
        <span className="manga-genres">{manga.genres.map((g, i) => <em key={i}>{tx(g, language)}</em>)}</span>
        <p className="manga-pitch">{tx(manga.pitch, language)}</p>
      </div>
      <div className="manga-counter">
        <span aria-hidden="true">{String(current + 1).padStart(2, "0")}</span>
        <span className="ticks">
          {mangas.map((m, i) => <button key={i} className={i === current ? "on" : ""} aria-label={title(m)}
            aria-current={i === current || undefined} onClick={() => stage.current.goTo(i)} />)}
        </span>
        <span aria-hidden="true">{String(mangas.length).padStart(2, "0")}</span>
      </div>
    </div>
  </div>;
}
