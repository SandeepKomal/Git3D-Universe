// Colour tokens. Every colour that reaches the SVG comes from here.
// Both themes are built on one palette: near-black and silver, a magenta,
// violet and burnt-orange signature gradient, and periwinkle, cyan, gold,
// orange and pink accents.

export const themes = {
  // Night: activity climbs a full spectrum, periwinkle → cyan → gold → orange,
  // with the peak day in hot pink, over a deep violet floor.
  aurora: {
    dark: true,
    bgInner: "#1d0b33",
    bgMid: "#110620",
    bgOuter: "#0c0c0c",
    plateTop: "#1a1029",
    plateEdge: "#5b1b8f",
    plateSide: "#0e0717",
    ramp: ["#2a1d40", "#8e96ff", "#9af5ff", "#ffe29a", "#ff8a3d"],
    peak: "#ff5fa2",
    ink: "#d7e2ea",
    mute: "#9aa4b2",
    rule: "#2e2440",
    ring: "#8e96ff",
    ringHi: "#f4d9ff",
    glow: "#c04be0",
    cellEdge: "#7a5fb0",
    planetLight: "#ffffff",
    nebulaA: "#b600a8",
    nebulaB: "#be4c00",
    grid: "#3b2a5c",
    planets: ["#b600a8", "#ff8a3d", "#8e96ff", "#ffe29a", "#9af5ff", "#ff5fa2", "#7621b0"],
    // Empty days drift through this band across the year.
    floor: ["#1b0630", "#2a0f4a", "#36145e", "#2b1a5c", "#3a1240", "#2a0f4a"],
    shadow: "#000000",
    stars: true,
  },
  // Day: silver-white sky, activity deepens from lilac to violet, and the
  // peak day is burnt orange from the signature gradient.
  daylight: {
    dark: false,
    bgInner: "#ffffff",
    bgMid: "#f4f2f8",
    bgOuter: "#e6e9f0",
    plateTop: "#ebe6f3",
    plateEdge: "#c8bddc",
    plateSide: "#d6cde6",
    ramp: ["#e3ddef", "#c6b3f0", "#9b78e0", "#7621b0", "#4a1272"],
    peak: "#ff8a3d",
    ink: "#1b0630",
    mute: "#646973",
    rule: "#d9d1e6",
    ring: "#7621b0",
    ringHi: "#ffffff",
    glow: "#b600a8",
    cellEdge: "#c3b6da",
    planetLight: "#ffffff",
    nebulaA: "#f4d9ff",
    nebulaB: "#ffe7c4",
    grid: "#cfc4e2",
    planets: ["#7621b0", "#be4c00", "#b600a8", "#5b63e0", "#c9372a", "#2a8fa3", "#e0901f"],
    floor: ["#e7e0f5", "#efe0f2", "#f7e3ec", "#fae9dc", "#efe4f7", "#e5e3f6"],
    shadow: "#7a6a96",
    stars: false,
  },
};

export const FONT_STACK = "ui-sans-serif, 'SF Pro Display', 'Segoe UI', Inter, Helvetica, Arial, sans-serif";
