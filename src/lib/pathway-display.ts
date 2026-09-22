import type { CourseCatalogEntry } from "@/lib/course-catalog";

export type PathwayDisplay = {
  title: string;
  description: string;
  audience: string;
  image: string;
  imageAlt: string;
  href: string;
};

const PATHWAY_DISPLAY: Record<string, PathwayDisplay> = {
  "broiler-foundations": {
    title: "Broiler Production",
    description:
      "From house design and brooding to flock health, records, and profit — everything a broiler enterprise needs to run well.",
    audience: "Smallholder broiler farmers and trainers in Uganda",
    image: "/pathways/broiler-production.webp",
    imageAlt: "Broiler Production pathway artwork showing a chick against a poultry-house backdrop",
    href: "/course/broiler-foundations",
  },
  "layers-foundations": {
    title: "Layer Production",
    description:
      "From pullet development to egg quality, flock health, and layer economics — the full production cycle in one course.",
    audience: "Layer farmers, pullet growers, farm staff, and poultry trainers in Uganda",
    image: "/pathways/layer-production.webp",
    imageAlt: "Layer Production pathway artwork showing a laying hen and eggs",
    href: "/course/layers-foundations",
  },
  "croiler-production": {
    title: "Kroiler & Dual-Purpose",
    description:
      "From brooding to market weight — built for Kuroiler, SASSO, and other dual-purpose poultry systems.",
    audience: "Smallholder dual-purpose poultry farmers, field trainers, and brooder operators in Uganda",
    image: "/pathways/kroiler-dual-purpose.webp",
    imageAlt: "Kroiler and dual-purpose pathway artwork showing a brown chicken among a flock",
    href: "/course/kroilers-foundations",
  },
};

export function getPathwayDisplay(course: CourseCatalogEntry): PathwayDisplay {
  return PATHWAY_DISPLAY[course.id] ?? {
    title: course.title,
    description: course.description,
    audience: course.audience,
    image: "/course-media/market-readiness.jpg",
    imageAlt: "",
    href: `/course/${course.id}`,
  };
}
