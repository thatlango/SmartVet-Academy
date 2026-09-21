import { lazy, Suspense, useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Loader2, LogOut, Menu, X } from "lucide-react";
import { SmartVetLogo } from "@/components/SmartVetLogo";
import { useAuth } from "@/lib/auth";

const Home = lazy(() => import("@/pages/Home"));
const AuthPage = lazy(() => import("@/pages/Auth"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const CourseOverview = lazy(() => import("@/pages/CourseOverview"));
const ModulePage = lazy(() => import("@/pages/Module"));
const QuizPage = lazy(() => import("@/pages/Quiz"));
const CertificatePage = lazy(() => import("@/pages/Certificate"));
const VerifyPage = lazy(() => import("@/pages/Verify"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const LIVE_COURSE_ID = "broiler-foundations";

function PageLoader() {
  return (
    <div className="flex min-h-[45vh] items-center justify-center" role="status" aria-label="Loading page">
      <Loader2 className="size-6 animate-spin text-primary" />
    </div>
  );
}

function Layout() {
  const { user, loading, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setMobileOpen(false), [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" aria-label="SmartVet Africa Academy home" className="shrink-0">
            <SmartVetLogo className="h-11 w-auto sm:h-12" />
          </Link>

          <nav aria-label="Primary navigation" className="hidden items-center gap-1 text-sm font-semibold sm:flex">
            <Link className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground" to="/">
              Courses
            </Link>
            <Link className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground" to="/verify">
              Verify certificate
            </Link>
            {!loading && user ? (
              <>
                <Link className="ml-2 rounded-lg border border-border bg-card px-3 py-2" to="/dashboard">
                  My learning
                </Link>
                <button
                  type="button"
                  onClick={() => void signOut()}
                  aria-label="Sign out"
                  className="inline-flex size-11 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <LogOut className="size-4" />
                </button>
              </>
            ) : !loading ? (
              <Link className="ml-2 rounded-lg bg-primary px-4 py-2.5 text-primary-foreground" to="/auth">
                Sign in
              </Link>
            ) : (
              <span className="ml-2 h-10 w-20 animate-pulse rounded-lg bg-muted" />
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
          <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-border bg-card px-4 py-3 sm:hidden">
            <div className="mx-auto grid max-w-7xl gap-2">
              <Link className="min-h-11 rounded-xl px-3 py-2.5 font-semibold hover:bg-muted" to="/">
                Courses
              </Link>
              <Link className="min-h-11 rounded-xl px-3 py-2.5 font-semibold hover:bg-muted" to="/verify">
                Verify certificate
              </Link>
              {!loading && user ? (
                <>
                  <Link className="min-h-11 rounded-xl bg-primary px-3 py-2.5 font-semibold text-primary-foreground" to="/dashboard">
                    My learning
                  </Link>
                  <button
                    type="button"
                    onClick={() => void signOut()}
                    className="flex min-h-11 items-center gap-2 rounded-xl px-3 py-2.5 text-left font-semibold text-muted-foreground hover:bg-muted"
                  >
                    <LogOut className="size-4" />
                    Sign out
                  </button>
                </>
              ) : !loading ? (
                <Link className="min-h-11 rounded-xl bg-primary px-3 py-2.5 font-semibold text-primary-foreground" to="/auth">
                  Sign in
                </Link>
              ) : null}
            </div>
          </nav>
        )}
      </header>

      <main id="main-content" tabIndex={-1} className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/course/:courseId" element={<CourseOverview />} />
            <Route path="/course/:courseId/module/:moduleId" element={<ModulePage />} />
            <Route path="/course/:courseId/quiz" element={<QuizPage />} />
            <Route path="/course/:courseId/certificate" element={<CertificatePage />} />
            <Route path="/quiz" element={<Navigate to={`/course/${LIVE_COURSE_ID}/quiz`} replace />} />
            <Route path="/certificate" element={<Navigate to={`/course/${LIVE_COURSE_ID}/certificate`} replace />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 SmartVet Africa Academy · Smart Vet Africa</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link className="font-medium hover:text-primary" to="/">
              Courses
            </Link>
            <Link className="font-medium text-primary" to="/verify">
              Verify a certificate
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return <Layout />;
}
