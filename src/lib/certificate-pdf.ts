import { jsPDF } from "jspdf";

interface CertificateData {
  name: string;
  courseTitle: string;
  hours: number;
  date: string;
  code: string;
}

export function buildCertificatePdf(data: CertificateData): jsPDF {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const w = 297;
  const h = 210;
  const cx = w / 2;

  const paper: [number, number, number] = [247, 248, 244];
  const ink: [number, number, number] = [23, 32, 25];
  const green: [number, number, number] = [28, 126, 2];
  const gold: [number, number, number] = [229, 192, 32];
  const muted: [number, number, number] = [101, 112, 104];

  doc.setFillColor(...paper);
  doc.rect(0, 0, w, h, "F");
  doc.setDrawColor(...green);
  doc.setLineWidth(1.6);
  doc.rect(10, 10, w - 20, h - 20);
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.4);
  doc.rect(14, 14, w - 28, h - 28);

  doc.setTextColor(...green);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("SmartVet Africa Academy", cx, 32, { align: "center" });
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.text("Powered by Smart Vet Africa · Uganda", cx, 39, { align: "center" });

  doc.setTextColor(...ink);
  doc.setFont("times", "bold");
  doc.setFontSize(34);
  doc.text("Certificate of Completion", cx, 60, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(...muted);
  doc.text("This certifies that", cx, 78, { align: "center" });

  doc.setFont("times", "bold");
  doc.setFontSize(28);
  doc.setTextColor(...ink);
  doc.text(data.name, cx, 93, { align: "center" });
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.6);
  doc.line(cx - 65, 97, cx + 65, 97);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(...muted);
  doc.text("has successfully completed the course", cx, 110, { align: "center" });

  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...green);
  const titleLines = doc.splitTextToSize(data.courseTitle, w - 90) as string[];
  doc.text(titleLines, cx, 122, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...muted);
  doc.text(
    `${data.hours} hours of study · Cobb500 reference standards · Smart Vet Africa facilitator curriculum`,
    cx,
    136,
    { align: "center" },
  );

  doc.setFontSize(10);
  doc.setTextColor(...ink);
  doc.text(`Issued on ${data.date}`, 30, 170);

  doc.setDrawColor(...green);
  doc.setLineWidth(0.8);
  doc.circle(cx, 166, 14);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...green);
  doc.text("SMARTVET", cx, 164, { align: "center" });
  doc.text("AFRICA", cx, 169, { align: "center" });

  doc.setFont("courier", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...ink);
  doc.text(`Verification: ${data.code}`, w - 30, 170, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.text("Verify at /verify on the SmartVet Africa Academy site", w - 30, 176, { align: "right" });

  return doc;
}
