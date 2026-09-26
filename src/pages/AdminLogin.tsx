import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { SmartVetLogo } from "@/components/SmartVetLogo";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

export default function AdminLoginPage() {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading, signIn, signUp } = useAuth();
  const requestedReturn = searchParams.get("returnTo");
  const returnTo = requestedReturn && requestedReturn.startsWith("/admin") && !requestedReturn.startsWith("//")
    ? requestedReturn
    : "/admin";
  const invitationFlow = returnTo.startsWith("/admin/invite/");
  const [createAccount, setCreateAccount] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [recoveryMessage, setRecoveryMessage] = useState("");

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
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to send password-reset instructions.");
    } finally {
      setBusy(false);
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setRecoveryMessage("");
    try {
      if (createAccount && invitationFlow) {
        if (name.trim().length < 2) throw new Error("Enter your full name.");
        await signUp(name.trim(), email.trim(), password);
      } else {
        await signIn(email.trim(), password);
      }
      nav(returnTo, { replace: true });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f4f7f4]"><Loader2 className="size-7 animate-spin text-emerald-700" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#f4f7f4] px-4 py-8 sm:py-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">
        <div className="w-full max-w-md">
          <div className="mb-5 flex items-center justify-between gap-4">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900">
              <ArrowLeft className="size-4" />
              Academy
            </Link>
            <div className="rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200">
              <SmartVetLogo className="h-8 w-auto" />
            </div>
          </div>

          <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,.08)]">
            <div className="bg-[#173122] px-6 py-7 text-white sm:px-8">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-white/10">
                <ShieldCheck className="size-5" />
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-[.16em] text-emerald-200">SmartVet Academy</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight">Administration</h1>
              <p className="mt-2 text-sm leading-6 text-emerald-50/75">
                {invitationFlow ? "Sign in with the email that received the administrator invitation." : "Sign in to manage learners, assessments, certificates and Academy access."}
              </p>
            </div>

            <div className="p-6 sm:p-8">
              {invitationFlow && (
                <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                  <div className="flex gap-3">
                    <KeyRound className="mt-0.5 size-5 shrink-0 text-emerald-700" />
                    <div>
                      <p className="text-sm font-bold text-emerald-900">Administrator invitation</p>
                      <p className="mt-1 text-sm leading-6 text-emerald-800/80">
                        Already have a SmartVet account? Sign in. If this is your first account, create one here and return directly to your invitation.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <h2 className="text-xl font-bold text-slate-950">
                {createAccount ? "Create your administrator account" : "Administrator sign in"}
              </h2>

              <form onSubmit={submit} className="mt-5 space-y-4">
                {createAccount && invitationFlow && (
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Full name</span>
                    <input
                      required
                      autoComplete="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="mt-1.5 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    />
                  </label>
                )}

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Email</span>
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-1.5 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    placeholder="you@organisation.org"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Password</span>
                  <input
                    required
                    minLength={8}
                    maxLength={128}
                    type="password"
                    autoComplete={createAccount ? "new-password" : "current-password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="mt-1.5 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                  {!createAccount && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void sendRecovery()}
                      className="mt-2 text-sm font-semibold text-emerald-700 hover:underline disabled:opacity-50"
                    >
                      Forgot password?
                    </button>
                  )}
                </label>

                {recoveryMessage && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-800">{recoveryMessage}</p>}
                {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm leading-6 text-rose-700">{error}</p>}

                <button
                  disabled={busy}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#173122] px-5 py-3 font-bold text-white transition hover:bg-[#214b34] disabled:opacity-60"
                >
                  {busy && <Loader2 className="size-4 animate-spin" />}
                  {createAccount ? "Create account and continue" : "Sign in to administration"}
                </button>
              </form>

              {invitationFlow && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setCreateAccount((value) => !value);
                    setError("");
                    setRecoveryMessage("");
                  }}
                  className="mt-5 w-full text-center text-sm font-semibold text-slate-600 hover:text-emerald-700 disabled:opacity-50"
                >
                  {createAccount ? "Already have an account? Sign in" : "First time here? Create an account"}
                </button>
              )}

              <p className="mt-6 border-t border-slate-100 pt-5 text-center text-xs leading-5 text-slate-400">
                Access is limited to authorised SmartVet Academy administrators.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
