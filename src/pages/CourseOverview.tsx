import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock3,
  Loader2,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getCourse } from "@/lib/courses";
import { getCertificate, getCompletedModules, hasPassedQuiz, type CertificateRecord } from "@/lib/learning";

export default function CourseOverview() {
  const { courseId = "" } = useParams();
  const course = getCourse(courseId);
  const { user, loading: authLoading } = useAuth();
  const [done, setDone] = useState<number[]>([]);
  const [passed, setPassed] = useState(false);
  const [cert, setCert] = useState<CertificateRecord | null>(null);
  const [progressLoading, setProgressLoading] = useState(false);
  const [progressError, setProgressError] = useState("");

  useEffect(() => {
    if (!user || !course) {
      setDone([]);
      setPassed(false);
      setCert(null);
      setProgressError("");
      return;
    }

    setDone([]);
    setPassed(false);
    setCert(null);
    setProgressError("");
    setProgressLoading(true);

    Promise.allSettled([
      getCompletedModules(course.id),
      hasPassedQuiz(course.id),
      getCertificate(course.id),
    ])
      .then(([completed, quizPassed, certificate]) => {
        if (completed.status === "fulfilled") setDone(completed.value);
        if (quizPassed.status === "fulfilled") setPassed(quizPassed.value);
        if (certificate.status === "fulfilled") setCert(certificate.value);

        if (
          completed.status === "rejected" ||
          quizPassed.status === "rejected" ||
          certificate.status === "rejected"
        ) {
          setProgressError("Some saved progress could not be refreshed. Refresh before assuming a module, assessment or certificate is missing.");
        }
      })
      .finally(() => setProgressLoading(false));
  }, [user, course]);

  const complete = course ? done.length === course.modules.length : false;
  const next = course ? Math.min(done.length + 1, course.modules.length) : 1;
  const progress = course ? Math.round((done.length / course.modules.length) * 100) : 0;

  const action = useMemo(() => {
    if (!course) return null;
    if (!user) {
      const target = `/course/${course.id}/module/1`;
      return { label: "Start this pathway", to: `/auth?returnTo=${encodeURIComponent(target)}` };
    }
    if (cert || passed) return { label: "Open certificate", to: `/course/${course.id}/certificate` };
    if (complete) return { label: "Take final assessment", to: `/course/${course.id}/quiz` };
    return {
      label: done.length ? "Continue pathway" : "Start pathway",
      to: `/course/${course.id}/module/${next}`,
    };
  }, [course, user, cert, passed, complete, done.length, next]);

  if (!course) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-3xl font-semibold">Pathway not found</h1>
        <p className="mt-3 text-muted-foreground">This learning pathway may have moved or is no longer available.</p>
        <Link to="/" className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground">
          View available pathways
        </Link>
      </div>
    );
  }

  return (
    <div>
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="font-semibold hover:text-primary">Courses</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{course.title}</span>
          </nav>

          <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[.12em] text-primary">{course.level}</span>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">Self-paced</span>
              </div>
              <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl">{course.title}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">{course.description}</p>
              <p className="mt-5 max-w-3xl text-sm leading-6 text-muted-foreground">
                <span className="font-semibold text-foreground">Designed for:</span> {course.audience}
              </p>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2"><BookOpen className="size-4 text-primary" />{course.modules.length} modules</span>
                <span className="inline-flex items-center gap-2"><Clock3 className="size-4 text-primary" />About {course.hours} hours</span>
                <span className="inline-flex items-center gap-2"><Award className="size-4 text-primary" />Verifiable certificate</span>
              </div>
            </div>

            <aside className="rounded-2xl border border-border bg-background p-5 shadow-sm">
              {authLoading || progressLoading ? (
                <div className="flex min-h-32 items-center justify-center">
                  <Loader2 className="size-6 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  {user ? (
                    <div>
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[.12em] text-primary">Your progress</p>
                          <p className="mt-1 text-sm text-muted-foreground">{done.length} of {course.modules.length} modules complete</p>
                        </div>
                        <strong className="text-3xl text-primary">{progress}%</strong>
                      </div>
                      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-muted" aria-label={`${progress}% complete`}>
                        <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[.12em] text-primary">Ready to learn?</p>
                      <h2 className="mt-2 text-xl font-semibold">Create a free learner account</h2>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">Your progress is saved so you can stop and continue later.</p>
                    </div>
                  )}

                  {progressError && (
                    <p role="status" className="mt-4 rounded-xl border border-gold/50 bg-gold/10 p-3 text-sm leading-6">
                      {progressError}
                    </p>
                  )}

                  {action && (
                    <Link to={action.to} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground">
                      {action.label}
                      <ArrowRight className="size-4" />
                    </Link>
                  )}
                </>
              )}

              <div className="mt-5 border-t border-border pt-5">
                <div className="flex gap-3 text-sm leading-6 text-muted-foreground">
                  <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
                  <p>Complete every module and pass the final assessment at 75% or above to earn the pathway certificate.</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[.14em] text-primary">Curriculum</p>
          <h2 className="mt-2 text-3xl font-semibold">What you will work through</h2>
          <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
            Modules follow the production sequence so each decision builds on the previous one. Complete them in order, then take the pathway assessment.
          </p>

          <ol className="mt-7 space-y-3">
            {course.modules.map((module) => {
              const completed = done.includes(module.id);
              const unlocked = !user || completed || module.id === next || complete;
              const moduleLink = user
                ? `/course/${course.id}/module/${module.id}`
                : `/auth?returnTo=${encodeURIComponent(`/course/${course.id}/module/${module.id}`)}`;

              const content = (
                <>
                  <span className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${completed ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                    {completed ? <CheckCircle2 className="size-5" /> : module.id}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold uppercase tracking-[.1em] text-muted-foreground">{module.stepLabel}</span>
                    <span className="mt-1 block font-semibold text-foreground">{module.title}</span>
                    <span className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground"><Clock3 className="size-3.5" />{module.durationMinutes} minutes</span>
                  </span>
                  {user && !unlocked ? <LockKeyhole className="size-4 shrink-0 text-muted-foreground" /> : <ArrowRight className="size-4 shrink-0 text-primary" />}
                </>
              );

              return (
                <li key={module.id}>
                  {unlocked ? (
                    <Link to={moduleLink} className="flex min-h-16 items-center gap-4 rounded-2xl border border-border bg-card p-4 transition hover:border-primary/35 hover:shadow-sm">
                      {content}
                    </Link>
                  ) : (
                    <div className="flex min-h-16 items-center gap-4 rounded-2xl border border-border bg-muted/35 p-4" aria-label={`${module.title}, locked`}>
                      {content}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-semibold">How to use this pathway</h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />Read the key message and learning outcomes first.</li>
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />Use the farm activity to apply the lesson to your own flock.</li>
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />Pass the short knowledge check before moving forward.</li>
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />Revisit completed modules whenever you need a field refresher.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <h3 className="font-semibold">Farm guidance note</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Breed, vaccine and product instructions can differ. Use verified breeder, hatchery and veterinary guidance when it is more specific than a general Academy training reference.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
