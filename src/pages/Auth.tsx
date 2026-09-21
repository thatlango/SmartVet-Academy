import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

export default function AuthPage() {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [recoveryMessage, setRecoveryMessage] = useState("");

  const requestedReturn = searchParams.get("returnTo");
  const returnTo = requestedReturn && requestedReturn.startsWith("/") && !requestedReturn.startsWith("//")
    ? requestedReturn
    : "/dashboard";

  useEffect(() => {
    if (!loading && user) nav(returnTo, { replace: true });
  }, [loading, user, nav, returnTo]);

  async function sendRecovery() {
    setError("");
    setRecoveryMessage("");
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError("Enter your email address first.");
      return;
    }

    setBusy(true);
    try {
      await api<{ accepted: boolean }>("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: normalizedEmail }),
      });
      setRecoveryMessage("If an account exists for that email, password-reset instructions have been sent.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send password-reset instructions.");
    } finally {
      setBusy(false);
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (mode === "signup") {
        if (name.trim().length < 2) throw new Error("Enter your full name.");
        await signUp(name.trim(), email.trim(), password);
      } else {
        await signIn(email.trim(), password);
      }
      nav(returnTo, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to continue.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto grid min-h-[72vh] max-w-7xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-[.9fr_1.1fr] md:items-center md:py-16">
      <div>
        <Link to="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary">
          <ArrowLeft className="size-4" />
          Back to courses
        </Link>
        <p className="mt-7 text-sm font-bold uppercase tracking-[.14em] text-primary">Learner account</p>
        <h1 className="mt-3 max-w-xl text-4xl font-semibold leading-tight sm:text-5xl">Keep your place and continue on any device.</h1>
        <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
          Your completed modules, assessment status and certificates stay connected to your learner account.
        </p>
        <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-primary">
          <ShieldCheck className="size-4" />
          Progress saved securely
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
        <div className="grid grid-cols-2 rounded-xl bg-muted p-1" role="tablist" aria-label="Account access">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signin"}
            onClick={() => { setMode("signin"); setError(""); }}
            className={`min-h-11 rounded-lg px-3 py-2 text-sm font-semibold ${mode === "signin" ? "bg-card shadow-sm" : ""}`}
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signup"}
            onClick={() => { setMode("signup"); setError(""); }}
            className={`min-h-11 rounded-lg px-3 py-2 text-sm font-semibold ${mode === "signup" ? "bg-card shadow-sm" : ""}`}
          >
            Create account
          </button>
        </div>

        <h2 className="mt-6 text-2xl font-semibold">{mode === "signup" ? "Create your learner account" : "Welcome back"}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {mode === "signup" ? "Use the name you want displayed on your certificates." : "Sign in to continue from your saved progress."}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <label className="block">
              <span className="text-sm font-semibold">Full name</span>
              <input
                required
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-1.5 min-h-12 w-full rounded-xl border border-input bg-background px-4 py-3"
                placeholder="Name shown on your certificate"
              />
            </label>
          )}
          <label className="block">
            <span className="text-sm font-semibold">Email</span>
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1.5 min-h-12 w-full rounded-xl border border-input bg-background px-4 py-3"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Password</span>
            <input
              required
              minLength={8}
              maxLength={128}
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1.5 min-h-12 w-full rounded-xl border border-input bg-background px-4 py-3"
            />
            <span className="mt-1 block text-xs text-muted-foreground">Use at least 8 characters.</span>
            {mode === "signin" && (
              <button
                type="button"
                disabled={busy}
                onClick={() => void sendRecovery()}
                className="mt-2 min-h-10 text-sm font-semibold text-primary hover:underline disabled:opacity-50"
              >
                Forgot your password?
              </button>
            )}
          </label>

          {recoveryMessage && (
            <p role="status" className="rounded-xl bg-primary/10 p-3 text-sm leading-6 text-foreground">{recoveryMessage}</p>
          )}
          {error && <p role="alert" className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

          <button
            disabled={busy}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground disabled:opacity-60"
          >
            {busy && <Loader2 className="size-4 animate-spin" />}
            {mode === "signup" ? "Create learner account" : "Sign in and continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
