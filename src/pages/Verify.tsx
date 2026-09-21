import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Loader2, Search, ShieldCheck, ShieldX } from "lucide-react";
import { getCourse } from "@/lib/courses";
import { formatDate, verifyCertificate } from "@/lib/learning";

type VerificationResult = {
  full_name: string;
  course_id: string;
  issued_at: string;
};

export default function VerifyPage() {
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState(() => (searchParams.get("code") ?? "").trim().toUpperCase());
  const [result, setResult] = useState<VerificationResult | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    const normalized = code.trim().toUpperCase();
    if (!normalized) return;

    setBusy(true);
    setError("");
    setResult(undefined);
    try {
      setResult(await verifyCertificate(normalized));
    } catch {
      setError("We could not check this certificate right now. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  const course = result ? getCourse(result.course_id) : undefined;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-[.14em] text-primary">Public certificate check</p>
        <h1 className="mt-2 text-4xl font-semibold leading-tight sm:text-5xl">Verify a SmartVet Africa certificate</h1>
        <p className="mt-4 leading-7 text-muted-foreground">
          Enter the verification code printed on the certificate. You do not need a learner account to verify a certificate.
        </p>
      </div>

      <form onSubmit={submit} className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <label htmlFor="certificate-code" className="text-sm font-semibold">Verification code</label>
        <p id="certificate-code-help" className="mt-1 text-sm text-muted-foreground">Codes are shown in the verification section of every issued certificate.</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            id="certificate-code"
            aria-describedby="certificate-code-help"
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            className="min-h-12 min-w-0 flex-1 rounded-xl border border-input bg-background px-4 py-3 font-mono tracking-wide"
            placeholder="SVA-XXXXXXXXXX"
            autoCapitalize="characters"
            autoComplete="off"
          />
          <button
            disabled={busy || !code.trim()}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground disabled:opacity-50"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            {busy ? "Checking…" : "Verify"}
          </button>
        </div>
      </form>

      {error && (
        <p role="alert" className="mt-6 rounded-2xl bg-destructive/10 p-5 text-sm leading-6 text-destructive">{error}</p>
      )}

      {result === null && (
        <section aria-live="polite" className="mt-7 rounded-2xl border border-destructive/20 bg-card p-6">
          <ShieldX className="size-8 text-destructive" />
          <h2 className="mt-3 text-2xl font-semibold">Certificate not found</h2>
          <p className="mt-2 leading-7 text-muted-foreground">
            Check every character in the code and try again. A missing record does not by itself establish whether a separate paper document is genuine.
          </p>
        </section>
      )}

      {result && (
        <section aria-live="polite" className="mt-7 rounded-2xl border border-primary/25 bg-primary/5 p-6 sm:p-7">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <ShieldCheck className="size-6" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[.12em] text-primary">Verified Academy record</p>
              <h2 className="mt-2 text-2xl font-semibold">{result.full_name}</h2>
              <p className="mt-3 font-semibold">{course?.title ?? result.course_id}</p>
              <p className="mt-1 text-sm text-muted-foreground">Issued {formatDate(result.issued_at)}</p>
              <p className="mt-4 break-all font-mono text-xs text-muted-foreground">{code.trim().toUpperCase()}</p>
              {course && (
                <Link to={`/course/${course.id}`} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary">
                  View pathway
                  <ArrowRight className="size-4" />
                </Link>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
