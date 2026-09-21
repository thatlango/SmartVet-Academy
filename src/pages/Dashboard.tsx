import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Award, BookOpen, CheckCircle2, Clock3, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { liveCourses, type Course } from "@/lib/courses";
import {
  getCertificate,
  getCompletedModules,
  getProfileName,
  hasPassedQuiz,
  type CertificateRecord,
} from "@/lib/learning";

type Summary = {
  course: Course;
  done: number[];
  passed: boolean;
  cert: CertificateRecord | null;
};

function courseAction(summary: Summary) {
  const { course, done, passed, cert } = summary;
  const complete = done.length === course.modules.length;
  const next = Math.min(done.length + 1, course.modules.length);

  if (cert || passed) return { label: "Open certificate", to: `/course/${course.id}/certificate` };
  if (complete) return { label: "Take final assessment", to: `/course/${course.id}/quiz` };
  return {
    label: done.length ? "Continue learning" : "Start pathway",
    to: `/course/${course.id}/module/${next}`,
  };
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [warning, setWarning] = useState("");

  useEffect(() => {
    if (!authLoading && !user) nav("/auth?returnTo=%2Fdashboard", { replace: true });
  }, [authLoading, user, nav]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      setWarning("");
      try {
        const profileName = await getProfileName(user.id).catch(() => user.displayName ?? "");
        setName(profileName);

        const data = await Promise.all(
          liveCourses.map(async (course) => {
            const [doneResult, passedResult, certResult] = await Promise.allSettled([
              getCompletedModules(course.id),
              hasPassedQuiz(course.id),
              getCertificate(course.id),
            ]);

            return {
              summary: {
                course,
                done: doneResult.status === "fulfilled" ? doneResult.value : [],
                passed: passedResult.status === "fulfilled" ? passedResult.value : false,
                cert: certResult.status === "fulfilled" ? certResult.value : null,
              },
              degraded:
                doneResult.status === "rejected" ||
                passedResult.status === "rejected" ||
                certResult.status === "rejected",
            };
          }),
        );

        setSummaries(data.map(({ summary }) => summary));
        if (data.some(({ degraded }) => degraded)) {
          setWarning("Some learning progress could not be refreshed. The available pathway information is shown below; refresh before relying on a missing completion or certificate.");
        }
      } catch {
        setSummaries(liveCourses.map((course) => ({ course, done: [], passed: false, cert: null })));
        setWarning("We could not refresh your learning progress. Please refresh the page and try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const active = useMemo(
    () =>
      summaries.find((item) => item.done.length > 0 && !item.cert && item.done.length < item.course.modules.length) ??
      summaries.find((item) => !item.cert) ??
      summaries[0],
    [summaries],
  );

  if (authLoading || loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="size-7 animate-spin text-primary" /></div>;
  }
  if (!user) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
      <p className="text-sm font-bold uppercase tracking-[.14em] text-primary">My learning</p>
      <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">Welcome{name ? ", " + name.split(" ")[0] : ""}.</h1>
      <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
        Pick up where you stopped, review completed lessons, or start another poultry pathway.
      </p>

      {warning && (
        <p role="status" className="mt-5 rounded-xl border border-gold/50 bg-gold/10 p-4 text-sm leading-6 text-foreground">
          {warning}
        </p>
      )}

      {active && (() => {
        const action = courseAction(active);
        const progress = Math.round((active.done.length / active.course.modules.length) * 100);
        const next = Math.min(active.done.length + 1, active.course.modules.length);
        const nextModule = active.course.modules.find((module) => module.id === next);
        return (
          <section className="mt-8 overflow-hidden rounded-3xl border border-primary/20 bg-primary text-primary-foreground shadow-lg">
            <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.14em] text-primary-foreground/75">
                  {active.cert ? "Completed pathway" : active.done.length ? "Continue where you left off" : "Recommended next step"}
                </p>
                <h2 className="mt-3 text-3xl font-semibold">{active.course.title}</h2>
                {!active.cert && nextModule && (
                  <p className="mt-3 text-primary-foreground/80">
                    Next: {nextModule.stepLabel} · {nextModule.title}
                  </p>
                )}
                {active.cert && <p className="mt-3 text-primary-foreground/80">Your certificate is ready to view or download.</p>}
                <div className="mt-5 max-w-2xl">
                  <div className="mb-2 flex justify-between text-xs font-semibold">
                    <span>{active.done.length} of {active.course.modules.length} modules complete</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-white/20">
                    <div className="h-full rounded-full bg-white" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </div>
              <Link to={action.to} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-primary">
                {action.label}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </section>
        );
      })()}

      <section className="mt-12">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.14em] text-primary">Your pathways</p>
            <h2 className="mt-2 text-3xl font-semibold">Learning overview</h2>
          </div>
          <Link to="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary">
            Browse course catalogue
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-7 grid gap-5 lg:grid-cols-3">
          {summaries.map((summary) => {
            const { course, done, passed, cert } = summary;
            const progress = Math.round((done.length / course.modules.length) * 100);
            const action = courseAction(summary);
            const complete = done.length === course.modules.length;

            return (
              <article key={course.id} className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-primary">{course.level}</span>
                  {cert ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary"><Award className="size-4" />Certified</span>
                  ) : complete && passed ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary"><CheckCircle2 className="size-4" />Passed</span>
                  ) : null}
                </div>

                <h3 className="mt-4 text-2xl font-semibold">{course.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{course.tagline}</p>

                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5"><BookOpen className="size-3.5" />{course.modules.length} modules</span>
                  <span className="inline-flex items-center gap-1.5"><Clock3 className="size-3.5" />{course.hours} hours</span>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-xs font-semibold text-muted-foreground">
                    <span>{done.length} completed</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to={action.to} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
                    {action.label}
                    <ArrowRight className="size-4" />
                  </Link>
                  <Link to={`/course/${course.id}`} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border px-4 py-2.5 text-sm font-semibold">
                    Overview
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
