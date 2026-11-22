import React, { useEffect, useRef, useState } from "react";
import "./grove.css";
import "./experience.css";
import { profile } from "../content/profile";
import { tx } from "../content/i18n";
import { techIcon, brightBrand } from "./techIcons";
import { LEAF } from "../Vine";
import { Fireflies, useFitScale } from "./Fireflies";
import { IvyBorder } from "./IvyBorder";

// Experience: the career as a glowing vine on the left (newest at the top, the
// current job pulsing); the chosen job opens on the right in an ivy-framed card.

const months = (start, end) => {
  if (!start) return 0;
  const [y1, m1] = start.split("-").map(Number);
  const now = new Date();
  const [y2, m2] = end ? end.split("-").map(Number) : [now.getFullYear(), now.getMonth() + 1];
  return (y2 - y1) * 12 + (m2 - m1) + 1;
};
const duration = (n, t) => {
  const y = Math.floor(n / 12), m = n % 12;
  return [y && `${y} ${t.ui.yr}`, m && `${m} ${t.ui.mo}`].filter(Boolean).join(" ");
};

export default function Experience({ t, language }) {
  const jobs = profile.experience;
  const [sel, setSel] = useState(Math.max(0, jobs.findIndex((j) => j.current)));
  const job = jobs[sel];
  const total = jobs.reduce((n, j) => n + months(j.start, j.end), 0);
  const companies = new Set(jobs.map((j) => tx(j.place, "en"))).size;
  const highlights = [].concat(tx(job.highlights, language) || tx(job.text, language) || []);
  const frame = useRef(null), fit = useRef(null);
  useFitScale(frame, fit);

  useEffect(() => {
    const key = (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setSel((i) => Math.min(jobs.length - 1, i + 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSel((i) => Math.max(0, i - 1)); }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [jobs.length]);

  return <div className="page grove xp">
    <Fireflies count={12} />
    <div className="xp-frame" ref={frame}><div className="xp-layout g-fit" ref={fit}>
      <aside className="xp-side">
        <header className="g-head">
          <span className="g-eyebrow">{t.sections.experience}</span>
          <h2 className="g-title">{t.ui.expHeadline}</h2>
          <p className="g-sub"><b>{duration(total, t)}</b> {t.ui.expTotal} · <b>{companies}</b> {t.ui.statCompanies.toLowerCase()}</p>
        </header>
        <ol className="xp-path">
          {jobs.map((j, i) => <li key={i} style={{ "--i": i }}>
            <button className={"xp-stop" + (i === sel ? " is-on" : "") + (j.current ? " is-current" : "")}
              aria-pressed={i === sel} onClick={() => setSel(i)}>
              <span className="xp-node" aria-hidden="true">
                <svg viewBox="-10 -10 20 20">
                  <path d={LEAF} transform="translate(-1.5 1) rotate(-140) scale(1.5)" />
                  <path d={LEAF} transform="translate(1.5 1) rotate(-40) scale(1.5)" />
                  <circle r="3.6" />
                </svg>
              </span>
              <span className="xp-stop-when">{tx(j.period, language)}</span>
              <span className="xp-stop-role">{tx(j.role, language)}</span>
              <span className="xp-stop-place">{tx(j.place, language)}</span>
            </button>
          </li>)}
        </ol>
      </aside>

      <section className="xp-detail g-card" key={sel + language} aria-live="polite">
        <span className="xp-ivy" aria-hidden="true">
          <IvyBorder seed={11 + sel * 7} inset={8} radius={18} band={0.8}
            strands={[{ at: 0.9, length: 0.14, dir: 1 }, { at: 0.47, length: 0.12, dir: 1 }]} />
        </span>
        <span className="xp-year" aria-hidden="true">{(job.start || "").slice(0, 4)}</span>
        <div className="xp-top">
          <span className="xp-mono" aria-hidden="true">{tx(job.place, "en").slice(0, 1)}</span>
          <div className="xp-title">
            <h3>{tx(job.role, language)}</h3>
            <p>{tx(job.place, language)}{job.type && <><i>·</i>{tx(job.type, language)}</>}</p>
          </div>
        </div>
        <div className="xp-meta">
          {job.current && <span className="xp-badge"><i aria-hidden="true" />{t.ui.expPresent}</span>}
          <span className="xp-pill">{tx(job.period, language)}</span>
          {job.start && <span className="xp-pill">{duration(months(job.start, job.end), t)}</span>}
        </div>
        <h4 className="xp-label">{t.ui.highlights}</h4>
        <ul className="xp-points">{highlights.map((h, i) => <li key={i} style={{ "--i": i }}>{h}</li>)}</ul>
        {job.tech?.length > 0 && <>
          <h4 className="xp-label">{t.ui.techUsed}</h4>
          <ul className="xp-tech">
            {job.tech.map((s, i) => {
              const icon = techIcon(s);
              return <li key={s} style={{ "--i": i, "--brand": icon ? brightBrand(icon.hex) : "#c8f59a" }}>
                {icon ? <svg viewBox="0 0 24 24"><path d={icon.path} /></svg> : <b>{s.slice(0, 3)}</b>}{s}
              </li>;
            })}
          </ul>
        </>}
      </section>
    </div></div>
  </div>;
}
