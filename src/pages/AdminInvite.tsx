import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { SmartVetLogo } from "@/components/SmartVetLogo";
import { useAuth } from "@/lib/auth";
import { acceptAdminInvite, getAdminInvitePreview, type AdminInvitePreview } from "@/lib/admin";

function roleLabel(role: string) {
  if (role === "owner") return "Owner";
  if (role === "admin") return "Administrator";
  if (role === "assessor") return "Assessor";
  return "Support";
}

export default function AdminInvitePage() {
  const { token = "" } = useParams();
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const nav = useNavigate();
  const [invite, setInvite] = useState<AdminInvitePreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    getAdminInvitePreview(token)
      .then((next) => {
        if (!cancelled) setInvite(next);
      })
      .catch((reason) => {
        if (!cancelled) setError(reason instanceof Error ? reason.message : "This invitation could not be opened.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [token]);

  async function accept() {
    setAccepting(true);
    setError("");
    try {
      await acceptAdminInvite(token);
      setAccepted(true);
      window.setTimeout(() => nav("/admin", { replace: true }), 700);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "This invitation could not be accepted.");
    } finally {
      setAccepting(false);
    }
  }

  if (authLoading || loading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f4f7f4]"><Loader2 className="size-7 animate-spin text-emerald-700" /></div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f7f4] px-4 py-10">
      <div className="w-full max-w-xl rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,.09)] sm:p-8">
        <div className="inline-flex rounded-2xl border border-slate-100 bg-white px-3 py-2 shadow-sm">
          <SmartVetLogo className="h-10 w-auto" />
        </div>

        {error && !invite ? (
          <>
            <div className="mt-7 flex size-13 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
              <ShieldCheck className="size-6" />
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">Invitation unavailable</h1>
            <p className="mt-3 leading-7 text-slate-600">{error}</p>
            <Link to="/" className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-[#173122] px-4 py-2.5 text-sm font-semibold text-white">Back to Academy</Link>
          </>
        ) : invite ? (
          <>
            <p className="mt-7 text-xs font-bold uppercase tracking-[.16em] text-emerald-700">Academy administration</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">You have been invited to SmartVet Academy.</h1>
            <p className="mt-3 leading-7 text-slate-600">
              This invitation grants <span className="font-semibold text-slate-900">{roleLabel(invite.role)}</span> access to the Academy administration console.
            </p>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[.08em] text-slate-500">Invitation email</p>
              <p className="mt-1 font-semibold text-slate-900">{invite.email}</p>
              <p className="mt-3 text-xs text-slate-500">Expires {new Date(invite.expires_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</p>
            </div>

            {!user ? (
              <div className="mt-6">
                <p className="text-sm leading-6 text-slate-600">Sign in or create an account using <span className="font-semibold text-slate-900">{invite.email}</span> to accept this invitation.</p>
                <Link
                  to={`/admin/login?returnTo=${encodeURIComponent(location.pathname)}`}
                  className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#173122] px-5 py-3 font-semibold text-white"
                >
                  Sign in to accept
                </Link>
              </div>
            ) : accepted ? (
              <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-emerald-800">
                <p className="flex items-center gap-2 font-semibold"><CheckCircle2 className="size-5" /> Invitation accepted</p>
                <p className="mt-1 text-sm">Opening the administration console…</p>
              </div>
            ) : (
              <div className="mt-6">
                <p className="text-sm leading-6 text-slate-600">Signed in as <span className="font-semibold text-slate-900">{user.email || user.displayName}</span>.</p>
                {error && <p role="alert" className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
                <button
                  type="button"
                  disabled={accepting}
                  onClick={() => void accept()}
                  className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#173122] px-5 py-3 font-semibold text-white disabled:opacity-50"
                >
                  {accepting && <Loader2 className="size-4 animate-spin" />}
                  Accept admin invitation
                </button>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
