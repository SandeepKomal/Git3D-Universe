import test from "node:test";
import assert from "node:assert/strict";
import { renderSvg } from "../src/render.mjs";
import { sampleData } from "../src/sample.mjs";
import { themes } from "../src/themes.mjs";

for (const theme of Object.keys(themes)) {
  test(`renders a clean SVG for theme ${theme}`, () => {
    const svg = renderSvg(sampleData(), { theme });
    assert.match(svg, /^<svg [^>]*xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    assert.ok(svg.trimEnd().endsWith("</svg>"));
    assert.ok(!/NaN|undefined|Infinity/.test(svg), "no invalid numbers or undefined values");
    assert.ok(svg.length < 600_000, "stays comfortably small for a README");
    assert.match(svg, new RegExp(`stroke="${themes[theme].cellEdge}"`), "terrain uses visible cell edges");
  });
}

test("output is deterministic", () => {
  assert.equal(renderSvg(sampleData()), renderSvg(sampleData()));
});

test("hostile names and colours cannot inject markup", () => {
  const data = sampleData();
  data.name = `<script>alert(1)</script>"&`;
  data.repos[0].name = `"><img src=x onerror=alert(1)>`;
  data.repos[0].color = `red" onload="alert(1)`;
  const svg = renderSvg(data);
  assert.ok(!svg.includes("<script"));
  assert.ok(!svg.includes("<img"));
  assert.ok(!svg.includes('onload="alert'));
});

test("static mode has no animation elements", () => {
  assert.ok(!renderSvg(sampleData(), { animate: false }).includes("<animateMotion"));
  assert.ok(renderSvg(sampleData(), { animate: true }).includes("<animateMotion"));
});

test("unknown theme gives a clear error", () => {
  assert.throws(() => renderSvg(sampleData(), { theme: "nope" }), /Unknown theme/);
});
