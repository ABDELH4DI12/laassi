import React, { Fragment, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { TopBar } from "./TopBar";
import { apps } from "./apps";
import { paintWallpaper } from "./wallpaper";
import "./desktop.css";

const palettes = { Cobalt: 224, Amethyst: 272, Jade: 163 };
const settingsApp = apps.find((app) => app.name === "Settings");

function usePreference(key, choices) {
  const storageKey = "afterhours-" + key;
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (choices.includes(saved)) return saved;
    } catch {
      /* Storage may be unavailable in private browsing. */
    }
    return choices[0];
  });
  function update(next) {
    setValue(next);
    try {
      localStorage.setItem(storageKey, next);
    } catch {
      /* Keep the session preference. */
    }
  }
  return [value, update];
}

function Wallpaper({ palette }) {
  const canvas = useRef(null);
  useEffect(() => {
    let frame;
    const draw = () => paintWallpaper(canvas.current, palettes[palette]);
    function resize() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    }
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [palette]);
  return <canvas id="wall" aria-hidden="true" ref={canvas} />;
}

function AppButtons({ dock, active, onOpen }) {
  return apps.map((app) => (
    <Fragment key={app.name}>
      {dock && app === settingsApp && <span className="dock-rule" />}
      <button
        aria-label={app.title}
        aria-pressed={dock ? active === app : undefined}
        onClick={(event) => onOpen(app, event.currentTarget)}
      >
        <span className="tile">
          <img src={app.icon} alt="" />
        </span>
        <span className="caption">{app.name}</span>
      </button>
    </Fragment>
  ));
}

function Desktop() {
  const [active, setActive] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [palette, setPalette] = usePreference("palette", Object.keys(palettes));
  const [format, setFormat] = usePreference("clock", ["24", "12"]);
  const launcher = useRef(null);
  const appsButton = useRef(null);
  const closeButton = useRef(null);
  const opener = useRef(null);

  function open(app, trigger) {
    opener.current = launcher.current?.contains(trigger)
      ? appsButton.current
      : trigger;
    setExpanded(false);
    setActive(app);
    closeButton.current?.focus();
  }
  function close() {
    setActive(null);
    opener.current?.focus();
  }
  useEffect(() => {
    if (active) closeButton.current?.focus();
  }, [active]);
  useEffect(() => {
    if (!expanded) return;
    launcher.current.querySelector("button").focus();
    function outside(event) {
      if (
        !launcher.current.contains(event.target) &&
        !appsButton.current.contains(event.target)
      )
        setExpanded(false);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [expanded]);
  useEffect(() => {
    function escape(event) {
      if (event.key !== "Escape") return;
      if (expanded) {
        setExpanded(false);
        appsButton.current.focus();
      } else if (active) close();
    }
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [expanded, active]);

  return (
    <>
      <Wallpaper palette={palette} />
      <TopBar
        format={format}
        expanded={expanded}
        appsButton={appsButton}
        onToggle={() => setExpanded((value) => !value)}
        onSettings={(event) => open(settingsApp, event.currentTarget)}
      />
      <main aria-label="Desktop">
        <section
          className="panel launcher"
          id="launcher"
          aria-labelledby="app-title"
          ref={launcher}
          hidden={!expanded}
        >
          <h2 id="app-title">Applications</h2>
          <div className="app-grid">
            <AppButtons onOpen={open} />
          </div>
        </section>
        {active && (
          <section
            role="dialog"
            aria-labelledby="window-name"
            className="panel window"
          >
            <header className="window-head">
              <h1 id="window-name">{active.title}</h1>
              <button
                className="close"
                aria-label="Close window"
                ref={closeButton}
                onClick={close}
              >
                ×
              </button>
            </header>
            {active === settingsApp ? (
              <div className="settings">
                <label className="setting">
                  Wallpaper
                  <select
                    value={palette}
                    onChange={(event) => setPalette(event.target.value)}
                  >
                    {Object.keys(palettes).map((name) => (
                      <option key={name}>{name}</option>
                    ))}
                  </select>
                </label>
                <label className="setting">
                  Clock format
                  <select
                    value={format}
                    onChange={(event) => setFormat(event.target.value)}
                  >
                    <option value="24">24-hour</option>
                    <option value="12">12-hour</option>
                  </select>
                </label>
              </div>
            ) : (
              <div className="empty">
                <span className="tile">
                  <img src={active.icon} alt="" />
                </span>
                <p>{active.empty}</p>
              </div>
            )}
          </section>
        )}
      </main>
      <div className="dock-zone">
        <nav className="dock" aria-label="Application dock">
          <AppButtons dock active={active} onOpen={open} />
        </nav>
      </div>
    </>
  );
}

createRoot(document.getElementById("root")).render(<Desktop />);
