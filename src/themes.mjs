// Colour tokens. Every colour that reaches the SVG comes from here.
// Both themes use a pop palette of electric blue, mint green, violet and
// hot pink, with a lime peak day.

export const themes = {
  // Night: bright pop colours on dark indigo. Activity goes electric blue →
  // mint green → violet → hot pink, and the peak day glows lime.
  aurora: {
    dark: true,
    bgInner: "#151033",
    bgMid: "#0c0a1f",
    bgOuter: "#07070f",
    plateTop: "#141230",
    plateEdge: "#3d3a8c",
    plateSide: "#0b0a1c",
    ramp: ["#1f1c45", "#4d8dff", "#2ff5a8", "#a66bff", "#ff4fc3"],
    peak: "#c8ff3d",
    ink: "#eef2ff",
    mute: "#a3a8c8",
    rule: "#2a2750",
    ring: "#6f9bff",
    ringHi: "#ffffff",
    glow: "#ff5ccf",
    cellEdge: "#5a56b0",
    planetLight: "#ffffff",
    nebulaA: "#ff2d8a",
    nebulaB: "#2b7bff",
    grid: "#2f2c66",
    planets: ["#ff5ccf", "#2ff5a8", "#4d8dff", "#c8ff3d", "#a66bff", "#2fd8ff", "#ff8a5c"],
    // Empty days drift through this band across the year.
    floor: ["#1a1745", "#1c1d52", "#1a2350", "#1d1a4d", "#251a4f", "#1a1745"],
    shadow: "#000000",
    stars: true,
  },
  // Day: the same pop colours, slightly deeper so they stay readable on white.
  daylight: {
    dark: false,
    bgInner: "#ffffff",
    bgMid: "#f5f6fc",
    bgOuter: "#e9ebf5",
    plateTop: "#eceefa",
    plateEdge: "#c4c9e6",
    plateSide: "#d5d9ef",
    ramp: ["#e2e5f5", "#3d7bff", "#12c98a", "#8a4dff", "#f03fbf"],
    peak: "#7bc800",
    ink: "#141433",
    mute: "#5d6285",
    rule: "#d9dcef",
    ring: "#3d7bff",
    ringHi: "#ffffff",
    glow: "#f03fbf",
    cellEdge: "#c3c8e6",
    planetLight: "#ffffff",
    nebulaA: "#ffd6f1",
    nebulaB: "#d3e3ff",
    grid: "#cdd2ec",
    planets: ["#f03fbf", "#12c98a", "#3d7bff", "#7bc800", "#8a4dff", "#14b5e0", "#ff7a45"],
    floor: ["#e6e9fa", "#e3effb", "#e1f6f0", "#ece6fa", "#f8e6f4", "#e6e9fa"],
    shadow: "#7d84b3",
    stars: false,
  },
};

export const FONT_STACK = "ui-sans-serif, 'SF Pro Display', 'Segoe UI', Inter, Helvetica, Arial, sans-serif";
