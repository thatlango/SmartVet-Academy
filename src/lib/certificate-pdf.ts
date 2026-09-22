import { jsPDF } from "jspdf";
import { getCertificateTemplate } from "@/lib/certificate-templates";

interface CertificateData {
  name: string;
  courseId: string;
  code: string;
}

const CERTIFICATE_WIDTH = 2000;
const CERTIFICATE_HEIGHT = 1414;
const NAME_CENTER_X = 1263;
const NAME_BASELINE_Y = 748;
const CERT_NUMBER_X = 210;
const CERT_NUMBER_Y = 722;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Certificate template could not be loaded."));
    image.src = src;
  });
}

function fittedNameSize(
  context: CanvasRenderingContext2D,
  name: string,
  maxWidth: number,
): number {
  let size = 58;
  while (size > 34) {
    context.font = `700 ${size}px Arial, Helvetica, sans-serif`;
    if (context.measureText(name).width <= maxWidth) return size;
    size -= 2;
  }
  return 34;
}

function drawCenteredRuns(
  context: CanvasRenderingContext2D,
  centerX: number,
  y: number,
  runs: Array<{ text: string; weight: 400 | 700 }>,
) {
  const widths = runs.map((run) => {
    context.font = `${run.weight} 32px Arial, Helvetica, sans-serif`;
    return context.measureText(run.text).width;
  });
  let x = centerX - widths.reduce((sum, width) => sum + width, 0) / 2;

  runs.forEach((run, index) => {
    context.font = `${run.weight} 32px Arial, Helvetica, sans-serif`;
    context.fillText(run.text, x, y);
    x += widths[index];
  });
}

function drawBroilerCourseCopy(context: CanvasRenderingContext2D) {
  // The supplied Broiler and Layer certificates share the same artwork.
  // Replace only the course-copy area so the official background, signature,
  // marks and geometry remain untouched.
  context.fillStyle = "#fffdf9";
  context.fillRect(700, 776, 1126, 96);

  context.fillStyle = "#111111";
  context.textAlign = "left";
  context.textBaseline = "alphabetic";
  drawCenteredRuns(context, NAME_CENTER_X, 810, [
    { text: "has successfully completed a ", weight: 400 },
    { text: "Broiler Production training", weight: 700 },
  ]);
  drawCenteredRuns(context, NAME_CENTER_X, 860, [
    { text: "from ", weight: 400 },
    { text: "SmartVet Academy", weight: 700 },
  ]);
}

export async function buildCertificatePdf({
  name,
  courseId,
  code,
}: CertificateData): Promise<jsPDF> {
  const image = await loadImage(getCertificateTemplate(courseId));

  const canvas = document.createElement("canvas");
  canvas.width = CERTIFICATE_WIDTH;
  canvas.height = CERTIFICATE_HEIGHT;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not create the certificate canvas.");

  context.drawImage(image, 0, 0, CERTIFICATE_WIDTH, CERTIFICATE_HEIGHT);

  if (courseId === "broiler-foundations") {
    drawBroilerCourseCopy(context);
  }

  const learnerName = name.trim() || "Learner";

  context.textAlign = "center";
  context.textBaseline = "alphabetic";
  context.fillStyle = "#111827";
  context.font = `700 ${fittedNameSize(context, learnerName, 1000)}px Arial, Helvetica, sans-serif`;
  context.fillText(learnerName, NAME_CENTER_X, NAME_BASELINE_Y);

  context.textAlign = "left";
  context.fillStyle = "#404040";
  context.font = "600 23px Arial, Helvetica, sans-serif";
  context.fillText(`Certificate No. ${code}`, CERT_NUMBER_X, CERT_NUMBER_Y);

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  pdf.addImage(
    canvas.toDataURL("image/png"),
    "PNG",
    0,
    0,
    297,
    210,
    undefined,
    "FAST",
  );

  return pdf;
}
