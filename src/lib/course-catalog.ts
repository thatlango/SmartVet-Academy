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
    title: "Broiler Production & Poultry Business Foundations",
    tagline: "Nine practical modules from house design and brooding to flock health, records and profit.",
    description:
      "A field-practical SmartVet Africa certificate course for smallholder broiler farmers in Uganda, covering house design, pre-placement, feed and water management, ventilation, biosecurity, growing performance, flock health, records and poultry-business decisions.",
    level: "Foundation",
    hours: 10.5,
    audience: "Smallholder broiler farmers and trainers in Uganda",
    status: "live",
    moduleCount: 9,
  },
  {
    id: "layers-foundations",
    title: "Layer Production & Egg Business Foundations",
    tagline: "Ten practical modules from pullet development to egg quality, flock health and layer economics.",
    description:
      "A SmartVet Africa certificate pathway for smallholder and growing commercial layer farms, covering pullet development, housing, lighting, phase feeding, point of lay, egg quality, flock health, records and egg-business economics.",
    level: "Foundation",
    hours: 11.5,
    audience: "Layer farmers, pullet growers, farm staff and poultry trainers in Uganda",
    status: "live",
    moduleCount: 10,
  },
  {
    id: "croiler-production",
    title: "Croiler & Dual-Purpose Poultry Production",
    tagline: "Ten practical modules for Kuroiler, SASSO and comparable dual-purpose poultry systems.",
    description:
      "A SmartVet Africa certificate pathway for improved dual-purpose poultry, covering business-model choice, brooding, range and housing, feeding, growth, biosecurity, seasonal scavenging, females for eggs, replacement genetics and whole-flock economics.",
    level: "Foundation",
    hours: 11.25,
    audience: "Smallholder dual-purpose poultry farmers, field trainers and brooder operators in Uganda",
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
