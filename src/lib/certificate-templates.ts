const CERTIFICATE_TEMPLATES: Record<string, string> = {
  "broiler-foundations": "/certificates/layer-production.webp?v=20260922-broiler-repair",
  "layers-foundations": "/certificates/layer-production.webp?v=20260922-broiler-repair",
  "croiler-production": "/certificates/kroiler-dual-purpose.webp?v=20260922-broiler-repair",
};

export function getCertificateTemplate(courseId: string): string {
  return CERTIFICATE_TEMPLATES[courseId] ?? CERTIFICATE_TEMPLATES["broiler-foundations"];
}
