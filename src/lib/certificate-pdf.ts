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
