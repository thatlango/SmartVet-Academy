import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Check, Copy, Download, Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getCourse } from "@/lib/courses";
import { buildCertificatePdf } from "@/lib/certificate-pdf";
import {
  formatDate,
  getCertificate,
  getCompletedModules,
  getProfileName,
  hasPassedQuiz,
  issueCertificate,
  type CertificateRecord,
} from "@/lib/learning";

const SIGNATORY_NAME = "Obuku Richard";
const SIGNATORY_TITLE = "Chief Executive Officer, SmartVet Africa";

export default function CertificatePage() {
  const { courseId = "" } = useParams();
  const course = getCourse(courseId);
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [cert, setCert] = useState<CertificateRecord | null>(null);
  const [eligible, setEligible] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      nav(`/auth?returnTo=${encodeURIComponent(location.pathname)}`, { replace: true });
    }
  }, [authLoading, user, nav, location.pathname]);

  useEffect(() => {
    if (!user || !course) {
      if (user && !course) setLoading(false);
      return;
    }

    (async () => {
      try {
        const [profileName, completed, passed, existing] = await Promise.all([
          getProfileName(user.id),
          getCompletedModules(course.id),
          hasPassedQuiz(course.id),
          getCertificate(course.id),
        ]);
        setName(profileName);
        const ok = completed.length === course.modules.length && passed;
        setEligible(ok);
        setCert(existing ?? (ok ? await issueCertificate(course.id) : null));
      } catch {
        setError("We could not load your certificate right now. Refresh the page and try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [user, course]);

  if (!course) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-3xl font-semibold">Course not found</h1>
        <Link to="/" className="mt-6 inline-flex min-h-11 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground">View courses</Link>
      </div>
    );
  }

  if (authLoading || loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="size-7 animate-spin text-primary" /></div>;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-3xl font-semibold">Certificate temporarily unavailable</h1>
        <p role="alert" className="mt-3 leading-7 text-muted-foreground">{error}</p>
        <Link to={`/course/${course.id}`} className="mt-6 inline-flex min-h-11 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground">Return to pathway</Link>
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-3xl font-semibold">Your certificate is not ready yet</h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          {eligible ? "Please refresh and try again." : "Complete all modules and pass this pathway's final assessment first."}
        </p>
        <Link to={`/course/${course.id}`} className="mt-6 inline-flex min-h-11 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground">Return to pathway</Link>
      </div>
    );
  }

  const date = formatDate(cert.issued_at);

  function download() {
    buildCertificatePdf({
      name,
      courseTitle: course!.title,
      hours: course!.hours,
      date,
      code: cert!.verification_code,
    }).save(`smartvet-africa-${course!.id}-${cert!.verification_code}.pdf`);
  }

  async function copyVerificationLink() {
    const url = `${window.location.origin}/verify?code=${encodeURIComponent(cert!.verification_code)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link to="/dashboard" className="font-semibold hover:text-primary">My learning</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/course/${course.id}`} className="font-semibold hover:text-primary">{course.title}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Certificate</span>
      </nav>

      <p className="mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[.14em] text-primary">
        <ShieldCheck className="size-4" />
        Certificate issued
      </p>
      <h1 className="mt-2 text-4xl font-semibold">Your SmartVet Africa certificate</h1>
      <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">Download your certificate or share its public verification link with a buyer, employer, programme or partner.</p>

      <div className="mt-8 rounded-3xl border-4 border-double border-primary/40 bg-card p-2 shadow-lg">
        <div className="texture-grain rounded-2xl border border-gold/40 px-5 py-9 text-center sm:px-10 sm:py-10">
          <img src="/smartvet-logo-full.svg" className="mx-auto h-20 w-auto" alt="SmartVet Africa" />

          <p className="mt-7 text-xs font-bold uppercase tracking-[.24em] text-primary">Certificate of Completion</p>
          <p className="mt-7 text-sm text-muted-foreground">This certifies that</p>
          <p className="mx-auto mt-2 max-w-2xl border-b border-gold/60 pb-3 font-display text-3xl font-semibold">{name}</p>
          <p className="mt-5 text-sm text-muted-foreground">has successfully completed</p>
          <h2 className="mt-2 text-2xl font-semibold text-primary">{course.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{course.hours} hours. {course.modules.length} modules</p>

          <div className="mx-auto mt-9 grid max-w-4xl gap-7 border-t border-border/70 pt-7 text-left sm:grid-cols-[1fr_auto_1.2fr] sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Issued</p>
              <p className="mt-2 font-medium">{date}</p>
              <p className="mt-4 text-xs font-bold uppercase tracking-[.14em] text-primary">Verification</p>
              <p className="mt-2 break-all font-mono text-sm">{cert.verification_code}</p>
            </div>

            <div className="hidden h-16 w-px bg-border sm:block" />

            <div className="text-center sm:text-right">
              <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Signed by</p>
              <p className="mt-3 font-display text-2xl italic">{SIGNATORY_NAME}</p>
              <div className="ml-auto mt-1 h-px max-w-[240px] bg-foreground/70" />
              <p className="mt-2 font-semibold">{SIGNATORY_NAME}</p>
              <p className="text-sm text-muted-foreground">{SIGNATORY_TITLE}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button onClick={download} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground">
          <Download className="size-4" />
          Download PDF
        </button>
        <button onClick={() => void copyVerificationLink()} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 font-semibold">
          {copied ? <Check className="size-4 text-primary" /> : <Copy className="size-4" />}
          {copied ? "Link copied" : "Copy verification link"}
        </button>
        <Link to={`/verify?code=${encodeURIComponent(cert.verification_code)}`} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border bg-card px-5 py-3 font-semibold">
          Verify certificate
        </Link>
      </div>
    </div>
  );
}
