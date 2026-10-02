import test from "node:test";
import assert from "node:assert/strict";
import { makeProjector, prismFaces } from "../src/geometry.mjs";

test("projection origin lands on the centre point", () => {
  const p = makeProjector({ yawDeg: -26, pitchDeg: 58, cx: 100, cy: 50 });
  const o = p(0, 0, 0);
  assert.equal(o.x, 100);
  assert.equal(o.y, 50);
});

test("raising height moves a point up the screen", () => {
  const p = makeProjector({ yawDeg: -26, pitchDeg: 58, cx: 0, cy: 0 });
  assert.ok(p(0, 0, 10).y < p(0, 0, 0).y);
});

test("a prism shows two sides and a top, never hidden faces", () => {
  const p = makeProjector({ yawDeg: -26, pitchDeg: 58, cx: 0, cy: 0 });
  const faces = prismFaces(p, 0, 0, 10, 20);
  assert.equal(faces.length, 3);
  assert.equal(faces.filter((f) => f.top).length, 1);
  for (const f of faces) assert.ok(f.pts.every((q) => Number.isFinite(q.x) && Number.isFinite(q.y)));
});
