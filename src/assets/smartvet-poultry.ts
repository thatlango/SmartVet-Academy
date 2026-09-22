import part0a from "./poultry-cutout-0a.b64?raw";
import part0b from "./poultry-cutout-0b.b64?raw";
import part1 from "./poultry-cutout-1.b64?raw";
import part2 from "./poultry-cutout-2.b64?raw";
import part3a from "./poultry-cutout-3a.b64?raw";
import part3b from "./poultry-cutout-3b.b64?raw";
import part4 from "./poultry-cutout-4.b64?raw";
import part5 from "./poultry-cutout-5.b64?raw";
import part6 from "./poultry-cutout-6.b64?raw";

const encoded = [
  part0a,
  part0b,
  part1,
  part2,
  part3a,
  part3b,
  part4,
  part5,
  part6,
]
  .map((part) => part.trim())
  .join("");

export const SMARTVET_POULTRY_SRC = `data:image/webp;base64,${encoded}`;
