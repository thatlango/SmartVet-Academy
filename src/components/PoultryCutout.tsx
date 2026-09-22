import { useEffect, useState } from "react";

type Props = {
  className?: string;
  alt?: string;
};

const SOURCE = "/smartvet-hero.webp";
const TARGET_WIDTH = 1500;

/**
 * Builds a transparent WebP cutout from the existing SmartVet poultry artwork.
 * The source is same-origin, so the chroma-key conversion is safe to run once
 * in the browser without sending learner data anywhere.
 */
export function PoultryCutout({ className, alt = "" }: Props) {
  const [src, setSrc] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    const image = new Image();
    image.decoding = "async";
    image.src = SOURCE;

    image.onload = () => {
      if (cancelled) return;

      // The poultry group occupies the right side of the 3:1 source artwork.
      const cropX = Math.round(image.naturalWidth * 0.56);
      const cropY = 0;
      const cropWidth = image.naturalWidth - cropX;
      const cropHeight = image.naturalHeight;

      const work = document.createElement("canvas");
      work.width = cropWidth;
      work.height = cropHeight;
      const workContext = work.getContext("2d", { willReadFrequently: true });
      if (!workContext) return;

      workContext.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight,
      );

      const pixels = workContext.getImageData(0, 0, cropWidth, cropHeight);
      const data = pixels.data;

      // Key the flat SmartVet green background while retaining soft subject edges.
      const bg = { r: 33, g: 139, b: 85 };
      for (let index = 0; index < data.length; index += 4) {
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const dr = r - bg.r;
        const dg = g - bg.g;
        const db = b - bg.b;
        const distance = Math.sqrt(dr * dr + dg * dg + db * db);
        const greenDominance = g - Math.max(r, b);

        if (greenDominance > 18 && distance < 92) {
          const alpha = Math.max(0, Math.min(1, (distance - 14) / 48));
          data[index + 3] = Math.round(data[index + 3] * alpha);

          if (alpha < 0.92) {
            data[index + 1] = Math.min(g, Math.max(r, b) * 1.08);
          }
        }
      }
      workContext.putImageData(pixels, 0, 0);

      const targetHeight = Math.round((cropHeight / cropWidth) * TARGET_WIDTH);
      const output = document.createElement("canvas");
      output.width = TARGET_WIDTH;
      output.height = targetHeight;
      const outputContext = output.getContext("2d");
      if (!outputContext) return;
      outputContext.imageSmoothingEnabled = true;
      outputContext.imageSmoothingQuality = "high";
      outputContext.drawImage(work, 0, 0, TARGET_WIDTH, targetHeight);

      try {
        const webp = output.toDataURL("image/webp", 0.86);
        if (!cancelled) setSrc(webp);
      } catch {
        if (!cancelled) setSrc(SOURCE);
      }
    };

    image.onerror = () => {
      if (!cancelled) setSrc(SOURCE);
    };

    return () => {
      cancelled = true;
    };
  }, []);

  if (!src) {
    return <div className={className} aria-hidden="true" />;
  }

  return <img src={src} alt={alt} className={className} decoding="async" />;
}
