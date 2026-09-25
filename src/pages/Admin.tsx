import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Award,
  BookOpenCheck,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileCheck2,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  MailPlus,
  Copy,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { SmartVetLogo } from "@/components/SmartVetLogo";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import { liveCourseCatalog } from "@/lib/course-catalog";
import {
  createAdminInvite,
  createAssessmentQuestion,
  deleteAssessmentQuestion,
  getAdminAssessment,
  getAdminAudit,
  getAdminDirectory,
  getAdminCertificates,
  getAdminEnrollments,
  getAdminLearners,
  getAdminOverview,
  getAdminSession,
  removeAdmin,
  resendAdminInvite,
  revokeAdminInvite,
  setAdminEnrollment,
  setCertificateRevoked,
  updateAdminRole,
  updateAssessmentQuestion,
  updateLearnerStatus,
  type AcademyAdminRecord,
  type AdminAssessmentQuestion,
  type AdminAuditRecord,
  type AdminCertificate,
  type AdminEnrollment,
  type AdminInviteRecord,
  type AdminLearner,
  type AdminOverview,
  type AdminRole,
  type AdminSession,
} from "@/lib/admin";

type Section = "overview" | "learners" | "enrollments" | "assessments" | "certificates" | "admins" | "audit";

const sectionMeta: Array<{ id: Section; label: string; icon: ReactNode }> = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard className="size-4" /> },
  { id: "learners", label: "Learners", icon: <Users className="size-4" /> },
  { id: "enrollments", label: "Enrolments", icon: <BookOpenCheck className="size-4" /> },
  { id: "assessments", label: "Assessments", icon: <ClipboardList className="size-4" /> },
  { id: "certificates", label: "Certificates", icon: <Award className="size-4" /> },
  { id: "admins", label: "Admins", icon: <ShieldCheck className="size-4" /> },
  { id: "audit", label: "Audit log", icon: <FileCheck2 className="size-4" /> },
];

function courseName(courseId: string) {
  return liveCourseCatalog.find((course) => course.id === courseId)?.title ?? courseId;
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}

function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "success" | "warning" | "danger" | "neutral" }) {
  const toneClass = {
    success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    warning: "bg-amber-50 text-amber-700 ring-amber-200",
    danger: "bg-rose-50 text-rose-700 ring-rose-200",
    neutral: "bg-slate-100 text-slate-600 ring-slate-200",
  }[tone];
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${toneClass}`}>{children}</span>;
}

function Panel({ title, description, action, children }: { title: string; description?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,.05)]">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-950">{title}</h2>
          {description && <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="px-6 py-14 text-center">
      <div className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <SlidersHorizontal className="size-5" />
      </div>
      <h3 className="mt-4 font-bold text-slate-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{detail}</p>
    </div>
  );
}

export default function AdminPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [section, setSection] = useState<Section>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [session, setSession] = useState<AdminSession | null>(null);
  const [adminLoading, setAdminLoading] = useState(true);
  const [adminError, setAdminError] = useState("");
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [learners, setLearners] = useState<AdminLearner[]>([]);
  const [enrollments, setEnrollments] = useState<AdminEnrollment[]>([]);
  const [questions, setQuestions] = useState<AdminAssessmentQuestion[]>([]);
  const [certificates, setCertificates] = useState<AdminCertificate[]>([]);
  const [audit, setAudit] = useState<AdminAuditRecord[]>([]);
  const [loadingSection, setLoadingSection] = useState(false);
  const [search, setSearch] = useState("");
  const [courseId, setCourseId] = useState(liveCourseCatalog[0]?.id ?? "");
  const [notice, setNotice] = useState("");
  const [questionId, setQuestionId] = useState<string | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [published, setPublished] = useState(true);
  const [savingQuestion, setSavingQuestion] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      nav(`/auth?returnTo=${encodeURIComponent(location.pathname)}`, { replace: true });
    }
  }, [authLoading, user, nav, location.pathname]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setAdminLoading(true);
    setAdminError("");
    getAdminSession()
      .then((next) => {
        if (!cancelled) setSession(next);
      })
      .catch((error) => {
        if (cancelled) return;
        if (error instanceof ApiError && error.status === 403) {
          setAdminError("This account does not have SmartVet Academy administration access.");
        } else {
          setAdminError("The administration service could not be opened. Try again.");
        }
      })
      .finally(() => {
        if (!cancelled) setAdminLoading(false);
      });
    return () => { cancelled = true; };
  }, [user]);

  async function loadSection(nextSection = section) {
    if (!session) return;
    setLoadingSection(true);
    setNotice("");
    try {
      if (nextSection === "overview") setOverview(await getAdminOverview());
      if (nextSection === "learners") setLearners(await getAdminLearners(search));
      if (nextSection === "enrollments") setEnrollments(await getAdminEnrollments(courseId));
      if (nextSection === "assessments") {
        const next = await getAdminAssessment(courseId);
        setQuestions(next);
        if (!questionId && next[0]) selectQuestion(next[0]);
      }
      if (nextSection === "certificates") setCertificates(await getAdminCertificates(search, courseId));
      if (nextSection === "audit") setAudit(await getAdminAudit());
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "This admin view could not be refreshed.");
    } finally {
      setLoadingSection(false);
    }
  }

  useEffect(() => {
    if (!session) return;
    void loadSection(section);
  }, [session, section, courseId]);

  function selectQuestion(question: AdminAssessmentQuestion) {
    setQuestionId(question.id);
    setQuestionText(question.question_text);
    setOptions(question.options);
    setCorrectIndex(question.correct_index);
    setPublished(question.published);
  }

  function newQuestion() {
    setQuestionId(null);
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectIndex(0);
    setPublished(true);
  }

  async function saveQuestion(event: FormEvent) {
    event.preventDefault();
    setSavingQuestion(true);
    setNotice("");
    try {
      if (questionId) {
        await updateAssessmentQuestion(courseId, questionId, {
          question: questionText,
          options,
          correctIndex,
          published,
        });
      } else {
        await createAssessmentQuestion(courseId, {
          question: questionText,
          options,
          correctIndex,
          published,
        });
      }
      setNotice(questionId ? "Assessment question updated." : "Assessment question created.");
      const next = await getAdminAssessment(courseId);
      setQuestions(next);
      const selected = questionId ? next.find((item) => item.id === questionId) : next[next.length - 1];
      if (selected) selectQuestion(selected);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Question could not be saved.");
    } finally {
      setSavingQuestion(false);
    }
  }

  const passRate = overview?.quizAttempts
    ? Math.round((overview.quizPasses / overview.quizAttempts) * 100)
    : 0;

  const canManageAccounts = session?.role === "owner" || session?.role === "admin";
  const canManageAssessments = canManageAccounts || session?.role === "assessor";
  const canManageEnrollments = canManageAccounts || session?.role === "support";

  const selectedCourse = useMemo(
    () => liveCourseCatalog.find((course) => course.id === courseId),
    [courseId],
  );

  if (authLoading || adminLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f5f7f4]"><Loader2 className="size-7 animate-spin text-primary" /></div>;
  }

  if (!user) return null;

  if (adminError || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7f4] px-4">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-xl shadow-slate-900/5">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
            <ShieldCheck className="size-6" />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-slate-950">Administration access required</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">{adminError}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/dashboard" className="inline-flex min-h-11 items-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white">Back to learning</Link>
            <button type="button" onClick={() => void signOut()} className="inline-flex min-h-11 items-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700">Sign out</button>
          </div>
        </div>
      </div>
    );
  }

  const title = sectionMeta.find((item) => item.id === section)?.label ?? "Overview";

  return (
    <div className="min-h-screen bg-[#f4f7f4] text-slate-950">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-[#173122] text-white lg:flex lg:flex-col">
          <div className="border-b border-white/10 px-5 py-5">
            <Link to="/" className="inline-flex rounded-xl bg-white px-3 py-2">
              <SmartVetLogo className="h-9 w-auto" />
            </Link>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[.16em] text-emerald-200/80">Academy administration</p>
          </div>
          <nav className="flex-1 space-y-1 p-3">
            {sectionMeta.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSection(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${section === item.id ? "bg-white text-[#173122]" : "text-emerald-50/80 hover:bg-white/10 hover:text-white"}`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
          <div className="border-t border-white/10 p-4">
            <p className="truncate text-sm font-semibold">{session.displayName || session.email || "Administrator"}</p>
            <p className="mt-1 text-xs capitalize text-emerald-100/70">{session.role}</p>
            <button
              type="button"
              onClick={() => void signOut()}
              className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-emerald-50/80 hover:text-white"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </div>
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button type="button" aria-label="Close menu" className="absolute inset-0 bg-slate-950/45" onClick={() => setMobileOpen(false)} />
            <aside className="relative z-10 flex h-full w-[82%] max-w-xs flex-col bg-[#173122] p-4 text-white shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-white px-3 py-2"><SmartVetLogo className="h-8 w-auto" /></div>
                <button type="button" onClick={() => setMobileOpen(false)} className="flex size-10 items-center justify-center rounded-xl bg-white/10"><X className="size-5" /></button>
              </div>
              <nav className="mt-6 space-y-1">
                {sectionMeta.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => { setSection(item.id); setMobileOpen(false); }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold ${section === item.id ? "bg-white text-[#173122]" : "text-emerald-50/80"}`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </nav>
            </aside>
          </div>
        )}

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
            <div className="flex min-h-[68px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setMobileOpen(true)} className="flex size-10 items-center justify-center rounded-xl border border-slate-200 lg:hidden"><Menu className="size-5" /></button>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[.14em] text-emerald-700">SmartVet Academy</p>
                  <h1 className="text-xl font-bold tracking-tight">{title}</h1>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => void loadSection()}
                  disabled={loadingSection}
                  className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm disabled:opacity-50"
                >
                  <RefreshCw className={`size-4 ${loadingSection ? "animate-spin" : ""}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <Link to="/dashboard" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#173122] px-3.5 py-2 text-sm font-semibold text-white">
                  Learner view
                  <ChevronRight className="size-4" />
                </Link>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">
            {notice && (
              <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                {notice}
              </div>
            )}

            {section === "overview" && (
              <div className="space-y-6">
                <section className="overflow-hidden rounded-[30px] bg-[#1E4430] p-6 text-white shadow-[0_20px_50px_rgba(30,68,48,.18)] sm:p-8">
                  <div className="max-w-3xl">
                    <p className="text-xs font-bold uppercase tracking-[.18em] text-[#F2A25C]">Operations console</p>
                    <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-.035em] sm:text-4xl">Manage learning delivery from one place.</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-50/75">
                      Track participation, control enrolments, maintain final assessments, and govern certificate issuance without touching learner-facing data directly.
                    </p>
                  </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    ["Learners", overview?.learners ?? "—", <Users className="size-5" />, `${overview?.active7d ?? 0} active in 7 days`],
                    ["Active enrolments", overview?.activeEnrollments ?? "—", <BookOpenCheck className="size-5" />, `${overview?.activeAccounts ?? 0} active accounts`],
                    ["Assessment pass rate", overview ? `${passRate}%` : "—", <ClipboardList className="size-5" />, `${overview?.quizAttempts ?? 0} attempts`],
                    ["Certificates", overview?.certificates ?? "—", <Award className="size-5" />, `${overview?.publishedQuestions ?? 0} published questions`],
                  ].map(([label, value, icon, detail]) => (
                    <article key={String(label)} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,.04)]">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">{icon}</div>
                      <p className="mt-5 text-sm font-semibold text-slate-500">{label}</p>
                      <p className="mt-1 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
                      <p className="mt-2 text-xs text-slate-500">{detail}</p>
                    </article>
                  ))}
                </section>

                <Panel title="Administration areas" description="Use the console for operational control; curriculum lesson content remains versioned in the course codebase.">
                  <div className="grid gap-0 divide-y divide-slate-100 md:grid-cols-2 md:divide-x md:divide-y-0">
                    <div className="p-6">
                      <h3 className="font-bold">Learning operations</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">Search learners, suspend accounts, assign course access and review learner activity signals.</p>
                      <button type="button" onClick={() => setSection("learners")} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-700">Manage learners <ChevronRight className="size-4" /></button>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold">Assessment & certification</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">Edit question banks, control publication, see certificate records, and revoke certificates when required.</p>
                      <button type="button" onClick={() => setSection("assessments")} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-700">Manage assessments <ChevronRight className="size-4" /></button>
                    </div>
                  </div>
                </Panel>
              </div>
            )}

            {section === "learners" && (
              <Panel
                title="Learners"
                description="Search academy accounts and control account status."
                action={
                  <form
                    onSubmit={(event) => { event.preventDefault(); void loadSection("learners"); }}
                    className="flex w-full gap-2 sm:w-auto"
                  >
                    <div className="relative min-w-0 flex-1 sm:w-72">
                      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or email" className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-emerald-500" />
                    </div>
                    <button type="submit" className="rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white">Search</button>
                  </form>
                }
              >
                {learners.length === 0 ? <EmptyState title="No learners found" detail="Learner accounts will appear here after registration or once your search matches an account." /> : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-slate-50 text-xs uppercase tracking-[.08em] text-slate-500">
                        <tr>
                          <th className="px-5 py-3 font-semibold">Learner</th>
                          <th className="px-5 py-3 font-semibold">Status</th>
                          <th className="px-5 py-3 font-semibold">Learning</th>
                          <th className="px-5 py-3 font-semibold">Assessments</th>
                          <th className="px-5 py-3 font-semibold">Certificates</th>
                          <th className="px-5 py-3 font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {learners.map((learner) => (
                          <tr key={learner.core_user_id} className="align-top">
                            <td className="px-5 py-4">
                              <p className="font-semibold text-slate-900">{learner.full_name}</p>
                              <p className="mt-1 text-xs text-slate-500">{learner.email || "No email"}</p>
                            </td>
                            <td className="px-5 py-4"><Badge tone={learner.status === "active" ? "success" : "danger"}>{learner.status}</Badge></td>
                            <td className="px-5 py-4 text-slate-600">
                              <p>{learner.modules_completed} modules completed</p>
                              <p className="mt-1 text-xs text-slate-400">{learner.enrollments.length} recorded enrolments</p>
                            </td>
                            <td className="px-5 py-4 text-slate-600">{learner.assessment_passes}/{learner.assessment_attempts} passes</td>
                            <td className="px-5 py-4 text-slate-600">{learner.certificates}</td>
                            <td className="px-5 py-4">
                              <button
                                type="button"
                                disabled={!canManageAccounts}
                                onClick={async () => {
                                  const status = learner.status === "active" ? "suspended" : "active";
                                  if (status === "suspended" && !window.confirm(`Suspend ${learner.full_name}? They will lose Academy access until reactivated.`)) return;
                                  try {
                                    await updateLearnerStatus(learner.core_user_id, status);
                                    setNotice(`${learner.full_name} is now ${status}.`);
                                    setLearners(await getAdminLearners(search));
                                  } catch (error) {
                                    setNotice(error instanceof Error ? error.message : "Learner status could not be changed.");
                                  }
                                }}
                                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-40"
                              >
                                {learner.status === "active" ? "Suspend" : "Reactivate"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Panel>
            )}

            {section === "enrollments" && (
              <div className="space-y-6">
                <Panel
                  title="Enrolments"
                  description="Assign course access or suspend/withdraw an existing enrolment."
                  action={
                    <select value={courseId} onChange={(event) => setCourseId(event.target.value)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold">
                      {liveCourseCatalog.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
                    </select>
                  }
                >
                  {enrollments.length === 0 ? <EmptyState title="No recorded enrolments" detail="Learners are automatically enrolled when they first open a pathway, or you can assign access below." /> : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase tracking-[.08em] text-slate-500">
                          <tr><th className="px-5 py-3 font-semibold">Learner</th><th className="px-5 py-3 font-semibold">Course</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 font-semibold">Updated</th><th className="px-5 py-3 font-semibold">Manage</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {enrollments.map((item) => (
                            <tr key={`${item.core_user_id}:${item.course_id}`}>
                              <td className="px-5 py-4"><p className="font-semibold">{item.full_name}</p><p className="mt-1 text-xs text-slate-500">{item.email || "No email"}</p></td>
                              <td className="px-5 py-4 text-slate-600">{courseName(item.course_id)}</td>
                              <td className="px-5 py-4"><Badge tone={item.status === "active" ? "success" : item.status === "suspended" ? "warning" : "danger"}>{item.status}</Badge></td>
                              <td className="px-5 py-4 text-xs text-slate-500">{formatDate(item.updated_at)}</td>
                              <td className="px-5 py-4">
                                <select
                                  value={item.status}
                                  disabled={!canManageEnrollments}
                                  onChange={async (event) => {
                                    try {
                                      await setAdminEnrollment(item.core_user_id, item.course_id, event.target.value as AdminEnrollment["status"]);
                                      setEnrollments(await getAdminEnrollments(courseId));
                                      setNotice("Enrolment updated.");
                                    } catch (error) {
                                      setNotice(error instanceof Error ? error.message : "Enrolment could not be updated.");
                                    }
                                  }}
                                  className="h-9 rounded-xl border border-slate-200 bg-white px-2 text-xs font-semibold disabled:opacity-40"
                                >
                                  <option value="active">Active</option>
                                  <option value="suspended">Suspended</option>
                                  <option value="withdrawn">Withdrawn</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Panel>

                <Panel title="Assign or update course access" description="Choose a learner, course and access status.">
                  <EnrollmentForm learners={learners} currentCourseId={courseId} disabled={!canManageEnrollments} onSaved={async (message) => {
                    setNotice(message);
                    setEnrollments(await getAdminEnrollments(courseId));
                  }} ensureLearners={async () => {
                    const next = learners.length ? learners : await getAdminLearners("");
                    if (!learners.length) setLearners(next);
                    return next;
                  }} />
                </Panel>
              </div>
            )}

            {section === "assessments" && (
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_480px]">
                <Panel
                  title="Assessment question bank"
                  description={selectedCourse ? `${selectedCourse.title} · ${questions.filter((q) => q.published).length} published` : "Choose a course"}
                  action={
                    <div className="flex gap-2">
                      <select value={courseId} onChange={(event) => { setCourseId(event.target.value); setQuestionId(null); }} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold">
                        {liveCourseCatalog.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
                      </select>
                      <button type="button" onClick={newQuestion} disabled={!canManageAssessments} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#173122] px-3.5 text-sm font-semibold text-white disabled:opacity-40"><Plus className="size-4" /> New</button>
                    </div>
                  }
                >
                  {questions.length === 0 ? <EmptyState title="No assessment questions" detail="Create the first published question for this pathway." /> : (
                    <div className="divide-y divide-slate-100">
                      {questions.map((question) => (
                        <button key={question.id} type="button" onClick={() => selectQuestion(question)} className={`flex w-full items-start gap-4 px-5 py-4 text-left transition hover:bg-slate-50 ${questionId === question.id ? "bg-emerald-50/60" : ""}`}>
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-700">{question.position}</span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-semibold leading-6 text-slate-900">{question.question_text}</span>
                            <span className="mt-2 flex flex-wrap gap-2"><Badge tone={question.published ? "success" : "warning"}>{question.published ? "Published" : "Draft"}</Badge><Badge>Answer {question.correct_index + 1}</Badge></span>
                          </span>
                          <ChevronRight className="mt-2 size-4 text-slate-300" />
                        </button>
                      ))}
                    </div>
                  )}
                </Panel>

                <Panel title={questionId ? "Edit question" : "New question"} description="Learners never receive the correct-answer index from this interface.">
                  <form onSubmit={saveQuestion} className="space-y-5 p-5 sm:p-6">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-[.08em] text-slate-500">Question</label>
                      <textarea value={questionText} onChange={(event) => setQuestionText(event.target.value)} rows={4} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm leading-6 outline-none focus:border-emerald-500" />
                    </div>
                    <div className="space-y-3">
                      {options.map((option, index) => (
                        <label key={index} className="block rounded-2xl border border-slate-200 p-3">
                          <span className="flex items-center gap-3">
                            <input type="radio" name="correct-answer" checked={correctIndex === index} onChange={() => setCorrectIndex(index)} />
                            <span className="text-xs font-bold uppercase tracking-[.08em] text-slate-500">Option {index + 1}</span>
                          </span>
                          <input
                            value={option}
                            onChange={(event) => setOptions((current) => current.map((value, optionIndex) => optionIndex === index ? event.target.value : value))}
                            className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-emerald-500"
                          />
                        </label>
                      ))}
                    </div>
                    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3">
                      <input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} />
                      <span><span className="block text-sm font-semibold">Published</span><span className="text-xs text-slate-500">Visible in learner assessment</span></span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      <button type="submit" disabled={!canManageAssessments || savingQuestion} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#173122] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40">
                        {savingQuestion ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                        {questionId ? "Save changes" : "Create question"}
                      </button>
                      {questionId && (
                        <button
                          type="button"
                          disabled={!canManageAssessments}
                          onClick={async () => {
                            if (!window.confirm("Delete this assessment question? Existing attempt history is retained, but the question will no longer be available.")) return;
                            try {
                              await deleteAssessmentQuestion(courseId, questionId);
                              setNotice("Assessment question deleted.");
                              const next = await getAdminAssessment(courseId);
                              setQuestions(next);
                              if (next[0]) selectQuestion(next[0]); else newQuestion();
                            } catch (error) {
                              setNotice(error instanceof Error ? error.message : "Question could not be deleted.");
                            }
                          }}
                          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-700 disabled:opacity-40"
                        >
                          <Trash2 className="size-4" />
                          Delete
                        </button>
                      )}
                    </div>
                  </form>
                </Panel>
              </div>
            )}

            {section === "certificates" && (
              <Panel
                title="Certificates"
                description="Review issued certificates and revoke or restore verification."
                action={
                  <form onSubmit={(event) => { event.preventDefault(); void loadSection("certificates"); }} className="flex flex-wrap gap-2">
                    <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, email or code" className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm" />
                    <select value={courseId} onChange={(event) => setCourseId(event.target.value)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold">
                      {liveCourseCatalog.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
                    </select>
                    <button className="rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white">Filter</button>
                  </form>
                }
              >
                {certificates.length === 0 ? <EmptyState title="No certificates found" detail="Issued certificates matching the current filters will appear here." /> : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-slate-50 text-xs uppercase tracking-[.08em] text-slate-500"><tr><th className="px-5 py-3 font-semibold">Learner</th><th className="px-5 py-3 font-semibold">Course</th><th className="px-5 py-3 font-semibold">Certificate</th><th className="px-5 py-3 font-semibold">Issued</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 font-semibold">Action</th></tr></thead>
                      <tbody className="divide-y divide-slate-100">
                        {certificates.map((certificate) => (
                          <tr key={certificate.id}>
                            <td className="px-5 py-4"><p className="font-semibold">{certificate.full_name}</p><p className="mt-1 text-xs text-slate-500">{certificate.email || "No email"}</p></td>
                            <td className="px-5 py-4 text-slate-600">{courseName(certificate.course_id)}</td>
                            <td className="px-5 py-4 font-mono text-xs font-semibold">{certificate.verification_code}</td>
                            <td className="px-5 py-4 text-xs text-slate-500">{formatDate(certificate.issued_at)}</td>
                            <td className="px-5 py-4"><Badge tone={certificate.revoked_at ? "danger" : "success"}>{certificate.revoked_at ? "Revoked" : "Valid"}</Badge></td>
                            <td className="px-5 py-4">
                              <button
                                type="button"
                                disabled={!canManageAccounts}
                                onClick={async () => {
                                  const revoked = !certificate.revoked_at;
                                  let reason = "";
                                  if (revoked) {
                                    reason = window.prompt("Reason for revocation", "Revoked by Academy administrator") ?? "";
                                    if (!reason) return;
                                  }
                                  try {
                                    await setCertificateRevoked(certificate.id, revoked, reason);
                                    setCertificates(await getAdminCertificates(search, courseId));
                                    setNotice(revoked ? "Certificate revoked." : "Certificate restored.");
                                  } catch (error) {
                                    setNotice(error instanceof Error ? error.message : "Certificate could not be updated.");
                                  }
                                }}
                                className={`rounded-xl border px-3 py-2 text-xs font-semibold disabled:opacity-40 ${certificate.revoked_at ? "border-emerald-200 text-emerald-700" : "border-rose-200 text-rose-700"}`}
                              >
                                {certificate.revoked_at ? "Restore" : "Revoke"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Panel>
            )}

            {section === "admins" && (
              <AdminAccessPanel session={session} />
            )}

            {section === "audit" && (
              <Panel title="Administration audit log" description="High-impact admin mutations are recorded with actor, entity and timestamp.">
                {audit.length === 0 ? <EmptyState title="No admin events yet" detail="Changes to learners, enrolments, assessments and certificates will be recorded here." /> : (
                  <div className="divide-y divide-slate-100">
                    {audit.map((item) => (
                      <div key={item.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">{item.action}</p>
                          <p className="mt-1 text-xs text-slate-500">{item.full_name} · {item.entity_type} · {item.entity_id}</p>
                        </div>
                        <p className="text-xs font-medium text-slate-400">{formatDate(item.created_at)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function AdminAccessPanel({ session }: { session: AdminSession }) {
  const [admins, setAdmins] = useState<AcademyAdminRecord[]>([]);
  const [invites, setInvites] = useState<AdminInviteRecord[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AdminRole>("admin");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [latestLink, setLatestLink] = useState("");

  const canInvite = session.role === "owner" || session.role === "admin";
  const canManageExisting = session.role === "owner";

  async function load() {
    setLoading(true);
    setMessage("");
    try {
      const directory = await getAdminDirectory();
      setAdmins(directory.admins);
      setInvites(directory.invites);
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "Administrator access could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [session.coreUserId]);

  async function copyLink(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setMessage("Invite link copied.");
    } catch {
      setLatestLink(value);
      setMessage("Copy was blocked by your browser. The invite link is shown below.");
    }
  }

  async function invite(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setLatestLink("");
    try {
      const created = await createAdminInvite(email.trim(), role);
      setEmail("");
      setLatestLink(created.inviteUrl);
      setMessage(created.delivery.delivered
        ? `Invitation sent to ${created.email}.`
        : `Invitation created for ${created.email}. Email delivery is not configured, so copy the link below.`);
      await load();
      setLatestLink(created.inviteUrl);
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "The administrator invitation could not be created.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <Panel
        title="Platform administrators"
        description="Control who can manage SmartVet Academy and what level of access they have."
        action={
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        }
      >
        {loading ? (
          <div className="flex min-h-40 items-center justify-center"><Loader2 className="size-6 animate-spin text-emerald-700" /></div>
        ) : admins.length === 0 ? (
          <EmptyState title="No administrators found" detail="The bootstrap owner will appear here after their first successful admin sign-in." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[.08em] text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Administrator</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 font-semibold">Access since</th>
                  <th className="px-5 py-3 font-semibold">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {admins.map((admin) => {
                  const isSelf = admin.core_user_id === session.coreUserId;
                  return (
                    <tr key={admin.core_user_id}>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">{admin.full_name}</p>
                        <p className="mt-1 text-xs text-slate-500">{admin.email || "No email"}</p>
                      </td>
                      <td className="px-5 py-4"><Badge tone={admin.role === "owner" ? "success" : "neutral"}>{admin.role}</Badge></td>
                      <td className="px-5 py-4 text-xs text-slate-500">{formatDate(admin.created_at)}</td>
                      <td className="px-5 py-4">
                        {canManageExisting ? (
                          <div className="flex flex-wrap gap-2">
                            <select
                              value={admin.role}
                              disabled={isSelf}
                              onChange={async (event) => {
                                const nextRole = event.target.value as AdminRole;
                                try {
                                  await updateAdminRole(admin.core_user_id, nextRole);
                                  setMessage(`${admin.full_name}'s role is now ${nextRole}.`);
                                  await load();
                                } catch (reason) {
                                  setMessage(reason instanceof Error ? reason.message : "Role could not be changed.");
                                }
                              }}
                              className="h-9 rounded-xl border border-slate-200 bg-white px-2 text-xs font-semibold disabled:opacity-40"
                            >
                              <option value="owner">Owner</option>
                              <option value="admin">Admin</option>
                              <option value="assessor">Assessor</option>
                              <option value="support">Support</option>
                            </select>
                            <button
                              type="button"
                              disabled={isSelf}
                              onClick={async () => {
                                if (!window.confirm(`Remove ${admin.full_name}'s Academy administration access?`)) return;
                                try {
                                  await removeAdmin(admin.core_user_id);
                                  setMessage("Administrator access removed.");
                                  await load();
                                } catch (reason) {
                                  setMessage(reason instanceof Error ? reason.message : "Administrator access could not be removed.");
                                }
                              }}
                              className="h-9 rounded-xl border border-rose-200 px-3 text-xs font-semibold text-rose-700 disabled:opacity-40"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Owner-managed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <Panel
        title="Invite an administrator"
        description="Invitations expire automatically and can only be accepted by the email address you specify."
      >
        <form onSubmit={invite} className="grid gap-4 p-5 sm:grid-cols-[minmax(0,1fr)_190px_auto] sm:items-end sm:p-6">
          <label>
            <span className="text-xs font-bold uppercase tracking-[.08em] text-slate-500">Email address</span>
            <input
              required
              type="email"
              value={email}
              disabled={!canInvite || busy}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@example.com"
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 disabled:bg-slate-50"
            />
          </label>
          <label>
            <span className="text-xs font-bold uppercase tracking-[.08em] text-slate-500">Role</span>
            <select
              value={role}
              disabled={!canInvite || busy}
              onChange={(event) => setRole(event.target.value as AdminRole)}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold"
            >
              {session.role === "owner" && <option value="owner">Owner</option>}
              <option value="admin">Admin</option>
              <option value="assessor">Assessor</option>
              <option value="support">Support</option>
            </select>
          </label>
          <button
            type="submit"
            disabled={!canInvite || busy}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#173122] px-4 text-sm font-semibold text-white disabled:opacity-40"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : <MailPlus className="size-4" />}
            Send invite
          </button>
        </form>

        {message && <p className="mx-5 mb-4 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-800 sm:mx-6">{message}</p>}
        {latestLink && (
          <div className="mx-5 mb-6 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 sm:mx-6">
            <p className="text-xs font-bold uppercase tracking-[.08em] text-emerald-800">Invite link</p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input readOnly value={latestLink} className="h-10 min-w-0 flex-1 rounded-xl border border-emerald-200 bg-white px-3 text-xs text-slate-700" />
              <button type="button" onClick={() => void copyLink(latestLink)} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-800 px-3 text-xs font-semibold text-white">
                <Copy className="size-4" />
                Copy link
              </button>
            </div>
          </div>
        )}
      </Panel>

      <Panel title="Pending invitations" description="Resending rotates the invite token and extends its expiry. Revoked or expired links cannot be accepted.">
        {invites.length === 0 ? (
          <EmptyState title="No invitations yet" detail="New administrator invitations will appear here." />
        ) : (
          <div className="divide-y divide-slate-100">
            {invites.map((invite) => {
              const expired = new Date(invite.expires_at).getTime() <= Date.now();
              const inactive = Boolean(invite.revoked_at) || expired;
              return (
                <div key={invite.id} className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-900">{invite.email}</p>
                      <Badge tone={inactive ? "warning" : "success"}>{invite.revoked_at ? "revoked" : expired ? "expired" : "pending"}</Badge>
                      <Badge>{invite.role}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">Invited by {invite.invited_by_name} · expires {formatDate(invite.expires_at)}</p>
                  </div>
                  {canInvite && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const resent = await resendAdminInvite(invite.id);
                            setLatestLink(resent.inviteUrl);
                            setMessage(resent.delivery.delivered ? "Invitation resent." : "Invitation refreshed. Copy the new link below.");
                            await load();
                            setLatestLink(resent.inviteUrl);
                          } catch (reason) {
                            setMessage(reason instanceof Error ? reason.message : "Invitation could not be refreshed.");
                          }
                        }}
                        disabled={Boolean(invite.revoked_at)}
                        className="h-9 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-700 disabled:opacity-40"
                      >
                        Resend
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!window.confirm(`Revoke the invitation for ${invite.email}?`)) return;
                          try {
                            await revokeAdminInvite(invite.id);
                            setMessage("Invitation revoked.");
                            await load();
                          } catch (reason) {
                            setMessage(reason instanceof Error ? reason.message : "Invitation could not be revoked.");
                          }
                        }}
                        disabled={Boolean(invite.revoked_at)}
                        className="h-9 rounded-xl border border-rose-200 px-3 text-xs font-semibold text-rose-700 disabled:opacity-40"
                      >
                        Revoke
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Panel>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Owner", "Full administration, including owner assignment and admin removal."],
          ["Admin", "Operational administration and invitations, without owner-only changes."],
          ["Assessor", "Assessment question-bank management and Academy review access."],
          ["Support", "Learner and enrolment support without assessment or owner controls."],
        ].map(([name, detail]) => (
          <div key={name} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="font-bold text-slate-900">{name}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function EnrollmentForm({
  learners,
  currentCourseId,
  disabled,
  onSaved,
  ensureLearners,
}: {
  learners: AdminLearner[];
  currentCourseId: string;
  disabled: boolean;
  onSaved: (message: string) => Promise<void> | void;
  ensureLearners: () => Promise<AdminLearner[]>;
}) {
  const [allLearners, setAllLearners] = useState(learners);
  const [learnerId, setLearnerId] = useState(learners[0]?.core_user_id ?? "");
  const [courseId, setCourseId] = useState(currentCourseId);
  const [status, setStatus] = useState<AdminEnrollment["status"]>("active");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (learners.length) {
      setAllLearners(learners);
      if (!learnerId) setLearnerId(learners[0].core_user_id);
    }
  }, [learners, learnerId]);

  useEffect(() => setCourseId(currentCourseId), [currentCourseId]);

  useEffect(() => {
    if (allLearners.length) return;
    void ensureLearners().then((next) => {
      setAllLearners(next);
      if (next[0]) setLearnerId(next[0].core_user_id);
    });
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!learnerId || !courseId) return;
    setBusy(true);
    setError("");
    try {
      await setAdminEnrollment(learnerId, courseId, status);
      const learner = allLearners.find((item) => item.core_user_id === learnerId);
      await onSaved(`${learner?.full_name ?? "Learner"} enrolment updated.`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Enrolment could not be saved.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
      <label>
        <span className="text-xs font-bold uppercase tracking-[.08em] text-slate-500">Learner</span>
        <select value={learnerId} onChange={(event) => setLearnerId(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm">
          {allLearners.map((learner) => <option key={learner.core_user_id} value={learner.core_user_id}>{learner.full_name} {learner.email ? `· ${learner.email}` : ""}</option>)}
        </select>
      </label>
      <label>
        <span className="text-xs font-bold uppercase tracking-[.08em] text-slate-500">Course</span>
        <select value={courseId} onChange={(event) => setCourseId(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm">
          {liveCourseCatalog.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
        </select>
      </label>
      <label>
        <span className="text-xs font-bold uppercase tracking-[.08em] text-slate-500">Status</span>
        <select value={status} onChange={(event) => setStatus(event.target.value as AdminEnrollment["status"])} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm">
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="withdrawn">Withdrawn</option>
        </select>
      </label>
      <div className="flex items-end">
        <button type="submit" disabled={disabled || busy || !learnerId} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#173122] px-4 text-sm font-semibold text-white disabled:opacity-40">
          {busy ? <Loader2 className="size-4 animate-spin" /> : <UserCog className="size-4" />}
          Save enrolment
        </button>
      </div>
      {error && <p className="sm:col-span-2 lg:col-span-4 text-sm font-medium text-rose-700">{error}</p>}
    </form>
  );
}
