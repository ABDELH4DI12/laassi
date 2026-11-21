import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import "./terminal.css";
import { profile } from "../content/profile";
import { works } from "../content/works";
import { tx } from "../content/i18n";
import { IvyBorder } from "./IvyBorder";

// A plain shell. The only decoration is the dock's glowing ivy, grown at random around the window's border.
// Commands stay in English (that's what you type); everything they print follows the language setting,
// including what was printed before the language changed.

const user = String(tx(profile.name, "en") || "guest").toLowerCase().replace(/[^a-z0-9]/g, "") || "guest";
const host = "afterhours";
const SECTIONS = ["about", "experience", "skills", "education", "languages"];
const FILES = [...SECTIONS.map((name) => name + ".txt"), "works/"];
const APPS = ["works", "store", "watchlist", "mangas", ...SECTIONS];
// [what to show, its description key]; plain commands are clickable.
const HELP = ["help", "about", "experience", "skills", "education", "languages", "works", ["open <app>", "open"], "ls", "clear", "exit"]
  .map((row) => (Array.isArray(row) ? row : [row, row]));

const level = (n) => Math.max(0, Math.min(5, Math.round(Number(n) || 0)));
const meter = (n) => "█".repeat(level(n)) + "░".repeat(5 - level(n));
const comma = (lang) => (lang === "ar" ? "، " : ", ");

const Run = createContext(() => {});
function Cmd({ c, children }) {
  const run = useContext(Run);
  return <button className="t-cmd" dir="ltr" onClick={() => run(c)}>{children ?? c}</button>;
}
const Prompt = () => <span className="t-prompt"><b className="t-user">{user}@{host}</b>:<b className="t-path">~</b>$ </span>;

// What each content command prints, given { lang, t } at the time it's shown.
const outputs = {
  help: () => ({ t }) => <div className="t-table t-table--2">
    {HELP.map(([label, key]) => <React.Fragment key={key}>
      <span dir="ltr">{label.includes(" ") ? label : <Cmd c={label} />}</span>
      <span className="t-dim">{t.ui.term.help[key]}</span>
    </React.Fragment>)}
  </div>,
  about: () => ({ lang }) => <>
    <div className="t-bright">{tx(profile.name, lang)}</div>
    <div className="t-dim">{tx(profile.role, lang)} · {tx(profile.location, lang)}</div>
    {tx(profile.about, lang).map((text, i) => <div key={i} className="t-gap">{text}</div>)}
  </>,
  experience: () => ({ lang, t }) => profile.experience.map((job, i) => <div key={i} className={i ? "t-gap" : ""}>
    <div>
      <span className="t-bright">{tx(job.role, lang)}</span> @ {tx(job.place, lang)}{" "}
      <span className="t-dim">({tx(job.period, lang)}{job.current ? comma(lang) + t.ui.term.current : ""})</span>
    </div>
    <div className="t-indent">{tx(job.text, lang)}</div>
  </div>),
  // One table for every group, so the meters line up all the way down.
  skills: () => ({ lang }) => <div className="t-table t-table--3">
    {profile.skills.map((g, i) => <React.Fragment key={i}>
      <div className={"t-bright t-span" + (i ? " t-gap" : "")}>{tx(g.group, lang)}</div>
      {g.items.map((s, k) => <React.Fragment key={k}>
        <span className="t-indent">{tx(s.name, lang)}</span><span>{meter(s.level)}</span><span className="t-dim">{level(s.level)}/5</span>
      </React.Fragment>)}
    </React.Fragment>)}
  </div>,
  education: () => ({ lang }) => profile.education.map((e, i) => <div key={i} className={i ? "t-gap" : ""}>
    <div>
      <span className="t-bright">{tx(e.degree, lang)}</span> @ {tx(e.school, lang)}{" "}
      <span className="t-dim">({tx(e.period, lang)})</span>
    </div>
    <div className="t-indent">{tx(e.text, lang)}</div>
  </div>),
  languages: () => ({ lang }) => <div className="t-table t-table--3">
    {profile.languages.map((l, i) => <React.Fragment key={i}>
      <span>{tx(l.name, lang)}</span><span>{meter(l.level)}</span><span className="t-dim">{tx(l.note, lang)}</span>
    </React.Fragment>)}
  </div>,
  works: () => ({ lang, t }) => <>
    <div className="t-table t-table--3">
      {works.map((w, i) => <React.Fragment key={i}>
        <span className="t-dim">{String(i + 1).padStart(2, "0")}</span>
        <span>{tx(w.title, lang)}</span>
        <span className="t-dim">{[tx(w.year, lang), tx(w.role, lang)].filter(Boolean).join("  ")}</span>
      </React.Fragment>)}
    </div>
    <div className="t-gap t-dim">{t.ui.term.browse[0]}<Cmd c="open works" />{t.ui.term.browse[1]}</div>
  </>,
};

export default function Terminal({ t, language, onOpen, onClose }) {
  // Each line is a renderer, so it is drawn in whatever language is current.
  const [lines, setLines] = useState(() => [{ id: 0, render: ({ t }) =>
    <div>{t.ui.term.welcome[0]}<Cmd c="help" />{t.ui.term.welcome[1]}</div> }]);
  const [input, setInput] = useState("");
  const history = useRef([]);
  const cursor = useRef(-1);
  const uid = useRef(1);
  const screen = useRef(null);
  const field = useRef(null);
  const L = { lang: language, t };

  // A command runs once, now (opening an app, reading the clock); what it prints is
  // returned as a renderer for later.
  const commands = {
    ...outputs,
    open: (arg) => {
      const app = arg.toLowerCase().replace(/\/$/, "");
      if (!app) return ({ t }) => <div>{t.ui.term.usage}: <bdi>open &lt;app&gt;</bdi>  <span className="t-dim">(<bdi>{APPS.join(", ")}</bdi>)</span></div>;
      if (app === "terminal") return ({ t }) => <div className="t-dim">{t.ui.term.already}</div>;
      return onOpen(app) ? null : ({ t }) => <div className="t-err"><bdi>open: {arg}</bdi>: {t.ui.term.noApp}</div>;
    },
    cd: (arg) => (!arg || arg === "~" ? null : commands.open(arg)),
    ls: () => () => <div className="t-ls" dir="ltr">{FILES.map((f) =>
      <Cmd key={f} c={f.endsWith("/") ? "open " + f.slice(0, -1) : "cat " + f}><span className={f.endsWith("/") ? "t-dir" : ""}>{f}</span></Cmd>)}
    </div>,
    cat: (arg) => {
      const name = arg.toLowerCase().replace(/\.txt$/, "");
      if (SECTIONS.includes(name)) return outputs[name]();
      return ({ t }) => <div className="t-err"><bdi>cat{arg ? ": " + arg : ""}</bdi>: {arg ? t.ui.term.noFile : t.ui.term.missingFile}</div>;
    },
    pwd: () => () => <div dir="ltr">/home/{user}</div>,
    whoami: () => () => <div dir="ltr">{user}</div>,
    date: () => {
      const now = new Date();
      return ({ lang }) => <div>{now.toLocaleString(lang, { dateStyle: "full", timeStyle: "medium" })}</div>;
    },
    echo: (arg) => () => <div dir="auto">{arg}</div>,
    history: () => {
      const snapshot = [...history.current];
      return () => <div dir="ltr">{snapshot.map((h, i) => <div key={i}><span className="t-dim">{String(i + 1).padStart(4)}</span>  {h}</div>)}</div>;
    },
    exit: () => { onClose(); return null; },
  };

  function run(raw) {
    const text = raw.trim();
    const out = [{ echo: true, render: () => <><Prompt />{raw}</> }];
    if (text) {
      history.current.push(text);
      cursor.current = -1;
      const [name, ...rest] = text.split(/\s+/);
      const key = name.toLowerCase();
      if (key === "clear") { setLines([]); return; }
      const render = commands[key]
        ? commands[key](rest.join(" "))
        : ({ t }) => <div><bdi>{name}</bdi>{t.ui.term.notFound[0]}<Cmd c="help" />{t.ui.term.notFound[1]}</div>;
      if (render) out.push({ render });
    }
    setLines((all) => [...all, ...out.map((line) => ({ ...line, id: uid.current++ }))]);
  }
  // Clickable commands always reach the current `run`.
  const runRef = useRef(run);
  runRef.current = run;
  const [runLatest] = useState(() => (c) => runRef.current(c));

  useEffect(() => { field.current?.focus(); }, []);
  useEffect(() => { screen.current?.scrollTo({ top: screen.current.scrollHeight }); }, [lines, language]);

  function onKey(event) {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      const list = history.current;
      if (!list.length) return;
      if (event.key === "ArrowUp") cursor.current = cursor.current < 0 ? list.length - 1 : Math.max(0, cursor.current - 1);
      else cursor.current = cursor.current < 0 || cursor.current + 1 >= list.length ? -1 : cursor.current + 1;
      setInput(cursor.current < 0 ? "" : list[cursor.current]);
    } else if (event.key === "Tab") {
      event.preventDefault();
      const [name, ...rest] = input.split(" ");
      const pool = rest.length
        ? (["open", "cd"].includes(name) ? APPS : name === "cat" ? FILES.filter((f) => !f.endsWith("/")) : [])
        : Object.keys(commands).concat("clear");
      const word = (rest.length ? rest.join(" ") : name).toLowerCase();
      const hits = pool.filter((option) => option.startsWith(word));
      if (hits.length === 1) setInput(rest.length ? `${name} ${hits[0]}` : hits[0] + " ");
      else if (hits.length > 1) setLines((all) => [...all, { id: uid.current++, render: () => <div className="t-dim" dir="ltr">{hits.join("  ")}</div> }]);
    } else if (event.key === "l" && event.ctrlKey) {
      event.preventDefault();
      setLines([]);
    } else if (event.key === "Escape" && input) {
      // First Escape clears the line; the next one closes the terminal.
      event.preventDefault();
      setInput("");
    }
  }

  // The shell itself (prompt, commands) reads left to right; Arabic output reads right to left.
  const outDir = language === "ar" ? "rtl" : "ltr";
  return <div className="page terminal" dir="ltr" onClick={() => getSelection()?.isCollapsed && field.current?.focus()}>
    <IvyBorder />
    <Run.Provider value={runLatest}>
      <div className="t-screen" ref={screen}>
        <div role="log" aria-live="polite">
          {lines.map((line) => line.echo
            ? <div key={line.id} className="t-echo" dir="ltr">{line.render(L)}</div>
            : <div key={line.id} className="t-out" dir={outDir}>{line.render(L)}</div>)}
        </div>
        <form className="t-input" dir="ltr" onSubmit={(event) => { event.preventDefault(); run(input); setInput(""); }}>
          <label htmlFor="t-field"><Prompt /></label>
          <input id="t-field" ref={field} data-autofocus value={input} onChange={(event) => setInput(event.target.value)}
            onKeyDown={onKey} autoComplete="off" autoCapitalize="off" spellCheck="false" aria-label={t.ui.terminalHint} />
        </form>
      </div>
    </Run.Provider>
  </div>;
}
