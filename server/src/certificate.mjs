import path from "node:path";
import PDFDocument from "pdfkit";
import sharp from "sharp";

const ASSET_DIR = path.resolve(process.env.CERTIFICATE_ASSET_DIR || path.join(process.cwd(), "certificate-assets"));
const PAGE_WIDTH = 841.89;
const PAGE_HEIGHT = 595.28;
const SOURCE_WIDTH = 2000;
const SOURCE_HEIGHT = 1414;
const sx = PAGE_WIDTH / SOURCE_WIDTH;
const sy = PAGE_HEIGHT / SOURCE_HEIGHT;

const templates = {
  // Broiler and Layer use the same supplied certificate base artwork.
  // Broiler-specific course wording is rendered below without altering the official layout.
  "broiler-foundations": "layer-production.webp",
  "layers-foundations": "layer-production.webp",
  "croiler-production": "kroiler-dual-purpose.webp",
};

function x(value) {
  return value * sx;
}

function y(value) {
  return value * sy;
}

function collectPdf(doc) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });
}

function fittedNameSize(doc, name, maxSourceWidth = 1000) {
  let size = 58 * sy;
  const min = 34 * sy;
  while (size > min) {
    doc.font("Helvetica-Bold").fontSize(size);
    if (doc.widthOfString(name) <= x(maxSourceWidth)) return size;
    size -= 2 * sy;
  }
  return min;
}

function centeredRuns(doc, centerSourceX, sourceY, runs) {
  const size = 32 * sy;
  const widths = runs.map((run) => {
    doc.font(run.bold ? "Helvetica-Bold" : "Helvetica").fontSize(size);
    return doc.widthOfString(run.text);
  });
  let cursor = x(centerSourceX) - widths.reduce((sum, width) => sum + width, 0) / 2;
  for (let index = 0; index < runs.length; index++) {
    const run = runs[index];
    doc.font(run.bold ? "Helvetica-Bold" : "Helvetica")
      .fontSize(size)
      .fillColor("#111111")
      .text(run.text, cursor, y(sourceY) - size * 0.82, { lineBreak: false });
    cursor += widths[index];
  }
}

export async function renderCertificatePdf({ name, courseId, code, issuedAt }) {
  const template = templates[courseId];
  if (!template) throw new Error("Unsupported certificate course.");

  const templatePath = path.join(ASSET_DIR, template);
  const background = await sharp(templatePath).png().toBuffer();

  const doc = new PDFDocument({
    size: "A4",
    layout: "landscape",
    margin: 0,
    info: {
      Title: "SmartVet Africa Academy Certificate",
      Author: "SmartVet Africa Academy",
      Subject: courseId,
      Keywords: "SmartVet Academy, certificate, " + code,
      CreationDate: issuedAt ? new Date(issuedAt) : new Date(),
    },
  });
  const output = collectPdf(doc);

  doc.image(background, 0, 0, { width: PAGE_WIDTH, height: PAGE_HEIGHT });

  if (courseId === "broiler-foundations") {
    doc.save()
      .rect(x(700), y(776), x(1126), y(96))
      .fill("#fffdf9")
      .restore();
    centeredRuns(doc, 1263, 810, [
      { text: "has successfully completed a ", bold: false },
      { text: "Broiler Production training", bold: true },
    ]);
    centeredRuns(doc, 1263, 860, [
      { text: "from ", bold: false },
      { text: "SmartVet Academy", bold: true },
    ]);
  }

  const learnerName = String(name || "Learner").trim() || "Learner";
  const nameSize = fittedNameSize(doc, learnerName);
  doc.font("Helvetica-Bold")
    .fontSize(nameSize)
    .fillColor("#111827")
    .text(learnerName, x(763), y(748) - nameSize * 0.82, {
      width: x(1000),
      align: "center",
      lineBreak: false,
    });

  doc.font("Helvetica-Bold")
    .fontSize(23 * sy)
    .fillColor("#404040")
    .text("Certificate No. " + code, x(210), y(722) - 23 * sy * 0.82, {
      lineBreak: false,
    });

  doc.font("Helvetica")
    .fontSize(12 * sy)
    .fillColor("#5f6368")
    .text("Verify: academy.smartvet.africa/verify?code=" + code, x(210), y(760), {
      lineBreak: false,
    });

  doc.end();
  return output;
}
