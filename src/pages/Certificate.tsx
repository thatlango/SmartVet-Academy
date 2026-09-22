import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Check, Copy, Download, Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getCourse } from "@/lib/courses";
import { buildCertificatePdf } from "@/lib/certificate-pdf";
import { getCertificateTemplate } from "@/lib/certificate-templates";
import {
  formatDate,
  getCertificate,
  getCompletedModules,
  getProfileName,
  hasPassedQuiz,
  issueCertificate,
  type CertificateRecord,
} from "@/lib/learning";

function certificateNameSize(name: string) {
  if (name.length > 42) return 36;
  if (name.length > 34) return 42;
  if (name.length > 26) return 48;
  return 56;
}

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
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

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

    let cancelled = false;

    (async () => {
      try {
        const [profileName, completed, passed, existing] = await Promise.all([
          getProfileName(user.id),
          getCompletedModules(course.id),
          hasPassedQuiz(course.id),
          getCertificate(course.id),
        ]);

        if (cancelled) return;

        setName(profileName);
        const ok = completed.length === course.modules.length && passed;
        setEligible(ok);

        if (existing) {
          setCert(existing);
        } else if (ok) {
          setCert(await issueCertificate(course.id));
        } else {
          setCert(null);
        }
      } catch {
        if (!cancelled) {
          setError("We could not load your certificate right now. Refresh the page and try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, course]);

  if (!course) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-3xl font-semibold">Course not found</h1>
        <Link to="/" className="mt-6 inline-flex min-h-11 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground">
          View courses
        </Link>
      </div>
    );
  }

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-7 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-3xl font-semibold">Certificate temporarily unavailable</h1>
        <p role="alert" className="mt-3 leading-7 text-muted-foreground">{error}</p>
        <Link to={`/course/${course.id}`} className="mt-6 inline-flex min-h-11 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground">
          Return to pathway
        </Link>
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
        <Link to={`/course/${course.id}`} className="mt-6 inline-flex min-h-11 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground">
          Return to pathway
        </Link>
      </div>
    );
  }

  const learnerName = name.trim() || user?.displayName?.trim() || "Learner";
  const certificateTemplate = getCertificateTemplate(course.id);
  const issuedDate = formatDate(cert.issued_at);

  async function download() {
    if (!course || !cert || downloading) return;

    try {
      setDownloading(true);
      setDownloadError("");
      const pdf = await buildCertificatePdf({
        name: learnerName,
        courseId: course.id,
        code: cert.verification_code,
      });
      pdf.save(`smartvet-africa-${course.id}-${cert.verification_code}.pdf`);
    } catch {
      setDownloadError("We could not prepare your certificate download. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  async function copyVerificationLink() {
    const url = `${window.location.origin}/verify?code=${encodeURIComponent(cert.verification_code)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link to="/dashboard" className="font-semibold hover:text-primary">My learning</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/course/${course.id}`} className="font-semibold hover:text-primary">{course.title}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Certificate</span>
      </nav>

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[.14em] text-primary">
            <ShieldCheck className="size-4" />
            Certificate issued
          </p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{course.title} certificate</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Issued {issuedDate} · Certificate No. <span className="font-mono font-semibold text-foreground">{cert.verification_code}</span>
          </p>
        </div>
      </div>

      <div className="mt-7 overflow-hidden bg-white shadow-[0_18px_50px_rgba(15,23,42,.14)]">
        <div className="relative w-full" style={{ aspectRatio: "2000 / 1414" }}>
          <img
            src={certificateTemplate}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-contain"
          />
          <svg
            viewBox="0 0 2000 1414"
            className="pointer-events-none absolute inset-0 h-full w-full"
            role="img"
            aria-label={`${course.title} certificate issued to ${learnerName}, certificate number ${cert.verification_code}`}
          >
            <text
              x="1263"
              y="748"
              textAnchor="middle"
              fill="#111827"
              fontFamily="Arial, Helvetica, sans-serif"
              fontWeight="700"
              fontSize={certificateNameSize(learnerName)}
            >
              {learnerName}
            </text>
            <text
              x="210"
              y="722"
              fill="#404040"
              fontFamily="Arial, Helvetica, sans-serif"
              fontWeight="600"
              fontSize="23"
            >
              Certificate No. {cert.verification_code}
            </text>
          </svg>
        </div>
      </div>

      {downloadError && (
        <p role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {downloadError}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={() => void download()}
          disabled={downloading}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground disabled:cursor-wait disabled:opacity-70"
        >
          {downloading ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
          {downloading ? "Preparing certificate..." : "Download certificate"}
        </button>
        <button
          type="button"
          onClick={() => void copyVerificationLink()}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 font-semibold"
        >
          {copied ? <Check className="size-4 text-primary" /> : <Copy className="size-4" />}
          {copied ? "Link copied" : "Copy verification link"}
        </button>
        <Link
          to={`/verify?code=${encodeURIComponent(cert.verification_code)}`}
          className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border bg-card px-5 py-3 font-semibold"
        >
          Verify certificate
        </Link>
      </div>
    </div>
  );
}
