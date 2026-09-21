import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock3,
  LockKeyhole,
  PlayCircle,
  RefreshCcw,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { courseCatalog, liveCourseCatalog } from "@/lib/course-catalog";
import { useAuth } from "@/lib/auth";

const steps = [
  {
    number: "01",
    title: "Choose your pathway",
    copy: "Start with Broiler, Layer or Croiler learning based on the poultry system you actually run.",
  },
  {
    number: "02",
    title: "Learn in sequence",
    copy: "Work through focused modules with practical farm examples, visual guides and short knowledge checks.",
  },
  {
    number: "03",
    title: "Complete the assessment",
    copy: "Finish the pathway and take the final assessment when every module is complete.",
  },
  {
    number: "04",
    title: "Earn your certificate",
    copy: "Score 75% or above to receive a SmartVet Africa certificate with a public verification code.",
  },
];

const courseImages: Record<string, string> = {
  "broiler-foundations": "/course-media/chick-temperature-behaviour.jpg",
  "layers-foundations": "/course-media/records-profit-tracking.jpg",
  "croiler-production": "/course-media/market-readiness.jpg",
};

const courseLabels: Record<string, string> = {
  "broiler-foundations": "Broiler",
  "layers-foundations": "Layer",
  "croiler-production": "Croiler",
};

const learningFeatures = [
  {
    icon: RefreshCcw,
    title: "Resume where you stopped",
    copy: "Your completed modules and pathway progress are saved to your account across learning sessions.",
  },
  {
    icon: PlayCircle,
    title: "Practical module flow",
    copy: "Short, sequenced lessons keep the next action clear and reduce the need to navigate a complex course menu.",
  },
  {
    icon: BarChart3,
    title: "Visible learning progress",
    copy: "Track modules completed, hours learned, assessments and pathway completion from your student dashboard.",
  },
  {
    icon: BadgeCheck,
    title: "Verifiable certificates",
    copy: "Each completed pathway issues its own certificate and public verification code.",
  },
];

export default function Home() {
  const { user } = useAuth();

  const totalModules = liveCourseCatalog.reduce((sum, course) => sum + course.moduleCount, 0);
  const totalHours = liveCourseCatalog.reduce((sum, course) => sum + course.hours, 0);

  return (
    <div className="bg-[#f4f8f5]">
      <section className="px-4 pb-5 pt-5 sm:px-6 sm:pb-7 sm:pt-7">
        <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[30px] bg-[#218d59] text-white shadow-[0_22px_60px_rgba(11,111,60,.16)]">
          <img
            src="/smartvet-hero.webp"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-right"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,74,41,.72)_0%,rgba(7,91,49,.58)_35%,rgba(9,93,52,.16)_63%,rgba(9,93,52,0)_78%)]" />

          <div className="relative z-10 flex min-h-[520px] items-center px-6 py-10 sm:min-h-[470px] sm:px-10 lg:aspect-[3/1] lg:min-h-0 lg:px-12 lg:py-12">
            <div className="max-w-[680px] lg:max-w-[58%]">
              <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.17em] text-emerald-50 backdrop-blur-sm">
                SmartVet Africa Academy
              </p>
              <h1 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-.045em] sm:text-5xl lg:text-[56px]">
                Practical poultry skills for <span className="text-orange-300">healthier birds</span> and stronger farm businesses.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-emerald-50/95 sm:text-lg sm:leading-8">
                Learn broiler, layer and Croiler production through structured, field-ready pathways built around the decisions farmers make every day.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to={user ? "/dashboard" : "/auth"}
                  className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[#073a25] px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5"
                >
                  {user ? "Continue Learning" : "Start Learning"}
                  <span className="flex size-7 items-center justify-center rounded-full bg-white text-primary">
                    <ArrowRight className="size-4" />
                  </span>
                </Link>
                <a
                  href="#pathways"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/35 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/15"
                >
                  Explore Pathways
                </a>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-emerald-50/90">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-orange-300" />
                  Learn at your own pace
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-orange-300" />
                  Progress saved automatically
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-orange-300" />
                  Verifiable certificates
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto -mt-1 grid max-w-7xl gap-3 pt-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,.035)]">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-emerald-50 text-primary">
              <BookOpen className="size-5" />
            </span>
            <div>
              <strong className="block text-xl font-bold text-slate-950">{totalModules}</strong>
              <span className="text-xs font-medium text-slate-500">practical modules</span>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,.035)]">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
              <Clock3 className="size-5" />
            </span>
            <div>
              <strong className="block text-xl font-bold text-slate-950">{totalHours.toFixed(2)}</strong>
              <span className="text-xs font-medium text-slate-500">hours of learning</span>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,.035)]">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-emerald-50 text-primary">
              <Award className="size-5" />
            </span>
            <div>
              <strong className="block text-xl font-bold text-slate-950">{liveCourseCatalog.length}</strong>
              <span className="text-xs font-medium text-slate-500">certificate pathways</span>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,.035)]">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
              <BadgeCheck className="size-5" />
            </span>
            <div>
              <strong className="block text-xl font-bold text-slate-950">75%</strong>
              <span className="text-xs font-medium text-slate-500">certificate pass mark</span>
            </div>
          </div>
        </div>
      </section>

      <section id="pathways" className="lesson-anchor mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Learning pathways</p>
            <h2 className="mt-2 max-w-3xl text-3xl font-bold tracking-[-.035em] text-slate-950 sm:text-4xl">
              Choose the production system you actually run.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500 sm:text-base">
              Each course is a separate learning journey with its own modules, final assessment, progress record and certificate.
            </p>
          </div>
          <Link
            to={user ? "/courses" : "/auth"}
            className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 shadow-sm"
          >
            {user ? "View My Courses" : "Create an Account"}
            <ArrowRight className="size-4 text-primary" />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {liveCourseCatalog.map((course, index) => (
            <article
              key={course.id}
              className="group overflow-hidden rounded-[22px] border border-slate-200/80 bg-white shadow-[0_10px_30px_rgba(15,23,42,.045)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,.08)]"
            >
              <div className="relative h-52 overflow-hidden bg-slate-100">
                <img
                  src={courseImages[course.id]}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/55 to-transparent" />
                <span
                  className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.12em] ${
                    index === 1 ? "bg-orange-50 text-orange-700" : "bg-emerald-50 text-primary"
                  }`}
                >
                  {courseLabels[course.id]}
                </span>
                <span className="absolute bottom-4 left-4 text-xs font-bold uppercase tracking-[.1em] text-white/90">
                  {course.level} pathway
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold leading-7 tracking-[-.02em] text-slate-950">{course.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">{course.tagline}</p>

                <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 text-center">
                  <div>
                    <strong className="block text-base font-bold text-slate-900">{course.moduleCount}</strong>
                    <span className="text-[10px] text-slate-500">Modules</span>
                  </div>
                  <div>
                    <strong className="block text-base font-bold text-slate-900">{course.hours}</strong>
                    <span className="text-[10px] text-slate-500">Hours</span>
                  </div>
                  <div>
                    <strong className="block text-base font-bold text-slate-900">75%</strong>
                    <span className="text-[10px] text-slate-500">Pass mark</span>
                  </div>
                </div>

                <p className="mt-4 text-xs leading-5 text-slate-500">
                  <span className="font-bold text-slate-700">Designed for:</span> {course.audience}
                </p>

                <Link
                  to={`/course/${course.id}`}
                  className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-primary"
                >
                  View Course
                  <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="border-y border-slate-200/70 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">How learning works</p>
              <h2 className="mt-2 text-3xl font-bold tracking-[-.035em] text-slate-950 sm:text-4xl">
                From first lesson to farm practice.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
                The Academy keeps the flow simple: one clear next action, visible progress and a certificate when the pathway is complete.
              </p>

              <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
                  <p className="text-sm leading-6 text-slate-600">
                    Training targets are learning references. Where a breeder, hatchery, veterinarian or approved product guide provides a more specific instruction for your birds, follow that verified guidance.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute bottom-8 left-[22px] top-8 hidden w-px bg-slate-200 sm:block" />
              <div className="space-y-3">
                {steps.map((step) => (
                  <article key={step.number} className="relative flex gap-4 rounded-2xl border border-slate-200/80 bg-[#f8faf8] p-5 sm:gap-5">
                    <span className="relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-sm">
                      {step.number}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-slate-950">{step.title}</h3>
                      <p className="mt-1.5 text-sm leading-6 text-slate-500">{step.copy}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Built around the learner</p>
          <h2 className="mx-auto mt-2 max-w-3xl text-3xl font-bold tracking-[-.035em] text-slate-950 sm:text-4xl">
            A learning experience that keeps your next action obvious.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            SmartVet Academy is designed for practical use on the farm, at home or during facilitated training.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {learningFeatures.map(({ icon: Icon, title, copy }, index) => (
            <article key={title} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,.035)]">
              <span
                className={`flex size-11 items-center justify-center rounded-2xl ${
                  index % 2 ? "bg-orange-50 text-orange-600" : "bg-emerald-50 text-primary"
                }`}
              >
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-bold text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 pb-14 sm:px-6 sm:pb-16">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[28px] bg-[#083e28] text-white lg:grid-cols-[1.05fr_.95fr]">
          <div className="p-7 sm:p-9 lg:p-11">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-orange-300">Certificate pathway</p>
            <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-[-.035em] sm:text-4xl">
              Finish a pathway. Prove what you completed.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-emerald-50/80 sm:text-base">
              Each pathway has its own final assessment and certificate. Certificates include a unique verification code that can be checked publicly.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={user ? "/dashboard" : "/auth"}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-primary"
              >
                {user ? "Go to My Learning" : "Start Learning"}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/verify"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/25 px-4 py-2.5 text-sm font-bold text-white"
              >
                Verify a Certificate
              </Link>
            </div>
          </div>

          <div className="relative flex min-h-[290px] items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#0b6f3c,#1e9358)] p-7 sm:p-9">
            <div className="absolute -right-12 -top-16 size-64 rounded-full bg-orange-400/15 blur-2xl" />
            <div className="relative w-full max-w-md rounded-[22px] border border-white/20 bg-white p-6 text-slate-900 shadow-2xl sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.16em] text-primary">SmartVet Africa Academy</p>
                  <h3 className="mt-1 text-lg font-bold">Certificate of Completion</h3>
                </div>
                <Award className="size-9 text-orange-500" />
              </div>
              <div className="my-5 h-px bg-slate-200" />
              <p className="text-xs text-slate-500">Awarded for successfully completing an Academy learning pathway and meeting the required assessment standard.</p>
              <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3">
                <span>
                  <span className="block text-[10px] uppercase tracking-wide text-slate-400">Pass standard</span>
                  <strong className="text-sm">75% or above</strong>
                </span>
                <BadgeCheck className="size-8 text-primary" />
              </div>
              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[.12em] text-slate-400">Publicly verifiable · SmartVet Africa</p>
            </div>
          </div>
        </div>
      </section>

      {courseCatalog.some((course) => course.status === "coming-soon") && (
        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 sm:pb-16">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-400">More learning in development</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {courseCatalog.filter((course) => course.status === "coming-soon").map((course) => (
                <article key={course.id} className="flex gap-4 rounded-xl bg-slate-50 p-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500">
                    <LockKeyhole className="size-4" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-orange-600">Coming soon</p>
                    <h3 className="mt-1 text-sm font-bold text-slate-900">{course.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{course.tagline}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-slate-200/70 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Ready to begin?</p>
            <h2 className="mt-2 text-2xl font-bold tracking-[-.025em] text-slate-950 sm:text-3xl">
              Choose your pathway and start with the first lesson.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to={user ? "/dashboard" : "/auth"}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white"
            >
              {user ? "Continue Learning" : "Create Account"}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/verify"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700"
            >
              <ShieldCheck className="size-4 text-primary" />
              Verify Certificate
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
