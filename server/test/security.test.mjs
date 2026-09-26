import assert from "node:assert/strict";
import test from "node:test";
import { fixedWindowRateLimit, maskEmail, resetRateLimitStateForTests, safeResetPath } from "../src/security.mjs";

test("maskEmail hides the local address while preserving the delivery domain", () => {
  assert.equal(maskEmail("administrator@example.org"), "ad********@example.org");
  assert.equal(maskEmail("a@example.org"), "a***@example.org");
});

test("safeResetPath only permits Academy-owned auth destinations", () => {
  assert.equal(safeResetPath("/admin/login"), "/admin/login");
  assert.equal(safeResetPath("/admin/invite/abc123"), "/admin/invite/abc123");
  assert.equal(safeResetPath("/auth"), "/auth");
  assert.equal(safeResetPath("https://evil.example"), "/auth");
  assert.equal(safeResetPath("//evil.example"), "/auth");
});

test("fixedWindowRateLimit blocks requests after the configured threshold", () => {
  resetRateLimitStateForTests();
  const middleware = fixedWindowRateLimit({ name: "test", windowMs: 60_000, max: 2 });
  const req = { ip: "127.0.0.1", socket: {} };
  const responses = [];
  const makeRes = () => ({
    headers: {},
    set(name, value) { this.headers[name] = value; return this; },
    status(code) { this.statusCode = code; return this; },
    json(body) { responses.push({ status: this.statusCode, body, headers: this.headers }); return this; },
  });
  let nextCount = 0;
  middleware(req, makeRes(), () => { nextCount += 1; });
  middleware(req, makeRes(), () => { nextCount += 1; });
  middleware(req, makeRes(), () => { nextCount += 1; });
  assert.equal(nextCount, 2);
  assert.equal(responses[0].status, 429);
  assert.equal(responses[0].body.error.code, "RATE_LIMITED");
});
