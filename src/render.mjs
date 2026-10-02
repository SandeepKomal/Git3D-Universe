import { computeStats, levelOf } from "./stats.mjs";
import { makeProjector, prismFaces } from "./geometry.mjs";
import { themes, FONT_STACK } from "./themes.mjs";

const W = 1280;
const H = 640;
const CX = 805;
const CY = 372;
const CELL = 10.5;
const GAP = 1.5;

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

function stars() {
  let seed = 99;
  const rand = () => {
    seed = (Math.imul(seed, 1103515245) + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  let out = "";
  for (let i = 0; i < 100; i++) {
    const big = rand() < 0.08;
    out += `<circle cx="${r1(rand() * W)}" cy="${r1(rand() * H)}" r="${big ? 1.4 : 0.7}" fill="#fff" opacity="${r1(0.12 + rand() * 0.45)}"/>`;
  }
  return out;
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
  let svg = "";
  for (const { u, v, day } of cells) {
    const isPeak = stats.peak.date === day.date && day.count > 0;
    const base = isPeak ? t.peak : t.ramp[levelOf(day.count, stats.max)];
    if (day.count === 0) {
      svg += poly(
        [project(u, v), project(u + size, v), project(u + size, v + size), project(u, v + size)],
        base,
        ` opacity=".6"`
      );
      continue;
    }
    const height = 3 + Math.pow(day.count / stats.max, 0.8) * 70;
    for (const face of prismFaces(project, u, v, size, height)) {
      svg += poly(face.pts, adjust(base, face.shade), face.top && isPeak ? ` filter="url(#glow)"` : "");
    }
  }

  const pad = 9;
  const U0 = u0 - pad, U1 = -u0 + pad, V0 = v0 - pad, V1 = -v0 + pad;
  const top = [project(U0, V0), project(U1, V0), project(U1, V1), project(U0, V1)];
  const lift = (p) => ({ x: p.x, y: p.y + 11 });
  const bottom = top.map(lift);
  const plate =
    poly(bottom, t.plateSide) +
    poly([top[3], top[2], bottom[2], bottom[3]], t.plateSide) +
    poly([top[2], top[1], bottom[1], bottom[2]], adjust(t.plateSide, 0.85)) +
    `<polygon points="${pts(top)}" fill="${t.plateTop}" stroke="${t.plateEdge}" stroke-width="1"/>`;

  return { plate, bars: svg };
}

const RINGS = [330, 405, 480];
const RING_FLATTEN = 0.3;

function orbits(data, t, animate) {
  const ellipse = (R, i) =>
    `<ellipse cx="${CX}" cy="${CY}" rx="${R}" ry="${r1(R * RING_FLATTEN)}" fill="none" stroke="url(#ringFade)" stroke-width="${i === 1 ? 1.2 : 0.8}"${i === 2 ? ` stroke-dasharray="2 7"` : ""}/>`;
  const rings = RINGS.map(ellipse).join("");

  const repos = data.repos.slice(0, 6);
  const maxStars = Math.max(1, ...repos.map((r) => r.stars));
  const satellites = repos
    .map((repo, i) => {
      const ring = i % RINGS.length;
      const R = RINGS[ring];
      const radius = 6 + 8 * Math.sqrt(repo.stars / maxStars);
      const color = HEX.test(repo.color || "") ? repo.color : t.glow;
      const label = esc(repo.name.length > 18 ? `${repo.name.slice(0, 17)}…` : repo.name);
      const duration = 52 + ring * 20 + i * 3;
      const phase = (i / repos.length + ring * 0.17) % 1;
      const start = animate
        ? `<animateMotion dur="${duration}s" begin="${r1(-duration * phase)}s" repeatCount="indefinite" path="M${CX - R},${CY} a${R},${r1(R * RING_FLATTEN)} 0 1,0 ${2 * R},0 a${R},${r1(R * RING_FLATTEN)} 0 1,0 ${-2 * R},0"/>`
        : "";
      const angle = phase * Math.PI * 2;
      const staticTransform = animate
        ? ""
        : ` transform="translate(${r1(CX + R * Math.cos(angle))} ${r1(CY + R * RING_FLATTEN * Math.sin(angle))})"`;
      return `<g${staticTransform}>${start}
  <ellipse cx="0" cy="${r1(radius + 5)}" rx="${r1(radius * 1.1)}" ry="${r1(radius * 0.3)}" fill="#000" opacity=".3"/>
  <circle r="${r1(radius)}" fill="${color}"/>
  <circle r="${r1(radius)}" fill="url(#planetShade)"/>
  <text y="${r1(-radius - 8)}" text-anchor="middle" font-size="11" font-weight="600" fill="${t.ink}" paint-order="stroke" stroke="${t.bgOuter}" stroke-width="3">${label}</text>
</g>`;
    })
    .join("\n");

  return rings + satellites;
}

function panel(data, stats, t) {
  const x = 40, y = 44, w = 300, h = 322;
  const stat = (sx, sy, value, label) =>
    `<text x="${sx}" y="${sy}" font-size="30" font-weight="700" letter-spacing="-0.5" fill="${t.ink}">${esc(value)}</text>` +
    `<text x="${sx}" y="${sy + 19}" font-size="12" fill="${t.mute}">${esc(label)}</text>`;

  // Sparkline of the last 26 weeks.
  const series = stats.weekly.slice(-26);
  const top = Math.max(1, ...series);
  const sx0 = x + 28, sw = w - 56, sy0 = y + h - 34, sh = 38;
  const step = sw / Math.max(1, series.length - 1);
  const line = series.map((v, i) => `${r1(sx0 + i * step)},${r1(sy0 - (v / top) * sh)}`);
  const area = `${sx0},${sy0} ${line.join(" ")} ${r1(sx0 + sw)},${sy0}`;

  return `<g>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" fill="url(#glassFill)" stroke="url(#glassEdge)"/>
  <text x="${x + 28}" y="${y + 52}" font-size="22" font-weight="700" letter-spacing="-0.3" fill="${t.ink}">${esc(data.name)}</text>
  <text x="${x + 28}" y="${y + 74}" font-size="13" fill="${t.mute}">@${esc(data.login)}, last 12 months</text>
  <line x1="${x + 28}" x2="${x + w - 28}" y1="${y + 94}" y2="${y + 94}" stroke="${t.rule}"/>
  ${stat(x + 28, y + 138, stats.total.toLocaleString("en-US"), "contributions")}
  ${stat(x + 170, y + 138, `${stats.activeDays}`, "active days")}
  ${stat(x + 28, y + 204, `${stats.current} d`, "current streak")}
  ${stat(x + 170, y + 204, `${stats.longest} d`, "longest streak")}
  <text x="${x + 28}" y="${y + h - 52}" font-size="11" fill="${t.mute}">Weekly activity, last 26 weeks</text>
  <polygon points="${area}" fill="${t.glow}" opacity=".22"/>
  <polyline points="${line.join(" ")}" fill="none" stroke="${t.glow}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
</g>`;
}

function legend(stats, t) {
  const x = 68, y = H - 52;
  const swatches = t.ramp.map((c, i) => `<rect x="${x + i * 18}" y="${y - 10}" width="12" height="12" rx="3" fill="${c}"/>`).join("");
  const peak = stats.peak.date
    ? `<circle cx="${x + 130}" cy="${y - 4}" r="5" fill="${t.peak}" filter="url(#glow)"/><text x="${x + 142}" y="${y}" font-size="11" fill="${t.mute}">${esc(stats.peak.date)}: ${stats.max} contributions</text>`
    : "";
  return `<text x="${x - 28}" y="${y}" font-size="11" fill="${t.mute}">less</text>${swatches}<text x="${x + 94}" y="${y}" font-size="11" fill="${t.mute}">more</text>${peak}`;
}

export function renderSvg(data, { theme = "aurora", animate = true } = {}) {
  const t = themes[theme];
  if (!t) throw new Error(`Unknown theme "${theme}". Available: ${Object.keys(themes).join(", ")}`);

  const stats = computeStats(data.weeks);
  const project = makeProjector({ yawDeg: -26, pitchDeg: 58, cx: CX, cy: CY });
  const { plate, bars } = terrain(data, stats, t, project);
  const label = `${data.name}: ${stats.total} contributions, longest streak ${stats.longest} days`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(label)}" font-family="${FONT_STACK}">
<defs>
  <radialGradient id="bg" cx="62%" cy="58%" r="85%"><stop offset="0" stop-color="${t.bgInner}"/><stop offset=".55" stop-color="${t.bgMid}"/><stop offset="1" stop-color="${t.bgOuter}"/></radialGradient>
  <linearGradient id="glassFill" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.dark ? "#fff" : "#fff"}" stop-opacity="${t.dark ? 0.09 : 0.85}"/><stop offset="1" stop-color="#fff" stop-opacity="${t.dark ? 0.03 : 0.45}"/></linearGradient>
  <linearGradient id="glassEdge" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.dark ? "#fff" : t.plateEdge}" stop-opacity=".35"/><stop offset="1" stop-color="${t.ring}" stop-opacity=".35"/></linearGradient>
  <linearGradient id="ringFade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${t.ring}" stop-opacity=".05"/><stop offset=".5" stop-color="${t.ring}" stop-opacity=".65"/><stop offset="1" stop-color="${t.ring}" stop-opacity=".05"/></linearGradient>
  <radialGradient id="planetShade" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="${t.planetLight}" stop-opacity=".85"/><stop offset=".4" stop-color="${t.planetLight}" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
  <radialGradient id="floorGlow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${t.glow}" stop-opacity="${t.dark ? 0.25 : 0.18}"/><stop offset="1" stop-color="${t.glow}" stop-opacity="0"/></radialGradient>
  <filter id="glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
${t.stars ? stars() : ""}
<ellipse cx="${CX}" cy="${CY + 30}" rx="520" ry="190" fill="url(#floorGlow)"/>
${plate}
${bars}
${orbits(data, t, animate)}
${panel(data, stats, t)}
${legend(stats, t)}
<text x="${W - 40}" y="${H - 28}" text-anchor="end" font-size="11" fill="${t.mute}" opacity=".75">${esc(data.generatedAt)}</text>
</svg>
`;
}
