import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import http from "node:http";
import pg from "pg";

const { Pool } = pg;
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error("DATABASE_URL is required for integration smoke.");

const API_PORT = 4600;
const CORE_PORT = 4700;
const ORIGIN = "http://academy.test";
const owner = { coreUserId: "11111111-1111-4111-8111-111111111111", email: "owner@example.org", displayName: "Academy Owner" };
const support = { coreUserId: "22222222-2222-4222-8222-222222222222", email: "support@example.org", displayName: "Academy Support" };
const identities = new Map([
  ["token-owner", owner],
  ["token-support", support],
]);

function json(res, status, body) {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
}
async function body(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

const core = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${CORE_PORT}`);
  if (req.method === "GET" && url.pathname === "/api/v1/auth/provider-config") {
    return json(res, 200, { data: { passwordEnabled: true } });
  }
  if (req.method === "POST" && url.pathname === "/api/v1/auth/login") {
    const input = await body(req);
    const user = input.email === owner.email ? owner : input.email === support.email ? support : null;
    if (!user) return json(res, 401, { error: { code: "AUTH_FAILED", message: "Invalid credentials." } });
    const suffix = user === owner ? "owner" : "support";
    return json(res, 200, { data: {
      session: { accessToken: `token-${suffix}`, refreshToken: `refresh-${suffix}`, expiresIn: 3600 },
      user,
    }});
  }
  if (req.method === "GET" && url.pathname === "/api/v1/auth/me") {
    const token = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
    const user = identities.get(token);
    if (!user) return json(res, 401, { error: { code: "AUTH_REQUIRED", message: "Sign in." } });
    return json(res, 200, { data: user });
  }
  if (req.method === "POST" && url.pathname === "/api/v1/auth/logout") return json(res, 200, { data: { revoked: true } });
  if (req.method === "POST" && url.pathname === "/api/v1/auth/forgot-password") return json(res, 202, { data: { accepted: true } });
  return json(res, 404, { error: { code: "NOT_FOUND", message: "Not found." } });
});

await new Promise((resolve) => core.listen(CORE_PORT, "127.0.0.1", resolve));

const pool = new Pool({ connectionString: DATABASE_URL, max: 1 });
await pool.query(
  `INSERT INTO learner_profiles(core_user_id,email,full_name)
   VALUES ($1::uuid,$2,$3)
   ON CONFLICT(core_user_id) DO UPDATE SET email=EXCLUDED.email,full_name=EXCLUDED.full_name`,
  [support.coreUserId,support.email,support.displayName],
);
await pool.query(
  `INSERT INTO academy_admins(core_user_id,role)
   VALUES ($1::uuid,'support')
   ON CONFLICT(core_user_id) DO UPDATE SET role='support',updated_at=now()`,
  [support.coreUserId],
);

const api = spawn(process.execPath, ["src/server.mjs"], {
  cwd: new URL("..", import.meta.url),
  env: {
    ...process.env,
    PORT: String(API_PORT),
    TUKU_CORE_URL: `http://127.0.0.1:${CORE_PORT}/api/v1`,
    ALLOWED_ORIGIN: ORIGIN,
    SMARTVET_ADMIN_EMAILS: owner.email,
    RESEND_API_KEY: "",
    SMARTVET_ADMIN_INVITE_FROM: "",
  },
  stdio: ["ignore", "pipe", "pipe"],
});
let apiLogs = "";
api.stdout.on("data", (chunk) => { apiLogs += chunk.toString(); });
api.stderr.on("data", (chunk) => { apiLogs += chunk.toString(); });

async function waitForApi() {
  for (let i = 0; i < 80; i++) {
    try {
      const response = await fetch(`http://127.0.0.1:${API_PORT}/api/health`);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Academy API did not become healthy.\n" + apiLogs);
}

function cookieFor(token) {
  return `__Host-smartvet_access=${token}`;
}
async function request(path, { method = "GET", token, body: payload, origin = false } = {}) {
  const headers = { accept: "application/json" };
  if (token) headers.cookie = cookieFor(token);
  if (payload !== undefined) headers["content-type"] = "application/json";
  if (origin) headers.origin = ORIGIN;
  const response = await fetch(`http://127.0.0.1:${API_PORT}${path}`, {
    method,
    headers,
    body: payload === undefined ? undefined : JSON.stringify(payload),
  });
  const data = await response.json().catch(() => null);
  return { response, data };
}

try {
  await waitForApi();

  const health = await fetch(`http://127.0.0.1:${API_PORT}/api/health`);
  assert.equal(health.status, 200);
  assert.match(health.headers.get("content-security-policy") || "", /default-src 'self'/);
  assert.equal(health.headers.get("permissions-policy"), "camera=(), microphone=(), geolocation=()");

  {
    const login = await request("/api/auth/login", { method: "POST", body: { email: owner.email, password: "test-password" }, origin: true });
    assert.equal(login.response.status, 200);
  }

  {
    const check = await request("/api/courses/broiler-foundations/modules/1/check", { token: "token-owner" });
    assert.equal(check.response.status, 200);
    assert.equal(check.data.data.module_id, 1);
    assert.equal(check.data.data.options.length, 4);
    assert.equal("correct_index" in check.data.data, false);
    assert.equal("explanation" in check.data.data, false);
  }

  {
    const wrong = await request("/api/courses/broiler-foundations/modules/1/complete", {
      method: "POST", token: "token-owner", origin: true, body: { answer: 0 },
    });
    assert.equal(wrong.response.status, 200);
    assert.equal(wrong.data.data.correct, false);
    const progress = await request("/api/courses/broiler-foundations/progress", { token: "token-owner" });
    assert.deepEqual(progress.data.data, []);
  }

  {
    const correct = await request("/api/courses/broiler-foundations/modules/1/complete", {
      method: "POST", token: "token-owner", origin: true, body: { answer: 2 },
    });
    assert.equal(correct.response.status, 200);
    assert.equal(correct.data.data.correct, true);
    assert.ok(correct.data.data.explanation);
    const progress = await request("/api/courses/broiler-foundations/progress", { token: "token-owner" });
    assert.deepEqual(progress.data.data, [1]);
  }

  {
    const demote = await request(`/api/admin/admins/${owner.coreUserId}`, {
      method: "PATCH", token: "token-owner", origin: true, body: { role: "admin" },
    });
    assert.equal(demote.response.status, 409);
    assert.equal(demote.data.error.code, "LAST_OWNER_BLOCKED");
  }

  {
    const forbidden = await request("/api/admin/assessments?courseId=broiler-foundations", { token: "token-support" });
    assert.equal(forbidden.response.status, 403);
    assert.equal(forbidden.data.error.code, "ADMIN_FORBIDDEN");
  }

  {
    const created = await request("/api/admin/invites", {
      method: "POST", token: "token-owner", origin: true, body: { email: "candidate@example.org", role: "admin" },
    });
    assert.equal(created.response.status, 201);
    const invitePath = new URL(created.data.data.inviteUrl).pathname;
    const preview = await request(invitePath.replace("/admin/invite/", "/api/admin-invitations/"));
    assert.equal(preview.response.status, 200);
    assert.notEqual(preview.data.data.email, "candidate@example.org");
    assert.match(preview.data.data.email, /@example\.org$/);
    assert.equal(preview.response.headers.get("referrer-policy"), "no-referrer");
    const inviteCookie = (preview.response.headers.get("set-cookie") || "").match(/__Host-smartvet_admin_invite=[^;]+/)?.[0];
    assert.ok(inviteCookie, "preview should exchange the URL token for an HttpOnly invitation cookie");
    const current = await fetch(`http://127.0.0.1:${API_PORT}/api/admin-invitations/current`, {
      headers: { cookie: inviteCookie },
    });
    assert.equal(current.status, 200);
    const currentData = await current.json();
    assert.equal(currentData.data.email, preview.data.data.email);
  }

  {
    const missingOrigin = await request("/api/auth/logout", { method: "POST", token: "token-owner", body: {} });
    assert.equal(missingOrigin.response.status, 403);
    assert.equal(missingOrigin.data.error.code, "ORIGIN_REQUIRED");
  }

  console.log("Academy integration smoke passed.");
} finally {
  api.kill("SIGTERM");
  core.close();
  await pool.end();
}
