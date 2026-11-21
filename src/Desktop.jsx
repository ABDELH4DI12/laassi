import React, { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { TopBar } from "./TopBar";
import { Vine } from "./Vine";
import { DockIcon } from "./DockIcons";
import { sections, SectionIcon } from "./Sections";
import { dockApps } from "./apps";
import { paintWallpaper } from "./wallpaper";
import { languages, translations } from "./languages";
import "./fonts";
import "./desktop.css";

const palettes = { "Pixel Forest": null, Amethyst: 272, Jade: 163 };
const sectionItems = sections.map((name) => ({ name, section: true }));

// Every app and profile section opens as a full-screen "room", loaded on demand.
const pages = {
  Terminal: lazy(() => import("./pages/Terminal")),
  Works: lazy(() => import("./pages/Works")),
  Store: lazy(() => import("./pages/Store")),
  WatchList: lazy(() => import("./pages/WatchList")),
  Mangas: lazy(() => import("./MangaShelf")),
  about: lazy(() => import("./pages/About")),
  experience: lazy(() => import("./pages/Experience")),
  skills: lazy(() => import("./pages/Skills")),
  education: lazy(() => import("./pages/Education")),
  languages: lazy(() => import("./pages/LanguagesPage")),
};

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
    if (palette === "Pixel Forest") return;
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
  if (palette === "Pixel Forest") return null;
  return <canvas id="wall" aria-hidden="true" ref={canvas} />;
}

// Font setting -> the stacks defined in desktop.css (each pairs a Latin and an Arabic face).
const fonts = { system: "var(--font-sans)", serif: "var(--font-serif)", mono: "var(--font-mono)" };

function SelectSetting({ label, value, onChange, options }) {
  return <label className="setting"><span>{label}</span>
    <select value={value} onChange={event => onChange(event.target.value)}>
      {Object.entries(options).map(([key, text]) => <option key={key} value={key}>{text}</option>)}
    </select>
  </label>;
}

// ---------- Window open / close animation ----------
const motionOff = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
// The dock button or desktop shortcut that launches an app or section.
const launcherFor = (item) => document.querySelector(`[data-launch="${item.name}"]`);
// Transform that shrinks the window onto a launcher's rectangle.
function towards(win, launcher) {
  const s = Math.max(0.04, Math.min(1, launcher.width / win.width));
  const dx = launcher.left + launcher.width / 2 - (win.left + win.width / 2);
  const dy = launcher.top + launcher.height / 2 - (win.top + win.height / 2);
  return `translate(${dx}px, ${dy}px) scale(${s})`;
}

function Stage({ item, t, language, panel, closeButton, onClose, onOpen, maxed, onToggleMax, launchFrom }) {
  const Page = pages[item.name];
  // Opening: zoom out of the icon that launched the window. Switching profile tabs
  // has no launcher, so the frame stays put and only the content changes.
  useLayoutEffect(() => {
    const el = panel.current;
    if (!el || !launchFrom || motionOff()) return;
    const from = launchFrom.rect ? towards(el.getBoundingClientRect(), launchFrom.rect) : "scale(.94)";
    el.animate([
      { transform: from, opacity: 0 },
      { opacity: 1, offset: 0.3 },
      { transform: "none", opacity: 1 },
    ], { duration: 520, easing: "cubic-bezier(.16, 1, .3, 1)" });
  }, []);
  const title = item.section ? t.sections[item.name] : t.apps[item.name][0];
  return <section role="dialog" ref={panel} aria-labelledby="window-title"
    className={"panel window--stage stage--" + item.name + (maxed ? " is-max" : "")}>
    {/* Title bar: icon and title, profile tabs, then the window buttons. Double-click to maximize. */}
    <header className="window-head titlebar" onDoubleClick={event => !event.target.closest("button") && onToggleMax()}>
      <div className="titlebar-title">
        <span className="titlebar-icon" aria-hidden="true">
          {item.section ? <SectionIcon name={item.name} /> : <DockIcon name={item.name} />}
        </span>
        <h1 id="window-title">{title}</h1>
      </div>
      {item.section && <nav className="profile-tabs" aria-label={t.ui.profile}>
        {sections.map(name => <button key={name} aria-current={name === item.name ? "page" : undefined}
          onClick={() => onOpen(name)}>{t.sections[name]}</button>)}
      </nav>}
      <div className="titlebar-controls">
        <button className="titlebar-btn titlebar-max" aria-label={maxed ? t.ui.restore : t.ui.maximize}
          title={maxed ? t.ui.restore : t.ui.maximize} onClick={onToggleMax}>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            {maxed ? <><rect x="3.5" y="5.5" width="7" height="7" rx="1.2" /><path d="M6 5.5V4.7c0-.7.5-1.2 1.2-1.2h4.1c.7 0 1.2.5 1.2 1.2v4.1c0 .7-.5 1.2-1.2 1.2h-.8" /></>
              : <rect x="3.5" y="3.5" width="9" height="9" rx="1.5" />}
          </svg>
        </button>
        <button className="titlebar-btn close" ref={closeButton} aria-label={t.close} title={t.close} onClick={onClose}>
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7" /></svg>
        </button>
      </div>
    </header>
    <Suspense fallback={<div className="stage-loading" aria-hidden="true" />}>
      <Page t={t} language={language} onOpen={onOpen} onClose={onClose} />
    </Suspense>
  </section>;
}

function Desktop() {
  const [active, setActive] = useState(null);
  const [maxed, setMaxed] = useState(false);
  const launch = useRef(null);      // where the window being opened launches from
  const closing = useRef(false);
  const [palette, setPalette] = usePreference("palette", Object.keys(palettes));
  const [format, setFormat] = usePreference("clock", ["24", "12"]);
  const [language, setLanguage] = usePreference("language", Object.keys(languages));
  const [theme, setTheme] = usePreference("theme", ["dark", "light"]);
  const [font, setFont] = usePreference("font", Object.keys(fonts));
  const [accent, setAccent] = useState(() => {
    try {
      const saved = localStorage.getItem("afterhours-accent");
      if (/^#[\da-f]{6}$/i.test(saved)) return saved;
    } catch {}
    return "#e0a458";
  });
  const t = translations[language];
  const opener = useRef(null);
  const closeButton = useRef(null);
  const panel = useRef(null);
  // Settings is a popover of its own: opening it leaves any open window where it is.
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsPanel = useRef(null);
  const settingsClose = useRef(null);
  const settingsToggle = useRef(null);

  function close() {
    const el = panel.current, item = active;
    const finish = () => {
      closing.current = false;
      // Only clear the window we were closing (another may have opened meanwhile).
      setActive(current => (current === item ? null : current));
      opener.current?.focus();
    };
    // Closing a room window: shrink back into its icon.
    const launcher = item && launcherFor(item);
    if (el && launcher && !motionOff()) {
      if (closing.current) return;
      closing.current = true;
      el.animate([
        { transform: "none", opacity: 1 },
        { opacity: 1, offset: 0.55 },
        { transform: towards(el.getBoundingClientRect(), launcher.getBoundingClientRect()), opacity: 0 },
      ], { duration: 300, easing: "cubic-bezier(.5, 0, .75, .4)", fill: "forwards" }).finished.then(finish, finish);
      return;
    }
    finish();
  }
  // Maximize / restore with a smooth grow: switch to the new size at once (so pages
  // lay out a single time), then animate from where the window was to where it is.
  const maxFrom = useRef(null);
  function toggleMax() {
    if (panel.current && !motionOff()) maxFrom.current = panel.current.getBoundingClientRect();
    setMaxed(value => !value);
  }
  // Runs after the new size is in the DOM but before it's painted.
  useLayoutEffect(() => {
    const first = maxFrom.current, el = panel.current;
    maxFrom.current = null;
    if (!first || !el) return;
    const last = el.getBoundingClientRect();
    if (!last.width || (Math.abs(first.width - last.width) < 1 && Math.abs(first.height - last.height) < 1)) return;
    const growing = last.width > first.width;
    const scaleX = first.width / last.width, scaleY = first.height / last.height;
    el.animate([
      {
        transformOrigin: "0 0",
        transform: `translate(${first.left - last.left}px, ${first.top - last.top}px) scale(${scaleX}, ${scaleY})`,
        borderRadius: growing ? `${16 / scaleX}px` : "0px",
      },
      { transformOrigin: "0 0", transform: "none", borderRadius: growing ? "0px" : "16px" },
    ], { duration: 460, easing: "cubic-bezier(.2, .9, .25, 1)" });
  }, [maxed]);
  function open(app, trigger) {
    opener.current = trigger;
    closing.current = false;
    launch.current = { rect: trigger?.getBoundingClientRect() };
    setActive(app);
  }
  // Open any app or section by name (used by the Terminal's `open` command and the profile tabs).
  function openByName(name) {
    const key = String(name).toLowerCase();
    const item = [...dockApps, ...sectionItems].find(entry => entry.name.toLowerCase() === key);
    if (!item) return false;
    const tabSwitch = active?.section && item.section;
    closing.current = false;
    launch.current = tabSwitch ? null : { rect: launcherFor(item)?.getBoundingClientRect() };
    setActive(item);
    return true;
  }
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);
  // A newly opened window: a page can ask for focus itself (the Terminal's prompt);
  // otherwise focus its close button.
  useEffect(() => {
    if (active && !panel.current?.querySelector("[data-autofocus]")) closeButton.current?.focus();
  }, [active]);
  // Settings takes focus when it opens. Closing it with Escape or × hands focus back to
  // its button; closing it by clicking elsewhere leaves focus on what was clicked.
  useEffect(() => { if (settingsOpen) settingsClose.current?.focus(); }, [settingsOpen]);
  function closeSettings(refocus) {
    setSettingsOpen(false);
    if (refocus) settingsToggle.current?.focus();
  }
  // Escape closes the topmost thing: Settings first, then the window.
  useEffect(() => {
    function escape(event) {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      if (settingsOpen) { event.preventDefault(); closeSettings(true); }
      else if (active) close();
    }
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [active, settingsOpen]);
  // A click anywhere outside Settings closes it (and still reaches what was clicked).
  useEffect(() => {
    if (!settingsOpen) return;
    function outside(event) {
      if (!settingsPanel.current?.contains(event.target) && !settingsToggle.current?.contains(event.target)) closeSettings(false);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [settingsOpen]);

  function changeAccent(value) {
    setAccent(value);
    try { localStorage.setItem("afterhours-accent", value); } catch {}
  }

  return <div className={palette === "Pixel Forest" ? "desktop pixel-forest" : "desktop"} data-theme={theme} style={{ "--accent": accent, fontFamily: fonts[font] }}>
    <Wallpaper palette={palette} />
    <TopBar format={format} language={language} label={t.settings} expanded={settingsOpen}
      onSettings={event => { settingsToggle.current = event.currentTarget; setSettingsOpen(value => !value); }} />
    <nav className="dock" aria-label={t.dock}>
      {dockApps.map((app, i) => <button key={app.name} data-launch={app.name} style={{ "--b": i }} aria-label={app.name} aria-pressed={active === app} title={t.apps[app.name][0]}
        onClick={event => active === app ? close() : open(app, event.currentTarget)}>
        <Vine />
        <span className="plaque"><DockIcon name={app.name} /></span>
        <span>{t.apps[app.name][0]}</span>
      </button>)}
    </nav>
    <main aria-label={t.desktop}>
      <ul className="shortcuts">
        {sectionItems.map(item => <li key={item.name}>
          <button className="shortcut" data-launch={item.name} aria-pressed={active === item}
            onClick={event => active === item ? close() : open(item, event.currentTarget)}>
            <span className="plaque"><SectionIcon name={item.name} /></span>
            <span className="shortcut-label">{t.sections[item.name]}</span>
          </button>
        </li>)}
      </ul>
      {active && <Stage key={active.name} item={active} t={t} language={language} panel={panel} closeButton={closeButton}
        maxed={maxed} onToggleMax={toggleMax} launchFrom={launch.current}
        onClose={close} onOpen={openByName} />}
      {settingsOpen && <section role="dialog" ref={settingsPanel} aria-labelledby="settings-title" className="panel preferences">
        <header className="window-head"><h1 id="settings-title">{t.settings}</h1>
          <button className="close" ref={settingsClose} aria-label={t.close} onClick={() => closeSettings(true)}>×</button>
        </header>
        <div className="settings">
          <SelectSetting label={t.language} value={language} onChange={setLanguage} options={languages} />
          <SelectSetting label={t.font} value={font} onChange={setFont} options={{system:t.system, serif:t.serif, mono:t.mono}} />
          <div className="setting"><span id="theme-label">{t.theme}</span><div className="segments" role="group" aria-labelledby="theme-label">
            {["light","dark"].map(key => <button key={key} aria-pressed={theme === key} onClick={() => setTheme(key)}>{t[key]}</button>)}
          </div></div>
          <label className="setting">{t.color}<input type="color" value={accent} onChange={event => changeAccent(event.target.value)} /></label>
          <SelectSetting label={t.wallpaper} value={palette} onChange={setPalette} options={Object.fromEntries(Object.keys(palettes).map((key,i) => [key,t.skies[i]]))} />
          <SelectSetting label={t.clock} value={format} onChange={setFormat} options={{24:t.hours[0],12:t.hours[1]}} />
        </div>
      </section>}
    </main>
  </div>;
}
createRoot(document.getElementById("root")).render(<Desktop />);
