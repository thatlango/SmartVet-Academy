import crypto from "node:crypto";
import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import pg from "pg";
import { renderCertificatePdf } from "./certificate.mjs";
import { fixedWindowRateLimit, maskEmail, safeResetPath } from "./security.mjs";

const { Pool } = pg;
const PORT = Number(process.env.PORT || 4500);
const DATABASE_URL = process.env.DATABASE_URL;
const CORE_URL = (process.env.TUKU_CORE_URL || "http://tuku-core-api:3000/api/v1").replace(/\/$/, "");
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "https://academy.smartvet.africa";
const COURSE_CONFIG = {
  "broiler-foundations": { moduleCount: 9 },
  "layers-foundations": { moduleCount: 10 },
  "croiler-production": { moduleCount: 10 },
};
const ACCESS_COOKIE = "__Host-smartvet_access";
const REFRESH_COOKIE = "__Host-smartvet_refresh";
const ADMIN_INVITE_COOKIE = "__Host-smartvet_admin_invite";
const ADMIN_EMAILS = new Set(
  String(process.env.SMARTVET_ADMIN_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean),
);
const ADMIN_CORE_USER_IDS = new Set(
  String(process.env.SMARTVET_ADMIN_CORE_USER_IDS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean),
);
const RESEND_API_KEY = String(process.env.RESEND_API_KEY || "").trim();
const ADMIN_INVITE_FROM = String(process.env.SMARTVET_ADMIN_INVITE_FROM || "").trim();
const ADMIN_INVITE_TTL_HOURS = Math.min(168, Math.max(1, Number(process.env.SMARTVET_ADMIN_INVITE_TTL_HOURS || 72)));

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

function setAdminInviteCookie(res, token, expiresAt) {
  const ttl = Math.max(60_000, Math.min(30 * 60_000, new Date(expiresAt).getTime() - Date.now()));
  res.cookie(ADMIN_INVITE_COOKIE, token, cookieOptions(ttl));
}

function clearAdminInviteCookie(res) {
  res.clearCookie(ADMIN_INVITE_COOKIE, { httpOnly: true, secure: true, sameSite: "lax", path: "/" });
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

async function assertLearnerActive(coreUserId) {
  const result = await pool.query("SELECT status FROM learner_profiles WHERE core_user_id=$1::uuid", [coreUserId]);
  if (result.rows[0]?.status === "suspended") {
    throw new HttpError(403, "This Academy account is suspended. Contact SmartVet Africa for support.", "ACCOUNT_SUSPENDED");
  }
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
      await assertLearnerActive(publicIdentity.coreUserId);
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
    await assertLearnerActive(publicIdentity.coreUserId);
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

async function ensureCourseAccess(coreUserId, courseId) {
  await assertLearnerActive(coreUserId);
  const result = await pool.query(
    `INSERT INTO course_enrollments(core_user_id,course_id,status)
     VALUES ($1::uuid,$2,'active')
     ON CONFLICT(core_user_id,course_id) DO UPDATE SET updated_at=course_enrollments.updated_at
     RETURNING status`,
    [coreUserId, courseId],
  );
  const status = result.rows[0]?.status;
  if (status !== "active") {
    throw new HttpError(403, status === "suspended" ? "This course enrolment is suspended." : "You are not currently enrolled in this course.", "ENROLLMENT_INACTIVE");
  }
}

function isBootstrapAdmin(publicIdentity) {
  const email = String(publicIdentity?.email || "").trim().toLowerCase();
  const id = String(publicIdentity?.coreUserId || "").trim().toLowerCase();
  return (email && ADMIN_EMAILS.has(email)) || (id && ADMIN_CORE_USER_IDS.has(id));
}

async function requireAdmin(req, res, allowedRoles = ["owner","admin","assessor","support"]) {
  const auth = await authenticate(req, res);
  let result = await pool.query(
    "SELECT role FROM academy_admins WHERE core_user_id=$1::uuid",
    [auth.publicIdentity.coreUserId],
  );
  if (!result.rowCount && isBootstrapAdmin(auth.publicIdentity)) {
    result = await pool.query(
      `INSERT INTO academy_admins(core_user_id,role)
       VALUES ($1::uuid,'owner')
       ON CONFLICT(core_user_id) DO UPDATE SET updated_at=now()
       RETURNING role`,
      [auth.publicIdentity.coreUserId],
    );
  }
  const role = result.rows[0]?.role;
  if (!role || !allowedRoles.includes(role)) {
    throw new HttpError(403, "You do not have Academy administration access.", "ADMIN_FORBIDDEN");
  }
  return { ...auth, role };
}

async function auditAdmin(actorCoreUserId, action, entityType, entityId, metadata = {}) {
  await pool.query(
    "INSERT INTO admin_audit_log(actor_core_user_id,action,entity_type,entity_id,metadata) VALUES ($1::uuid,$2,$3,$4,$5::jsonb)",
    [actorCoreUserId, action, entityType, String(entityId), JSON.stringify(metadata)],
  );
}

function parseLimit(value, fallback = 50, max = 200) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
}

function parseOffset(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : 0;
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function newAdminInviteToken() {
  return crypto.randomBytes(32).toString("base64url");
}

function adminInviteHash(token) {
  return crypto.createHash("sha256").update(String(token || "")).digest("hex");
}

function adminInviteUrl(token) {
  return `${ALLOWED_ORIGIN}/admin/invite/${encodeURIComponent(token)}`;
}

async function sendAdminInviteEmail({ email, role, inviteUrl, invitedBy }) {
  if (!RESEND_API_KEY || !ADMIN_INVITE_FROM) return { delivered: false, reason: "email_not_configured" };
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${RESEND_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: ADMIN_INVITE_FROM,
        to: [email],
        subject: "You have been invited to administer SmartVet Academy",
        text: [
          "You have been invited to the SmartVet Academy administration console.",
          "",
          `Role: ${role}`,
          invitedBy ? `Invited by: ${invitedBy}` : "",
          "",
          "Accept the invitation:",
          inviteUrl,
          "",
          `This invitation expires in ${ADMIN_INVITE_TTL_HOURS} hours.`,
          "If you were not expecting this invitation, you can ignore this email.",
        ].filter(Boolean).join("\n"),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) return { delivered: false, reason: "email_provider_rejected" };
    return { delivered: true, reason: null };
  } catch {
    return { delivered: false, reason: "email_provider_unavailable" };
  }
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
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      formAction: ["'self'"],
      imgSrc: ["'self'", "data:", "https://drive.google.com", "https://*.googleusercontent.com"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
      connectSrc: ["'self'"],
      frameSrc: ["'self'", "blob:"],
      upgradeInsecureRequests: [],
    },
  },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
}));
app.use((_req, res, next) => {
  res.set("permissions-policy", "camera=(), microphone=(), geolocation=()");
  next();
});
app.use(express.json({ limit: "32kb" }));
app.use(cookieParser());

const authLimiter = fixedWindowRateLimit({ name: "auth", windowMs: 15 * 60_000, max: 20 });
const recoveryLimiter = fixedWindowRateLimit({ name: "recovery", windowMs: 15 * 60_000, max: 8 });
const inviteLimiter = fixedWindowRateLimit({ name: "admin-invite", windowMs: 15 * 60_000, max: 30 });
const verifyLimiter = fixedWindowRateLimit({ name: "certificate-verify", windowMs: 60_000, max: 60 });

app.use((req, _res, next) => {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    const origin = req.get("origin");
    if (origin && origin !== ALLOWED_ORIGIN) return next(new HttpError(403, "Origin rejected.", "ORIGIN_REJECTED"));
    const hasSessionCookie = Boolean(req.cookies?.[ACCESS_COOKIE] || req.cookies?.[REFRESH_COOKIE]);
    if (hasSessionCookie && !origin) return next(new HttpError(403, "Request origin is required.", "ORIGIN_REQUIRED"));
  }
  next();
});

app.get("/api/health", asyncRoute(async (_req, res) => {
  const db = await pool.query("SELECT 1 AS ok");
  const core = await coreRequest("/auth/provider-config");
  res.json({ data: { ok: db.rows[0]?.ok === 1 && core?.passwordEnabled === true, database: "vps-postgres", auth: "tuku-first-party" } });
}));

function estateTelemetryAuthorized(provided) {
  const expected = String(process.env.TUKU_ESTATE_INSIGHTS_SECRET || "");
  const supplied = String(provided || "");
  if (!expected || !supplied || expected.length !== supplied.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(supplied));
  } catch {
    return false;
  }
}

app.get("/api/internal/estate-telemetry", asyncRoute(async (req, res) => {
  if (!estateTelemetryAuthorized(req.get("x-tuku-insights-key"))) {
    return res.status(401).json({ error: { code: "ESTATE_TELEMETRY_UNAUTHORIZED", message: "Telemetry credential is invalid." } });
  }

  const result = await pool.query(`
    SELECT
      (SELECT count(*)::int FROM learner_profiles) learners,
      (SELECT count(DISTINCT core_user_id)::int FROM learner_progress WHERE completed_at >= now() - interval '7 days') active_7d,
      (SELECT count(*)::int FROM learner_progress) module_completions,
      (SELECT count(*)::int FROM course_state WHERE completed_at IS NOT NULL) courses_completed,
      (SELECT count(*)::int FROM quiz_attempts) quiz_attempts,
      (SELECT count(*)::int FROM quiz_attempts WHERE passed) quiz_passes,
      (SELECT count(*)::int FROM certificates) certificates,
      (SELECT max(completed_at) FROM learner_progress) last_learning_at,
      (SELECT max(created_at) FROM quiz_attempts) last_quiz_at,
      (SELECT max(issued_at) FROM certificates) last_certificate_at
  `);
  const row = result.rows[0] || {};
  res.json({
    productCode: "smartvet",
    generatedAt: new Date().toISOString(),
    kpis: {
      learners: Number(row.learners || 0),
      activeLearners7d: Number(row.active_7d || 0),
      moduleCompletions: Number(row.module_completions || 0),
      coursesCompleted: Number(row.courses_completed || 0),
      quizAttempts: Number(row.quiz_attempts || 0),
      quizPasses: Number(row.quiz_passes || 0),
      certificates: Number(row.certificates || 0),
    },
    activity: {
      lastLearningAt: row.last_learning_at ? new Date(row.last_learning_at).toISOString() : null,
      lastQuizAt: row.last_quiz_at ? new Date(row.last_quiz_at).toISOString() : null,
      lastCertificateAt: row.last_certificate_at ? new Date(row.last_certificate_at).toISOString() : null,
    },
  });
}));

app.post("/api/auth/register", authLimiter, asyncRoute(async (req, res) => {
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
  const user = await upsertLearner(result.user);
  await assertLearnerActive(user.coreUserId);
  setSessionCookies(res, result.session);
  res.status(201).json({ data: user });
}));

app.post("/api/auth/login", authLimiter, asyncRoute(async (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  if (!email || !password) throw new HttpError(422, "Enter your email and password.", "CREDENTIALS_REQUIRED");
  const result = await coreRequest("/auth/login", { method: "POST", body: { email, password } });
  if (!result?.session || !result?.user) throw new HttpError(502, "Sign-in did not return a usable session.", "SESSION_MISSING");
  const user = await upsertLearner(result.user);
  await assertLearnerActive(user.coreUserId);
  setSessionCookies(res, result.session);
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

app.post("/api/auth/forgot-password", recoveryLimiter, asyncRoute(async (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  if (!email) throw new HttpError(422, "Enter your email address.", "EMAIL_REQUIRED");
  const resetPath = safeResetPath(req.body?.returnTo);
  await coreRequest("/auth/forgot-password", {
    method: "POST",
    body: { channel: "email", identifier: email, redirectTo: `${ALLOWED_ORIGIN}${resetPath}` },
  });
  res.status(202).json({ data: { accepted: true } });
}));

app.get("/api/profile", asyncRoute(async (req, res) => {
  const { publicIdentity } = await authenticate(req, res);
  const result = await pool.query("SELECT full_name,email FROM learner_profiles WHERE core_user_id=$1::uuid", [publicIdentity.coreUserId]);
  res.json({ data: { ...result.rows[0], email: maskEmail(result.rows[0].email) } });
}));

app.get("/api/courses/:courseId/state", asyncRoute(async (req, res) => {
  const courseId = req.params.courseId;
  const courseConfig = requireCourse(courseId);
  const { publicIdentity } = await authenticate(req, res);
  await ensureCourseAccess(publicIdentity.coreUserId, courseId);
  const result = await pool.query(
    "SELECT current_module_id,progress_percent,completed_at FROM course_state WHERE core_user_id=$1::uuid AND course_id=$2",
    [publicIdentity.coreUserId, courseId],
  );
  res.json({ data: result.rows[0] ?? null });
}));

app.get("/api/courses/:courseId/progress", asyncRoute(async (req, res) => {
  const courseId = req.params.courseId;
  const courseConfig = requireCourse(courseId);
  const { publicIdentity } = await authenticate(req, res);
  await ensureCourseAccess(publicIdentity.coreUserId, courseId);
  const result = await pool.query(
    "SELECT module_id FROM learner_progress WHERE core_user_id=$1::uuid AND course_id=$2 ORDER BY module_id",
    [publicIdentity.coreUserId, courseId],
  );
  res.json({ data: result.rows.map((row) => row.module_id) });
}));

app.get("/api/learning/activity", asyncRoute(async (req, res) => {
  const { publicIdentity } = await authenticate(req, res);
  const result = await pool.query(
    `SELECT course_id,module_id,completed_at
       FROM learner_progress
      WHERE core_user_id=$1::uuid
        AND completed_at >= now() - interval '42 days'
      ORDER BY completed_at ASC`,
    [publicIdentity.coreUserId],
  );
  res.json({ data: result.rows });
}));

app.get("/api/learning/dashboard", asyncRoute(async (req, res) => {
  const { publicIdentity } = await authenticate(req, res);
  const courseIds = Object.keys(COURSE_CONFIG);

  const snapshot = await withClient(async (client) => {
    await client.query("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY");

    const [profile, progress, quiz, certificates, activity] = await Promise.all([
      client.query(
        "SELECT full_name FROM learner_profiles WHERE core_user_id=$1::uuid LIMIT 1",
        [publicIdentity.coreUserId],
      ),
      client.query(
        "SELECT course_id,module_id FROM learner_progress WHERE core_user_id=$1::uuid ORDER BY course_id,module_id",
        [publicIdentity.coreUserId],
      ),
      client.query(
        "SELECT course_id,bool_or(passed) AS passed FROM quiz_attempts WHERE core_user_id=$1::uuid GROUP BY course_id",
        [publicIdentity.coreUserId],
      ),
      client.query(
        "SELECT course_id,verification_code,issued_at FROM certificates WHERE core_user_id=$1::uuid AND revoked_at IS NULL",
        [publicIdentity.coreUserId],
      ),
      client.query(
        `SELECT course_id,module_id,completed_at
           FROM learner_progress
          WHERE core_user_id=$1::uuid
            AND completed_at >= now() - interval '42 days'
          ORDER BY completed_at ASC`,
        [publicIdentity.coreUserId],
      ),
    ]);

    const courses = Object.fromEntries(
      courseIds.map((courseId) => [courseId, { done: [], passed: false, cert: null }]),
    );

    for (const row of progress.rows) {
      if (courses[row.course_id]) courses[row.course_id].done.push(row.module_id);
    }
    for (const row of quiz.rows) {
      if (courses[row.course_id]) courses[row.course_id].passed = Boolean(row.passed);
    }
    for (const row of certificates.rows) {
      if (courses[row.course_id]) {
        courses[row.course_id].cert = {
          verification_code: row.verification_code,
          issued_at: row.issued_at,
          course_id: row.course_id,
        };
      }
    }

    return {
      full_name: profile.rows[0]?.full_name || publicIdentity.displayName || publicIdentity.email?.split("@")[0] || "Learner",
      courses,
      activity: activity.rows,
      generated_at: new Date().toISOString(),
    };
  });

  res.json({ data: snapshot });
}));

app.get("/api/courses/:courseId/modules/:moduleId/check", asyncRoute(async (req, res) => {
  const courseId = req.params.courseId;
  const courseConfig = requireCourse(courseId);
  const moduleId = Number(req.params.moduleId);
  if (!Number.isInteger(moduleId) || moduleId < 1 || moduleId > courseConfig.moduleCount) {
    throw new HttpError(404, "Module not found.", "MODULE_NOT_FOUND");
  }
  const { publicIdentity } = await authenticate(req, res);
  await ensureCourseAccess(publicIdentity.coreUserId, courseId);
  const result = await pool.query(
    `SELECT module_id,question_text,options
       FROM module_checks
      WHERE course_id=$1 AND module_id=$2 AND published=true
      LIMIT 1`,
    [courseId,moduleId],
  );
  if (!result.rowCount) throw new HttpError(409, "This module check is not currently available.", "MODULE_CHECK_UNAVAILABLE");
  const row = result.rows[0];
  res.json({ data: { module_id: row.module_id, question: row.question_text, options: row.options } });
}));

app.post("/api/courses/:courseId/modules/:moduleId/complete", asyncRoute(async (req, res) => {
  const courseId = req.params.courseId;
  const courseConfig = requireCourse(courseId);
  const moduleId = Number(req.params.moduleId);
  const answer = Number(req.body?.answer);
  if (!Number.isInteger(moduleId) || moduleId < 1 || moduleId > courseConfig.moduleCount) throw new HttpError(404, "Module not found.", "MODULE_NOT_FOUND");
  if (!Number.isInteger(answer) || answer < 0 || answer > 3) throw new HttpError(422, "Choose an answer before continuing.", "MODULE_ANSWER_INVALID");

  const { publicIdentity } = await authenticate(req, res);
  await ensureCourseAccess(publicIdentity.coreUserId, courseId);

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

      const check = await client.query(
        `SELECT correct_index,explanation
           FROM module_checks
          WHERE course_id=$1 AND module_id=$2 AND published=true
          LIMIT 1`,
        [courseId,moduleId],
      );
      if (!check.rowCount) throw new HttpError(409, "This module check is not currently available.", "MODULE_CHECK_UNAVAILABLE");
      if (answer !== check.rows[0].correct_index) {
        return { correct: false, module_id: moduleId, progress_percent: null };
      }

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
    const explanation = await client.query(
      "SELECT explanation FROM module_checks WHERE course_id=$1 AND module_id=$2 AND published=true LIMIT 1",
      [courseId,moduleId],
    );
    return { correct: true, module_id: moduleId, progress_percent: progress, explanation: explanation.rows[0]?.explanation || undefined };
  });

  res.json({ data: result });
}));

app.get("/api/courses/:courseId/quiz/passed", asyncRoute(async (req, res) => {
  const courseId = req.params.courseId;
  const courseConfig = requireCourse(courseId);
  const { publicIdentity } = await authenticate(req, res);
  await ensureCourseAccess(publicIdentity.coreUserId, courseId);
  const result = await pool.query(
    "SELECT EXISTS(SELECT 1 FROM quiz_attempts WHERE core_user_id=$1::uuid AND course_id=$2 AND passed) AS passed",
    [publicIdentity.coreUserId, courseId],
  );
  res.json({ data: { passed: result.rows[0].passed } });
}));

app.get("/api/courses/:courseId/assessment", asyncRoute(async (req, res) => {
  const courseId = req.params.courseId;
  requireCourse(courseId);
  const { publicIdentity } = await authenticate(req, res);
  await ensureCourseAccess(publicIdentity.coreUserId, courseId);
  const result = await pool.query(
    "SELECT id,position,question_text,options FROM assessment_questions WHERE course_id=$1 AND published=true ORDER BY position,id",
    [courseId],
  );
  res.json({
    data: result.rows.map((row) => ({
      id: row.id,
      position: row.position,
      question: row.question_text,
      options: row.options,
    })),
  });
}));

app.post("/api/courses/:courseId/quiz", asyncRoute(async (req, res) => {
  const courseId = req.params.courseId;
  const courseConfig = requireCourse(courseId);
  const { publicIdentity } = await authenticate(req, res);
  await ensureCourseAccess(publicIdentity.coreUserId, courseId);
  const answers = req.body?.answers;
  const questionIds = req.body?.questionIds;
  const questions = await pool.query(
    "SELECT id,correct_index FROM assessment_questions WHERE course_id=$1 AND published=true ORDER BY position,id",
    [courseId],
  );
  if (!questions.rowCount) throw new HttpError(409, "This assessment is not currently available.", "ASSESSMENT_UNAVAILABLE");
  if (
    !Array.isArray(answers) ||
    !Array.isArray(questionIds) ||
    answers.length !== questions.rowCount ||
    questionIds.length !== questions.rowCount ||
    answers.some((v) => !Number.isInteger(v) || v < 0 || v > 3) ||
    questions.rows.some((row, index) => String(row.id) !== String(questionIds[index]))
  ) {
    throw new HttpError(422, "The assessment changed or is incomplete. Refresh it and try again.", "QUIZ_ANSWERS_INVALID");
  }
  const done = await pool.query(
    "SELECT count(*)::int AS count FROM learner_progress WHERE core_user_id=$1::uuid AND course_id=$2",
    [publicIdentity.coreUserId, courseId],
  );
  if (done.rows[0].count < courseConfig.moduleCount) throw new HttpError(409, "Complete all modules before the final assessment.", "COURSE_INCOMPLETE");
  const score = answers.reduce((total, answer, index) => total + (answer === questions.rows[index].correct_index ? 1 : 0), 0);
  const total = questions.rowCount;
  const passed = score / total >= 0.75;
  await pool.query(
    "INSERT INTO quiz_attempts(core_user_id,course_id,score,total,passed,answers) VALUES ($1::uuid,$2,$3,$4,$5,$6::jsonb)",
    [publicIdentity.coreUserId, courseId, score, total, passed, JSON.stringify({ questionIds, answers })],
  );
  res.json({ data: { score, total, passed } });
}));

app.get("/api/courses/:courseId/certificate", asyncRoute(async (req, res) => {
  const courseId = req.params.courseId;
  const courseConfig = requireCourse(courseId);
  const { publicIdentity } = await authenticate(req, res);
  await ensureCourseAccess(publicIdentity.coreUserId, courseId);
  const result = await pool.query(
    "SELECT verification_code,issued_at,course_id FROM certificates WHERE core_user_id=$1::uuid AND course_id=$2 AND revoked_at IS NULL",
    [publicIdentity.coreUserId, courseId],
  );
  res.json({ data: result.rows[0] ?? null });
}));

app.post("/api/courses/:courseId/certificate", asyncRoute(async (req, res) => {
  const courseId = req.params.courseId;
  const courseConfig = requireCourse(courseId);
  const { publicIdentity } = await authenticate(req, res);
  await ensureCourseAccess(publicIdentity.coreUserId, courseId);
  const certificate = await withClient(async (client) => {
    const lockKey = `certificate:${publicIdentity.coreUserId}:${courseId}`;
    await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [lockKey]);
    const existing = await client.query(
      "SELECT verification_code,issued_at,course_id,revoked_at FROM certificates WHERE core_user_id=$1::uuid AND course_id=$2",
      [publicIdentity.coreUserId, courseId],
    );
    if (existing.rowCount) {
      if (existing.rows[0].revoked_at) {
        throw new HttpError(409, "This certificate has been revoked. Contact SmartVet Africa for support.", "CERTIFICATE_REVOKED");
      }
      return {
        verification_code: existing.rows[0].verification_code,
        issued_at: existing.rows[0].issued_at,
        course_id: existing.rows[0].course_id,
      };
    }

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


app.get("/api/courses/:courseId/certificate.pdf", asyncRoute(async (req, res) => {
  const courseId = req.params.courseId;
  requireCourse(courseId);
  const { publicIdentity } = await authenticate(req, res);
  await ensureCourseAccess(publicIdentity.coreUserId, courseId);

  const result = await pool.query(
    `SELECT c.verification_code,c.issued_at,c.course_id,p.full_name
     FROM certificates c
     JOIN learner_profiles p ON p.core_user_id=c.core_user_id
     WHERE c.core_user_id=$1::uuid AND c.course_id=$2 AND c.revoked_at IS NULL
     LIMIT 1`,
    [publicIdentity.coreUserId, courseId],
  );
  if (!result.rowCount) throw new HttpError(404, "Certificate not found.", "CERTIFICATE_NOT_FOUND");

  const certificate = result.rows[0];
  const pdf = await renderCertificatePdf({
    name: certificate.full_name,
    courseId,
    code: certificate.verification_code,
    issuedAt: certificate.issued_at,
  });

  const disposition = req.query.preview === "1" ? "inline" : "attachment";
  res.set({
    "content-type": "application/pdf",
    "content-disposition": `${disposition}; filename="smartvet-africa-${courseId}-${certificate.verification_code}.pdf"`,
    "cache-control": "private, no-store",
    "x-content-type-options": "nosniff",
  });
  res.send(pdf);
}));


app.get("/api/admin-invitations/:token", inviteLimiter, asyncRoute(async (req, res) => {
  res.set("referrer-policy", "no-referrer");
  const token = String(req.params.token || "");
  if (token.length < 20 || token.length > 256) throw new HttpError(404, "Invitation not found.", "INVITE_NOT_FOUND");
  const result = await pool.query(
    `SELECT email,role,expires_at
       FROM academy_admin_invites
      WHERE token_hash=$1 AND accepted_at IS NULL AND revoked_at IS NULL AND expires_at > now()
      LIMIT 1`,
    [adminInviteHash(token)],
  );
  if (!result.rowCount) throw new HttpError(404, "This invitation is invalid, expired or already used.", "INVITE_NOT_FOUND");
  setAdminInviteCookie(res, token, result.rows[0].expires_at);
  res.json({ data: { ...result.rows[0], email: maskEmail(result.rows[0].email) } });
}));

app.get("/api/admin-invitations/current", inviteLimiter, asyncRoute(async (req, res) => {
  res.set("referrer-policy", "no-referrer");
  const token = String(req.cookies?.[ADMIN_INVITE_COOKIE] || "");
  if (token.length < 20 || token.length > 256) throw new HttpError(404, "Invitation not found.", "INVITE_NOT_FOUND");
  const result = await pool.query(
    `SELECT email,role,expires_at
       FROM academy_admin_invites
      WHERE token_hash=$1 AND accepted_at IS NULL AND revoked_at IS NULL AND expires_at > now()
      LIMIT 1`,
    [adminInviteHash(token)],
  );
  if (!result.rowCount) {
    clearAdminInviteCookie(res);
    throw new HttpError(404, "This invitation is invalid, expired or already used.", "INVITE_NOT_FOUND");
  }
  res.json({ data: { ...result.rows[0], email: maskEmail(result.rows[0].email) } });
}));

app.post("/api/admin-invitations/accept", inviteLimiter, asyncRoute(async (req, res) => {
  res.set("referrer-policy", "no-referrer");
  const token = String(req.cookies?.[ADMIN_INVITE_COOKIE] || "");
  if (token.length < 20 || token.length > 256) throw new HttpError(404, "Invitation not found.", "INVITE_NOT_FOUND");
  const auth = await authenticate(req, res);
  const signedInEmail = normalizeEmail(auth.publicIdentity.email);
  if (!signedInEmail) throw new HttpError(409, "Your account needs an email address before this invitation can be accepted.", "INVITE_EMAIL_REQUIRED");

  const accepted = await withClient(async (client) => {
    const invite = await client.query(
      `SELECT id,email,role,expires_at
         FROM academy_admin_invites
        WHERE token_hash=$1 AND accepted_at IS NULL AND revoked_at IS NULL AND expires_at > now()
        FOR UPDATE`,
      [adminInviteHash(token)],
    );
    if (!invite.rowCount) throw new HttpError(404, "This invitation is invalid, expired or already used.", "INVITE_NOT_FOUND");
    const row = invite.rows[0];
    if (normalizeEmail(row.email) !== signedInEmail) {
      throw new HttpError(403, `This invitation was sent to ${maskEmail(row.email)}. Sign in with that email address to accept it.`, "INVITE_EMAIL_MISMATCH");
    }
    await client.query(
      `INSERT INTO academy_admins(core_user_id,role)
       VALUES ($1::uuid,$2)
       ON CONFLICT(core_user_id) DO UPDATE SET role=EXCLUDED.role,updated_at=now()`,
      [auth.publicIdentity.coreUserId,row.role],
    );
    await client.query(
      `UPDATE academy_admin_invites
          SET accepted_at=now(),accepted_by=$2::uuid,updated_at=now()
        WHERE id=$1::uuid`,
      [row.id,auth.publicIdentity.coreUserId],
    );
    return { inviteId: row.id, role: row.role };
  });

  clearAdminInviteCookie(res);
  await auditAdmin(auth.publicIdentity.coreUserId, "admin.invite.accept", "academy_admin_invite", accepted.inviteId, { role: accepted.role });
  res.json({ data: { accepted: true, role: accepted.role } });
}));

app.get("/api/admin/admins", asyncRoute(async (req, res) => {
  await requireAdmin(req, res, ["owner","admin"]);
  const [admins, invites] = await Promise.all([
    pool.query(
      `SELECT a.core_user_id,a.role,a.created_at,a.updated_at,p.full_name,p.email
       FROM academy_admins a
       JOIN learner_profiles p ON p.core_user_id=a.core_user_id
       ORDER BY CASE a.role WHEN 'owner' THEN 1 WHEN 'admin' THEN 2 WHEN 'assessor' THEN 3 ELSE 4 END,p.full_name`,
    ),
    pool.query(
      `SELECT i.id,i.email,i.role,i.expires_at,i.created_at,i.updated_at,i.accepted_at,i.revoked_at,
              p.full_name AS invited_by_name,p.email AS invited_by_email
       FROM academy_admin_invites i
       JOIN learner_profiles p ON p.core_user_id=i.invited_by
       WHERE i.accepted_at IS NULL
       ORDER BY i.created_at DESC
       LIMIT 100`,
    ),
  ]);
  res.json({ data: { admins: admins.rows, invites: invites.rows } });
}));

app.post("/api/admin/invites", asyncRoute(async (req, res) => {
  const admin = await requireAdmin(req, res, ["owner","admin"]);
  const email = normalizeEmail(req.body?.email);
  const role = String(req.body?.role || "admin").trim().toLowerCase();
  if (!validEmail(email)) throw new HttpError(422, "Enter a valid administrator email address.", "INVITE_EMAIL_INVALID");
  if (!["owner","admin","assessor","support"].includes(role)) throw new HttpError(422, "Choose a valid administrator role.", "INVITE_ROLE_INVALID");
  if (role === "owner" && admin.role !== "owner") throw new HttpError(403, "Only an owner can invite another owner.", "OWNER_INVITE_FORBIDDEN");

  const existingAdmin = await pool.query(
    `SELECT a.core_user_id,a.role,p.full_name,p.email
     FROM academy_admins a JOIN learner_profiles p ON p.core_user_id=a.core_user_id
     WHERE lower(p.email)=lower($1) LIMIT 1`,
    [email],
  );
  if (existingAdmin.rowCount) throw new HttpError(409, "That email already has Academy administration access.", "ADMIN_ALREADY_EXISTS");

  const token = newAdminInviteToken();
  const tokenHash = adminInviteHash(token);
  const expiresAt = new Date(Date.now() + ADMIN_INVITE_TTL_HOURS * 60 * 60 * 1000);
  const result = await withClient(async (client) => {
    await client.query(
      `UPDATE academy_admin_invites
       SET revoked_at=now(),revoked_by=$2::uuid,updated_at=now()
       WHERE lower(email)=lower($1) AND accepted_at IS NULL AND revoked_at IS NULL`,
      [email,admin.publicIdentity.coreUserId],
    );
    return client.query(
      `INSERT INTO academy_admin_invites(email,role,token_hash,invited_by,expires_at)
       VALUES ($1,$2,$3,$4::uuid,$5)
       RETURNING id,email,role,expires_at,created_at`,
      [email,role,tokenHash,admin.publicIdentity.coreUserId,expiresAt],
    );
  });

  const inviteUrl = adminInviteUrl(token);
  const delivery = await sendAdminInviteEmail({
    email,
    role,
    inviteUrl,
    invitedBy: admin.publicIdentity.displayName || admin.publicIdentity.email,
  });
  await auditAdmin(admin.publicIdentity.coreUserId, "admin.invite.create", "academy_admin_invite", result.rows[0].id, { email, role, delivered: delivery.delivered });
  res.status(201).json({ data: { ...result.rows[0], inviteUrl, delivery } });
}));

app.post("/api/admin/invites/:inviteId/resend", asyncRoute(async (req, res) => {
  const admin = await requireAdmin(req, res, ["owner","admin"]);
  const inviteId = String(req.params.inviteId || "");
  const current = await pool.query(
    `SELECT id,email,role FROM academy_admin_invites
     WHERE id=$1::uuid AND accepted_at IS NULL AND revoked_at IS NULL`,
    [inviteId],
  );
  if (!current.rowCount) throw new HttpError(404, "Pending invitation not found.", "INVITE_NOT_FOUND");
  if (current.rows[0].role === "owner" && admin.role !== "owner") throw new HttpError(403, "Only an owner can resend an owner invitation.", "OWNER_INVITE_FORBIDDEN");

  const token = newAdminInviteToken();
  const expiresAt = new Date(Date.now() + ADMIN_INVITE_TTL_HOURS * 60 * 60 * 1000);
  const result = await pool.query(
    `UPDATE academy_admin_invites
     SET token_hash=$2,expires_at=$3,updated_at=now()
     WHERE id=$1::uuid
     RETURNING id,email,role,expires_at,created_at,updated_at`,
    [inviteId,adminInviteHash(token),expiresAt],
  );
  const inviteUrl = adminInviteUrl(token);
  const delivery = await sendAdminInviteEmail({
    email: result.rows[0].email,
    role: result.rows[0].role,
    inviteUrl,
    invitedBy: admin.publicIdentity.displayName || admin.publicIdentity.email,
  });
  await auditAdmin(admin.publicIdentity.coreUserId, "admin.invite.resend", "academy_admin_invite", inviteId, { delivered: delivery.delivered });
  res.json({ data: { ...result.rows[0], inviteUrl, delivery } });
}));

app.delete("/api/admin/invites/:inviteId", asyncRoute(async (req, res) => {
  const admin = await requireAdmin(req, res, ["owner","admin"]);
  const inviteId = String(req.params.inviteId || "");
  const current = await pool.query(
    "SELECT id,role,email FROM academy_admin_invites WHERE id=$1::uuid AND accepted_at IS NULL AND revoked_at IS NULL",
    [inviteId],
  );
  if (!current.rowCount) throw new HttpError(404, "Pending invitation not found.", "INVITE_NOT_FOUND");
  if (current.rows[0].role === "owner" && admin.role !== "owner") throw new HttpError(403, "Only an owner can revoke an owner invitation.", "OWNER_INVITE_FORBIDDEN");
  await pool.query(
    "UPDATE academy_admin_invites SET revoked_at=now(),revoked_by=$2::uuid,updated_at=now() WHERE id=$1::uuid",
    [inviteId,admin.publicIdentity.coreUserId],
  );
  await auditAdmin(admin.publicIdentity.coreUserId, "admin.invite.revoke", "academy_admin_invite", inviteId, { email: current.rows[0].email });
  res.json({ data: { revoked: true } });
}));

app.patch("/api/admin/admins/:coreUserId", asyncRoute(async (req, res) => {
  const admin = await requireAdmin(req, res, ["owner"]);
  const coreUserId = String(req.params.coreUserId || "");
  const role = String(req.body?.role || "").trim().toLowerCase();
  if (!["owner","admin","assessor","support"].includes(role)) throw new HttpError(422, "Choose a valid administrator role.", "ADMIN_ROLE_INVALID");
  const result = await withClient(async (client) => {
    await client.query("SELECT pg_advisory_xact_lock(hashtextextended('academy-admin-owners',0))");
    const current = await client.query(
      "SELECT role FROM academy_admins WHERE core_user_id=$1::uuid FOR UPDATE",
      [coreUserId],
    );
    if (!current.rowCount) throw new HttpError(404, "Administrator not found.", "ADMIN_NOT_FOUND");
    if (current.rows[0].role === "owner" && role !== "owner") {
      const owners = await client.query("SELECT count(*)::int AS count FROM academy_admins WHERE role='owner'");
      if (owners.rows[0].count <= 1) throw new HttpError(409, "The Academy must keep at least one owner.", "LAST_OWNER_BLOCKED");
    }
    return client.query(
      `UPDATE academy_admins SET role=$2,updated_at=now()
       WHERE core_user_id=$1::uuid
       RETURNING core_user_id,role,created_at,updated_at`,
      [coreUserId,role],
    );
  });
  await auditAdmin(admin.publicIdentity.coreUserId, "admin.role.update", "academy_admin", coreUserId, { role });
  res.json({ data: result.rows[0] });
}));

app.delete("/api/admin/admins/:coreUserId", asyncRoute(async (req, res) => {
  const admin = await requireAdmin(req, res, ["owner"]);
  const coreUserId = String(req.params.coreUserId || "");
  if (coreUserId === admin.publicIdentity.coreUserId) throw new HttpError(409, "You cannot remove your own administrator access.", "ADMIN_SELF_REMOVE_BLOCKED");
  const current = await pool.query("SELECT role FROM academy_admins WHERE core_user_id=$1::uuid", [coreUserId]);
  if (!current.rowCount) throw new HttpError(404, "Administrator not found.", "ADMIN_NOT_FOUND");
  if (current.rows[0].role === "owner") {
    const owners = await pool.query("SELECT count(*)::int AS count FROM academy_admins WHERE role='owner'");
    if (owners.rows[0].count <= 1) throw new HttpError(409, "The Academy must keep at least one owner.", "LAST_OWNER_BLOCKED");
  }
  await pool.query("DELETE FROM academy_admins WHERE core_user_id=$1::uuid", [coreUserId]);
  await auditAdmin(admin.publicIdentity.coreUserId, "admin.access.remove", "academy_admin", coreUserId, { previousRole: current.rows[0].role });
  res.json({ data: { removed: true } });
}));

app.get("/api/admin/session", asyncRoute(async (req, res) => {
  const admin = await requireAdmin(req, res);
  res.json({ data: { ...admin.publicIdentity, role: admin.role } });
}));

app.get("/api/admin/overview", asyncRoute(async (req, res) => {
  await requireAdmin(req, res);
  const result = await pool.query(`
    SELECT
      (SELECT count(*)::int FROM learner_profiles) learners,
      (SELECT count(*)::int FROM learner_profiles WHERE status='active') active_accounts,
      (SELECT count(DISTINCT core_user_id)::int FROM learner_progress WHERE completed_at >= now() - interval '7 days') active_7d,
      (SELECT count(*)::int FROM course_enrollments WHERE status='active') active_enrollments,
      (SELECT count(*)::int FROM quiz_attempts) quiz_attempts,
      (SELECT count(*)::int FROM quiz_attempts WHERE passed) quiz_passes,
      (SELECT count(*)::int FROM certificates WHERE revoked_at IS NULL) certificates,
      (SELECT count(*)::int FROM assessment_questions WHERE published) published_questions
  `);
  const row = result.rows[0] || {};
  res.json({ data: {
    learners: Number(row.learners || 0),
    activeAccounts: Number(row.active_accounts || 0),
    active7d: Number(row.active_7d || 0),
    activeEnrollments: Number(row.active_enrollments || 0),
    quizAttempts: Number(row.quiz_attempts || 0),
    quizPasses: Number(row.quiz_passes || 0),
    certificates: Number(row.certificates || 0),
    publishedQuestions: Number(row.published_questions || 0),
  } });
}));

app.get("/api/admin/learners", asyncRoute(async (req, res) => {
  await requireAdmin(req, res, ["owner","admin","support"]);
  const limit = parseLimit(req.query.limit, 50, 100);
  const offset = parseOffset(req.query.offset);
  const search = String(req.query.search || "").trim();
  const params = [];
  let where = "";
  if (search) {
    params.push(`%${search}%`);
    where = `WHERE p.full_name ILIKE $1 OR COALESCE(p.email,'') ILIKE $1`;
  }
  params.push(limit, offset);
  const limitParam = params.length - 1;
  const offsetParam = params.length;
  const result = await pool.query(`
    SELECT
      p.core_user_id,p.full_name,p.email,p.status,p.created_at,p.updated_at,
      COALESCE(pr.modules_completed,0)::int modules_completed,
      COALESCE(qa.attempts,0)::int assessment_attempts,
      COALESCE(qa.passes,0)::int assessment_passes,
      COALESCE(cc.certificates,0)::int certificates,
      COALESCE(en.enrollments,'[]'::jsonb) enrollments
    FROM learner_profiles p
    LEFT JOIN (
      SELECT core_user_id,count(*)::int modules_completed
      FROM learner_progress GROUP BY core_user_id
    ) pr ON pr.core_user_id=p.core_user_id
    LEFT JOIN (
      SELECT core_user_id,count(*)::int attempts,count(*) FILTER (WHERE passed)::int passes
      FROM quiz_attempts GROUP BY core_user_id
    ) qa ON qa.core_user_id=p.core_user_id
    LEFT JOIN (
      SELECT core_user_id,count(*) FILTER (WHERE revoked_at IS NULL)::int certificates
      FROM certificates GROUP BY core_user_id
    ) cc ON cc.core_user_id=p.core_user_id
    LEFT JOIN (
      SELECT core_user_id,jsonb_agg(jsonb_build_object('courseId',course_id,'status',status) ORDER BY course_id) enrollments
      FROM course_enrollments GROUP BY core_user_id
    ) en ON en.core_user_id=p.core_user_id
    ${where}
    ORDER BY p.created_at DESC
    LIMIT $${limitParam} OFFSET $${offsetParam}
  `, params);
  res.json({ data: result.rows });
}));

app.patch("/api/admin/learners/:coreUserId", asyncRoute(async (req, res) => {
  const admin = await requireAdmin(req, res, ["owner","admin"]);
  const coreUserId = String(req.params.coreUserId || "");
  const status = String(req.body?.status || "");
  if (!["active","suspended"].includes(status)) throw new HttpError(422, "Choose a valid learner status.", "STATUS_INVALID");
  if (coreUserId === admin.publicIdentity.coreUserId && status === "suspended") {
    throw new HttpError(409, "You cannot suspend your own administrator account.", "SELF_SUSPEND_BLOCKED");
  }
  const result = await pool.query(
    "UPDATE learner_profiles SET status=$2,updated_at=now() WHERE core_user_id=$1::uuid RETURNING core_user_id,full_name,email,status",
    [coreUserId,status],
  );
  if (!result.rowCount) throw new HttpError(404, "Learner not found.", "LEARNER_NOT_FOUND");
  await auditAdmin(admin.publicIdentity.coreUserId, "learner.status.update", "learner", coreUserId, { status });
  res.json({ data: result.rows[0] });
}));

app.get("/api/admin/enrollments", asyncRoute(async (req, res) => {
  await requireAdmin(req, res, ["owner","admin","support"]);
  const courseId = String(req.query.courseId || "").trim();
  if (courseId) requireCourse(courseId);
  const limit = parseLimit(req.query.limit, 100, 200);
  const params = courseId ? [courseId,limit] : [limit];
  const where = courseId ? "WHERE e.course_id=$1" : "";
  const limitParam = courseId ? 2 : 1;
  const result = await pool.query(`
    SELECT e.core_user_id,e.course_id,e.status,e.enrolled_at,e.updated_at,p.full_name,p.email
    FROM course_enrollments e
    JOIN learner_profiles p ON p.core_user_id=e.core_user_id
    ${where}
    ORDER BY e.updated_at DESC
    LIMIT $${limitParam}
  `, params);
  res.json({ data: result.rows });
}));

app.put("/api/admin/enrollments/:coreUserId/:courseId", asyncRoute(async (req, res) => {
  const admin = await requireAdmin(req, res, ["owner","admin","support"]);
  const coreUserId = String(req.params.coreUserId || "");
  const courseId = String(req.params.courseId || "");
  requireCourse(courseId);
  const status = String(req.body?.status || "active");
  if (!["active","suspended","withdrawn"].includes(status)) throw new HttpError(422, "Choose a valid enrolment status.", "ENROLLMENT_STATUS_INVALID");
  const learner = await pool.query("SELECT 1 FROM learner_profiles WHERE core_user_id=$1::uuid", [coreUserId]);
  if (!learner.rowCount) throw new HttpError(404, "Learner not found.", "LEARNER_NOT_FOUND");
  const result = await pool.query(
    `INSERT INTO course_enrollments(core_user_id,course_id,status,managed_by)
     VALUES ($1::uuid,$2,$3,$4::uuid)
     ON CONFLICT(core_user_id,course_id) DO UPDATE
       SET status=EXCLUDED.status,managed_by=EXCLUDED.managed_by,updated_at=now()
     RETURNING core_user_id,course_id,status,enrolled_at,updated_at`,
    [coreUserId,courseId,status,admin.publicIdentity.coreUserId],
  );
  await auditAdmin(admin.publicIdentity.coreUserId, "enrollment.update", "enrollment", `${coreUserId}:${courseId}`, { status });
  res.json({ data: result.rows[0] });
}));

app.get("/api/admin/assessments", asyncRoute(async (req, res) => {
  await requireAdmin(req, res, ["owner","admin","assessor"]);
  const courseId = String(req.query.courseId || "").trim();
  if (!courseId) throw new HttpError(422, "Choose a course.", "COURSE_REQUIRED");
  requireCourse(courseId);
  const result = await pool.query(
    "SELECT id,course_id,position,question_text,options,correct_index,published,created_at,updated_at FROM assessment_questions WHERE course_id=$1 ORDER BY position,id",
    [courseId],
  );
  res.json({ data: result.rows });
}));

app.post("/api/admin/assessments/:courseId/questions", asyncRoute(async (req, res) => {
  const admin = await requireAdmin(req, res, ["owner","admin","assessor"]);
  const courseId = String(req.params.courseId || "");
  requireCourse(courseId);
  const question = String(req.body?.question || "").trim();
  const options = req.body?.options;
  const correctIndex = Number(req.body?.correctIndex);
  const published = req.body?.published !== false;
  if (question.length < 5 || question.length > 800) throw new HttpError(422, "Enter a valid question.", "QUESTION_INVALID");
  if (!Array.isArray(options) || options.length !== 4 || options.some((v) => String(v).trim().length < 1)) throw new HttpError(422, "Provide four answer options.", "OPTIONS_INVALID");
  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex > 3) throw new HttpError(422, "Choose the correct answer.", "CORRECT_INDEX_INVALID");
  const next = await pool.query("SELECT COALESCE(max(position),0)+1 AS position FROM assessment_questions WHERE course_id=$1", [courseId]);
  const result = await pool.query(
    `INSERT INTO assessment_questions(course_id,position,question_text,options,correct_index,published)
     VALUES ($1,$2,$3,$4::jsonb,$5,$6)
     RETURNING id,course_id,position,question_text,options,correct_index,published,created_at,updated_at`,
    [courseId,next.rows[0].position,question,JSON.stringify(options.map((v) => String(v).trim())),correctIndex,published],
  );
  await auditAdmin(admin.publicIdentity.coreUserId, "assessment.question.create", "assessment_question", result.rows[0].id, { courseId });
  res.status(201).json({ data: result.rows[0] });
}));

app.patch("/api/admin/assessments/:courseId/questions/:questionId", asyncRoute(async (req, res) => {
  const admin = await requireAdmin(req, res, ["owner","admin","assessor"]);
  const courseId = String(req.params.courseId || "");
  requireCourse(courseId);
  const questionId = String(req.params.questionId || "");
  const question = String(req.body?.question || "").trim();
  const options = req.body?.options;
  const correctIndex = Number(req.body?.correctIndex);
  const published = Boolean(req.body?.published);
  if (question.length < 5 || question.length > 800) throw new HttpError(422, "Enter a valid question.", "QUESTION_INVALID");
  if (!Array.isArray(options) || options.length !== 4 || options.some((v) => String(v).trim().length < 1)) throw new HttpError(422, "Provide four answer options.", "OPTIONS_INVALID");
  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex > 3) throw new HttpError(422, "Choose the correct answer.", "CORRECT_INDEX_INVALID");
  const result = await pool.query(
    `UPDATE assessment_questions
       SET question_text=$3,options=$4::jsonb,correct_index=$5,published=$6,updated_at=now()
     WHERE id=$1::uuid AND course_id=$2
     RETURNING id,course_id,position,question_text,options,correct_index,published,created_at,updated_at`,
    [questionId,courseId,question,JSON.stringify(options.map((v) => String(v).trim())),correctIndex,published],
  );
  if (!result.rowCount) throw new HttpError(404, "Assessment question not found.", "QUESTION_NOT_FOUND");
  await auditAdmin(admin.publicIdentity.coreUserId, "assessment.question.update", "assessment_question", questionId, { courseId, published });
  res.json({ data: result.rows[0] });
}));

app.delete("/api/admin/assessments/:courseId/questions/:questionId", asyncRoute(async (req, res) => {
  const admin = await requireAdmin(req, res, ["owner","admin","assessor"]);
  const courseId = String(req.params.courseId || "");
  requireCourse(courseId);
  const questionId = String(req.params.questionId || "");
  const result = await pool.query(
    "DELETE FROM assessment_questions WHERE id=$1::uuid AND course_id=$2 RETURNING id",
    [questionId,courseId],
  );
  if (!result.rowCount) throw new HttpError(404, "Assessment question not found.", "QUESTION_NOT_FOUND");
  await auditAdmin(admin.publicIdentity.coreUserId, "assessment.question.delete", "assessment_question", questionId, { courseId });
  res.json({ data: { deleted: true } });
}));

app.get("/api/admin/certificates", asyncRoute(async (req, res) => {
  await requireAdmin(req, res, ["owner","admin"]);
  const search = String(req.query.search || "").trim();
  const courseId = String(req.query.courseId || "").trim();
  const params = [];
  const clauses = [];
  if (search) {
    params.push(`%${search}%`);
    clauses.push(`(p.full_name ILIKE $${params.length} OR COALESCE(p.email,'') ILIKE $${params.length} OR c.verification_code ILIKE $${params.length})`);
  }
  if (courseId) {
    requireCourse(courseId);
    params.push(courseId);
    clauses.push(`c.course_id=$${params.length}`);
  }
  params.push(parseLimit(req.query.limit, 100, 200));
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const result = await pool.query(`
    SELECT c.id,c.core_user_id,c.course_id,c.verification_code,c.issued_at,c.revoked_at,c.revocation_reason,p.full_name,p.email
    FROM certificates c
    JOIN learner_profiles p ON p.core_user_id=c.core_user_id
    ${where}
    ORDER BY c.issued_at DESC
    LIMIT $${params.length}
  `, params);
  res.json({ data: result.rows });
}));

app.patch("/api/admin/certificates/:certificateId", asyncRoute(async (req, res) => {
  const admin = await requireAdmin(req, res, ["owner","admin"]);
  const certificateId = String(req.params.certificateId || "");
  const revoked = Boolean(req.body?.revoked);
  const reason = String(req.body?.reason || "").trim().slice(0,500);
  const result = revoked
    ? await pool.query(
        `UPDATE certificates SET revoked_at=now(),revoked_by=$2::uuid,revocation_reason=$3,updated_at=now()
         WHERE id=$1::uuid RETURNING id,course_id,verification_code,issued_at,revoked_at,revocation_reason`,
        [certificateId,admin.publicIdentity.coreUserId,reason || "Revoked by Academy administrator"],
      )
    : await pool.query(
        `UPDATE certificates SET revoked_at=NULL,revoked_by=NULL,revocation_reason=NULL,updated_at=now()
         WHERE id=$1::uuid RETURNING id,course_id,verification_code,issued_at,revoked_at,revocation_reason`,
        [certificateId],
      );
  if (!result.rowCount) throw new HttpError(404, "Certificate not found.", "CERTIFICATE_NOT_FOUND");
  await auditAdmin(admin.publicIdentity.coreUserId, revoked ? "certificate.revoke" : "certificate.restore", "certificate", certificateId, { reason });
  res.json({ data: result.rows[0] });
}));

app.get("/api/admin/audit", asyncRoute(async (req, res) => {
  await requireAdmin(req, res, ["owner","admin"]);
  const limit = parseLimit(req.query.limit, 50, 100);
  const result = await pool.query(
    `SELECT l.id,l.action,l.entity_type,l.entity_id,l.metadata,l.created_at,p.full_name,p.email
     FROM admin_audit_log l
     JOIN learner_profiles p ON p.core_user_id=l.actor_core_user_id
     ORDER BY l.created_at DESC LIMIT $1`,
    [limit],
  );
  res.json({ data: result.rows });
}));

app.get("/api/certificates/verify/:code", verifyLimiter, asyncRoute(async (req, res) => {
  const code = String(req.params.code || "").trim().toUpperCase();
  if (!/^SVA-[A-F0-9]{10}$/.test(code)) return res.json({ data: null });
  const result = await pool.query(
    `SELECT p.full_name,c.course_id,c.issued_at
     FROM certificates c
     JOIN learner_profiles p ON p.core_user_id=c.core_user_id
     WHERE c.verification_code=$1
       AND c.revoked_at IS NULL
     LIMIT 1`,
    [code],
  );
  res.json({ data: result.rows[0] ?? null });
}));

app.use((error, req, res, _next) => {
  const status = Number(error?.status || 500);
  const safeStatus = status >= 400 && status < 600 ? status : 500;
  if (safeStatus >= 500) {
    const safePath = req.path.replace(/\/api\/admin-invitations\/[^/]+/g, "/api/admin-invitations/[redacted]");
    console.error(JSON.stringify({ event: "academy_api_error", path: safePath, message: error?.message, code: error?.code }));
  }
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
