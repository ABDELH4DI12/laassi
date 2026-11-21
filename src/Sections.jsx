import React from "react";

export const sections = ["about", "experience", "skills", "education", "languages"];

const leaf = (x, y, r) =>
  <path className="glyph-leaf" d="M0 0q2.4-2.8 5.4 0q-2.8 2.6-5.4 0z" transform={`translate(${x} ${y}) rotate(${r})`} />;

const glyphs = {
  about: <>
    <circle cx="16" cy="11.5" r="5" />
    <path d="M6.5 26.5c.8-5 4.6-8 9.5-8s8.7 3 9.5 8" />
    {leaf(20.4, 7.2, -40)}
  </>,
  experience: <>
    <path d="M8 5.5v21" />
    <circle cx="8" cy="9" r="2.2" className="glyph-fill" />
    <circle cx="8" cy="17" r="2.2" />
    <circle cx="8" cy="24.5" r="2.2" />
    <path d="M13 9h13M13 17h10M13 24.5h12" />
    {leaf(25.6, 9.2, -30)}
  </>,
  skills: <>
    <path d="M16 4.5l2.6 7.2 7.4.4-5.8 4.7 2 7.4L16 20l-6.2 4.2 2-7.4-5.8-4.7 7.4-.4z" />
    {leaf(22.6, 23.6, 30)}
  </>,
  education: <>
    <path d="M3.5 12.5L16 6.5l12.5 6L16 18.5z" />
    <path d="M9 15.3v6.2c2 2 4.4 3 7 3s5-1 7-3v-6.2M27 13.5v7" />
    {leaf(27, 20.6, 100)}
  </>,
  languages: <>
    <path d="M4.5 7.5h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-6l-4.5 3.6v-3.6H6.5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z" />
    <path d="M23.5 13.5h2a2 2 0 0 1 2 2v6.5a2 2 0 0 1-2 2h-1v3.2l-4-3.2h-5a2 2 0 0 1-2-2v-1" />
    {leaf(19.6, 7.8, -40)}
  </>,
};

export function SectionIcon({ name }) {
  return <svg className="glyph" viewBox="0 0 32 32" aria-hidden="true">{glyphs[name]}</svg>;
}
