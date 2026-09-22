const CERTIFICATE_TEMPLATES: Record<string, string> = {
  "broiler-foundations": "/certificates/broiler-production.webp",
  "layers-foundations": "/certificates/layer-production.webp",
  "croiler-production": "/certificates/kroiler-dual-purpose.webp",
};

export function getCertificateTemplate(courseId: string): string {
  return CERTIFICATE_TEMPLATES[courseId] ?? CERTIFICATE_TEMPLATES["broiler-foundations"];
}
