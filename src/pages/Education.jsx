import React, { useRef } from "react";
import "./grove.css";
import "./education.css";
import { profile } from "../content/profile";
import { tx } from "../content/i18n";
import { techIcon, brightBrand } from "./techIcons";
import { LEAF } from "../Vine";
import { Fireflies, useFitScale } from "./Fireflies";

// Education: each diploma as a card with a laurel seal around its year, joined in
// order by a glowing vine that carries on to "Then I started building".

// A laurel of ivy leaves around the year.
function Seal({ label }) {
  const leaves = [];
  for (const side of [-1, 1]) {
    for (let k = 0; k < 7; k++) {
      const th = ((90 + side * (18 + k * 19)) * Math.PI) / 180;   // from the bottom up each side
      const x = 60 + 44 * Math.cos(th), y = 60 + 44 * Math.sin(th);
      const heading = (th * 180) / Math.PI + side * 90;           // along the circle, upwards
      leaves.push(<path key={side + "-" + k} d={LEAF} className="ed-seal-leaf" style={{ "--k": k }}
        transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(heading + side * 35).toFixed(0)}) scale(${(2.3 - k * 0.12).toFixed(2)})`} />);
    }
  }
  return <span className="ed-seal-wrap" aria-hidden="true"><svg className="ed-seal" viewBox="0 0 120 120">
    <circle cx="60" cy="60" r="34" className="ed-seal-disc" />
    <circle cx="60" cy="60" r="29" className="ed-seal-inner" />
    <path d="M60 104 C 40 100, 22 84, 17 60 M60 104 C 80 100, 98 84, 103 60" className="ed-seal-stem" />
    {leaves}
  </svg><span className="ed-seal-year">{label}</span></span>;
}

const Corner = ({ pos }) => <svg className={"ed-corner ed-corner--" + pos} viewBox="0 0 30 30" aria-hidden="true">
  <path d="M2 28 V10 Q2 2 10 2 H28" />
  <path d={LEAF} transform="translate(6 6) rotate(45) scale(1.6)" />
</svg>;

const Arrow = () => <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>;

export default function Education({ t, language, onOpen }) {
  const frame = useRef(null), fit = useRef(null);
  useFitScale(frame, fit);
  const entries = [...profile.education].reverse();   // oldest first
  const firstYear = (p) => String(tx(p, "en")).match(/\d{4}/g)?.pop() || "";
  return <div className="page grove ed">
    <Fireflies count={12} />
    <div className="ed-scroll" ref={frame}>
      <div className="g-fit ed-fit" ref={fit}>
      <header className="g-head ed-head">
        <span className="g-eyebrow">{t.sections.education}</span>
        <h2 className="g-title">{t.ui.eduHeadline}</h2>
      </header>
      <div className="ed-path">
        <svg className="ed-vine" preserveAspectRatio="none" viewBox="0 0 100 10" aria-hidden="true">
          <path d="M0 5 C 12 1, 22 9, 34 5 S 56 1, 68 5 S 88 9, 100 5" pathLength="1" />
        </svg>
        {entries.map((e, i) => <article key={i} className="ed-card" style={{ "--i": i }}>
          {["tl", "tr", "bl", "br"].map((p) => <Corner key={p} pos={p} />)}
          <Seal label={firstYear(e.period)} />
          <span className="ed-period">{tx(e.period, language)}</span>
          <h3>{tx(e.degree, language)}</h3>
          <p className="ed-school">{tx(e.school, language)}</p>
          {e.text && !e.skills?.length && <p className="ed-text">{tx(e.text, language)}</p>}
          {e.skills?.length > 0 && <ul className="ed-skills" aria-label={t.ui.eduLearned}>
            {e.skills.map((s) => {
              const icon = techIcon(s);
              return <li key={s} style={{ "--brand": icon ? brightBrand(icon.hex) : "#c8f59a" }} title={s}>
                {icon ? <svg viewBox="0 0 24 24"><path d={icon.path} /></svg> : <b>{s.slice(0, 3)}</b>}
                <span>{s}</span>
              </li>;
            })}
          </ul>}
        </article>)}
        <button className="ed-next" style={{ "--i": entries.length }} onClick={() => onOpen("experience")}>
          <span className="ed-next-seed" aria-hidden="true" />
          <strong>{t.ui.eduNext}</strong>
          <span className="ed-next-link">{t.ui.seeExperience}<Arrow /></span>
        </button>
      </div>
      </div>
    </div>
  </div>;
}
