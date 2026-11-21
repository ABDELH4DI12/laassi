import React, { useEffect, useState } from "react";

function Clock({ format }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <>
      <span className="date">
        {now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })}
      </span>
      <time className="time" dateTime={now.toISOString()}>
        {now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: format === "12" ? "h12" : "h23",
        })}
      </time>
    </>
  );
}
export function TopBar({ format, expanded, appsButton, onToggle, onSettings }) {
  return (
    <header className="bar">
      <div className="side">
        <div className="brand">
          <svg
            className="logo"
            aria-hidden="true"
            viewBox="0 0 30 30"
            fill="currentColor"
          >
            <path d="m2 23 9-17h6L8 23zm10 0 8-15 3 6-5 9zm9 0 3.5-6.5L28 23z" />
          </svg>
          <span>
            After Hours <span className="os">OS</span>
          </span>
        </div>
        <span className="rule"></span>
        <button
          className="barbutton"
          id="apps"
          aria-controls="launcher"
          ref={appsButton}
          aria-expanded={expanded}
          onClick={onToggle}
        >
          Apps{" "}
          <svg width="11" height="10" viewBox="0 0 12 10" aria-hidden="true">
            <path
              d="m2 3 4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </button>
      </div>
      <div className="side">
        <div className="dategroup">
          <Clock format={format} />
        </div>
        <span className="rule"></span>
        <button
          className="barbutton"
          id="controls"
          onClick={onSettings}
          aria-label="Open settings"
        >
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
      </div>
    </header>
  );
}
