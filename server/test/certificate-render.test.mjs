import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

process.env.CERTIFICATE_ASSET_DIR = path.resolve(process.cwd(), "assets/certificates");
const { renderCertificatePdf } = await import("../src/certificate.mjs");

for (const courseId of ["broiler-foundations", "layers-foundations", "croiler-production"]) {
  test(`renders a valid PDF for ${courseId}`, async () => {
    const pdf = await renderCertificatePdf({
      name: "Certificate Test Learner",
      courseId,
      code: "SVA-0123456789",
      issuedAt: "2026-09-26T00:00:00.000Z",
    });
    assert.equal(pdf.subarray(0, 4).toString(), "%PDF");
    assert.ok(pdf.length > 50_000, `rendered PDF unexpectedly small: ${pdf.length}`);
  });
}
