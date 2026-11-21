import React from "react";

// Glowing line icons for the dock, drawn like the ivy around them: thin
// light-carrying strokes, each with a small leaf sprouting from it.
const leaf = (x, y, r) =>
  <path className="glyph-leaf" d="M0 0q2.4-2.8 5.4 0q-2.8 2.6-5.4 0z" transform={`translate(${x} ${y}) rotate(${r})`} />;

const glyphs = {
  Terminal: <>
    <rect x="4" y="6.5" width="24" height="19" rx="3.2" />
    <path d="M9.5 13l4 3-4 3M16.5 20h6.5" />
    {leaf(23.5, 6.8, -35)}
  </>,
  Works: <>
    <rect x="4" y="11" width="24" height="15" rx="2.6" />
    <path d="M12 11V8.6A1.6 1.6 0 0 1 13.6 7h4.8A1.6 1.6 0 0 1 20 8.6V11M4 17.5h24M16 16v3" />
    {leaf(4.5, 25.5, 200)}
  </>,
  Store: <>
    <path d="M7 11.5h18l-1.5 14.5H8.5z" />
    <path d="M12 14V10a4 4 0 0 1 8 0v4" />
    {leaf(24.6, 12, -40)}
  </>,
  WatchList: <>
    <rect x="4" y="9.5" width="24" height="16.5" rx="3" />
    <path d="M11 4.5l5 5 5-5" />
    <path d="M14 14.2v7.1l5.8-3.55z" className="glyph-fill" />
    {leaf(4.3, 25.6, 205)}
  </>,
  Mangas: <>
    <path d="M16 9.3C12.5 7 8.5 6.6 5 7.6v17c3.5-1 7.5-.6 11 1.7 3.5-2.3 7.5-2.7 11-1.7v-17c-3.5-1-7.5-.6-11 1.7zM16 9.3V26.3" />
    <path d="M8.5 12.5c1.8-.2 3.6.1 5 .8M8.5 16.5c1.8-.2 3.6.1 5 .8M18.5 13.3c1.4-.7 3.2-1 5-.8" className="glyph-thin" />
    {leaf(26.6, 7.6, -50)}
  </>,
};

export function DockIcon({ name }) {
  return <svg className="glyph" viewBox="0 0 32 32" aria-hidden="true">{glyphs[name]}</svg>;
}
