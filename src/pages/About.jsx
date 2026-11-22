import React, { useEffect, useRef } from "react";
import "@fontsource/fraunces/600.css";
import "./about.css";
import { profile } from "../content/profile";
import { tx } from "../content/i18n";
import { TechIcon } from "./techIcons";
import { IvyBorder } from "./IvyBorder";

const LinkedInMark = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" /></svg>;
const Arrow = () => <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>;
const Pin = () => <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 14.5s4.5-4.2 4.5-7.7a4.5 4.5 0 1 0-9 0c0 3.5 4.5 7.7 4.5 7.7z" /><circle cx="8" cy="6.8" r="1.6" /></svg>;

// About: an editorial profile card. Portrait on one side; a statement, the story,
// a few numbers, top skills and links on the other.
export default function About({ t, language, onOpen }) {
  const name = tx(profile.name, language);
  const years = Math.max(1, new Date().getFullYear() - (profile.since || new Date().getFullYear()));
  const companies = new Set(profile.experience.map((e) => tx(e.place, "en"))).size;
  const skills = profile.skills.reduce((n, g) => n + g.items.length, 0);
  const stats = [[years + "+", t.ui.statYears], [companies, t.ui.statCompanies], [skills, t.ui.statSkills]];

  // The card is designed for the normal window; in a bigger (maximized) window it
  // scales up as one piece so it fills the space instead of floating in it.
  const scroll = useRef(null), grid = useRef(null);
  useEffect(() => {
    const fit = () => {
      const box = scroll.current, card = grid.current;
      if (!box || !card) return;
      const k = Math.min(1.35, (box.clientWidth - 220) / card.offsetWidth, (box.clientHeight - 120) / card.offsetHeight);
      // Leave the normal-size window exactly as designed; only clearly bigger windows scale up.
      card.style.setProperty("--k", k > 1.12 ? k.toFixed(3) : "1");
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(scroll.current);
    ro.observe(grid.current);
    return () => ro.disconnect();
  }, []);

  return <div className="page about">
    <div className="about-scroll" ref={scroll}>
      <div className="about-grid" ref={grid}>
        <figure className="about-portrait">
          {profile.photo && <img src={profile.photo} alt={name} />}
          <span className="about-light" aria-hidden="true" />
          <span className="about-ivy" aria-hidden="true">
            <IvyBorder seed={7} inset={8} radius={20} band={1.1}
              strands={[{ at: 0.88, length: 0.2, dir: 1 }, { at: 0.38, length: 0.16, dir: 1 }, { at: 0.62, length: 0.08, dir: -1 }]} />
          </span>
          <figcaption>
            <strong>{name}</strong>
            <span>{tx(profile.role, language)}</span>
          </figcaption>
        </figure>

        <section className="about-main">
          <span className="about-eyebrow">{t.ui.aboutEyebrow}</span>
          <h2 className="about-headline">{tx(profile.headline, language)}</h2>
          <div className="about-tags">
            <span className="about-tag"><Pin />{tx(profile.location, language)}</span>
            {tx(profile.status, language) && <span className="about-tag about-tag--live"><i aria-hidden="true" />{tx(profile.status, language)}</span>}
          </div>
          <div className="about-text">
            {tx(profile.about, language).map((text, i) => <p key={i}>{text}</p>)}
          </div>
          <dl className="about-stats">
            {stats.map(([value, label]) => <div key={label}><dd>{value}</dd><dt>{label}</dt></div>)}
          </dl>
          {profile.topSkills?.length > 0 && <div className="about-skills">
            <span className="about-label">{t.ui.topSkills}</span>
            <ul>{profile.topSkills.map((s) => <li key={s}><TechIcon name={s} />{s}</li>)}</ul>
          </div>}
          <div className="about-actions">
            <button className="about-btn about-btn--primary" onClick={() => onOpen("works")}>{t.ui.seeWork}<Arrow /></button>
            {profile.links?.linkedin && <a className="about-btn" href={profile.links.linkedin} target="_blank" rel="noreferrer"><LinkedInMark />LinkedIn</a>}
          </div>
        </section>
      </div>
    </div>
  </div>;
}
