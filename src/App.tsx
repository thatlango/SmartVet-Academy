import { lazy, Suspense, useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Loader2, LogOut, Menu, X } from "lucide-react";
import { SmartVetLogo } from "@/components/SmartVetLogo";
import { StudentShell } from "@/components/StudentShell";
import { useAuth } from "@/lib/auth";

const Home = lazy(() => import("@/pages/Home"));
const StudentCourses = lazy(() => import("@/pages/StudentCourses"));
const AuthPage = lazy(() => import("@/pages/Auth"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const CourseOverview = lazy(() => import("@/pages/CourseOverview"));
const ModulePage = lazy(() => import("@/pages/Module"));
const QuizPage = lazy(() => import("@/pages/Quiz"));
const CertificatePage = lazy(() => import("@/pages/Certificate"));
const VerifyPage = lazy(() => import("@/pages/Verify"));
const AdminPage = lazy(() => import("@/pages/Admin"));
const AdminInvitePage = lazy(() => import("@/pages/AdminInvite"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const LIVE_COURSE_ID = "broiler-foundations";

function PageLoader() {
  return (
    <div className="flex min-h-[45vh] items-center justify-center" role="status" aria-label="Loading page">
      <Loader2 className="size-6 animate-spin text-primary" />
    </div>
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<StudentCourses />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course/kroilers-foundations" element={<Navigate to="/course/croiler-production" replace />} />
        <Route path="/course/:courseId" element={<CourseOverview />} />
        <Route path="/course/:courseId/module/:moduleId" element={<ModulePage />} />
        <Route path="/course/:courseId/quiz" element={<QuizPage />} />
        <Route path="/course/:courseId/certificate" element={<CertificatePage />} />
        <Route path="/quiz" element={<Navigate to={`/course/${LIVE_COURSE_ID}/quiz`} replace />} />
        <Route path="/certificate" element={<Navigate to={`/course/${LIVE_COURSE_ID}/certificate`} replace />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/invite/:token" element={<AdminInvitePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

function Layout() {
  const { user, loading, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const adminRoute = location.pathname === "/admin" || location.pathname.startsWith("/admin/");
  const studentRoute = Boolean(user) && (
    location.pathname === "/dashboard" ||
    location.pathname === "/courses" ||
    location.pathname.startsWith("/course/") ||
    location.pathname === "/quiz" ||
    location.pathname === "/certificate"
  );

  if (adminRoute) {
    return <AppRoutes />;
  }

  if (!loading && studentRoute) {
    return (
      <StudentShell>
        <AppRoutes />
      </StudentShell>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" aria-label="SmartVet Africa Academy home" className="shrink-0">
            <SmartVetLogo className="h-11 w-auto sm:h-12" />
          </Link>

          <nav aria-label="Primary navigation" className="hidden items-center gap-1 text-sm font-semibold sm:flex">
            <a className="rounded-xl px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-950" href="/#pathways">
              Pathways
            </a>
            <a className="rounded-xl px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-950" href="/#how-it-works">
              How it works
            </a>
            <Link className="rounded-xl px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-950" to="/verify">
              Verify certificate
            </Link>
            {!loading && user ? (
              <>
                <Link className="ml-2 rounded-xl bg-primary px-4 py-2.5 font-bold text-white shadow-sm" to="/dashboard">
                  My learning
                </Link>
                <button
                  type="button"
                  onClick={() => void signOut()}
                  aria-label="Sign out"
                  className="inline-flex size-11 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                >
                  <LogOut className="size-4" />
                </button>
              </>
            ) : !loading ? (
              <Link className="ml-2 rounded-xl bg-primary px-4 py-2.5 font-bold text-white shadow-sm" to="/auth">
                Start learning
              </Link>
            ) : (
              <span className="ml-2 h-10 w-24 animate-pulse rounded-xl bg-slate-100" />
            )}
          </nav>

          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-xl border border-border bg-card sm:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {mobileOpen && (
          <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-slate-200 bg-white px-4 py-3 sm:hidden">
            <div className="mx-auto grid max-w-7xl gap-2">
              <a className="min-h-11 rounded-xl px-3 py-2.5 font-semibold text-slate-700 hover:bg-slate-50" href="/#pathways">
                Pathways
              </a>
              <a className="min-h-11 rounded-xl px-3 py-2.5 font-semibold text-slate-700 hover:bg-slate-50" href="/#how-it-works">
                How it works
              </a>
              <Link className="min-h-11 rounded-xl px-3 py-2.5 font-semibold text-slate-700 hover:bg-slate-50" to="/verify">
                Verify certificate
              </Link>
              {!loading && user ? (
                <>
                  <Link className="min-h-11 rounded-xl bg-primary px-3 py-2.5 font-bold text-white" to="/dashboard">
                    My learning
                  </Link>
                  <button
                    type="button"
                    onClick={() => void signOut()}
                    className="flex min-h-11 items-center gap-2 rounded-xl px-3 py-2.5 text-left font-semibold text-slate-500 hover:bg-slate-50"
                  >
                    <LogOut className="size-4" />
                    Sign out
                  </button>
                </>
              ) : !loading ? (
                <Link className="min-h-11 rounded-xl bg-primary px-3 py-2.5 font-bold text-white" to="/auth">
                  Start learning
                </Link>
              ) : null}
            </div>
          </nav>
        )}
      </header>

      <main id="main-content" tabIndex={-1} className="flex-1">
        <AppRoutes />
      </main>

      <footer className="border-t border-slate-200 bg-[#083e28] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <SmartVetLogo className="h-12 w-auto brightness-0 invert" />
            <p className="mt-4 max-w-xl text-sm leading-6 text-emerald-50/70">
              Practical poultry learning, built to help farmers and field teams make better production decisions.
            </p>
            <p className="mt-5 text-xs text-emerald-50/55">© 2026 SmartVet Africa Academy</p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-emerald-50/80 md:justify-end">
            <a className="hover:text-white" href="/#pathways">Pathways</a>
            <a className="hover:text-white" href="/#how-it-works">How it works</a>
            <Link className="hover:text-white" to="/verify">Verify certificate</Link>
            {!loading && <Link className="text-orange-300 hover:text-orange-200" to={user ? "/dashboard" : "/auth"}>{user ? "My learning" : "Start learning"}</Link>}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return <Layout />;
}
