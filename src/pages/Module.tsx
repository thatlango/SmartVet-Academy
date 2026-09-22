import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  ImageIcon,
  Loader2,
  LockKeyhole,
  Target,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { completeModule, getCompletedModules } from "@/lib/learning";
import { getCourse, getModule, type Block, type Course } from "@/lib/courses";

const toneClass = {
  info: "border-secondary/25 bg-secondary/5",
  warning: "border-gold/60 bg-gold/15",
  danger: "border-destructive/25 bg-destructive/5",
  success: "border-primary/25 bg-primary/5",
} as const;

function BlockView({ block, index }: { block: Block; index: number }) {
  const anchor = `lesson-section-${index + 1}`;

  if (block.kind === "figure") {
    return (
      <figure id={anchor} className="lesson-anchor overflow-hidden rounded-2xl border border-border bg-card">
        <div className="aspect-[16/9] overflow-hidden bg-muted">
          <img
            src={block.src}
            alt={block.alt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
        <figcaption className="p-5 sm:p-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-secondary">
            <ImageIcon className="size-4" />
            {block.title}
          </div>
          <p className="mt-2 text-base leading-7 text-muted-foreground">{block.caption}</p>
          {block.source && <p className="mt-3 text-xs text-muted-foreground">Source: {block.source}</p>}
        </figcaption>
      </figure>
    );
  }

  if (block.kind === "activity") {
    return (
      <section id={anchor} className="lesson-anchor rounded-2xl border border-secondary/25 bg-secondary/5 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.12em] text-secondary">Apply it on the farm</p>
            <h2 className="mt-1 text-xl font-semibold">{block.title}</h2>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-semibold text-secondary">
            <Clock3 className="size-3.5" />
            {block.minutes} min practice
          </span>
        </div>
        <ol className="mt-5 space-y-3 text-base leading-7 text-muted-foreground">
          {block.items.map((item, itemIndex) => (
            <li key={item} className="flex gap-3">
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                {itemIndex + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  if (block.kind === "table") {
    return (
      <section id={anchor} className="lesson-anchor overflow-hidden rounded-2xl border border-border bg-card">
        <div className="p-5 pb-3 sm:p-6 sm:pb-4">
          <h2 className="text-xl font-semibold">{block.title}</h2>
          {block.note && <p className="mt-2 text-base leading-7 text-muted-foreground">{block.note}</p>}
        </div>

        <div className="divide-y divide-border md:hidden">
          {block.rows.map((row, rowIndex) => (
            <dl key={rowIndex} className="space-y-3 px-5 py-5">
              {row.map((cell, cellIndex) => (
                <div key={cellIndex} className="grid gap-1">
                  <dt className="text-xs font-bold uppercase tracking-[.08em] text-muted-foreground">{block.headers[cellIndex]}</dt>
                  <dd className={`text-sm leading-6 ${cellIndex === 0 ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{cell}</dd>
                </div>
              ))}
            </dl>
          ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-[680px] w-full text-left text-sm">
            <thead className="bg-muted/70">
              <tr>
                {block.headers.map((header) => (
                  <th scope="col" key={header} className="px-5 py-3 font-semibold text-foreground sm:px-6">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t border-border align-top">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={`px-5 py-4 leading-6 sm:px-6 ${cellIndex === 0 ? "font-medium text-foreground" : "text-muted-foreground"}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  if (block.kind === "callout") {
    return (
      <aside id={anchor} className={`lesson-anchor rounded-2xl border p-5 sm:p-6 ${toneClass[block.tone]}`}>
        <h2 className="text-xl font-semibold">{block.title}</h2>
        <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-3 size-1.5 shrink-0 rounded-full bg-current" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </aside>
    );
  }

  if (block.kind === "checklist") {
    return (
      <section id={anchor} className="lesson-anchor rounded-2xl border border-border bg-card p-5 sm:p-6">
        <h2 className="text-xl font-semibold">{block.title}</h2>
        <ul className="mt-5 space-y-3 text-base leading-7 text-muted-foreground">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Check className="size-3.5" />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  const Tag = block.ordered ? "ol" : "ul";
  return (
    <section id={anchor} className="lesson-anchor rounded-2xl border border-border bg-card p-5 sm:p-6">
      <h2 className="text-xl font-semibold">{block.title}</h2>
      <Tag className="mt-5 space-y-3 text-base leading-7 text-muted-foreground">
        {block.items.map((item, itemIndex) => (
          <li key={item} className="flex gap-3">
            {block.ordered ? (
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-foreground">
                {itemIndex + 1}
              </span>
            ) : (
              <span className="mt-3 size-1.5 shrink-0 rounded-full bg-primary" />
            )}
            <span>{item}</span>
          </li>
        ))}
      </Tag>
    </section>
  );
}

function CourseOutline({ course, done, currentId }: { course: Course; done: number[]; currentId: number }) {
  const complete = done.length === course.modules.length;
  const next = Math.min(done.length + 1, course.modules.length);

  return (
    <ol className="mt-4 space-y-1.5">
      {course.modules.map((item) => {
        const completed = done.includes(item.id);
        const unlocked = completed || item.id === next || complete;
        const current = item.id === currentId;
        const inner = (
          <>
            <span className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${completed ? "bg-primary text-primary-foreground" : current ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
              {completed ? <CheckCircle2 className="size-4" /> : item.id}
            </span>
            <span className="min-w-0 flex-1">
              <span className={`block text-sm font-semibold leading-5 ${current ? "text-primary" : "text-foreground"}`}>{item.title}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{item.durationMinutes} min</span>
            </span>
            {!unlocked && <LockKeyhole className="size-3.5 shrink-0 text-muted-foreground" />}
          </>
        );

        return (
          <li key={item.id}>
            {unlocked ? (
              <Link
                to={`/course/${course.id}/module/${item.id}`}
                aria-current={current ? "step" : undefined}
                className={`flex min-h-12 items-center gap-3 rounded-xl p-2.5 transition hover:bg-muted ${current ? "bg-primary/5" : ""}`}
              >
                {inner}
              </Link>
            ) : (
              <div className="flex min-h-12 items-center gap-3 rounded-xl p-2.5 opacity-65">{inner}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default function ModulePage() {
  const { courseId = "", moduleId = "" } = useParams();
  const course = getCourse(courseId);
  const module = course ? getModule(course, Number(moduleId)) : undefined;
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [done, setDone] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [saving, setSaving] = useState(false);
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
        .catch(() => setProgressError("We could not load your saved progress, so this module cannot be safely unlocked or completed yet."))
        .finally(() => setLoading(false));
    }
  }, [user, course, module?.id]);

  useEffect(() => {
    setSelected(null);
    setChecked(false);
    setSaving(false);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [courseId, moduleId]);

  if (!course || !module) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-3xl font-semibold">Module not found</h1>
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
        <h1 className="text-3xl font-semibold">Saved progress is temporarily unavailable</h1>
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

  const already = done.includes(module.id);
  const next = Math.min(done.length + 1, course.modules.length);
  const progress = Math.round((done.length / course.modules.length) * 100);

  if (!already && module.id > next) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <LockKeyhole className="mx-auto size-10 text-muted-foreground" />
        <h1 className="mt-4 text-3xl font-semibold">Complete the earlier module first</h1>
        <p className="mt-3 leading-7 text-muted-foreground">This pathway is sequenced so each module builds on the previous one.</p>
        <Link
          to={`/course/${course.id}/module/${next}`}
          className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground"
        >
          Go to module {next}
        </Link>
      </div>
    );
  }

  const correct = checked && selected === module.check.correctIndex;

  const nextTo = module.id === course.modules.length
    ? `/course/${course.id}/quiz`
    : `/course/${course.id}/module/${module.id + 1}`;

  async function saveAndAdvance() {
    if (!correct || already || saving) return;
    setSaving(true);
    setError("");
    try {
      await completeModule(course.id, module.id);
      setDone((current) => [...new Set([...current, module.id])].sort((a, b) => a - b));
      await new Promise((resolve) => window.setTimeout(resolve, 650));
      nav(nextTo);
    } catch {
      setError("Your answer is correct, but your progress could not be saved. Try again to continue.");
    } finally {
      setSaving(false);
    }
  }

  function checkAnswer() {
    if (selected === null || saving) return;
    setChecked(true);
    if (selected === module.check.correctIndex) {
      void saveAndAdvance();
    }
  }

  const previousTo = module.id > 1
    ? `/course/${course.id}/module/${module.id - 1}`
    : `/course/${course.id}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link to="/courses" className="font-semibold hover:text-primary">Pathways</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/course/${course.id}`} className="font-semibold hover:text-primary">{course.title}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Module {module.id}</span>
      </nav>

      <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <article className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[.12em] text-primary">
              {module.stepLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
              <Clock3 className="size-3.5" />
              {module.durationMinutes} min
            </span>
            {already && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <CheckCircle2 className="size-3.5" />
                Completed
              </span>
            )}
          </div>

          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl">{module.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">{module.intro}</p>

          <blockquote className="mt-6 max-w-3xl border-l-4 border-gold pl-5 font-display text-xl italic leading-8">
            “{module.quote}”
          </blockquote>

          <section className="mt-7 rounded-2xl bg-primary p-6 text-primary-foreground sm:p-7">
            <p className="text-xs font-bold uppercase tracking-wider text-primary-foreground/75">Key message</p>
            <p className="mt-2 text-xl font-semibold leading-8 sm:text-2xl">{module.keyMessage}</p>
          </section>

          <section className="mt-6 rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Target className="size-5 text-secondary" />
              <h2 className="text-xl font-semibold">By the end of this module</h2>
            </div>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {module.outcomes.map((outcome) => (
                <li key={outcome} className="flex gap-2 text-base leading-7 text-muted-foreground">
                  <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </section>

          <nav aria-label="Lesson contents" className="mt-6 rounded-2xl border border-border bg-background p-5">
            <p className="text-xs font-bold uppercase tracking-[.12em] text-primary">In this lesson</p>
            <ol className="mt-3 grid gap-2 sm:grid-cols-2">
              {module.blocks.map((block, index) => (
                <li key={index}>
                  <a href={`#lesson-section-${index + 1}`} className="inline-flex min-h-9 items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary">
                    <span className="text-primary">{index + 1}.</span>
                    {block.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <details className="mt-5 rounded-2xl border border-border bg-card p-4 lg:hidden">
            <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-3 font-semibold">
              <span>Pathway progress. {progress}%</span>
              <ChevronDown className="size-4" />
            </summary>
            <CourseOutline course={course} done={done} currentId={module.id} />
          </details>

          {error && <p role="alert" className="mt-5 rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{error}</p>}

          <div className="mt-7 space-y-5">
            {module.blocks.map((block, index) => (
              <BlockView key={index} block={block} index={index} />
            ))}
          </div>

          <fieldset className="mt-8 rounded-2xl border border-border bg-card p-5 sm:p-6">
            <legend className="px-1 text-xs font-bold uppercase tracking-[.12em] text-secondary">Knowledge check</legend>
            <h2 className="mt-2 text-xl font-semibold">{module.check.question}</h2>

            {!already && (
              <>
                <div className="mt-5 space-y-2">
                  {module.check.options.map((option, index) => (
                    <label
                      key={option}
                      className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition ${selected === index ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}
                    >
                      <input
                        type="radio"
                        name="module-knowledge-check"
                        className="mt-1"
                        checked={selected === index}
                        onChange={() => {
                          setSelected(index);
                          setChecked(false);
                        }}
                      />
                      <span className="leading-6">{option}</span>
                    </label>
                  ))}
                </div>
                <button
                  type="button"
                  disabled={selected === null || saving}
                  onClick={checkAnswer}
                  className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-4 py-2.5 font-semibold disabled:opacity-50"
                >
                  {saving && <Loader2 className="size-4 animate-spin" />}
                  {saving ? "Saving progress..." : "Check answer"}
                </button>
                {checked && (
                  <p
                    role="status"
                    className={`mt-4 rounded-xl p-4 text-sm leading-6 ${correct ? "bg-primary/10 text-foreground" : "bg-destructive/10 text-destructive"}`}
                  >
                    {correct
                      ? `${module.check.explanation} Your progress is being saved and the next step will open automatically.`
                      : "Not quite. Review the key message and the relevant section above, then try again."}
                  </p>
                )}
              </>
            )}

            {already && (
              <p className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary/10 p-3 text-sm text-primary">
                <CheckCircle2 className="size-4" />
                You have already completed this module. You can review it any time.
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
              <Link to={previousTo} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 font-semibold">
                <ArrowLeft className="size-4" />
                {module.id > 1 ? "Previous module" : "Pathway overview"}
              </Link>

              {already ? (
                <Link
                  to={nextTo}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground"
                >
                  {module.id === course.modules.length ? "Go to final assessment" : "Next module"}
                  <ArrowRight className="size-4" />
                </Link>
              ) : error && correct ? (
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void saveAndAdvance()}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground disabled:opacity-50"
                >
                  {saving && <Loader2 className="size-4 animate-spin" />}
                  Save progress and continue
                  <ArrowRight className="size-4" />
                </button>
              ) : (
                <p className="text-sm font-medium text-muted-foreground">
                  Answer correctly to continue automatically.
                </p>
              )}
            </div>
          </fieldset>
        </article>

        <aside className="sticky top-24 hidden rounded-2xl border border-border bg-card p-5 lg:block">
          <Link to={`/course/${course.id}`} className="text-sm font-semibold text-primary hover:underline">{course.title}</Link>
          <div className="mt-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.12em] text-muted-foreground">Pathway progress</p>
              <p className="mt-1 text-sm text-muted-foreground">{done.length} of {course.modules.length} complete</p>
            </div>
            <strong className="text-2xl text-primary">{progress}%</strong>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
          <CourseOutline course={course} done={done} currentId={module.id} />
        </aside>
      </div>
    </div>
  );
}
