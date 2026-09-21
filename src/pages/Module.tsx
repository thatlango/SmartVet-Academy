import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  ImageIcon,
  Loader2,
  LockKeyhole,
  Target,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { completeModule, getCompletedModules } from "@/lib/learning";
import { getCourse, getModule, type Block } from "@/lib/courses";

const toneClass = {
  info: "border-secondary/25 bg-secondary/5",
  warning: "border-gold/45 bg-gold/10",
  danger: "border-destructive/25 bg-destructive/5",
  success: "border-primary/25 bg-primary/5",
} as const;

function BlockView({ block }: { block: Block }) {
  if (block.kind === "figure") {
    return (
      <figure className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="aspect-[16/9] overflow-hidden bg-muted">
          <img
            src={block.src}
            alt={block.alt}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
        <figcaption className="p-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-secondary">
            <ImageIcon className="size-4" />
            {block.title}
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{block.caption}</p>
          {block.source && <p className="mt-2 text-xs text-muted-foreground/80">Source: {block.source}</p>}
        </figcaption>
      </figure>
    );
  }

  if (block.kind === "activity") {
    return (
      <div className="rounded-2xl border border-secondary/25 bg-secondary/5 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-semibold">{block.title}</h3>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1 text-xs font-semibold text-secondary">
            <Clock3 className="size-3.5" />
            {block.minutes} min practice
          </span>
        </div>
        <ol className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
          {block.items.map((item, index) => (
            <li key={item} className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                {index + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  if (block.kind === "table") {
    return (
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="p-5 pb-3 sm:p-6 sm:pb-4">
          <h3 className="font-semibold">{block.title}</h3>
          {block.note && <p className="mt-2 text-sm leading-6 text-muted-foreground">{block.note}</p>}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[620px] w-full text-left text-sm">
            <thead className="bg-muted/70">
              <tr>
                {block.headers.map((header) => (
                  <th key={header} className="px-5 py-3 font-semibold text-foreground sm:px-6">
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
                      className={`px-5 py-3 leading-6 sm:px-6 ${cellIndex === 0 ? "font-medium text-foreground" : "text-muted-foreground"}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (block.kind === "callout") {
    return (
      <div className={`rounded-2xl border p-5 sm:p-6 ${toneClass[block.tone]}`}>
        <h3 className="font-semibold">{block.title}</h3>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-current" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (block.kind === "checklist") {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <h3 className="font-semibold">{block.title}</h3>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Check className="size-3.5" />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const Tag = block.ordered ? "ol" : "ul";
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <h3 className="font-semibold">{block.title}</h3>
      <Tag className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
        {block.items.map((item, index) => (
          <li key={item} className="flex gap-3">
            {block.ordered ? (
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-foreground">
                {index + 1}
              </span>
            ) : (
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
            )}
            <span>{item}</span>
          </li>
        ))}
      </Tag>
    </div>
  );
}

export default function ModulePage() {
  const { courseId = "", moduleId = "" } = useParams();
  const course = getCourse(courseId);
  const module = course ? getModule(course, Number(moduleId)) : undefined;
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const [done, setDone] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) nav("/auth", { replace: true });
  }, [authLoading, user, nav]);

  useEffect(() => {
    if (user && course) getCompletedModules(course.id).then(setDone).finally(() => setLoading(false));
  }, [user, course]);

  if (!course || !module) return <div className="p-10">Module not found.</div>;
  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-7 animate-spin text-primary" />
      </div>
    );
  }

  const already = done.includes(module.id);
  const next = Math.min(done.length + 1, course.modules.length);

  if (!already && module.id > next) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <LockKeyhole className="mx-auto size-10" />
        <h1 className="mt-4 text-3xl font-semibold">Complete the earlier module first</h1>
        <Link
          to={`/course/${course.id}/module/${next}`}
          className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-primary-foreground"
        >
          Go to module {next}
        </Link>
      </div>
    );
  }

  const correct = checked && selected === module.check.correctIndex;

  async function finish() {
    if (!already && !correct) return;
    setSaving(true);
    await completeModule(course!.id, module!.id);
    nav(module!.id === course!.modules.length ? `/course/${course!.id}/quiz` : `/course/${course!.id}/module/${module!.id + 1}`);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link to="/dashboard" className="text-sm font-semibold text-muted-foreground hover:text-primary">
        ← My learning
      </Link>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[.12em] text-primary">
          {module.stepLabel}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
          <Clock3 className="size-3.5" />
          {module.durationMinutes} min
        </span>
      </div>

      <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">{module.title}</h1>
      <p className="mt-5 text-lg leading-8 text-muted-foreground">{module.intro}</p>

      <blockquote className="mt-6 border-l-4 border-gold pl-5 font-display text-xl italic">
        “{module.quote}”
      </blockquote>

      <div className="mt-7 rounded-2xl bg-primary p-6 text-primary-foreground">
        <p className="text-xs font-bold uppercase tracking-wider">Key message</p>
        <p className="mt-2 text-xl font-semibold">{module.keyMessage}</p>
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <Target className="size-5 text-secondary" />
          <h2 className="text-lg font-semibold">By the end of this module</h2>
        </div>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {module.outcomes.map((outcome) => (
            <li key={outcome} className="flex gap-2 text-sm leading-6 text-muted-foreground">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{outcome}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-7 space-y-5">
        {module.blocks.map((block, index) => (
          <BlockView key={index} block={block} />
        ))}
      </div>

      <section className="mt-8 rounded-2xl border border-border bg-card p-6">
        <p className="text-xs font-bold uppercase tracking-[.12em] text-secondary">Knowledge check</p>
        <h2 className="mt-2 text-xl font-semibold">{module.check.question}</h2>

        {!already && (
          <>
            <div className="mt-4 space-y-2">
              {module.check.options.map((option, index) => (
                <label
                  key={option}
                  className={`flex cursor-pointer gap-3 rounded-xl border p-3 transition ${selected === index ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}
                >
                  <input
                    type="radio"
                    checked={selected === index}
                    onChange={() => {
                      setSelected(index);
                      setChecked(false);
                    }}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            <button
              disabled={selected === null}
              onClick={() => setChecked(true)}
              className="mt-4 rounded-xl border border-border px-4 py-2 font-semibold disabled:opacity-50"
            >
              Check answer
            </button>
            {checked && (
              <p className={`mt-4 rounded-xl p-3 text-sm leading-6 ${correct ? "bg-primary/10 text-foreground" : "bg-destructive/10 text-destructive"}`}>
                {correct ? module.check.explanation : "Review the module and try again."}
              </p>
            )}
          </>
        )}

        <button
          disabled={saving || (!already && !correct)}
          onClick={() => void finish()}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground disabled:opacity-50"
        >
          {saving && <Loader2 className="size-4 animate-spin" />}
          {module.id === course.modules.length ? "Continue to final assessment" : "Complete module and continue"}
          <ArrowRight className="size-4" />
        </button>

        {already && (
          <p className="mt-3 inline-flex items-center gap-1 text-sm text-primary">
            <CheckCircle2 className="size-4" />
            Already completed
          </p>
        )}
      </section>
    </div>
  );
}
