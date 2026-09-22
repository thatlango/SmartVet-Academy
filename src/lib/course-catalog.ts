export type CourseCatalogEntry = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  level: string;
  hours: number;
  audience: string;
  status: "live" | "coming-soon";
  moduleCount: number;
};

export const liveCourseCatalog: CourseCatalogEntry[] = [
  {
    id: "broiler-foundations",
    title: "Broiler Production",
    tagline: "From house design and brooding to flock health, records, and profit — everything a broiler enterprise needs to run well.",
    description:
      "From house design and brooding to flock health, records, and profit — everything a broiler enterprise needs to run well.",
    level: "Foundation",
    hours: 10.5,
    audience: "Smallholder broiler farmers and trainers in Uganda",
    status: "live",
    moduleCount: 9,
  },
  {
    id: "layers-foundations",
    title: "Layer Production",
    tagline: "From pullet development to egg quality, flock health, and layer economics — the full production cycle in one course.",
    description:
      "From pullet development to egg quality, flock health, and layer economics — the full production cycle in one course.",
    level: "Foundation",
    hours: 11.5,
    audience: "Layer farmers, pullet growers, farm staff, and poultry trainers in Uganda",
    status: "live",
    moduleCount: 10,
  },
  {
    id: "croiler-production",
    title: "Kroiler & Dual-Purpose",
    tagline: "From brooding to market weight — built for Kuroiler, SASSO, and other dual-purpose poultry systems.",
    description:
      "From brooding to market weight — built for Kuroiler, SASSO, and other dual-purpose poultry systems.",
    level: "Foundation",
    hours: 11.25,
    audience: "Smallholder dual-purpose poultry farmers, field trainers, and brooder operators in Uganda",
    status: "live",
    moduleCount: 10,
  },
];

export const courseCatalog: CourseCatalogEntry[] = [
  ...liveCourseCatalog,
  {
    id: "smartvet-advanced",
    title: "Advanced SmartVet Flock Health",
    tagline: "Coming soon — biosecurity, vaccination planning and disease investigation.",
    description: "Advanced flock-health learning for farmers and field teams.",
    level: "Advanced",
    hours: 0,
    audience: "Poultry farmers and field teams",
    status: "coming-soon",
    moduleCount: 0,
  },
];
