const buckets = new Map();

export function maskEmail(value) {
  const email = String(value || "").trim().toLowerCase();
  const at = email.indexOf("@");
  if (at <= 0) return "";
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  const visible = local.length <= 2 ? local.slice(0, 1) : local.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(3, Math.min(8, local.length - visible.length)))}@${domain}`;
}

export function safeResetPath(value) {
  const candidate = String(value || "").trim();
  if (candidate === "/auth") return "/auth";
  if (candidate === "/admin/login") return "/admin/login";
  if (candidate.startsWith("/admin/invite/") && !candidate.startsWith("//")) return candidate;
  return "/auth";
}

export function fixedWindowRateLimit({ name, windowMs, max }) {
  if (!name || !Number.isFinite(windowMs) || windowMs <= 0 || !Number.isInteger(max) || max <= 0) {
    throw new Error("Invalid rate limiter configuration.");
  }
  return (req, res, next) => {
    const now = Date.now();
    const ip = String(req.ip || req.socket?.remoteAddress || "unknown");
    const key = `${name}:${ip}`;
    const current = buckets.get(key);
    if (!current || current.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }
    if (current.count >= max) {
      const retrySeconds = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
      res.set("retry-after", String(retrySeconds));
      return res.status(429).json({ error: { code: "RATE_LIMITED", message: "Too many requests. Try again shortly." } });
    }
    current.count += 1;
    return next();
  };
}

export function resetRateLimitStateForTests() {
  buckets.clear();
}
