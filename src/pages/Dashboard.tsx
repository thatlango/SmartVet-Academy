import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ClipboardCheck,
  Loader2,
  MoreHorizontal,
  PlayCircle,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { PoultryCutout } from "@/components/PoultryCutout";
import { liveCourses, type Course } from "@/lib/courses";
import {
  getDashboardSnapshot,
  type CertificateRecord,
  type LearningActivityRecord,
} from "@/lib/learning";

type Summary = {
  course: Course;
  done: number[];
  passed: boolean;
  cert: CertificateRecord | null;
};

const courseImages: Record<string, string> = {
  "broiler-foundations": "/course-media/chick-temperature-behaviour.jpg",
  "layers-foundations": "/course-media/records-profit-tracking.jpg",
  "croiler-production": "/course-media/market-readiness.jpg",
};

const courseShortNames: Record<string, string> = {
  "broiler-foundations": "Broiler Foundations",
  "layers-foundations": "Layer Management",
  "croiler-production": "Croiler Production",
};

function courseAction(summary: Summary) {
  const { course, done, passed, cert } = summary;
  const complete = done.length === course.modules.length;
  const next = Math.min(done.length + 1, course.modules.length);

  if (cert || passed) return { label: "Open Certificate", to: `/course/${course.id}/certificate` };
  if (complete) return { label: "Take Assessment", to: `/course/${course.id}/quiz` };
  return {
    label: done.length ? "Continue Learning" : "Start Course",
    to: `/course/${course.id}/module/${next}`,
  };
}

function percentage(done: number, total: number) {
  return total ? Math.round((done / total) * 100) : 0;
}

function startOfLocalDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function dayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function StatCard({
  icon,
  label,
  value,
  detail,
  accent = "green",
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  detail: string;
  accent?: "green" | "orange";
}) {
  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,.04)]">
      <div className="flex items-start gap-3">
        <span
          className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${
            accent === "orange" ? "bg-orange-50 text-orange-600" : "bg-emerald-50 text-primary"
          }`}
        >
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-semibold text-slate-500">{label}</p>
            <MoreHorizontal className="size-4 text-slate-300" />
          </div>
          <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">{value}</p>
          <p className="mt-0.5 text-xs text-slate-500">{detail}</p>
        </div>
      </div>
    </article>
  );
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [activity, setActivity] = useState<LearningActivityRecord[]>([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) nav("/auth?returnTo=%2Fdashboard", { replace: true });
  }, [authLoading, user, nav]);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function loadDashboard() {
      setLoading(true);
      setLoadError("");
      try {
        let snapshot;
        try {
          snapshot = await getDashboardSnapshot();
        } catch {
          await new Promise((resolve) => window.setTimeout(resolve, 350));
          snapshot = await getDashboardSnapshot();
        }

        if (cancelled) return;

        setName(snapshot.full_name || user?.displayName || "");
        setActivity(snapshot.activity ?? []);
        setSummaries(
          liveCourses.map((course) => {
            const courseState = snapshot.courses?.[course.id];
            return {
              course,
              done: courseState?.done ?? [],
              passed: courseState?.passed ?? false,
              cert: courseState?.cert ?? null,
            };
          }),
        );
      } catch {
        if (cancelled) return;
        setLoadError("We could not refresh your learning dashboard. Try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadDashboard();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const active = useMemo(
    () =>
      summaries.find((item) => item.done.length > 0 && !item.cert && item.done.length < item.course.modules.length) ??
      summaries.find((item) => !item.cert) ??
      summaries[0],
    [summaries],
  );

  const totals = useMemo(() => {
    const totalModules = summaries.reduce((sum, item) => sum + item.course.modules.length, 0);
    const completedModules = summaries.reduce((sum, item) => sum + item.done.length, 0);
    const certificates = summaries.filter((item) => item.cert).length;
    const hoursLearned = summaries.reduce((sum, item) => {
      const minutes = item.course.modules
        .filter((module) => item.done.includes(module.id))
        .reduce((total, module) => total + module.durationMinutes, 0);
      return sum + minutes / 60;
    }, 0);

    return {
      totalModules,
      completedModules,
      certificates,
      hoursLearned,
      overall: percentage(completedModules, totalModules),
    };
  }, [summaries]);

  const weeklyActivity = useMemo(() => {
    const today = startOfLocalDay(new Date());
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      return {
        date,
        key: dayKey(date),
        label: date.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 3),
        count: 0,
      };
    });

    const index = new Map(days.map((day, position) => [day.key, position]));
    activity.forEach((record) => {
      const date = new Date(record.completed_at);
      const position = index.get(dayKey(date));
      if (position !== undefined) days[position].count += 1;
    });

    return days;
  }, [activity]);

  const trend = useMemo(() => {
    const now = new Date();
    const currentCompleted = totals.completedModules;
    const recentRecords = activity
      .map((record) => new Date(record.completed_at))
      .filter((date) => !Number.isNaN(date.getTime()));

    const points = Array.from({ length: 6 }, (_, index) => {
      const cutoff = new Date(now);
      cutoff.setDate(now.getDate() - (5 - index) * 7);
      cutoff.setHours(23, 59, 59, 999);
      const laterCompletions = recentRecords.filter((date) => date > cutoff).length;
      const completedAtCutoff = Math.max(0, currentCompleted - laterCompletions);
      return percentage(completedAtCutoff, totals.totalModules);
    });

    return points;
  }, [activity, totals.completedModules, totals.totalModules]);

  const nextLessons = useMemo(
    () =>
      summaries
        .map((summary) => {
          const nextId = Math.min(summary.done.length + 1, summary.course.modules.length);
          const nextModule = summary.course.modules.find((module) => module.id === nextId);
          if (!nextModule) return null;
          const complete = summary.done.length === summary.course.modules.length;
          return {
            summary,
            module: nextModule,
            status: summary.cert ? "Completed" : complete ? "Assessment Ready" : summary.done.length ? "In Progress" : "Not Started",
          };
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    [summaries],
  );

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[68vh] items-center justify-center">
        <Loader2 className="size-7 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const firstName = (name || user.displayName || "Learner").split(" ")[0];
  const activeAction = active ? courseAction(active) : null;
  const activeNext = active
    ? active.course.modules.find((module) => module.id === Math.min(active.done.length + 1, active.course.modules.length))
    : null;
  const maxDaily = Math.max(1, ...weeklyActivity.map((item) => item.count));
  const assessmentReady = summaries.filter((item) => item.done.length === item.course.modules.length && !item.passed && !item.cert).length;

  const chartWidth = 250;
  const chartHeight = 86;
  const trendPoints = trend
    .map((value, index) => {
      const x = 8 + (index / Math.max(1, trend.length - 1)) * (chartWidth - 16);
      const y = chartHeight - 8 - (value / 100) * (chartHeight - 16);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="px-4 py-5 sm:px-6 sm:py-6">
      {loadError && (
        <div role="alert" className="mb-5 flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-slate-700 sm:flex-row sm:items-center sm:justify-between">
          <span>{loadError}</span>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex min-h-10 items-center justify-center rounded-xl bg-white px-4 py-2 font-semibold text-slate-800 shadow-sm"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-5">
          <section className="dashboard-hero">
            <div className="dashboard-hero__copy">
              <h1 className="font-display">Healthier birds. Stronger farm businesses.</h1>
              <p className="dashboard-hero__subhead">
                Self-paced courses in broiler, layer and Croiler production, built around the decisions you make on the farm every day.
              </p>
              {activeAction && (
                <Link to={activeAction.to} className="dashboard-hero__primary">
                  {active?.done.length ? "Continue Learning" : "Start Learning"}
                  <ArrowRight className="size-4" />
                </Link>
              )}
            </div>
            <div className="dashboard-hero__glow" aria-hidden="true" />
            <PoultryCutout className="dashboard-hero__art" />
          </section>

          <section className="grid gap-3 md:grid-cols-3" aria-label="Learning pathways">
            {summaries.map((summary, index) => {
              const progress = percentage(summary.done.length, summary.course.modules.length);
              return (
                <Link
                  key={summary.course.id}
                  to={`/course/${summary.course.id}`}
                  className="group flex min-h-20 items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-[0_8px_24px_rgba(15,23,42,.035)] transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span
                    className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${
                      index === 1 ? "bg-orange-50 text-orange-600" : "bg-emerald-50 text-primary"
                    }`}
                  >
                    {index === 1 ? <Award className="size-5" /> : <BookOpen className="size-5" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-slate-900">{courseShortNames[summary.course.id] ?? summary.course.title}</span>
                    <span className="mt-1 block text-xs text-slate-500">{summary.done.length}/{summary.course.modules.length} modules. {progress}%</span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-slate-300 transition group-hover:text-primary" />
                </Link>
              );
            })}
          </section>

          <section id="certificates" className="grid gap-3 sm:grid-cols-3">
            <StatCard
              icon={<BookOpen className="size-5" />}
              label="Modules Completed"
              value={totals.completedModules}
              detail={`of ${totals.totalModules} modules`}
            />
            <StatCard
              icon={<BadgeCheck className="size-5" />}
              label="Certificates Earned"
              value={totals.certificates}
              detail={`of ${summaries.length} certificates`}
              accent="orange"
            />
            <StatCard
              icon={<Clock3 className="size-5" />}
              label="Hours Learned"
              value={totals.hoursLearned.toFixed(1)}
              detail="estimated from completed lessons"
            />
          </section>

          <section>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-950">Continue Learning</h2>
                <p className="mt-1 text-sm text-slate-500">Pick up from your next lesson in each pathway.</p>
              </div>
              <Link to="/courses" className="hidden text-sm font-bold text-primary hover:underline sm:inline">See all</Link>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              {summaries.map((summary, index) => {
                const action = courseAction(summary);
                const progress = percentage(summary.done.length, summary.course.modules.length);
                const nextId = Math.min(summary.done.length + 1, summary.course.modules.length);
                const nextModule = summary.course.modules.find((module) => module.id === nextId);
                return (
                  <article key={summary.course.id} className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_24px_rgba(15,23,42,.04)]">
                    <div className="relative h-36 overflow-hidden bg-slate-100">
                      <img
                        src={courseImages[summary.course.id] ?? "/course-media/brooder-setup.jpg"}
                        alt=""
                        className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
                      />
                      <span
                        className={`absolute bottom-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                          index === 1 ? "bg-orange-50 text-orange-700" : "bg-emerald-50 text-primary"
                        }`}
                      >
                        {index === 0 ? "Broiler" : index === 1 ? "Layer" : "Croiler"}
                      </span>
                    </div>
                    <div className="p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[.08em] text-slate-400">
                        {summary.done.length === summary.course.modules.length ? "Pathway complete" : "Next lesson"}
                      </p>
                      <h3 className="mt-1 line-clamp-2 min-h-12 text-base font-bold leading-6 text-slate-950">
                        {summary.done.length === summary.course.modules.length ? summary.course.title : nextModule?.title ?? summary.course.title}
                      </h3>
                      <div className="mt-4 flex items-center gap-3">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${index === 1 ? "bg-orange-500" : "bg-primary"}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-600">{progress}%</span>
                      </div>
                      <Link
                        to={action.to}
                        className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-bold text-primary"
                      >
                        {action.label}
                        <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section id="lessons" className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,.04)] sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-950">Your Lessons</h2>
                <p className="mt-1 text-sm text-slate-500">Your next learning action in each pathway.</p>
              </div>
              <Link to="/courses" className="text-sm font-bold text-primary hover:underline">See all</Link>
            </div>

            <div className="mt-4 hidden overflow-x-auto md:block">
              <table className="w-full min-w-[720px] text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-[.08em] text-slate-400">
                    <th className="pb-3 pr-4">Lesson</th>
                    <th className="pb-3 pr-4">Course</th>
                    <th className="pb-3 pr-4">Type</th>
                    <th className="pb-3 pr-4">Duration</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {nextLessons.map(({ summary, module, status }) => {
                    const to = status === "Assessment Ready"
                      ? `/course/${summary.course.id}/quiz`
                      : `/course/${summary.course.id}/module/${module.id}`;
                    return (
                      <tr key={summary.course.id} className="border-b border-slate-100 last:border-0">
                        <td className="py-3 pr-4">
                          <Link to={to} className="flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-primary">
                            <PlayCircle className="size-4 shrink-0 text-primary" />
                            <span className="line-clamp-1">{module.title}</span>
                          </Link>
                        </td>
                        <td className="py-3 pr-4 text-xs text-slate-600">{courseShortNames[summary.course.id] ?? summary.course.title}</td>
                        <td className="py-3 pr-4 text-xs text-slate-600">Lesson</td>
                        <td className="py-3 pr-4 text-xs text-slate-600">{module.durationMinutes} min</td>
                        <td className="py-3 pr-4">
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            status === "Assessment Ready"
                              ? "bg-orange-50 text-orange-700"
                              : status === "In Progress"
                                ? "bg-emerald-50 text-primary"
                                : "bg-slate-100 text-slate-500"
                          }`}>
                            {status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <Link to={to} aria-label={`Open ${module.title}`} className="inline-flex size-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:border-emerald-200 hover:text-primary">
                            <ArrowRight className="size-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 space-y-3 md:hidden">
              {nextLessons.map(({ summary, module, status }) => {
                const to = status === "Assessment Ready"
                  ? `/course/${summary.course.id}/quiz`
                  : `/course/${summary.course.id}/module/${module.id}`;
                return (
                  <Link key={summary.course.id} to={to} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                    <PlayCircle className="size-5 shrink-0 text-primary" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-slate-900">{module.title}</span>
                      <span className="mt-0.5 block text-xs text-slate-500">{courseShortNames[summary.course.id]}. {module.durationMinutes} min</span>
                    </span>
                    <ChevronRight className="size-4 shrink-0 text-slate-400" />
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,.04)]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-950">Statistics</h2>
              <span className="text-xs font-bold text-primary">This Week</span>
            </div>

            <div className="mt-5 grid grid-cols-[128px_1fr] items-center gap-4">
              <div
                className="relative flex size-28 items-center justify-center rounded-full"
                style={{ background: `conic-gradient(#0b6f3c 0 ${Math.max(0, totals.overall - 8)}%, #f36c21 ${Math.max(0, totals.overall - 8)}% ${totals.overall}%, #e8f0eb ${totals.overall}% 100%)` }}
              >
                <div className="flex size-[82px] flex-col items-center justify-center rounded-full bg-white">
                  <strong className="text-2xl font-bold text-slate-950">{totals.overall}%</strong>
                  <span className="mt-0.5 text-center text-[10px] leading-3 text-slate-500">Overall<br />Completion</span>
                </div>
              </div>
              <div>
                <p className="text-base font-bold leading-5 text-slate-950">Good progress,<br />{firstName}! <span aria-hidden="true">🎉</span></p>
                <p className="mt-2 text-xs leading-5 text-slate-500">Keep learning to build stronger poultry skills.</p>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <h3 className="text-sm font-bold text-slate-900">Weekly Study Activity</h3>
              <div className="mt-4 flex h-28 items-end justify-between gap-2">
                {weeklyActivity.map((item, index) => (
                  <div key={item.key} className="flex h-full flex-1 flex-col items-center justify-end">
                    <div className="flex w-full flex-1 items-end justify-center">
                      <div
                        className={`w-full max-w-6 rounded-t-md ${
                          index === weeklyActivity.length - 4 ? "bg-orange-500" : index % 2 ? "bg-primary" : "bg-emerald-200"
                        }`}
                        style={{ height: `${Math.max(8, (item.count / maxDaily) * 82)}px` }}
                        title={`${item.count} module${item.count === 1 ? "" : "s"} completed`}
                      />
                    </div>
                    <span className="mt-2 text-[10px] text-slate-400">{item.label}</span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[10px] leading-4 text-slate-400">Bars represent modules completed each day.</p>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Learning Trend</h3>
                <span className="text-[10px] font-bold text-primary">Last 6 weeks</span>
              </div>
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="mt-3 h-24 w-full overflow-visible" role="img" aria-label="Six week completion trend">
                <line x1="8" y1={chartHeight - 8} x2={chartWidth - 8} y2={chartHeight - 8} stroke="#e2e8f0" strokeWidth="1" />
                <line x1="8" y1={chartHeight / 2} x2={chartWidth - 8} y2={chartHeight / 2} stroke="#f1f5f9" strokeWidth="1" />
                <polyline points={trendPoints} fill="none" stroke="#f36c21" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                {trend.map((value, index) => {
                  const x = 8 + (index / Math.max(1, trend.length - 1)) * (chartWidth - 16);
                  const y = chartHeight - 8 - (value / 100) * (chartHeight - 16);
                  return <circle key={index} cx={x} cy={y} r="3.5" fill="#f36c21" stroke="#fff" strokeWidth="1.5" />;
                })}
              </svg>
              <div className="flex justify-between px-1 text-[10px] text-slate-400">
                {trend.map((_, index) => <span key={index}>W{index + 1}</span>)}
              </div>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-5">
              <h3 className="text-sm font-bold text-slate-900">Learning Pathway Progress</h3>
              <div className="mt-4 space-y-4">
                {summaries.map((summary, index) => {
                  const value = percentage(summary.done.length, summary.course.modules.length);
                  return (
                    <div key={summary.course.id} className="grid grid-cols-[1fr_92px_34px] items-center gap-2">
                      <span className="truncate text-xs font-semibold text-slate-700">{courseShortNames[summary.course.id] ?? summary.course.title}</span>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className={`h-full rounded-full ${index === 1 ? "bg-orange-500" : "bg-primary"}`} style={{ width: `${value}%` }} />
                      </div>
                      <span className="text-right text-xs font-bold text-slate-600">{value}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section id="assessments" className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,.04)]">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                <ClipboardCheck className="size-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[.08em] text-orange-600">Assessments</p>
                <h2 className="mt-1 text-lg font-bold text-slate-950">{assessmentReady ? `${assessmentReady} ready to take` : "Keep building progress"}</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Finish every module in a pathway to unlock its final assessment and certificate.
                </p>
              </div>
            </div>
            {summaries.filter((item) => item.done.length === item.course.modules.length && !item.passed && !item.cert).map((item) => (
              <Link
                key={item.course.id}
                to={`/course/${item.course.id}/quiz`}
                className="mt-4 flex min-h-11 items-center justify-between rounded-xl bg-orange-50 px-3 text-sm font-bold text-orange-700"
              >
                Take {courseShortNames[item.course.id] ?? "assessment"}
                <ArrowRight className="size-4" />
              </Link>
            ))}
          </section>

          <section className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5">
            <div className="flex items-start gap-3">
              <TrendingUp className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <h2 className="text-sm font-bold text-slate-950">Your next target</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {activeNext
                    ? `Complete “${activeNext.title}” to move ${courseShortNames[active?.course.id ?? ""] ?? "your pathway"} forward.`
                    : "Choose a pathway and begin your next lesson."}
                </p>
                {activeAction && (
                  <Link to={activeAction.to} className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-primary">
                    Continue now <ArrowRight className="size-3.5" />
                  </Link>
                )}
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
