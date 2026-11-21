import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { reducedMotion } from "./art";

// Real 3D theatre curtains (three.js). Each side is a pleated velvet mesh hanging
// from the rail, gathered by a tie-back partway down and flaring out below it. A
// pleated valance runs across the top. The material uses three.js "sheen", made for
// velvet: fold edges glow, valleys stay deep. Wind moves the mesh itself: ripples
// travel down the cloth and the lower part swings. World units are CSS pixels.

const PLEATS = 5.5;        // pleats per curtain
const SEG_U = 120;         // segments across
const SEG_V = 96;          // segments down
const TIE = 0.58;          // tie-back height (0 = rail, 1 = floor)

// Deep red velvet; vertex colours carry the soft shadows (valleys, under the
// valance, towards the floor) that a real curtain has.
const velvet = () => new THREE.MeshPhysicalMaterial({
  color: 0x3c0710,
  roughness: 0.95,
  metalness: 0,
  sheen: 1,
  sheenColor: new THREE.Color(0x9a2e3a),
  sheenRoughness: 0.6,
  vertexColors: true,
  side: THREE.DoubleSide,
});
const withColours = (geometry) => {
  geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(geometry.attributes.position.count * 3), 3));
  return geometry;
};

// How wide the curtain is at height v (fraction of its full width): full at the
// rail, pinched at the tie-back, opening up again towards the floor.
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const curtainWidth = (W) => Math.min(W * 0.16, 230);

function spread(v) {
  if (v < TIE) {
    const k = v / TIE;
    return 1 - 0.68 * k * k * (3 - 2 * k);
  }
  const k = (v - TIE) / (1 - TIE);
  return 0.32 + 0.3 * Math.pow(k, 0.8);
}

function Panel(side) {
  const geometry = withColours(new THREE.PlaneGeometry(1, 1, SEG_U, SEG_V));
  const mesh = new THREE.Mesh(geometry, velvet());
  mesh.userData = { side };
  return mesh;
}

// Shape and wind for one curtain. Plane vertices (x, y in -0.5..0.5) become
// u (across, 0 = outer edge) and v (down, 0 = rail).
// Per-column pleat shape (it depends only on the position across): computed once.
const COLS = (() => {
  const fold = new Float32Array(SEG_U + 1), depthK = new Float32Array(SEG_U + 1), hem = new Float32Array(SEG_U + 1);
  for (let c = 0; c <= SEG_U; c++) {
    const u = c / SEG_U;
    const uw = u + 0.045 * Math.sin(u * 13 + 1) + 0.025 * Math.sin(u * 31);   // irregular pleat widths
    fold[c] = Math.sin(uw * PLEATS * Math.PI * 2);
    depthK[c] = 0.8 + 0.2 * Math.sin(u * 9 + 2);
    hem[c] = Math.abs(Math.sin(u * PLEATS * Math.PI));
  }
  return { fold, depthK, hem };
})();

function drape(mesh, W, H, t, still, open = 1) {
  const P = mesh.geometry.attributes.position, C = mesh.geometry.attributes.color;
  const pos = P.array, col = C.array, side = mesh.userData.side;
  const top = H / 2, height = H * 1.02;
  const outer = side === "left" ? -W / 2 - 6 : W / 2 + 6, dir = side === "left" ? 1 : -1;
  // Opening: closed, each curtain spans half the stage (overlapping in the middle);
  // it slides back to its own width and gathers at the tie-back as it opens.
  const ease = open * open * (3 - 2 * open);
  const width = curtainWidth(W) + (W / 2 + 60 - curtainWidth(W)) * (1 - ease);   // closed: they overlap in the middle
  const gather = clamp01((open - 0.25) / 0.75);
  const wind = still ? 0 : 1;
  const gust = wind * (Math.sin(t * 0.55) * 0.6 + Math.sin(t * 1.3 + 1) * 0.3 + Math.sin(t * 2.6) * 0.1);
  const { fold, depthK, hem } = COLS;
  let i = 0;
  for (let r = 0; r <= SEG_V; r++) {
    const v = r / SEG_V;
    const s = 1 - (1 - spread(v)) * gather;
    // Below the tie the cloth hangs free: it swings and ripples there.
    const free = v > TIE ? (v - TIE) / (1 - TIE) : 0;
    const swing = gust * 16 * free * free + wind * Math.sin(t * 1.8 + v * 5) * 3 * free;
    // Pleats are deeper where the cloth is bunched at the tie.
    const depth = ((width * s) / PLEATS) * (0.3 + 0.35 * (1 - s));
    const rowY = top - v * height, sag = 6 * free;
    const rippleK = wind * 3 * (0.2 + v), rippleA = v * 6 - t * 1.8;
    // Soft shadows that depend on height: under the valance, towards the floor.
    const aoRow = (0.45 + 0.55 * Math.min(1, v * 7)) * (1 - 0.6 * Math.pow(v, 1.6));
    const pull = 18 * (1 - s);
    for (let c = 0; c <= SEG_U; c++, i += 3) {
      const u = c / SEG_U, f = fold[c];
      const ripple = rippleK * Math.sin(rippleA + u * 2.5);
      pos[i] = outer + dir * (u * width * s + swing * (0.4 + u));
      pos[i + 1] = rowY - hem[c] * sag;
      pos[i + 2] = f * depth * depthK[c] + ripple * (0.5 + u * 0.5) - u * pull;
      // Valleys and the outer edge sit in shadow.
      const ao = (0.4 + 0.6 * (0.5 + 0.5 * f)) * aoRow * (0.45 + 0.55 * Math.min(1, u * 2.5));
      col[i] = col[i + 1] = col[i + 2] = ao;
    }
  }
  P.needsUpdate = true;
  C.needsUpdate = true;
  mesh.geometry.computeVertexNormals();
}

// Gold tie-back: a rope wrapped across the front of the gathered waist, knotted at
// the inner edge with a tassel hanging from it.
function TieBack() {
  const gold = new THREE.MeshStandardMaterial({ color: 0x5e4a2a, metalness: 0.6, roughness: 0.6 });
  const group = new THREE.Group();
  const rope = new THREE.Mesh(new THREE.BufferGeometry(), gold);
  const knot = new THREE.Mesh(new THREE.SphereGeometry(3.4, 16, 12), gold);
  const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 14, 8), gold);
  const tassel = new THREE.Mesh(new THREE.ConeGeometry(3.6, 16, 18, 1, true), gold);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(2.4, 14, 10), gold);
  cord.position.y = -9; cap.position.y = -17; tassel.position.y = -27;
  const hanging = new THREE.Group();
  hanging.add(cord, cap, tassel);
  knot.add(hanging);
  group.add(rope, knot);
  group.userData = { rope, knot, hanging, built: "" };
  return group;
}
function tie(group, side, W, H, t, still, open = 1) {
  group.visible = open >= 1;   // tied back once the curtain is fully open
  const width = curtainWidth(W), span = width * spread(TIE) + 10;
  const outer = side === "left" ? -W / 2 - 6 : W / 2 + 6, dir = side === "left" ? 1 : -1;
  const y = H / 2 - TIE * H * 1.02;
  const { rope, knot, hanging } = group.userData;
  const key = W + "x" + H;
  if (group.userData.built !== key) {
    // The rope runs from the outer edge across the cloth (bowing towards the viewer) to the knot.
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(outer, y + 2, 20),
      new THREE.Vector3(outer + dir * span * 0.35, y - 3, 48),
      new THREE.Vector3(outer + dir * span * 0.75, y - 2, 46),
      new THREE.Vector3(outer + dir * span, y, 30),
    ]);
    rope.geometry.dispose();
    rope.geometry = new THREE.TubeGeometry(curve, 40, 2.1, 10, false);
    knot.position.set(outer + dir * span, y, 32);
    group.userData.built = key;
  }
  hanging.rotation.z = still ? 0 : Math.sin(t * 1.3) * 0.12;   // the tassel swings a little
}

// The valance: a heavy pleated pelmet across the top, straight hem.
function Valance() {
  const geometry = withColours(new THREE.PlaneGeometry(1, 1, 220, 12));
  const mesh = new THREE.Mesh(geometry, velvet());
  mesh.userData.base = geometry.attributes.position.array.slice();
  return mesh;
}
function hang(mesh, W, H, t, still) {
  const pos = mesh.geometry.attributes.position, col = mesh.geometry.attributes.color, base = mesh.userData.base;
  const depthH = Math.min(H * 0.075, 46), scallops = Math.max(6, Math.round(W / 140));
  const wind = still ? 0 : 1;
  for (let i = 0; i < pos.count; i++) {
    const u = base[i * 3] + 0.5, v = 0.5 - base[i * 3 + 1];
    const scallop = Math.pow(Math.abs(Math.sin(u * scallops * Math.PI)), 0.6);
    const x = -W / 2 - 10 + u * (W + 20);
    const y = H / 2 + 4 - v * depthH * (0.97 + 0.03 * scallop);
    const fold = Math.sin(u * scallops * 4 * Math.PI);
    const z = fold * 5 + 30 + wind * Math.sin(t * 1.2 + u * 9) * 1.5 * v;
    pos.setXYZ(i, x, y, z);
    const ao = (0.5 + 0.5 * (0.5 + 0.5 * fold)) * (0.55 + 0.45 * v);
    col.setXYZ(i, ao, ao, ao);
  }
  pos.needsUpdate = true;
  col.needsUpdate = true;
  mesh.geometry.computeVertexNormals();
}

// openDelay / openDuration (ms): the curtains start closed and draw open.
export function Drapes({ openDelay = 0, openDuration = 0 }) {
  const box = useRef(null);
  const canvas = useRef(null);

  useEffect(() => {
    const el = box.current;
    const renderer = new THREE.WebGLRenderer({ canvas: canvas.current, alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.85;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -500, 500);
    camera.position.z = 200;

    // Low-key theatre light: almost no fill, one soft warm light from above the stage.
    scene.add(new THREE.AmbientLight(0x1a0a0c, 0.6));
    const key = new THREE.DirectionalLight(0xffe2c4, 2.1);
    key.position.set(0, 320, 220);
    scene.add(key);
    const rimL = new THREE.DirectionalLight(0xd98a5c, 1.0);
    rimL.position.set(300, -40, 120);
    scene.add(rimL);
    const rimR = new THREE.DirectionalLight(0xd98a5c, 1.0);
    rimR.position.set(-300, -40, 120);
    scene.add(rimR);

    const left = Panel("left"), right = Panel("right"), valance = Valance();
    const tieL = TieBack(), tieR = TieBack();
    scene.add(left, right, valance, tieL, tieR);

    const still = reducedMotion();
    const start = performance.now() + openDelay;
    const progress = (now) => (still || !openDuration ? 1 : clamp01((now - start) / openDuration));
    let W = 0, H = 0, raf = 0, last = 0;
    const resize = () => {
      W = el.offsetWidth; H = el.offsetHeight;
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
      renderer.setSize(W, H, false);
      Object.assign(camera, { left: -W / 2, right: W / 2, top: H / 2, bottom: -H / 2 });
      camera.updateProjectionMatrix();
    };
    const draw = (now) => {
      const t = still ? 0 : now / 1000, open = progress(now);
      drape(left, W, H, t, still, open);
      drape(right, W, H, t + 1.7, still, open);
      hang(valance, W, H, t, still);
      tie(tieL, "left", W, H, t, still, open);
      tie(tieR, "right", W, H, t + 1.7, still, open);
      renderer.render(scene, camera);
    };
    // Cloth moves slowly: ~30 fps is plenty, but the opening runs at full speed.
    // Pause while the tab is hidden.
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const opening = progress(now) < 1 && now >= start;
      if (document.hidden || (!opening && now - last < 32)) return;
      last = now;
      draw(now);
    };
    resize();
    draw(performance.now());
    const ro = new ResizeObserver(() => { resize(); draw(performance.now()); });
    ro.observe(el);
    if (!still) raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      scene.traverse((o) => { o.geometry?.dispose(); o.material?.dispose?.(); });
      renderer.dispose();
    };
  }, []);

  return <div className="drapes" ref={box} aria-hidden="true">
    <div className="drapes-frame" />
    <canvas ref={canvas} />
  </div>;
}
