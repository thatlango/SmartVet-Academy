import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PathwayCardGrid } from "@/components/PathwayCardGrid";
import { liveCourseCatalog } from "@/lib/course-catalog";

export default function StudentCourses() {
  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex flex-col gap-4 rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,.04)] sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-[-.03em] text-[#173122]">
            Choose your poultry learning pathway.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Pick the production system you run. Each pathway keeps its own modules, assessment, progress, and certificate.
          </p>
        </div>
        <Link
          to="/dashboard"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white"
        >
          Back to dashboard
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="mt-6">
        <PathwayCardGrid courses={liveCourseCatalog} />
      </div>
    </div>
  );
}
