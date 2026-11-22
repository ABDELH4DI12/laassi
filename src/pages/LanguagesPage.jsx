import React, { useRef } from "react";
import "./grove.css";
import "./languages-page.css";
import { profile } from "../content/profile";
import { tx, hasArabic } from "../content/i18n";
import { LEAF } from "../Vine";
import { Fireflies, useFitScale } from "./Fireflies";

// Languages: a card per language — its greeting in its own script, a vine ring
// that fills to the fluency level, and its name. A voice-wave drifts behind.

function Ring({ level, note }) {
  const a = (-90 + level * 72) * Math.PI / 180;           // where the vine ends
  const x = 80 + 64 * Math.cos(a), y = 80 + 64 * Math.sin(a);
  return <div className="lg-ring">
    <svg viewBox="0 0 160 160" aria-hidden="true">
      <circle className="lg-track" cx="80" cy="80" r="64" pathLength="100" />
      <circle className="lg-arc-glow" cx="80" cy="80" r="64" pathLength="100" style={{ "--lvl": level * 20 }} />
      <circle className="lg-arc" cx="80" cy="80" r="64" pathLength="100" style={{ "--lvl": level * 20 }} />
      <g className="lg-tip" transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
        <path d={LEAF} transform={`rotate(${(a * 180 / Math.PI + 140).toFixed(0)}) scale(2)`} />
        <path d={LEAF} transform={`rotate(${(a * 180 / Math.PI + 40).toFixed(0)}) scale(2)`} />
        <circle r="3.4" />
      </g>
    </svg>
    <div className="lg-ring-text">
      <strong>{note}</strong>
      <small>{level} / 5</small>
    </div>
  </div>;
}

// A long soft sine wave, drawn twice as wide as the page and slid along forever.
const WAVE = (() => {
  let d = "M0 50";
  for (let x = 0; x <= 2000; x += 10) {
    const env = 0.55 + 0.45 * Math.sin(x / 160);
    d += ` L${x} ${(50 + Math.sin(x / 38) * 22 * env).toFixed(1)}`;
  }
  return d;
})();

export default function LanguagesPage({ t, language }) {
  const frame = useRef(null), fit = useRef(null);
  useFitScale(frame, fit);
  const langs = profile.languages;
  return <div className="page grove lg">
    <Fireflies count={12} />
    <svg className="lg-wave" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true">
      <g className="lg-wave-run"><path d={WAVE} /><path d={WAVE} transform="translate(0 6) scale(1 .7)" className="lg-wave-2" /></g>
    </svg>
    <div className="lg-scroll" ref={frame}>
      <div className="g-fit lg-fit" ref={fit}>
      <header className="g-head lg-head">
        <span className="g-eyebrow">{t.sections.languages}</span>
        <h2 className="g-title">{t.ui.langHeadline}</h2>
        <p className="g-sub">{t.ui.langSub}</p>
      </header>
      <div className="lg-cards">
        {langs.map((l, i) => {
          const hello = tx(l.hello, language);
          return <article key={i} className="lg-card g-card" style={{ "--i": i }}>
            <p className={"lg-hello" + (hasArabic(hello) ? " is-arabic" : "")} dir="auto">{hello}</p>
            <Ring level={l.level} note={tx(l.note, language)} />
            <h3>{tx(l.name, language)}</h3>
            {l.native && l.native !== tx(l.name, language) && <span className="lg-native" dir="auto">{l.native}</span>}
          </article>;
        })}
      </div>
      </div>
    </div>
  </div>;
}
