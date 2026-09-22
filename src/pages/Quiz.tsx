import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Award, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getCourse } from "@/lib/courses";
import { getCompletedModules, recordQuizAttempt } from "@/lib/learning";

export default function QuizPage() {
  const { courseId = "" } = useParams();
  const course = getCourse(courseId);
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [done, setDone] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState<{ score: number; total: number; passed: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [progressError, setProgressError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      nav(`/auth?returnTo=${encodeURIComponent(location.pathname)}`, { replace: true });
    }
  }, [authLoading, user, nav, location.pathname]);

  useEffect(() => {
    if (user && course) {
      setLoading(true);
      setProgressError("");
      getCompletedModules(course.id)
        .then(setDone)
        .catch(() => setProgressError("We could not confirm your pathway completion, so the assessment cannot be safely opened yet."))
        .finally(() => setLoading(false));
    } else if (user && !course) {
      setLoading(false);
    }
  }, [user, course]);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = course ? answeredCount === course.quiz.length : false;
  const progress = course ? Math.round(((current + 1) / course.quiz.length) * 100) : 0;
  const scorePercent = useMemo(
    () => result ? Math.round((result.score / result.total) * 100) : 0,
    [result],
  );

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

  if (progressError) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-3xl font-semibold">Assessment status unavailable</h1>
        <p role="alert" className="mt-3 leading-7 text-muted-foreground">{progressError}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex min-h-11 items-center rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground"
          >
            Try again
          </button>
          <Link to={`/course/${course.id}`} className="inline-flex min-h-11 items-center rounded-xl border border-border px-5 py-3 font-semibold">
            Return to pathway
          </Link>
        </div>
      </div>
    );
  }

  if (done.length < course.modules.length) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-3xl font-semibold">Assessment locked</h1>
        <p className="mt-3 leading-7 text-muted-foreground">Complete all {course.modules.length} modules in this pathway first.</p>
        <Link to={`/course/${course.id}`} className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground">
          Return to pathway
        </Link>
      </div>
    );
  }

  async function submit() {
    if (!allAnswered) return;
    setBusy(true);
    setError("");
    try {
      const ordered = course!.quiz.map((_, index) => answers[index]);
      setResult(await recordQuizAttempt(course!.id, ordered));
    } catch {
      setError("Your assessment could not be submitted. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  if (result) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <div className={`mx-auto flex size-16 items-center justify-center rounded-full ${result.passed ? "bg-primary/10 text-primary" : "bg-muted text-foreground"}`}>
          {result.passed ? <Award className="size-8" /> : <CheckCircle2 className="size-8" />}
        </div>
        <p className="mt-6 text-sm font-bold uppercase tracking-[.14em] text-primary">Assessment result</p>
        <h1 className="mt-2 text-4xl font-semibold">{result.passed ? "You passed." : "Review and try again."}</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          You scored <span className="font-semibold text-foreground">{result.score}/{result.total} ({scorePercent}%)</span>. The pass mark is 75%.
        </p>

        {result.passed ? (
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to={`/course/${course.id}/certificate`} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground">
              <Award className="size-4" />
              View / download certificate
            </Link>
            <Link to={`/course/${course.id}`} className="inline-flex min-h-12 items-center rounded-xl border border-border bg-card px-5 py-3 font-semibold">
              Review pathway
            </Link>
          </div>
        ) : (
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to={`/course/${course.id}`} className="inline-flex min-h-12 items-center rounded-xl border border-border bg-card px-5 py-3 font-semibold">
              Review pathway
            </Link>
            <button
              type="button"
              onClick={() => {
                setResult(null);
                setAnswers({});
                setCurrent(0);
              }}
              className="min-h-12 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground"
            >
              Retake assessment
            </button>
          </div>
        )}
      </div>
    );
  }

  const question = course.quiz[current];
  const selected = answers[current];
  const last = current === course.quiz.length - 1;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
      <Link to={`/course/${course.id}`} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary">
        <ArrowLeft className="size-4" />
        Pathway overview
      </Link>

      <div className="mt-7 flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.14em] text-primary">Final assessment</p>
            <h1 className="mt-2 text-3xl font-semibold">{course.title}</h1>
          </div>
          <p className="text-sm font-semibold text-muted-foreground">{answeredCount} of {course.quiz.length} answered</p>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          Work through one question at a time. You can go back and change an answer before submitting. A score of 75% or above earns the pathway certificate.
        </p>
      </div>

      <div className="mt-7">
        <div className="flex items-center justify-between gap-3 text-sm font-semibold">
          <span>Question {current + 1} of {course.quiz.length}</span>
          <span className="text-primary">{progress}% through assessment</span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
          <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <fieldset className="mt-6 rounded-2xl border border-border bg-card p-5 sm:p-7">
        <legend className="px-1 text-xs font-bold uppercase tracking-[.12em] text-muted-foreground">Question {current + 1}</legend>
        <h2 className="mt-1 text-xl font-semibold leading-8">{question.question}</h2>
        <div className="mt-5 space-y-3">
          {question.options.map((option, optionIndex) => (
            <label
              key={option}
              className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${selected === optionIndex ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}
            >
              <input
                type="radio"
                name={`question-${current}`}
                className="mt-1"
                checked={selected === optionIndex}
                onChange={() => setAnswers((currentAnswers) => ({ ...currentAnswers, [current]: optionIndex }))}
              />
              <span className="leading-6">{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {error && <p role="alert" className="mt-5 rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{error}</p>}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          disabled={current === 0 || busy}
          onClick={() => setCurrent((value) => Math.max(0, value - 1))}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 font-semibold disabled:opacity-40"
        >
          <ArrowLeft className="size-4" />
          Previous
        </button>

        {last ? (
          <button
            type="button"
            disabled={!allAnswered || busy}
            onClick={() => void submit()}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground disabled:opacity-50"
          >
            {busy && <Loader2 className="size-4 animate-spin" />}
            Submit assessment
          </button>
        ) : (
          <button
            type="button"
            disabled={selected === undefined}
            onClick={() => setCurrent((value) => Math.min(course.quiz.length - 1, value + 1))}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground disabled:opacity-50"
          >
            Next question
            <ArrowRight className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
