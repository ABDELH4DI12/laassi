import React, { useEffect, useMemo, useRef, useState } from "react";
import "@fontsource/fraunces/600.css";
import "./watchlist.css";
import { watchlist } from "../content/watchlist";
import { tx } from "../content/i18n";
import { coverStyle, reducedMotion } from "./art";
import { Drapes } from "./Curtain";

// Opening: the curtains wait closed while the window settles, draw open, and the
// films rise in slowly as they part.
const OPEN_DELAY = 650, OPEN_TIME = 1800, SHOW_AT = OPEN_DELAY + OPEN_TIME * 0.55;

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
  const [shown, setShown] = useState(() => reducedMotion());
  useEffect(() => {
    if (shown) return;
    const timer = setTimeout(() => setShown(true), SHOW_AT);
    return () => clearTimeout(timer);
  }, []);
  const [prev, setPrev] = useState(null);
  const rail = useRef(null);
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
  // Keep the chosen poster centred in the row (scrolling only the row itself).
  useEffect(() => {
    const row = rail.current, item = row?.children[pick];
    if (!item) return;
    const left = item.offsetLeft - (row.clientWidth - item.offsetWidth) / 2;
    row.scrollTo({ left, behavior: "smooth" });
  }, [pick]);
  // ← → move through the films (mirrored in Arabic).
  useEffect(() => {
    const key = (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      const forward = (event.key === "ArrowRight") !== (language === "ar");
      choose((pick + (forward ? 1 : -1) + films.length) % films.length);
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

      <div className="rail" ref={rail} role="listbox" aria-label={t.apps.WatchList[0]}>
        {films.map((item, index) => <button key={index} role="option" aria-selected={index === pick} title={item.title}
          className={"rail-item" + (index === pick ? " is-on" : "")} onClick={() => choose(index)}>
          <Poster item={item} index={index} />
        </button>)}
      </div>
    </div>

    <Drapes openDelay={OPEN_DELAY} openDuration={OPEN_TIME} />
  </div>;
}
