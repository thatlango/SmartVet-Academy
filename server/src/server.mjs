import crypto from "node:crypto";
import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import pg from "pg";

const { Pool } = pg;
const PORT = Number(process.env.PORT || 4500);
const DATABASE_URL = process.env.DATABASE_URL;
const CORE_URL = (process.env.TUKU_CORE_URL || "http://tuku-core-api:3000/api/v1").replace(/\/$/, "");
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "https://academy.smartvet.africa";
const COURSE_CONFIG = {
  "broiler-foundations": {
    moduleCount: 9,
    quizKey: [2,2,1,1,0,1,2,2,1,1,1,2,0,1,0,1],
  },
  "layers-foundations": {
    moduleCount: 10,
    quizKey: [1,0,0,1,1,1,0,1,0,1,0,0,0,0,0,1],
  },
  "croiler-production": {
    moduleCount: 10,
    quizKey: [0,0,1,1,0,0,0,1,0,1,0,0,0,1,0,0],
  },
};
const ACCESS_COOKIE = "__Host-smartvet_access";
const REFRESH_COOKIE = "__Host-smartvet_refresh";

if (!DATABASE_URL) throw new Error("DATABASE_URL is required.");

const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

class HttpError extends Error {
  constructor(status, message, code = "ACADEMY_ERROR") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function unwrap(raw) {
  return raw && typeof raw === "object" && "data" in raw ? raw.data : raw;
}

function messageFrom(raw, fallback) {
  return raw?.error?.message || raw?.message || raw?.data?.message || fallback;
}

async function coreRequest(path, { method = "GET", body, accessToken } = {}) {
  const headers = { accept: "application/json" };
  if (body !== undefined) headers["content-type"] = "application/json";
  if (accessToken) headers.authorization = `Bearer ${accessToken}`;
  let response;
  try {
    response = await fetch(`${CORE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(12_000),
    });
  } catch {
    throw new HttpError(503, "Account services are temporarily unavailable. Please try again.", "TUKU_AUTH_UNAVAILABLE");
  }
  const raw = await response.json().catch(() => null);
  if (!response.ok) {
    throw new HttpError(response.status, messageFrom(raw, "Account request failed."), raw?.error?.code || "TUKU_AUTH_FAILED");
  }
  return unwrap(raw);
}

function cookieOptions(maxAge) {
  return {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge,
  };
}

function setSessionCookies(res, session) {
  const accessSeconds = Math.max(60, Number(session?.expiresIn || 3600));
  res.cookie(ACCESS_COOKIE, session.accessToken, cookieOptions(accessSeconds * 1000));
  res.cookie(REFRESH_COOKIE, session.refreshToken, cookieOptions(30 * 24 * 60 * 60 * 1000));
}

function clearSessionCookies(res) {
  res.clearCookie(ACCESS_COOKIE, { httpOnly: true, secure: true, sameSite: "lax", path: "/" });
  res.clearCookie(REFRESH_COOKIE, { httpOnly: true, secure: true, sameSite: "lax", path: "/" });
}

function publicUser(user) {
  const coreUserId = String(user?.coreUserId || "");
  if (!coreUserId) throw new HttpError(502, "Tuku Auth returned an incomplete identity.", "IDENTITY_INVALID");
  return {
    id: coreUserId,
    coreUserId,
    displayName: user?.displayName ?? null,
    email: user?.email ?? null,
  };
}

async function upsertLearner(user) {
  const u = publicUser(user);
  const fullName = String(u.displayName || u.email?.split("@")[0] || "SmartVet Learner").trim();
  await pool.query(
    `INSERT INTO learner_profiles(core_user_id,email,full_name)
     VALUES ($1::uuid,$2,$3)
     ON CONFLICT(core_user_id) DO UPDATE
       SET email=EXCLUDED.email,
           full_name=CASE WHEN EXCLUDED.full_name<>'' THEN EXCLUDED.full_name ELSE learner_profiles.full_name END,
           updated_at=now()`,
    [u.coreUserId, u.email, fullName],
  );
  return u;
}

async function authenticate(req, res) {
  const accessToken = req.cookies?.[ACCESS_COOKIE];
  const refreshToken = req.cookies?.[REFRESH_COOKIE];
  if (!accessToken && !refreshToken) throw new HttpError(401, "Sign in to continue.", "AUTH_REQUIRED");

  if (accessToken) {
    try {
      const identity = await coreRequest("/auth/me", { accessToken });
      const user = identity?.profile ?? identity;
      const publicIdentity = await upsertLearner(user);
      return { user, publicIdentity, accessToken };
    } catch (error) {
      if (!(error instanceof HttpError) || error.status !== 401 || !refreshToken) throw error;
    }
  }

  try {
    const refreshed = await coreRequest("/auth/refresh", { method: "POST", body: { refreshToken } });
    if (!refreshed?.session || !refreshed?.user) throw new HttpError(401, "Your session has expired. Sign in again.", "SESSION_EXPIRED");
    setSessionCookies(res, refreshed.session);
    const publicIdentity = await upsertLearner(refreshed.user);
    return { user: refreshed.user, publicIdentity, accessToken: refreshed.session.accessToken };
  } catch (error) {
    clearSessionCookies(res);
    if (error instanceof HttpError && error.status === 401) throw new HttpError(401, "Your session has expired. Sign in again.", "SESSION_EXPIRED");
    throw error;
  }
}

function requireCourse(courseId) {
  const config = COURSE_CONFIG[courseId];
  if (!config) throw new HttpError(404, "Course not found.", "COURSE_NOT_FOUND");
  return config;
}

function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

async function withClient(work) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const value = await work(client);
    await client.query("COMMIT");
    return value;
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "32kb" }));
app.use(cookieParser());

app.use((req, _res, next) => {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    const origin = req.get("origin");
    if (origin && origin !== ALLOWED_ORIGIN) return next(new HttpError(403, "Origin rejected.", "ORIGIN_REJECTED"));
  }
  next();
});

app.get("/api/health", asyncRoute(async (_req, res) => {
  const db = await pool.query("SELECT 1 AS ok");
  const core = await coreRequest("/auth/provider-config");
  res.json({ data: { ok: db.rows[0]?.ok === 1 && core?.passwordEnabled === true, database: "vps-postgres", auth: "tuku-first-party" } });
}));

app.post("/api/auth/register", asyncRoute(async (req, res) => {
  const fullName = String(req.body?.fullName || "").trim();
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  if (fullName.length < 2 || fullName.length > 160) throw new HttpError(422, "Enter your full name.", "NAME_INVALID");
  if (!email || !email.includes("@")) throw new HttpError(422, "Enter a valid email address.", "EMAIL_INVALID");
  if (password.length < 8 || password.length > 128) throw new HttpError(422, "Password must contain at least 8 characters.", "PASSWORD_INVALID");
  const result = await coreRequest("/auth/register", {
    method: "POST",
    body: { email, password, name: fullName, language: "en", country: "UG", consent: true, intent: "programme_participant" },
  });
  if (!result?.session || !result?.user) throw new HttpError(502, "The account was created but no session was returned.", "SESSION_MISSING");
  setSessionCookies(res, result.session);
  const user = await upsertLearner(result.user);
  res.status(201).json({ data: user });
}));

app.post("/api/auth/login", asyncRoute(async (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  if (!email || !password) throw new HttpError(422, "Enter your email and password.", "CREDENTIALS_REQUIRED");
  const result = await coreRequest("/auth/login", { method: "POST", body: { email, password } });
  if (!result?.session || !result?.user) throw new HttpError(502, "Sign-in did not return a usable session.", "SESSION_MISSING");
  setSessionCookies(res, result.session);
  const user = await upsertLearner(result.user);
  res.json({ data: user });
}));

app.get("/api/auth/session", asyncRoute(async (req, res) => {
  if (!req.cookies?.[ACCESS_COOKIE] && !req.cookies?.[REFRESH_COOKIE]) return res.json({ data: null });
  try {
    const { publicIdentity } = await authenticate(req, res);
    return res.json({ data: publicIdentity });
  } catch (error) {
    if (error instanceof HttpError && error.status === 401) {
      clearSessionCookies(res);
      return res.json({ data: null });
    }
    throw error;
  }
}));

app.get("/api/auth/me", asyncRoute(async (req, res) => {
  const { publicIdentity } = await authenticate(req, res);
  res.json({ data: publicIdentity });
}));

app.post("/api/auth/logout", asyncRoute(async (req, res) => {
  const accessToken = req.cookies?.[ACCESS_COOKIE];
  if (accessToken) {
    try { await coreRequest("/auth/logout", { method: "POST", accessToken, body: { allDevices: false } }); } catch {}
  }
  clearSessionCookies(res);
  res.json({ data: { revoked: true } });
}));

app.post("/api/auth/forgot-password", asyncRoute(async (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  if (!email) throw new HttpError(422, "Enter your email address.", "EMAIL_REQUIRED");
  await coreRequest("/auth/forgot-password", {
    method: "POST",
    body: { channel: "email", identifier: email, redirectTo: `${ALLOWED_ORIGIN}/auth` },
  });
  res.status(202).json({ data: { accepted: true } });
}));

app.get("/api/profile", asyncRoute(async (req, res) => {
  const { publicIdentity } = await authenticate(req, res);
  const result = await pool.query("SELECT full_name,email FROM learner_profiles WHERE core_user_id=$1::uuid", [publicIdentity.coreUserId]);
  res.json({ data: result.rows[0] });
}));

app.get("/api/courses/:courseId/state", asyncRoute(async (req, res) => {
  const courseId = req.params.courseId;\n  const courseConfig = requireCourse(courseId);
  const { publicIdentity } = await authenticate(req, res);
  const result = await pool.query(
    "SELECT current_module_id,progress_percent,completed_at FROM course_state WHERE core_user_id=$1::uuid AND course_id=$2",
    [publicIdentity.coreUserId, courseId],
  );
  res.json({ data: result.rows[0] ?? null });
}));

app.get("/api/courses/:courseId/progress", asyncRoute(async (req, res) => {
  const courseId = req.params.courseId;\n  const courseConfig = requireCourse(courseId);
  const { publicIdentity } = await authenticate(req, res);
  const result = await pool.query(
    "SELECT module_id FROM learner_progress WHERE core_user_id=$1::uuid AND course_id=$2 ORDER BY module_id",
    [publicIdentity.coreUserId, courseId],
  );
  res.json({ data: result.rows.map((row) => row.module_id) });
}));

app.post("/api/courses/:courseId/modules/:moduleId/complete", asyncRoute(async (req, res) => {
  const courseId = req.params.courseId;\n  const courseConfig = requireCourse(courseId);
  const moduleId = Number(req.params.moduleId);
  if (!Number.isInteger(moduleId) || moduleId < 1 || moduleId > courseConfig.moduleCount) throw new HttpError(404, "Module not found.", "MODULE_NOT_FOUND");
  const { publicIdentity } = await authenticate(req, res);

  const result = await withClient(async (client) => {
    const lockKey = `${publicIdentity.coreUserId}:${courseId}`;
    await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [lockKey]);

    const existing = await client.query(
      "SELECT module_id FROM learner_progress WHERE core_user_id=$1::uuid AND course_id=$2 AND module_id=$3",
      [publicIdentity.coreUserId, courseId, moduleId],
    );
    if (!existing.rowCount) {
      const earlier = await client.query(
        "SELECT count(*)::int AS count FROM learner_progress WHERE core_user_id=$1::uuid AND course_id=$2 AND module_id < $3",
        [publicIdentity.coreUserId, courseId, moduleId],
      );
      if (earlier.rows[0].count !== moduleId - 1) throw new HttpError(409, "Complete earlier modules first.", "MODULE_SEQUENCE");
      await client.query(
        "INSERT INTO learner_progress(core_user_id,course_id,module_id) VALUES ($1::uuid,$2,$3) ON CONFLICT DO NOTHING",
        [publicIdentity.coreUserId, courseId, moduleId],
      );
    }

    const countResult = await client.query(
      "SELECT count(*)::int AS count FROM learner_progress WHERE core_user_id=$1::uuid AND course_id=$2",
      [publicIdentity.coreUserId, courseId],
    );
    const count = countResult.rows[0].count;
    const progress = Math.min(100, Math.floor((count * 100) / courseConfig.moduleCount));
    const currentModule = count >= courseConfig.moduleCount ? courseConfig.moduleCount : count + 1;
    await client.query(
      `INSERT INTO course_state(core_user_id,course_id,current_module_id,progress_percent,completed_at)
       VALUES ($1::uuid,$2,$3,$4,CASE WHEN $4=100 THEN now() ELSE NULL END)
       ON CONFLICT(core_user_id,course_id) DO UPDATE
         SET current_module_id=EXCLUDED.current_module_id,
             progress_percent=EXCLUDED.progress_percent,
             completed_at=COALESCE(course_state.completed_at,EXCLUDED.completed_at),
             updated_at=now()`,
      [publicIdentity.coreUserId, courseId, currentModule, progress],
    );
    return { module_id: moduleId, progress_percent: progress };
  });

  res.json({ data: result });
}));

app.get("/api/courses/:courseId/quiz/passed", asyncRoute(async (req, res) => {
  const courseId = req.params.courseId;\n  const courseConfig = requireCourse(courseId);
  const { publicIdentity } = await authenticate(req, res);
  const result = await pool.query(
    "SELECT EXISTS(SELECT 1 FROM quiz_attempts WHERE core_user_id=$1::uuid AND course_id=$2 AND passed) AS passed",
    [publicIdentity.coreUserId, courseId],
  );
  res.json({ data: { passed: result.rows[0].passed } });
}));

app.post("/api/courses/:courseId/quiz", asyncRoute(async (req, res) => {
  const courseId = req.params.courseId;\n  const courseConfig = requireCourse(courseId);
  const { publicIdentity } = await authenticate(req, res);
  const answers = req.body?.answers;
  if (!Array.isArray(answers) || answers.length !== courseConfig.quizKey.length || answers.some((v) => !Number.isInteger(v) || v < 0 || v > 3)) {
    throw new HttpError(422, "Answer every assessment question.", "QUIZ_ANSWERS_INVALID");
  }
  const done = await pool.query(
    "SELECT count(*)::int AS count FROM learner_progress WHERE core_user_id=$1::uuid AND course_id=$2",
    [publicIdentity.coreUserId, courseId],
  );
  if (done.rows[0].count < courseConfig.moduleCount) throw new HttpError(409, "Complete all modules before the final assessment.", "COURSE_INCOMPLETE");
  const score = answers.reduce((total, answer, index) => total + (answer === courseConfig.quizKey[index] ? 1 : 0), 0);
  const passed = score / courseConfig.quizKey.length >= 0.75;
  await pool.query(
    "INSERT INTO quiz_attempts(core_user_id,course_id,score,total,passed,answers) VALUES ($1::uuid,$2,$3,$4,$5,$6::jsonb)",
    [publicIdentity.coreUserId, courseId, score, courseConfig.quizKey.length, passed, JSON.stringify(answers)],
  );
  res.json({ data: { score, total: courseConfig.quizKey.length, passed } });
}));

app.get("/api/courses/:courseId/certificate", asyncRoute(async (req, res) => {
  const courseId = req.params.courseId;\n  const courseConfig = requireCourse(courseId);
  const { publicIdentity } = await authenticate(req, res);
  const result = await pool.query(
    "SELECT verification_code,issued_at,course_id FROM certificates WHERE core_user_id=$1::uuid AND course_id=$2",
    [publicIdentity.coreUserId, courseId],
  );
  res.json({ data: result.rows[0] ?? null });
}));

app.post("/api/courses/:courseId/certificate", asyncRoute(async (req, res) => {
  const courseId = req.params.courseId;\n  const courseConfig = requireCourse(courseId);
  const { publicIdentity } = await authenticate(req, res);
  const certificate = await withClient(async (client) => {
    const lockKey = `certificate:${publicIdentity.coreUserId}:${courseId}`;
    await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [lockKey]);
    const existing = await client.query(
      "SELECT verification_code,issued_at,course_id FROM certificates WHERE core_user_id=$1::uuid AND course_id=$2",
      [publicIdentity.coreUserId, courseId],
    );
    if (existing.rowCount) return existing.rows[0];

    const eligibility = await client.query(
      `SELECT
         (SELECT count(*)::int FROM learner_progress WHERE core_user_id=$1::uuid AND course_id=$2) AS modules,
         EXISTS(SELECT 1 FROM quiz_attempts WHERE core_user_id=$1::uuid AND course_id=$2 AND passed) AS passed`,
      [publicIdentity.coreUserId, courseId],
    );
    if (eligibility.rows[0].modules < courseConfig.moduleCount || !eligibility.rows[0].passed) {
      throw new HttpError(409, "Complete all modules and pass the final assessment before downloading a certificate.", "CERTIFICATE_NOT_ELIGIBLE");
    }

    for (let attempt = 0; attempt < 5; attempt++) {
      const code = `SVA-${crypto.randomBytes(5).toString("hex").toUpperCase()}`;
      try {
        const inserted = await client.query(
          "INSERT INTO certificates(core_user_id,course_id,verification_code) VALUES ($1::uuid,$2,$3) RETURNING verification_code,issued_at,course_id",
          [publicIdentity.coreUserId, courseId, code],
        );
        return inserted.rows[0];
      } catch (error) {
        if (error?.code !== "23505") throw error;
      }
    }
    throw new HttpError(500, "Could not allocate a unique certificate code.", "CERTIFICATE_CODE_FAILED");
  });
  res.status(201).json({ data: certificate });
}));

app.get("/api/certificates/verify/:code", asyncRoute(async (req, res) => {
  const code = String(req.params.code || "").trim().toUpperCase();
  if (!/^SVA-[A-F0-9]{10}$/.test(code)) return res.json({ data: null });
  const result = await pool.query(
    `SELECT p.full_name,c.course_id,c.issued_at
     FROM certificates c
     JOIN learner_profiles p ON p.core_user_id=c.core_user_id
     WHERE c.verification_code=$1
     LIMIT 1`,
    [code],
  );
  res.json({ data: result.rows[0] ?? null });
}));

app.use((error, req, res, _next) => {
  const status = Number(error?.status || 500);
  const safeStatus = status >= 400 && status < 600 ? status : 500;
  if (safeStatus >= 500) console.error(JSON.stringify({ event: "academy_api_error", path: req.path, message: error?.message, code: error?.code }));
  res.status(safeStatus).json({ error: { code: error?.code || "ACADEMY_ERROR", message: safeStatus >= 500 ? "The academy could not complete this request." : error.message } });
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(JSON.stringify({ event: "smartvet_academy_api_ready", port: PORT, auth: "tuku-first-party", database: "vps-postgres" }));
});

async function shutdown() {
  server.close(async () => {
    await pool.end().catch(() => {});
    process.exit(0);
  });
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
