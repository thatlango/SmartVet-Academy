import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Award, BadgeCheck, LockKeyhole, ShieldCheck } from "lucide-react";
import { courseCatalog, liveCourseCatalog } from "@/lib/course-catalog";
import { useAuth } from "@/lib/auth";
import { getCompletedModules } from "@/lib/learning";
import { PoultryCutout } from "@/components/PoultryCutout";
import { PathwayCardGrid } from "@/components/PathwayCardGrid";

const steps = [
  {
    number: "01",
    title: "Choose your pathway",
    copy: "Start with Broiler, Layer or Kroiler/Dual-Purpose — whichever system you run.",
  },
  {
    number: "02",
    title: "Learn in sequence",
    copy: "Work through focused modules with practical farm examples, visual guides and short knowledge checks.",
  },
  {
    number: "03",
    title: "Complete the assessment",
    copy: "Take the final assessment once every module is complete.",
  },
  {
    number: "04",
    title: "Earn your certificate",
    copy: "Score 75% or above to receive a SmartVet Africa certificate with a public verification code.",
  },
];

export default function Home() {
  const { user } = useAuth();
  const [hasCourseInProgress, setHasCourseInProgress] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!user) {
      setHasCourseInProgress(false);
      return () => {
        cancelled = true;
      };
    }

    Promise.all(
      liveCourseCatalog.map(async (course) => ({
        course,
        completed: await getCompletedModules(course.id),
      })),
    )
      .then((items) => {
        if (cancelled) return;
        setHasCourseInProgress(
          items.some(({ course, completed }) => completed.length > 0 && completed.length < course.moduleCount),
        );
      })
      .catch(() => {
        if (!cancelled) setHasCourseInProgress(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const primaryCta = hasCourseInProgress
    ? { label: "Continue Learning", to: "/dashboard" }
    : { label: "Start learning free", to: user ? "/courses" : "/auth" };

  return (
    <div className="landing-page bg-[#F7F3EA] text-slate-950">
      <section className="px-4 pb-8 pt-5 sm:px-6 sm:pt-7">
        <header className="landing-hero mx-auto max-w-7xl">
          <div className="landing-hero__copy">
            <h1 className="font-display">
              Healthier birds. Stronger farm businesses.
            </h1>
            <p className="landing-hero__subhead">
              Self-paced courses in broiler, layer and dual-purpose poultry production, built around the decisions you make on the farm every day.
            </p>

            <div className="landing-hero__actions">
              <Link to={primaryCta.to} className="landing-hero__primary">
                {primaryCta.label}
                <ArrowRight className="size-4" />
              </Link>
              <a href="#pathways" className="landing-hero__secondary">
                Explore pathways
              </a>
            </div>

            <p className="landing-hero__trust">Free to start. No credit card needed.</p>
          </div>

          <div className="landing-hero__glow" aria-hidden="true" />
          <PoultryCutout className="landing-hero__art" />
        </header>
      </section>

      <section id="pathways" className="lesson-anchor mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-[-.03em] text-[#173122] sm:text-4xl">
              Choose the production system you run.
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              Each pathway has its own modules, final assessment and certificate.
            </p>
          </div>
          <Link
            to={user ? "/courses" : "/auth"}
            className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-[#1E4430]/15 bg-white px-4 py-2.5 text-sm font-semibold text-[#1E4430] shadow-sm"
          >
            {user ? "View my courses" : "Create an account"}
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-8">
          <PathwayCardGrid courses={liveCourseCatalog} />
        </div>

      </section>

      <section id="how-it-works" className="border-y border-[#1E4430]/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
          <h2 className="font-display text-3xl font-semibold tracking-[-.03em] text-[#173122] sm:text-4xl">
            How learning works.
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            One clear next step at a time, visible progress, and a certificate when you finish.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step) => (
              <article key={step.number} className="rounded-2xl border border-[#1E4430]/10 bg-[#F8F6EF] p-5">
                <span className="flex size-10 items-center justify-center rounded-full bg-[#1E4430] text-xs font-semibold text-[#F7F3EA]">
                  {step.number}
                </span>
                <h3 className="mt-4 text-base font-semibold text-[#173122]">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.copy}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#E8EFE8] p-5">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#1E4430]" />
            <p className="text-sm leading-6 text-slate-600">
              These are general learning targets, not medical advice. Where your breeder, hatchery, vet or a product label gives more specific guidance for your birds, follow that instead.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.08fr_.92fr]">
          <article className="overflow-hidden rounded-[26px] border border-[#1E4430]/10 bg-white shadow-[0_12px_32px_rgba(30,68,48,.06)]">
            <div className="grid h-full md:grid-cols-[1fr_.86fr]">
              <div className="p-6 sm:p-8">
                <h2 className="font-display text-3xl font-semibold tracking-[-.03em] text-[#173122]">
                  Earn a trusted certificate.
                </h2>
                <p className="mt-3 text-base leading-7 text-slate-600">
                  Each pathway ends in an assessment and a certificate — with a verification code anyone can check.
                </p>

                <div className="mt-6 space-y-3 text-sm text-slate-600">
                  <p className="flex items-center gap-2"><BadgeCheck className="size-4 text-[#1E4430]" /> Complete all modules</p>
                  <p className="flex items-center gap-2"><BadgeCheck className="size-4 text-[#1E4430]" /> Pass the final assessment at 75% or above</p>
                  <p className="flex items-center gap-2"><BadgeCheck className="size-4 text-[#1E4430]" /> Receive a unique verification code</p>
                </div>

                <Link
                  to="/verify"
                  className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#1E4430] px-4 py-2.5 text-sm font-semibold text-[#F7F3EA]"
                >
                  Verify a certificate
                  <ArrowRight className="size-4" />
                </Link>
              </div>

              <div className="flex items-center bg-[#E8EFE8] p-6 sm:p-8">
                <div className="w-full rounded-[20px] border border-[#1E4430]/15 bg-white p-5 shadow-xl">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[#1E4430]">SmartVet Africa Academy</p>
                      <h3 className="font-display mt-1 text-xl font-semibold text-[#173122]">Certificate of Completion</h3>
                    </div>
                    <Award className="size-9 text-[#F2A25C]" />
                  </div>
                  <div className="my-5 h-px bg-[#1E4430]/10" />
                  <p className="text-sm leading-6 text-slate-600">
                    Awarded after completing a learning pathway and meeting the required assessment standard.
                  </p>
                  <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-[#F8F6EF] p-3">
                    <span>
                      <span className="block text-xs text-slate-500">Pass standard</span>
                      <strong className="text-sm text-[#173122]">75% or above</strong>
                    </span>
                    <BadgeCheck className="size-8 text-[#1E4430]" />
                  </div>
                  <p className="mt-4 text-xs font-medium text-slate-500">Publicly verifiable</p>
                </div>
              </div>
            </div>
          </article>

          {courseCatalog.some((course) => course.status === "coming-soon") && (
            <article className="rounded-[26px] border border-[#1E4430]/10 bg-[#E8EFE8] p-6 sm:p-8">
              <h2 className="font-display text-3xl font-semibold tracking-[-.03em] text-[#173122]">
                Advanced learning coming soon.
              </h2>

              {courseCatalog.filter((course) => course.status === "coming-soon").map((course) => (
                <div key={course.id} className="mt-6 rounded-2xl bg-white p-5">
                  <div className="flex gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#F8F6EF] text-[#1E4430]">
                      <LockKeyhole className="size-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-semibold leading-7 text-[#173122]">
                        Advanced SmartVet Flock Health (coming soon)
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Biosecurity, vaccination planning and disease investigation.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </article>
          )}
        </div>
      </section>

      <section className="bg-[#1E4430] px-4 py-9 text-[#F7F3EA] sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              Ready to build a stronger poultry business?
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#C9D8C8]">
              Practical poultry learning, built to help farmers and field teams make better production decisions.
            </p>
          </div>
          <Link
            to={primaryCta.to}
            className="inline-flex min-h-12 w-fit items-center gap-2 rounded-xl bg-[#F2A25C] px-5 py-3 text-sm font-semibold text-[#173122] transition hover:bg-[#D98A44]"
          >
            {primaryCta.label}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
