import { computeStats, levelOf } from "./stats.mjs";
import { makeProjector, prismFaces } from "./geometry.mjs";
import { themes, FONT_STACK } from "./themes.mjs";

const W = 1280;
const H = 640;
const CX = 805;
const CY = 372;
const CELL = 10.5;
const GAP = 1.5;
const YAW = -26;
const PITCH = 58;
const PLATE_PAD = 9;
const PLATE_DEPTH = 20; // world units below the ground plane

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c]));
const r1 = (n) => Math.round(n * 10) / 10;
const HEX = /^#[0-9a-fA-F]{6}$/;

function adjust(hex, k) {
  const ch = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const out = ch.map((v) => (k >= 1 ? v + (255 - v) * (k - 1) : v * k));
  return "#" + out.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
}

const pts = (list) => list.map((p) => `${r1(p.x)},${r1(p.y)}`).join(" ");
const poly = (list, fill, extra = "") => `<polygon points="${pts(list)}" fill="${fill}"${extra}/>`;

// "2026-06-03" -> "Jun 3"
function shortDate(iso) {
  const [, m, d] = String(iso).split("-").map(Number);
  return m >= 1 && m <= 12 && d ? `${MONTHS[m - 1]} ${d}` : esc(iso);
}

function lcg(seed) {
  return () => {
    seed = (Math.imul(seed, 1103515245) + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}

function stars(animate) {
  const rand = lcg(99);
  let out = "";
  for (let i = 0; i < 110; i++) {
    const big = rand() < 0.08;
    const x = r1(rand() * W);
    const y = r1(rand() * H);
    const o = r1(0.12 + rand() * 0.45);
    if (big && animate) {
      const dur = r1(3 + rand() * 4);
      out += `<circle cx="${x}" cy="${y}" r="1.4" fill="#fff" opacity="${o}"><animate attributeName="opacity" values="${o};.9;${o}" dur="${dur}s" begin="${r1(-rand() * dur)}s" repeatCount="indefinite"/></circle>`;
    } else {
      out += `<circle cx="${x}" cy="${y}" r="${big ? 1.4 : 0.7}" fill="#fff" opacity="${o}"/>`;
    }
  }
  return out;
}

// Soft colour clouds behind the scene so the backdrop has depth instead of a flat fill.
function nebula() {
  return `<ellipse cx="1010" cy="170" rx="360" ry="190" fill="url(#nebA)"/><ellipse cx="560" cy="520" rx="420" ry="170" fill="url(#nebB)"/>`;
}

// A ground-plane grid around the plate, faded out radially by a mask.
function floorGrid(data, project, t) {
  const halfU = (data.weeks.length * CELL) / 2 + 190;
  const halfV = (7 * CELL) / 2 + 170;
  const step = CELL * 3;
  const h = -PLATE_DEPTH;
  let lines = "";
  for (let u = -Math.floor(halfU / step) * step; u <= halfU; u += step) {
    const a = project(u, -halfV, h), b = project(u, halfV, h);
    lines += `M${r1(a.x)},${r1(a.y)}L${r1(b.x)},${r1(b.y)}`;
  }
  for (let v = -Math.floor(halfV / step) * step; v <= halfV; v += step) {
    const a = project(-halfU, v, h), b = project(halfU, v, h);
    lines += `M${r1(a.x)},${r1(a.y)}L${r1(b.x)},${r1(b.y)}`;
  }
  return `<path d="${lines}" fill="none" stroke="${t.grid}" stroke-width=".6" opacity="${t.dark ? ".55" : ".5"}" mask="url(#gridMask)"/>`;
}

function terrain(data, stats, t, project) {
  const weekCount = data.weeks.length;
  const u0 = (-weekCount * CELL) / 2;
  const v0 = (-7 * CELL) / 2;

  const cells = [];
  data.weeks.forEach((week, i) =>
    week.forEach((day, j) => {
      const u = u0 + i * CELL + GAP / 2;
      const v = v0 + j * CELL + GAP / 2;
      cells.push({ u, v, day, depth: project(u, v, 0).depth });
    })
  );
  cells.sort((a, b) => a.depth - b.depth);

  const size = CELL - GAP;
  const heightOf = (count) => 3 + Math.pow(count / stats.max, 0.8) * 70;
  let svg = "";
  let peakTop = null;
  for (const { u, v, day } of cells) {
    const isPeak = stats.peak.date === day.date && day.count > 0;
    const base = isPeak ? t.peak : t.ramp[levelOf(day.count, stats.max)];
    if (day.count === 0) {
      svg += poly(
        [project(u, v), project(u + size, v), project(u + size, v + size), project(u, v + size)],
        base,
        ` opacity="${t.dark ? ".72" : ".6"}" stroke="${t.cellEdge}" stroke-width=".45" stroke-opacity="${t.dark ? ".62" : ".5"}"`
      );
      continue;
    }
    const height = heightOf(day.count);
    for (const face of prismFaces(project, u, v, size, height)) {
      const edge = face.top ? ` stroke="${t.cellEdge}" stroke-width=".45" stroke-opacity=".62"` : "";
      const glow = face.top && isPeak ? ` filter="url(#glow)"` : "";
      svg += poly(face.pts, adjust(base, face.shade), `${edge}${glow}`);
    }
    if (isPeak) peakTop = project(u + size / 2, v + size / 2, height);
  }

  // The plate is a slab under the calendar; only faces turned toward the viewer are drawn.
  const U0 = u0 - PLATE_PAD, U1 = -u0 + PLATE_PAD, V0 = v0 - PLATE_PAD, V1 = -v0 + PLATE_PAD;
  const corner = (u, v, h = 0) => project(u, v, h);
  const top = [corner(U0, V0), corner(U1, V0), corner(U1, V1), corner(U0, V1)];
  const bottom = [corner(U0, V0, -PLATE_DEPTH), corner(U1, V0, -PLATE_DEPTH), corner(U1, V1, -PLATE_DEPTH), corner(U0, V1, -PLATE_DEPTH)];
  const sides = [
    { n: [0, 1], i: [3, 2], shade: 1 },
    { n: [-1, 0], i: [0, 3], shade: 0.8 },
    { n: [1, 0], i: [2, 1], shade: 0.8 },
    { n: [0, -1], i: [1, 0], shade: 1 },
  ]
    .filter((s) => project.facing(s.n[0], s.n[1]) > 0)
    .map((s) => poly([top[s.i[0]], top[s.i[1]], bottom[s.i[1]], bottom[s.i[0]]], adjust(t.plateSide, s.shade)))
    .join("");

  const shadow = `<polygon points="${pts(bottom.map((p) => ({ x: p.x + 6, y: p.y + 22 })))}" fill="${t.shadow}" opacity="${t.dark ? ".75" : ".35"}" filter="url(#soft)"/>`;
  // Rim light along the two front edges catches the eye and separates plate from floor.
  const rim = `<polyline points="${pts([top[0], top[3], top[2]])}" fill="none" stroke="url(#rimFade)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>`;
  const plate =
    shadow +
    sides +
    `<polygon points="${pts(top)}" fill="url(#plateFill)" stroke="${t.plateEdge}" stroke-width="1"/>` +
    rim;

  // Month ticks along the front edge, below the slab.
  let months = "";
  let prev = -1;
  data.weeks.forEach((week, i) => {
    const m = Number(String(week[0]?.date || "").slice(5, 7));
    if (!m || m === prev) return;
    const first = prev === -1;
    prev = m;
    if (first && Number(String(week[0].date).slice(8, 10)) > 14) return; // partial leading month
    const a = project(u0 + i * CELL, V1, -PLATE_DEPTH);
    months += `<line x1="${r1(a.x)}" y1="${r1(a.y + 3)}" x2="${r1(a.x)}" y2="${r1(a.y + 8)}" stroke="${t.mute}" stroke-opacity=".6"/><text x="${r1(a.x)}" y="${r1(a.y + 20)}" text-anchor="middle" font-size="10" letter-spacing=".4" fill="${t.mute}">${MONTHS[m - 1]}</text>`;
  });

  return { plate, bars: svg, months, peakTop };
}

// A light beam rising from the busiest day, with a callout at its tip.
function beacon(peakTop, stats, t) {
  if (!peakTop) return "";
  const x = r1(peakTop.x), y0 = r1(peakTop.y - 2), y1 = r1(peakTop.y - 78);
  const label = `${shortDate(stats.peak.date)} · ${stats.max}`;
  const w = 26 + label.length * 6.4;
  return `<g>
  <linearGradient id="beam" gradientUnits="userSpaceOnUse" x1="0" y1="${y0}" x2="0" y2="${y1}"><stop offset="0" stop-color="${t.peak}" stop-opacity=".95"/><stop offset="1" stop-color="${t.peak}" stop-opacity="0"/></linearGradient>
  <line x1="${x}" y1="${y0}" x2="${x}" y2="${y1}" stroke="url(#beam)" stroke-width="7" opacity=".25"/>
  <line x1="${x}" y1="${y0}" x2="${x}" y2="${y1}" stroke="url(#beam)" stroke-width="1.5"/>
  <rect x="${r1(x - 11)}" y="${r1(y1 - 22)}" width="${r1(w)}" height="20" rx="10" fill="${t.bgOuter}" fill-opacity=".72" stroke="${t.peak}" stroke-opacity=".55"/>
  <circle cx="${x}" cy="${r1(y1 - 12)}" r="3" fill="${t.peak}"/>
  <text x="${r1(x + 8)}" y="${r1(y1 - 8)}" font-size="11" font-weight="600" fill="${t.ink}">${esc(label)}</text>
</g>`;
}

const RINGS = [330, 405, 480];
const RING_FLATTEN = 0.3;

// Planets orbit in a plane that passes behind the calendar on its far side
// and in front of it on its near side. Rings are split into a back and a front
// arc; each planet is drawn twice, once per layer, clipped to its half, so the
// animated copies stay in lockstep and the far side is hidden by the terrain.
function orbits(data, t, animate) {
  const arc = (R, sweep) => `M${CX - R},${CY} A${R},${r1(R * RING_FLATTEN)} 0 0,${sweep} ${CX + R},${CY}`;
  const ringPath = (R, i, sweep) =>
    `<path d="${arc(R, sweep)}" fill="none" stroke="url(#ringFade)" stroke-width="${i === 1 ? 1.2 : 0.8}"${i === 2 ? ` stroke-dasharray="2 7"` : ""}${sweep ? ` opacity=".6"` : ""}/>`;

  const repos = data.repos.slice(0, 6);
  const maxStars = Math.max(1, ...repos.map((r) => r.stars));
  const planet = (repo, i) => {
    const ring = i % RINGS.length;
    const R = RINGS[ring];
    const ry = r1(R * RING_FLATTEN);
    const radius = 6 + 8 * Math.sqrt(repo.stars / maxStars);
    const color = HEX.test(repo.color || "") ? repo.color : t.glow;
    const name = esc(repo.name.length > 18 ? `${repo.name.slice(0, 17)}…` : repo.name);
    const starsLabel = repo.stars > 0 ? `<tspan fill="${t.mute}" font-weight="500"> ★${Number(repo.stars) | 0}</tspan>` : "";
    const duration = 52 + ring * 20 + i * 3;
    const phase = (i / repos.length + ring * 0.17) % 1;
    const begin = r1(-duration * phase);

    // Path starts on the left and runs through the near side first.
    const path = `M${CX - R},${CY} a${R},${ry} 0 1,0 ${2 * R},0 a${R},${ry} 0 1,0 ${-2 * R},0`;
    const samples = 12;
    // Planets swell slightly on the near side and shrink on the far side.
    const scales = Array.from({ length: samples + 1 }, (_, k) => 1 + 0.18 * Math.sin((2 * Math.PI * k) / samples));
    const angle = Math.PI - 2 * Math.PI * phase;
    const near = Math.sin(angle);

    const motion = animate
      ? `<animateMotion dur="${duration}s" begin="${begin}s" repeatCount="indefinite" path="${path}"/>`
      : "";
    const scale = animate
      ? `<animateTransform attributeName="transform" type="scale" values="${scales.map((s) => r1(s * 100) / 100).join(";")}" dur="${duration}s" begin="${begin}s" repeatCount="indefinite"/>`
      : "";
    const place = animate ? "" : ` transform="translate(${r1(CX + R * Math.cos(angle))} ${r1(CY + R * RING_FLATTEN * near)})"`;
    const staticScale = animate ? "" : ` transform="scale(${r1((1 + 0.18 * near) * 100) / 100})"`;

    const halo = i === 0
      ? [
          `<path d="M${r1(-radius * 1.9)},0 A${r1(radius * 1.9)},${r1(radius * 0.5)} 0 0,1 ${r1(radius * 1.9)},0" fill="none" stroke="${color}" stroke-opacity=".55" stroke-width="1.6" transform="rotate(-16)"/>`,
          `<path d="M${r1(-radius * 1.9)},0 A${r1(radius * 1.9)},${r1(radius * 0.5)} 0 0,0 ${r1(radius * 1.9)},0" fill="none" stroke="${color}" stroke-opacity=".8" stroke-width="1.6" transform="rotate(-16)"/>`,
        ]
      : ["", ""];

    const body = `<g${place}>${motion}<g${staticScale}>${scale}
  <ellipse cx="0" cy="${r1(radius + 5)}" rx="${r1(radius * 1.1)}" ry="${r1(radius * 0.3)}" fill="#000" opacity=".28"/>
  <circle r="${r1(radius + 3.5)}" fill="${color}" opacity=".16"/>
  ${halo[0]}<circle r="${r1(radius)}" fill="${color}"/>
  <circle r="${r1(radius)}" fill="url(#planetShade)"/>
  <circle r="${r1(radius - 0.6)}" fill="none" stroke="${t.planetLight}" stroke-opacity=".35" stroke-width=".8"/>${halo[1]}
</g></g>`;

    // Labels sit above everything so they stay readable when the planet is
    // behind the terrain; they dim on the far side instead of being cut off.
    const fade = (n) => r1((n >= 0 ? 1 : 1 + 0.5 * n) * 100) / 100;
    const fadeAnim = animate
      ? `<animate attributeName="opacity" values="${scales.map((_, k) => fade(Math.sin((2 * Math.PI * k) / samples))).join(";")}" dur="${duration}s" begin="${begin}s" repeatCount="indefinite"/>`
      : "";
    const label = `<g${place}>${motion}<g${staticScale}>${scale}<text y="${r1(-radius - 9)}" text-anchor="middle" font-size="11" font-weight="600" fill="${t.ink}" paint-order="stroke" stroke="${t.bgOuter}" stroke-width="3" stroke-linejoin="round"${animate ? "" : ` opacity="${fade(near)}"`}>${fadeAnim}${name}${starsLabel}</text></g></g>`;
    return { body, label, near };
  };

  const bodies = repos.map(planet);
  const layer = (clip, pick) =>
    animate
      ? `<g clip-path="url(#${clip})">${bodies.map((b) => b.body).join("\n")}</g>`
      : bodies.filter(pick).map((b) => b.body).join("\n");

  return {
    back: RINGS.map((R, i) => ringPath(R, i, 1)).join("") + layer("farSide", (b) => b.near < 0),
    front: RINGS.map((R, i) => ringPath(R, i, 0)).join("") + layer("nearSide", (b) => b.near >= 0),
    labels: bodies.map((b) => b.label).join("\n"),
  };
}

function panel(data, stats, t) {
  const x = 40, y = 44, w = 300, h = 322;
  const stat = (sx, sy, value, label) =>
    `<text x="${sx}" y="${sy}" font-size="30" font-weight="700" letter-spacing="-0.5" fill="${t.ink}">${esc(value)}</text>` +
    `<text x="${sx}" y="${sy + 19}" font-size="12" fill="${t.mute}">${esc(label)}</text>`;

  // Sparkline of the last 26 weeks, drawn below its caption.
  const series = stats.weekly.slice(-26);
  const top = Math.max(1, ...series);
  const sx0 = x + 28, sw = w - 56, sy0 = y + h - 26, sh = 34;
  const step = sw / Math.max(1, series.length - 1);
  const line = series.map((v, i) => `${r1(sx0 + i * step)},${r1(sy0 - (v / top) * sh)}`);
  const area = `${sx0},${sy0} ${line.join(" ")} ${r1(sx0 + sw)},${sy0}`;
  const last = line[line.length - 1] || `${sx0},${sy0}`;
  const [lx, ly] = last.split(",");

  return `<g>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" fill="url(#glassFill)" stroke="url(#glassEdge)"/>
  <rect x="${x + 28}" y="${y + 26}" width="18" height="3" rx="1.5" fill="${t.glow}"/>
  <text x="${x + 52}" y="${y + 31}" font-size="9.5" font-weight="700" letter-spacing="1.6" fill="${t.glow}">CONTRIBUTION OBSERVATORY</text>
  <text x="${x + 28}" y="${y + 62}" font-size="22" font-weight="700" letter-spacing="-0.3" fill="${t.ink}">${esc(data.name)}</text>
  <text x="${x + 28}" y="${y + 82}" font-size="13" fill="${t.mute}">@${esc(data.login)} · last 12 months</text>
  <line x1="${x + 28}" x2="${x + w - 28}" y1="${y + 100}" y2="${y + 100}" stroke="${t.rule}"/>
  ${stat(x + 28, y + 140, stats.total.toLocaleString("en-US"), "contributions")}
  ${stat(x + 170, y + 140, `${stats.activeDays}`, "active days")}
  ${stat(x + 28, y + 202, `${stats.current} d`, "current streak")}
  ${stat(x + 170, y + 202, `${stats.longest} d`, "longest streak")}
  <text x="${x + 28}" y="${y + 250}" font-size="11" fill="${t.mute}">Weekly activity · last 26 weeks</text>
  <polygon points="${area}" fill="url(#sparkFill)"/>
  <polyline points="${line.join(" ")}" fill="none" stroke="${t.glow}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
  <circle cx="${lx}" cy="${ly}" r="3.2" fill="${t.glow}" stroke="${t.bgOuter}" stroke-width="1.5"/>
</g>`;
}

// Legend card: the intensity ramp drawn as tiny prisms that echo the terrain.
function legend(stats, t) {
  const x = 40, y = 384, w = 300, h = 120;
  let ramp = "";
  t.ramp.forEach((color, i) => {
    const p = makeProjector({ yawDeg: YAW, pitchDeg: PITCH, cx: x + 40 + i * 25, cy: y + 66 });
    const size = 11;
    if (i === 0) {
      ramp += poly([p(-size / 2, -size / 2), p(size / 2, -size / 2), p(size / 2, size / 2), p(-size / 2, size / 2)], color, ` stroke="${t.cellEdge}" stroke-width=".6"`);
      return;
    }
    for (const face of prismFaces(p, -size / 2, -size / 2, size, i * 8)) {
      ramp += poly(face.pts, adjust(color, face.shade), face.top ? ` stroke="${t.cellEdge}" stroke-width=".45" stroke-opacity=".62"` : "");
    }
  });

  const peak = stats.peak.date
    ? `<text x="${x + 186}" y="${y + 64}" font-size="18" font-weight="700" fill="${t.ink}">${esc(shortDate(stats.peak.date))}</text>
  <text x="${x + 186}" y="${y + 82}" font-size="11" fill="${t.mute}">${stats.max} contributions</text>`
    : `<text x="${x + 186}" y="${y + 64}" font-size="12" fill="${t.mute}">No activity yet</text>`;

  return `<g>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="url(#glassFill)" stroke="url(#glassEdge)"/>
  <text x="${x + 28}" y="${y + 28}" font-size="11" fill="${t.mute}">Daily intensity</text>
  ${ramp}
  <text x="${x + 28}" y="${y + 92}" font-size="10" fill="${t.mute}" opacity=".8">less</text>
  <text x="${x + 152}" y="${y + 92}" font-size="10" fill="${t.mute}" opacity=".8" text-anchor="end">more</text>
  <line x1="${x + 170}" x2="${x + 170}" y1="${y + 20}" y2="${y + 90}" stroke="${t.rule}"/>
  <circle cx="${x + 190}" cy="${y + 24}" r="4" fill="${t.peak}" filter="url(#glow)"/>
  <text x="${x + 200}" y="${y + 28}" font-size="11" fill="${t.mute}">Peak day</text>
  ${peak}
  <text x="${x + 28}" y="${y + h - 10}" font-size="10" fill="${t.mute}" opacity=".8">Planets: top repositories · size by stars</text>
</g>`;
}

export function renderSvg(data, { theme = "aurora", animate = true } = {}) {
  const t = themes[theme];
  if (!t) throw new Error(`Unknown theme "${theme}". Available: ${Object.keys(themes).join(", ")}`);

  const stats = computeStats(data.weeks);
  const project = makeProjector({ yawDeg: YAW, pitchDeg: PITCH, cx: CX, cy: CY });
  const { plate, bars, months, peakTop } = terrain(data, stats, t, project);
  const orbit = orbits(data, t, animate);
  const label = `${data.name}: ${stats.total} contributions, longest streak ${stats.longest} days`;
  const desc =
    `3D contribution terrain for @${data.login}: ${stats.total} contributions over ${stats.activeDays} active days, ` +
    `current streak ${stats.current} days, longest streak ${stats.longest} days` +
    (stats.peak.date ? `, busiest day ${stats.peak.date} with ${stats.max} contributions.` : ".");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(label)}" font-family="${FONT_STACK}">
<title>${esc(label)}</title>
<desc>${esc(desc)}</desc>
<defs>
  <radialGradient id="bg" cx="62%" cy="58%" r="85%"><stop offset="0" stop-color="${t.bgInner}"/><stop offset=".55" stop-color="${t.bgMid}"/><stop offset="1" stop-color="${t.bgOuter}"/></radialGradient>
  <radialGradient id="nebA"><stop offset="0" stop-color="${t.nebulaA}" stop-opacity="${t.dark ? 0.28 : 0.6}"/><stop offset="1" stop-color="${t.nebulaA}" stop-opacity="0"/></radialGradient>
  <radialGradient id="nebB"><stop offset="0" stop-color="${t.nebulaB}" stop-opacity="${t.dark ? 0.22 : 0.55}"/><stop offset="1" stop-color="${t.nebulaB}" stop-opacity="0"/></radialGradient>
  <radialGradient id="gridFade" cx="63%" cy="64%" r="42%"><stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  <mask id="gridMask"><rect width="${W}" height="${H}" fill="url(#gridFade)"/></mask>
  <linearGradient id="glassFill" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="${t.dark ? 0.09 : 0.85}"/><stop offset="1" stop-color="#fff" stop-opacity="${t.dark ? 0.03 : 0.45}"/></linearGradient>
  <linearGradient id="glassEdge" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.dark ? "#fff" : t.plateEdge}" stop-opacity=".35"/><stop offset="1" stop-color="${t.ring}" stop-opacity=".35"/></linearGradient>
  <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.glow}" stop-opacity=".35"/><stop offset="1" stop-color="${t.glow}" stop-opacity="0"/></linearGradient>
  <linearGradient id="plateFill" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${adjust(t.plateTop, 0.85)}"/><stop offset="1" stop-color="${adjust(t.plateTop, 1.08)}"/></linearGradient>
  <linearGradient id="rimFade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${t.glow}" stop-opacity=".9"/><stop offset=".6" stop-color="${t.glow}" stop-opacity=".45"/><stop offset="1" stop-color="${t.glow}" stop-opacity=".1"/></linearGradient>
  <linearGradient id="ringFade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${t.ring}" stop-opacity=".05"/><stop offset=".5" stop-color="${t.ring}" stop-opacity=".65"/><stop offset="1" stop-color="${t.ring}" stop-opacity=".05"/></linearGradient>
  <radialGradient id="planetShade" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="${t.planetLight}" stop-opacity=".85"/><stop offset=".4" stop-color="${t.planetLight}" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
  <radialGradient id="floorGlow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${t.glow}" stop-opacity="${t.dark ? 0.25 : 0.18}"/><stop offset="1" stop-color="${t.glow}" stop-opacity="0"/></radialGradient>
  <clipPath id="farSide"><rect width="${W}" height="${CY}"/></clipPath>
  <clipPath id="nearSide"><rect y="${CY}" width="${W}" height="${H - CY}"/></clipPath>
  <filter id="glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="soft" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="12"/></filter>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
${nebula()}
${t.stars ? stars(animate) : ""}
${floorGrid(data, project, t)}
<ellipse cx="${CX}" cy="${CY + 30}" rx="520" ry="190" fill="url(#floorGlow)"/>
${orbit.back}
${plate}
${bars}
${months}
${beacon(peakTop, stats, t)}
${orbit.front}
${orbit.labels}
${panel(data, stats, t)}
${legend(stats, t)}
<text x="${W - 40}" y="${H - 28}" text-anchor="end" font-size="11" fill="${t.mute}" opacity=".75">Updated ${esc(data.generatedAt)}</text>
</svg>
`;
}
