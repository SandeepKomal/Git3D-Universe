// Colour tokens. Every colour that reaches the SVG comes from here.
// Both themes use radium (neon) colours: blue, green, purple and pink, with
// a radium-yellow peak day at night and a neon-orange one by day.

export const themes = {
  // Night: fluorescent colours on near-black. Activity goes neon blue →
  // neon green → neon purple → neon pink, and the peak day glows radium yellow.
  aurora: {
    dark: true,
    bgInner: "#0e0b22",
    bgMid: "#07061a",
    bgOuter: "#030308",
    plateTop: "#0d0b20",
    plateEdge: "#3a2b8f",
    plateSide: "#070614",
    ramp: ["#16133a", "#00b7ff", "#39ff14", "#bc13fe", "#ff10f0"],
    peak: "#e6ff00",
    ink: "#f2f4ff",
    mute: "#a6abcf",
    rule: "#241f4f",
    ring: "#00b7ff",
    ringHi: "#d9f7ff",
    glow: "#ff10f0",
    cellEdge: "#4b3fb0",
    planetLight: "#ffffff",
    nebulaA: "#ff10f0",
    nebulaB: "#00b7ff",
    grid: "#2a2470",
    planets: ["#ff10f0", "#39ff14", "#00b7ff", "#e6ff00", "#bc13fe", "#00fff0", "#ff7a00"],
    // Empty days drift through this band across the year.
    floor: ["#141137", "#161642", "#141b44", "#18143f", "#1e1242", "#141137"],
    shadow: "#000000",
    // Bar tops get a bright outline in their own colour, like a neon tube.
    neonEdges: true,
    stars: true,
  },
  // Day: slightly deeper neons, which stay readable on a white sky.
  daylight: {
    dark: false,
    bgInner: "#ffffff",
    bgMid: "#f5f6fc",
    bgOuter: "#e9ebf5",
    plateTop: "#eceefa",
    plateEdge: "#c4c9e6",
    plateSide: "#d5d9ef",
    ramp: ["#e2e5f5", "#0091ff", "#1fc700", "#a100ff", "#ff00b8"],
    peak: "#ff6a00",
    ink: "#141433",
    mute: "#5d6285",
    rule: "#d9dcef",
    ring: "#0091ff",
    ringHi: "#ffffff",
    glow: "#ff00b8",
    cellEdge: "#c3c8e6",
    planetLight: "#ffffff",
    nebulaA: "#ffd1f3",
    nebulaB: "#cfe8ff",
    grid: "#cdd2ec",
    planets: ["#ff00b8", "#1fc700", "#0091ff", "#ff6a00", "#a100ff", "#00b8c7", "#e0b800"],
    floor: ["#e6e9fa", "#e3effb", "#e1f6f0", "#ece6fa", "#f8e6f4", "#e6e9fa"],
    shadow: "#7d84b3",
    stars: false,
  },
};

export const FONT_STACK = "ui-sans-serif, 'SF Pro Display', 'Segoe UI', Inter, Helvetica, Arial, sans-serif";
