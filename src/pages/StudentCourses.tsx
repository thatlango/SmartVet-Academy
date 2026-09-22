import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { liveCourseCatalog } from "@/lib/course-catalog";

export default function StudentCourses() {
  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex flex-col gap-4 rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,.04)] sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Pathways</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Choose your poultry learning pathway</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Broiler, Layer and Croiler learning are separated so each course follows the production decisions you actually make.
          </p>
        </div>
        <Link to="/dashboard" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white">
          Back to Dashboard
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        {liveCourseCatalog.map((course, index) => (
          <article key={course.id} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_24px_rgba(15,23,42,.04)]">
            <div className={`h-2 ${index === 1 ? "bg-orange-500" : "bg-primary"}`} />
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center justify-between gap-3">
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                  index === 1 ? "bg-orange-50 text-orange-700" : "bg-emerald-50 text-primary"
                }`}>
                  {index === 0 ? "Broiler" : index === 1 ? "Layer" : "Croiler"}
                </span>
                <span className="text-xs font-semibold text-slate-400">{course.level}</span>
              </div>

              <h2 className="mt-4 text-xl font-bold leading-7 text-slate-950">{course.title}</h2>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">{course.description}</p>

              <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 text-center">
                <div>
                  <strong className="block text-base text-slate-900">{course.moduleCount}</strong>
                  <span className="text-[10px] text-slate-500">Modules</span>
                </div>
                <div>
                  <strong className="block text-base text-slate-900">{course.hours}</strong>
                  <span className="text-[10px] text-slate-500">Hours</span>
                </div>
                <div>
                  <strong className="block text-base text-slate-900">75%</strong>
                  <span className="text-[10px] text-slate-500">Pass mark</span>
                </div>
              </div>

              <Link
                to={`/course/${course.id}`}
                className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white"
              >
                View Course
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
