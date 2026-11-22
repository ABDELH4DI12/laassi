import React, { useEffect, useMemo, useRef, useState } from "react";
import "@fontsource/fraunces/600.css";
import "@fontsource/cinzel-decorative/700.css";
import "./watchlist.css";
import { watchlist } from "../content/watchlist";
import { tx } from "../content/i18n";
import { coverStyle, grain, reducedMotion } from "./art";
import { Drapes } from "./Curtain";

// Opening: the curtains wait closed while the window settles and draw open; a film
// leader counts 3-2-1 (one second each), then fades out slowly as the films rise in.
const OPEN_DELAY = 650, OPEN_TIME = 1800, OPENED = OPEN_DELAY + OPEN_TIME;
const STEP = 1000, FADE = 1400, SHOW_FOR = 5000;
const SEQUENCE = [[OPENED, 3], [OPENED + STEP, 2], [OPENED + 2 * STEP, 1], [OPENED + 3 * STEP, "show"], [OPENED + 3 * STEP + FADE, "done"]];

// The leader keeps showing "1" while it fades away.
function Leader({ step }) {
  const leaving = step === "show";
  return <div className={"leader-stage" + (leaving ? " is-leaving" : "")} aria-hidden="true" style={{ "--grain": grain, "--fade": FADE + "ms" }}>
    <div className="leader" key={leaving ? 1 : step}>
      <span className={"leader-sweep" + (leaving ? " is-full" : "")} />
      <span className="leader-ring" />
      <span className="leader-cross" />
      <b>{leaving ? 1 : step}</b>
    </div>
  </div>;
}

function Poster({ item, index, className = "" }) {
  return item.poster
    ? <img className={"poster " + className} src={item.poster} alt="" draggable="false" />
    : <span className={"poster " + className} style={coverStyle(item.hue, index + 3)}>
      <span className="poster-text"><b>{item.title}</b><small>{item.year}</small></span>
    </span>;
}

// WatchList: a quiet cinema. Curtains frame the stage; the chosen film fills it
// (its poster becomes the backdrop) and a row of posters below picks the film.
export default function WatchList({ t, language }) {
  const films = useMemo(() => watchlist.map((w) => ({
    ...w, title: tx(w.title, language), by: tx(w.by, language), note: tx(w.note, language),
    typeLabel: t.ui[w.type] || tx(w.type, language),
  })), [language, t]);
  const [pick, setPick] = useState(0);
  const [step, setStep] = useState(() => (reducedMotion() ? "done" : "closed"));
  useEffect(() => {
    if (step === "done") return;
    const timers = SEQUENCE.map(([at, next]) => setTimeout(() => setStep(next), at));
    return () => timers.forEach(clearTimeout);
  }, []);
  const shown = step === "show" || step === "done";
  const [prev, setPrev] = useState(null);
  const film = films[pick];

  function choose(i) {
    if (i === pick) return;
    setPrev(pick);
    setPick(i);
  }
  // Drop the old backdrop once the new one has faded in.
  useEffect(() => {
    if (prev === null) return;
    const timer = setTimeout(() => setPrev(null), 900);
    return () => clearTimeout(timer);
  }, [pick]);
  const step1 = (dir) => choose((pick + dir + films.length) % films.length);
  // Once the show starts, the featured film changes every 5 seconds (the timer
  // restarts whenever a film is picked by hand).
  useEffect(() => {
    if (!shown || reducedMotion()) return;
    const timer = setTimeout(() => step1(1), SHOW_FOR);
    return () => clearTimeout(timer);
  }, [pick, shown]);
  // ← → move through the films (mirrored in Arabic).
  useEffect(() => {
    const key = (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      const forward = (event.key === "ArrowRight") !== (language === "ar");
      step1(forward ? 1 : -1);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });

  const backdrop = (f, i) => f.poster ? { backgroundImage: `url(${f.poster})` } : coverStyle(f.hue, i + 3);
  return <div className="page cinema" style={{ "--glow": `hsl(${film.hue ?? 30} 70% 55%)` }}>
    <div className={"stage" + (shown ? " is-shown" : " is-waiting")}>
      {prev !== null && <div key={"b" + prev} className="backdrop is-out" style={backdrop(films[prev], prev)} aria-hidden="true" />}
      <div key={"b" + pick} className="backdrop" style={backdrop(film, pick)} aria-hidden="true" />
      <div className="stage-shade" aria-hidden="true" />

      <section className="feature" key={pick + (shown ? "-on" : "")} aria-live="polite">
        <Poster item={film} index={pick} className="feature-poster" />
        <div className="feature-text">
          <span className="feature-meta">{film.typeLabel}<i aria-hidden="true">·</i>{film.year}</span>
          <h2>{film.title}</h2>
          <span className="feature-by">{t.ui.by} {film.by}</span>
          {film.rating > 0 && <span className="feature-stars" aria-label={`${film.rating} / 5`}>
            {[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= film.rating ? "on" : ""}>★</i>)}
          </span>}
          <p>{film.note}</p>
        </div>
      </section>

      {/* Film tape: the posters run past endlessly (the list is drawn twice so the loop is seamless). */}
      <div className="rail">
        <button className="tape-btn" onClick={() => step1(-1)} aria-label={t.ui.prevFilm} title={t.ui.prevFilm}>
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3L5 8l5 5" /></svg>
        </button>
        <div className="tape" role="listbox" aria-label={t.apps.WatchList[0]}>
          <div className="tape-track" style={{ "--n": films.length }}>
            {[0, 1].map((copy) => films.map((item, index) => <button key={copy + "-" + index}
              role={copy ? undefined : "option"} aria-hidden={copy ? true : undefined} tabIndex={copy ? -1 : undefined}
              aria-selected={copy ? undefined : index === pick} title={item.title}
              className={"rail-item" + (index === pick ? " is-on" : "")} onClick={() => choose(index)}>
              <Poster item={item} index={index} />
            </button>))}
          </div>
        </div>
        <button className="tape-btn" onClick={() => step1(1)} aria-label={t.ui.nextFilm} title={t.ui.nextFilm}>
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5" /></svg>
        </button>
      </div>
    </div>

    {typeof step === "number" || step === "show" ? <Leader step={step} /> : null}
    <div className="valance-title" aria-hidden="true"><span>{t.ui.valanceLine}</span></div>
    <Drapes openDelay={OPEN_DELAY} openDuration={OPEN_TIME} />
  </div>;
}
