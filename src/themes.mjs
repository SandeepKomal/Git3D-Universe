// Colour tokens. Every colour that reaches the SVG comes from here.
// Both themes use neon colours: blue, green, purple and pink. Night mode has
// a radium-yellow peak day; day mode is clean white with a tangerine peak.

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
    borderA: "#ffffff",
    borderB: "#00b7ff",
    rim: "#ff10f0",
    // Bar tops get an outline in a tint of their own colour, like a neon tube.
    neonEdges: true,
    stars: true,
  },
  // Day: clean white with neon-pink and neon-green borders, and light, crisp
  // neon colours: sky blue → fresh green → lavender → bubblegum pink, with a
  // tangerine peak day.
  daylight: {
    dark: false,
    bgInner: "#ffffff",
    bgMid: "#ffffff",
    bgOuter: "#ffffff",
    plateTop: "#ffffff",
    plateEdge: "#ff4fcf",
    plateSide: "#f6f7fb",
    ramp: ["#ffffff", "#3ec5ff", "#4ee66a", "#b77cff", "#ff5fd2"],
    peak: "#ff8a1f",
    ink: "#141433",
    mute: "#5d6285",
    rule: "#f1e4f3",
    ring: "#3ec5ff",
    ringHi: "#ffffff",
    glow: "#ff4fcf",
    cellEdge: "#e7e9f2",
    planetLight: "#ffffff",
    nebulaA: "#ffffff",
    nebulaB: "#ffffff",
    grid: "#eef0f6",
    planets: ["#ff5fd2", "#4ee66a", "#3ec5ff", "#ff8a1f", "#b77cff", "#2ee6d6", "#ffc83d"],
    floor: ["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"],
    shadow: "#9aa0c4",
    // Card borders run pink to green, and the plate's front edge glows green.
    borderA: "#ff4fcf",
    borderB: "#4ee66a",
    rim: "#4ee66a",
    neonEdges: true,
    stars: false,
  },
};

export const FONT_STACK = "ui-sans-serif, 'SF Pro Display', 'Segoe UI', Inter, Helvetica, Arial, sans-serif";
