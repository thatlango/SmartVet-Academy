import { jsPDF } from "jspdf";

interface CertificateData {
  name: string;
  courseTitle: string;
  hours: number;
  date: string;
  code: string;
}

const SMARTVET_MARK_PNG = "data:image/png;base64,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";
const SIGNATORY_NAME = "Obuku Richard";
const SIGNATORY_TITLE = "Chief Executive Officer, SmartVet Africa";

export function buildCertificatePdf(data: CertificateData): jsPDF {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const w = 297;
  const h = 210;
  const cx = w / 2;

  const paper: [number, number, number] = [247, 248, 244];
  const ink: [number, number, number] = [23, 32, 25];
  const green: [number, number, number] = [11, 111, 60];
  const gold: [number, number, number] = [229, 192, 32];
  const muted: [number, number, number] = [101, 112, 104];

  doc.setFillColor(...paper);
  doc.rect(0, 0, w, h, "F");

  // Quiet central medallion keeps the page dimensional without relying on PDF transparency.
  doc.setFillColor(243, 247, 242);
  doc.setDrawColor(229, 235, 227);
  doc.setLineWidth(0.3);
  doc.circle(cx, 107, 34, "FD");
  doc.setDrawColor(236, 222, 157);
  doc.circle(cx, 107, 29, "S");

  doc.setDrawColor(...green);
  doc.setLineWidth(1.6);
  doc.rect(10, 10, w - 20, h - 20);
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.4);
  doc.rect(14, 14, w - 28, h - 28);

  // Prominent SmartVet Africa brand lockup.
  const brandX = cx - 58;
  doc.addImage(SMARTVET_MARK_PNG, "PNG", brandX, 17, 24, 24);
  doc.setTextColor(...green);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("SmartVet", brandX + 29, 29.5);
  doc.setFontSize(8.5);
  doc.text("AFRICA", brandX + 29.5, 37.5);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.8);
  doc.setTextColor(...muted);
  doc.text("ACADEMY", brandX + 67, 37.5);
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.45);
  doc.line(cx - 19, 43, cx + 19, 43);

  doc.setTextColor(...ink);
  doc.setFont("times", "bold");
  doc.setFontSize(33);
  doc.text("Certificate of Completion", cx, 57, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11.5);
  doc.setTextColor(...muted);
  doc.text("This certifies that", cx, 73, { align: "center" });

  doc.setFont("times", "bold");
  doc.setFontSize(27);
  doc.setTextColor(...ink);
  doc.text(data.name, cx, 87, { align: "center" });
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.6);
  doc.line(cx - 66, 91, cx + 66, 91);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11.5);
  doc.setTextColor(...muted);
  doc.text("has successfully completed", cx, 103, { align: "center" });

  doc.setFont("times", "bold");
  doc.setFontSize(17.5);
  doc.setTextColor(...green);
  const titleLines = doc.splitTextToSize(data.courseTitle, w - 88) as string[];
  doc.text(titleLines, cx, 115, { align: "center" });

  const titleHeight = Math.max(1, titleLines.length) * 6.5;
  const metaY = Math.min(139, 116 + titleHeight + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...muted);
  doc.text(
    `${data.hours} hours of study · Final assessment passed · SmartVet Africa Academy`,
    cx,
    metaY,
    { align: "center" },
  );

  // Issuance details.
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...green);
  doc.text("ISSUED", 31, 159);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...ink);
  doc.text(data.date, 31, 166);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...green);
  doc.text("VERIFICATION", 31, 176);
  doc.setFont("courier", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...ink);
  doc.text(data.code, 31, 183);

  // SmartVet seal.
  doc.setFillColor(241, 246, 241);
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.55);
  doc.circle(cx, 169, 16.2, "FD");
  doc.setDrawColor(...green);
  doc.setLineWidth(0.9);
  doc.circle(cx, 169, 13.5);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...green);
  doc.text("SMARTVET", cx, 166.5, { align: "center" });
  doc.text("AFRICA", cx, 171, { align: "center" });
  doc.setFontSize(5.5);
  doc.setTextColor(...muted);
  doc.text("ACADEMY", cx, 175.5, { align: "center" });

  // CEO authorization block. This is a typed authorization line, not a reproduced handwritten signature.
  const sigCenter = 232;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...green);
  doc.text("SIGNED BY", sigCenter, 151, { align: "center" });

  doc.setFont("times", "italic");
  doc.setFontSize(15);
  doc.setTextColor(...ink);
  doc.text(SIGNATORY_NAME, sigCenter, 160, { align: "center" });

  doc.setDrawColor(...ink);
  doc.setLineWidth(0.35);
  doc.line(sigCenter - 30, 164, sigCenter + 30, 164);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(SIGNATORY_NAME, sigCenter, 170, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...muted);
  doc.text(SIGNATORY_TITLE, sigCenter, 175.5, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...muted);
  doc.text("Verify this certificate on the SmartVet Africa Academy verification page.", cx, 190, { align: "center" });

  return doc;
}
