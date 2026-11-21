export function paintWallpaper(canvas, hue) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const w = window.innerWidth,
    h = window.innerHeight,
    d = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(w * d);
  canvas.height = Math.round(h * d);
  ctx.setTransform(d, 0, 0, d, 0, 0);

  const sky = ctx.createRadialGradient(
    w * 0.52,
    h * 0.65,
    0,
    w * 0.5,
    h * 0.62,
    Math.max(w, h) * 0.88,
  );
  sky.addColorStop(0, "hsl(" + hue + " 56% 13%)");
  sky.addColorStop(0.55, "hsl(" + hue + " 50% 7%)");
  sky.addColorStop(1, "hsl(" + hue + " 48% 3%)");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);
  // Render contiguous cross-sections of two folded ribbons, back to front.
  // Extending the drawing beyond the viewport preserves its sweep on tall screens.
  const world = Math.max(w, h * 0.96),
    offset = (w - world) * 0.52;
  ctx.translate(offset, 0);
  ctx.scale(world, h);
  function trace(layer, t, reverse) {
    const points = 110;
    for (let j = 0; j <= points; j++) {
      const x = ((reverse ? points - j : j) / points) * 1.05 - 0.025;
      let y;
      if (layer === 0) {
        const crest =
          0.61 -
          0.41 *
            Math.exp(-Math.pow((x - 0.82 + t * 0.09) / (0.31 - 0.05 * t), 2));
        y =
          crest +
          0.5 * t +
          0.073 * Math.sin((x * 1.55 - t * 0.92) * Math.PI * 2) * t;
      } else {
        const bump = Math.exp(
          -Math.pow((x - 0.13 - t * 0.4) / (0.34 - 0.07 * t), 2),
        );
        y =
          0.84 -
          0.35 * bump +
          0.38 * t +
          0.072 * Math.sin((x * 1.16 + 0.12 - t * 0.59) * Math.PI * 2) -
          0.2 * x;
      }
      if (j === 0 && !reverse) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  }
  for (let layer = 0; layer < 2; layer++) {
    const rows = layer === 0 ? 132 : 168;
    for (let i = 0; i < rows; i++) {
      const t = i / rows;
      const bright = layer === 0 ? Math.exp(-t * 3.8) : Math.exp(-t * 2.45);
      const g = ctx.createLinearGradient(0, 0, 1, 0);
      const stops =
        layer === 0
          ? [
              [0, 5],
              [0.3, 10],
              [0.64, 37],
              [0.81, 53],
              [1, 16],
            ]
          : [
              [0, 33],
              [0.13, 56],
              [0.34, 43],
              [0.51, 17],
              [0.72, 9],
              [1, 23],
            ];
      for (const [p, l] of stops)
        g.addColorStop(
          p,
          "hsl(" + (hue + 8 * p) + " 74% " + (4.5 + l * bright) + "%)",
        );
      ctx.beginPath();
      trace(layer, t, false);
      trace(layer, (i + 1.15) / rows, true);
      ctx.closePath();
      ctx.fillStyle = g;
      ctx.fill();
      ctx.beginPath();
      trace(layer, t, false);
      ctx.strokeStyle =
        "hsla(" +
        (hue - 2) +
        " 86% " +
        (64 + 12 * bright) +
        "% / " +
        ((layer === 0 ? 0.035 : 0.047) + bright * (i % 3 === 0 ? 0.43 : 0.25)) +
        ")";
      ctx.lineWidth = 0.68 / h;
      ctx.stroke();
    }
  }
}
