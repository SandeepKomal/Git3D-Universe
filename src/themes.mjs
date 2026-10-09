// Colour tokens. Every colour that reaches the SVG comes from here.
// Night mode uses glowing neons (blue, green, purple, pink) with a
// radium-yellow peak. Day mode is clean white with very light pastel neons.
// In animated mode a colour wave rolls across the grid in both themes.

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
    // A neon colour wave rolls across the grid in animated mode.
    wave: ["#ff10f0", "#00b7ff", "#39ff14", "#bc13fe"],
    waveOpacity: 0.32,
    // Bar tops get an outline in a tint of their own colour, like a neon tube.
    neonEdges: true,
    stars: true,
  },
  // Day: clean white with soft pink and mint borders, and very light pastel
  // neons for a premium look: ice blue → mint → lilac → blush pink, with a
  // soft apricot peak day.
  daylight: {
    dark: false,
    bgInner: "#ffffff",
    bgMid: "#ffffff",
    bgOuter: "#ffffff",
    plateTop: "#ffffff",
    plateEdge: "#ff8fe0",
    plateSide: "#f6f7fb",
    ramp: ["#ffffff", "#9ddcff", "#9cf0b0", "#d2b0ff", "#ffa6e6"],
    peak: "#ffb36b",
    ink: "#141433",
    mute: "#5d6285",
    rule: "#f1e4f3",
    ring: "#7fd3ff",
    ringHi: "#ffffff",
    glow: "#ff8fe0",
    cellEdge: "#e7e9f2",
    planetLight: "#ffffff",
    nebulaA: "#ffffff",
    nebulaB: "#ffffff",
    grid: "#eef0f6",
    planets: ["#ff9fe2", "#94f0a8", "#8fdcff", "#ffb067", "#cfa8ff", "#8ff0e6", "#ffd77a"],
    floor: ["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"],
    shadow: "#9aa0c4",
    // Card borders run pink to green, and the plate's front edge glows green.
    borderA: "#ff8fe0",
    borderB: "#7ee89a",
    rim: "#7ee89a",
    wave: ["#ffb3ec", "#9fe6ff", "#a8f5bc", "#d9bfff"],
    waveOpacity: 0.6,
    neonEdges: true,
    stars: false,
  },
};

export const FONT_STACK = "ui-sans-serif, 'SF Pro Display', 'Segoe UI', Inter, Helvetica, Arial, sans-serif";
