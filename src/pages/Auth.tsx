import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function AuthPage() {
  const nav = useNavigate();
  const { user, loading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { if (!loading && user) nav("/dashboard", { replace: true }); }, [loading, user, nav]);

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
      nav("/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to continue.");
    } finally {
      setBusy(false);
    }
  }

  return <div className="mx-auto grid min-h-[72vh] max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 md:items-center">
    <div>
      <p className="text-sm font-bold uppercase tracking-[.14em] text-primary">Learner account</p>
      <h1 className="mt-3 text-4xl font-semibold">Learn over time without losing your place.</h1>
      <p className="mt-4 leading-7 text-muted-foreground">Your modules, assessment and certificate stay tied to your account across sessions.</p>
      <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-primary"><ShieldCheck className="size-4"/> Secure account service powered by Tuku Auth on the SmartVet VPS</p>
    </div>
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="grid grid-cols-2 rounded-xl bg-muted p-1">
        <button type="button" onClick={() => { setMode("signin"); setError(""); }} className={`rounded-lg px-3 py-2 text-sm font-semibold ${mode === "signin" ? "bg-card shadow-sm" : ""}`}>Sign in</button>
        <button type="button" onClick={() => { setMode("signup"); setError(""); }} className={`rounded-lg px-3 py-2 text-sm font-semibold ${mode === "signup" ? "bg-card shadow-sm" : ""}`}>Create account</button>
      </div>
      <form onSubmit={submit} className="mt-6 space-y-4">
        {mode === "signup" && <label className="block"><span className="text-sm font-semibold">Full name</span><input required autoComplete="name" value={name} onChange={e => setName(e.target.value)} className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3" placeholder="Name shown on your certificate"/></label>}
        <label className="block"><span className="text-sm font-semibold">Email</span><input required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3"/></label>
        <label className="block"><span className="text-sm font-semibold">Password</span><input required minLength={8} maxLength={128} type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={e => setPassword(e.target.value)} className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3"/><span className="mt-1 block text-xs text-muted-foreground">Use at least 8 characters.</span></label>
        {error && <p role="alert" className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
        <button disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground disabled:opacity-60">{busy && <Loader2 className="size-4 animate-spin"/>}{mode === "signup" ? "Create learner account" : "Sign in and continue"}</button>
      </form>
    </div>
  </div>;
}
