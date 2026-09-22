import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, BookOpen, Clock3 } from "lucide-react";
import type { CourseCatalogEntry } from "@/lib/course-catalog";
import { getPathwayDisplay } from "@/lib/pathway-display";

type PathwayCardGridProps = {
  courses: CourseCatalogEntry[];
};

export function PathwayCardGrid({ courses }: PathwayCardGridProps) {
  return (
    <div className="grid items-stretch gap-6 lg:grid-cols-3">
      {courses.map((course) => {
        const display = getPathwayDisplay(course);

        return (
          <article
            key={course.id}
            className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[#1E4430]/10 bg-white shadow-[0_12px_32px_rgba(30,68,48,.07)] transition hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(30,68,48,.12)]"
          >
            <div className="aspect-[16/9] w-full shrink-0 overflow-hidden bg-[#F1EFE6]">
              <img
                src={display.image}
                alt={display.imageAlt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="flex flex-1 flex-col p-6">
              <div className="lg:min-h-[68px]">
                <h3 className="font-display text-[1.55rem] font-semibold leading-[1.16] tracking-[-.02em] text-[#173122]">
                  {display.title}
                </h3>
              </div>

              <div className="mt-3 lg:min-h-[104px]">
                <p className="text-[15px] leading-7 text-slate-600">
                  {display.description}
                </p>
              </div>

              <div className="mt-4 lg:min-h-[76px]">
                <p className="text-[14px] leading-6 text-slate-600">
                  <span className="font-semibold text-[#173122]">Designed for:</span>{" "}
                  {display.audience}
                </p>
              </div>

              <div className="mt-auto border-t border-[#1E4430]/10 pt-5">
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex items-start gap-2.5">
                    <BookOpen className="mt-0.5 size-5 shrink-0 text-[#1E4430]" />
                    <span>
                      <strong className="block text-[17px] font-semibold leading-none text-[#173122]">
                        {course.moduleCount}
                      </strong>
                      <span className="mt-2 block text-[11px] text-slate-500">Modules</span>
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Clock3 className="mt-0.5 size-5 shrink-0 text-[#1E4430]" />
                    <span>
                      <strong className="block text-[17px] font-semibold leading-none text-[#173122]">
                        {course.hours}
                      </strong>
                      <span className="mt-2 block text-[11px] text-slate-500">Hours</span>
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <BadgeCheck className="mt-0.5 size-5 shrink-0 text-[#1E4430]" />
                    <span>
                      <strong className="block text-[17px] font-semibold leading-none text-[#173122]">
                        75%
                      </strong>
                      <span className="mt-2 block text-[11px] text-slate-500">Pass mark</span>
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to={display.href}
                className="mt-6 inline-flex min-h-[54px] w-full items-center justify-center gap-3 rounded-[16px] bg-[#1E4430] px-5 py-3 text-[15px] font-semibold text-[#F7F3EA] transition hover:bg-[#2F6B49]"
              >
                View course
                <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
