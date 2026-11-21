import React, { useEffect, useState } from "react";
import { profile } from "./content/profile";
import { tx } from "./content/i18n";

function Clock({ format, language }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <>
      <span className="date">
        {now.toLocaleDateString(language, {
          weekday: "short",
          month: "short",
          day: "numeric",
        })}
      </span>
      <time className="time" dateTime={now.toISOString()}>
        {now.toLocaleTimeString(language, {
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: format === "12" ? "h12" : "h23",
        })}
      </time>
    </>
  );
}
export function TopBar({ format, language, label, expanded, onSettings }) {
  return <header className="bar">
    <span className="owner-name">{tx(profile.name, language)}</span>
    <div className="dategroup"><Clock format={format} language={language} /></div>
    <button className="settings-toggle" aria-label={label} title={label} aria-expanded={expanded} onClick={onSettings}>
      <span>{language.toUpperCase()}</span>
          <svg
            className="baricon"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M2 6h3m5 0h8M2 14h8m5 0h3" />
            <circle cx="7.5" cy="6" r="2.4" />
            <circle cx="12.5" cy="14" r="2.4" />
          </svg>
    </button>
  </header>;
}
