import { useMemo, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Award,
  BadgeCheck,
  Bell,
  BookOpen,
  ChevronRight,
  ClipboardCheck,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  PlaySquare,
  Search,
  Settings,
  ShieldCheck,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { liveCourses } from "@/lib/courses";

type Props = { children: ReactNode };

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Pathways", to: "/courses", icon: BookOpen },
  { label: "Lessons", to: "/dashboard#lessons", icon: PlaySquare },
  { label: "Assessments", to: "/dashboard#assessments", icon: ClipboardCheck },
  { label: "Certificates", to: "/dashboard#certificates", icon: Award },
];

export function StudentShell({ children }: Props) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const nav = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (normalized.length < 2) return [];

    return liveCourses
      .flatMap((course) => [
        {
          title: course.title,
          meta: `${course.modules.length} modules. ${course.hours} hours`,
          to: `/course/${course.id}`,
        },
        ...course.modules.map((module) => ({
          title: module.title,
          meta: `${course.title}. ${module.durationMinutes} min`,
          to: `/course/${course.id}/module/${module.id}`,
        })),
      ])
      .filter((item) => (item.title + " " + item.meta).toLowerCase().includes(normalized))
      .slice(0, 6);
  }, [query]);

  const displayName = user?.displayName || user?.email?.split("@")[0] || "Learner";
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  function isActive(to: string) {
    if (to === "/dashboard") return location.pathname === "/dashboard";
    if (to === "/courses") return location.pathname === "/courses" || /^\/course\/[^/]+$/.test(location.pathname);
    if (to.includes("#lessons")) return location.pathname.includes("/module/");
    if (to.includes("#assessments")) return location.pathname.endsWith("/quiz");
    if (to.includes("#certificates")) return location.pathname.endsWith("/certificate");
    return false;
  }

  async function logout() {
    await signOut();
    nav("/", { replace: true });
  }

  const sidebar = (
    <aside className="flex h-full flex-col bg-white px-4 py-5">
      <Link to="/" className="flex min-h-14 items-center gap-3 px-2" aria-label="SmartVet Academy home">
        <img src="/smartvet-mark-full.png" alt="" className="size-12 object-contain" />
        <span className="text-xl font-black leading-5 tracking-[-.03em] text-slate-950">
          SmartVet<br /><span className="text-primary">Academy</span>
        </span>
      </Link>

      <div className="mt-8">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-[.12em] text-slate-400">Learning</p>
        <nav className="mt-3 space-y-1" aria-label="Learning navigation">
          {navItems.map(({ label, to, icon: Icon }) => {
            const active = isActive(to);
            return (
              <Link
                key={label}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition ${
                  active
                    ? "bg-emerald-50 text-primary"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <Icon className="size-[18px]" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-7 border-t border-slate-100 pt-6">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-[.12em] text-slate-400">Resources</p>
        <nav className="mt-3 space-y-1" aria-label="Resources">
          <Link
            to="/verify"
            onClick={() => setMobileOpen(false)}
            className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950"
          >
            <BadgeCheck className="size-[18px]" />
            Verify Certificate
          </Link>
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950"
          >
            <ShieldCheck className="size-[18px]" />
            Course Catalogue
          </Link>
        </nav>
      </div>

      <div className="mt-auto">
        <div className="mb-5 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-orange-50 p-4">
          <img src="/smartvet-mark-full.png" alt="" className="mx-auto h-20 w-20 object-contain" />
          <p className="mt-2 text-center text-sm font-bold leading-5 text-slate-900">Healthier Poultry<br />Brighter Tomorrows</p>
          <p className="mt-2 text-center text-[11px] font-semibold text-primary">Learn. Apply. Grow</p>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-[.12em] text-slate-400">Account</p>
          <button
            type="button"
            disabled
            title="Learner settings are coming next"
            className="mt-2 flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold text-slate-400"
          >
            <Settings className="size-[18px]" />
            Settings
            <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[10px] uppercase">Soon</span>
          </button>
          <button
            type="button"
            onClick={() => void logout()}
            className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold text-orange-600 hover:bg-orange-50"
          >
            <LogOut className="size-[18px]" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#f4f8f5] text-slate-950">
      <a
        href="#student-main"
        className="sr-only z-[70] rounded-lg bg-primary px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>

      <div className="mx-auto min-h-screen max-w-[1600px] lg:grid lg:grid-cols-[238px_minmax(0,1fr)]">
        <div className="hidden border-r border-slate-200/70 lg:block">{sidebar}</div>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Close navigation"
              className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative h-full w-[286px] max-w-[88vw] shadow-2xl">
              <button
                type="button"
                aria-label="Close navigation"
                className="absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-full bg-white shadow-sm"
                onClick={() => setMobileOpen(false)}
              >
                <X className="size-5" />
              </button>
              {sidebar}
            </div>
          </div>
        )}

        <div className="min-w-0">
          <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-[#f4f8f5]/95 px-4 py-3 backdrop-blur sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation"
              >
                <Menu className="size-5" />
              </button>

              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search for courses, lessons, or topics..."
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-emerald-300"
                  aria-label="Search courses and lessons"
                />
                {searchResults.length > 0 && (
                  <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                    {searchResults.map((result) => (
                      <Link
                        key={result.to}
                        to={result.to}
                        onClick={() => setQuery("")}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-slate-50"
                      >
                        <Search className="size-4 shrink-0 text-primary" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold">{result.title}</span>
                          <span className="mt-0.5 block truncate text-xs text-slate-500">{result.meta}</span>
                        </span>
                        <ChevronRight className="size-4 shrink-0 text-slate-400" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                disabled
                title="Messages are coming soon"
                className="hidden size-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 sm:flex"
              >
                <Mail className="size-4" />
              </button>
              <button
                type="button"
                disabled
                title="Notifications are coming soon"
                className="relative hidden size-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 sm:flex"
              >
                <Bell className="size-4" />
                <span className="absolute right-2 top-2 size-2 rounded-full bg-orange-500" />
              </button>

              <div className="hidden h-8 w-px bg-slate-200 sm:block" />

              <div className="flex shrink-0 items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-primary">
                  {initials || "SV"}
                </div>
                <div className="hidden min-w-0 sm:block">
                  <p className="max-w-36 truncate text-sm font-bold text-slate-900">{displayName}</p>
                  <p className="text-xs text-slate-500">Student</p>
                </div>
              </div>
            </div>
          </header>

          <main id="student-main" tabIndex={-1} className="min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
