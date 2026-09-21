import { Link } from "react-router-dom";
import { ArrowRight, Award, BookOpen, CheckCircle2, Clock3, LockKeyhole } from "lucide-react";
import { catalog, liveCourses } from "@/lib/courses";
import { useAuth } from "@/lib/auth";

const steps = [
  ["Choose a pathway", "Pick Broiler, Layer or Croiler/dual-purpose learning based on the flock you manage."],
  ["Learn in sequence", "Work through focused modules with practical farm examples, visual guides and short activities."],
  ["Check understanding", "Use a knowledge check in every module, then complete the final pathway assessment."],
  ["Earn a certificate", "Pass at 75% or above to receive a verifiable SmartVet Africa certificate."],
];

export default function Home() {
  const { user } = useAuth();
  const totalModules = liveCourses.reduce((sum, course) => sum + course.modules.length, 0);

  return (
    <div>
      <section className="border-b border-border bg-gradient-to-b from-accent/55 to-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.15fr_.85fr] md:items-center md:py-20">
          <div>
            <p className="inline-flex rounded-full bg-accent px-3 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-primary">
              Practical poultry learning
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-.04em] sm:text-5xl lg:text-6xl">
              Learn the production system you actually run.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Separate learning pathways for broilers, layers and Croiler/dual-purpose flocks—built around practical production decisions, farm records and business performance.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={user ? "/dashboard" : "/auth"}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground"
              >
                {user ? "Continue learning" : "Start learning"}
                <ArrowRight className="size-4" />
              </Link>
              <a
                href="#pathways"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 font-semibold"
              >
                Explore pathways
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-xl sm:p-7">
            <img src="/smartvet-chicken.png" alt="" className="mx-auto h-32 w-32 object-contain sm:h-36 sm:w-36" />
            <div className="mt-5 grid grid-cols-3 gap-2 text-center sm:gap-3">
              <div className="rounded-xl bg-background p-3">
                <strong className="block text-2xl text-primary">{totalModules}</strong>
                <span className="text-xs text-muted-foreground">modules</span>
              </div>
              <div className="rounded-xl bg-background p-3">
                <strong className="block text-2xl text-primary">75%</strong>
                <span className="text-xs text-muted-foreground">pass mark</span>
              </div>
              <div className="rounded-xl bg-background p-3">
                <strong className="block text-2xl text-primary">{liveCourses.length}</strong>
                <span className="text-xs text-muted-foreground">pathways</span>
              </div>
            </div>
            <div className="mt-4 flex items-start gap-3 rounded-xl bg-primary/5 p-4 text-sm leading-6 text-muted-foreground">
              <Award className="mt-0.5 size-5 shrink-0 text-primary" />
              <p>Progress is saved to your account and every completed pathway earns its own verifiable certificate.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="pathways" className="lesson-anchor mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <p className="text-sm font-bold uppercase tracking-[.14em] text-primary">Learning pathways</p>
        <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold">Choose by production system</h2>
            <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
              Each pathway has its own production logic, assessment and certificate. Breed-specific targets should always be checked against the hatchery or breeder guide for the birds on your farm.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {liveCourses.map((course) => (
            <article key={course.id} className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md">
              <div className="flex items-center justify-between gap-3">
                <span className="w-fit rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                  {course.level}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">Live</span>
              </div>
              <h3 className="mt-4 text-2xl font-semibold">{course.title}</h3>
              <p className="mt-2 leading-7 text-muted-foreground">{course.description}</p>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                <span className="font-semibold text-foreground">For:</span> {course.audience}
              </p>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-5 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><BookOpen className="size-4" />{course.modules.length} modules</span>
                <span className="inline-flex items-center gap-1.5"><Clock3 className="size-4" />{course.hours} hours</span>
                <span className="inline-flex items-center gap-1.5"><Award className="size-4" />Certificate</span>
              </div>
              <Link
                to={`/course/${course.id}`}
                className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-primary"
              >
                View pathway
                <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </Link>
            </article>
          ))}
        </div>

        {catalog.some((course) => course.status === "coming-soon") && (
          <div className="mt-10">
            <h3 className="text-lg font-semibold">More learning in development</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {catalog.filter((course) => course.status === "coming-soon").map((course) => (
                <article key={course.id} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                      <LockKeyhole className="size-4" />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Coming soon</p>
                      <h4 className="mt-1 font-semibold">{course.title}</h4>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{course.tagline}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <p className="text-sm font-bold uppercase tracking-[.14em] text-primary">How learning works</p>
          <h2 className="mt-2 text-3xl font-semibold">A clear path from lesson to farm practice</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {steps.map(([title, copy], index) => (
              <div key={title} className="rounded-2xl border border-border bg-background p-5">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
            <p className="text-sm leading-6 text-muted-foreground">
              Academy targets are training references. Where a breeder, hatchery, veterinarian or approved product guide gives a more specific instruction for your birds, follow that verified guidance.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
