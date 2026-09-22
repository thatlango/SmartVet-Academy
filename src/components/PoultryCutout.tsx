import { SMARTVET_POULTRY_SRC } from "@/assets/smartvet-poultry";

type Props = {
  className?: string;
  alt?: string;
  decorative?: boolean;
};

export function PoultryCutout({ className, alt = "", decorative = true }: Props) {
  return (
    <img
      src={SMARTVET_POULTRY_SRC}
      alt={decorative ? "" : alt}
      aria-hidden={decorative ? "true" : undefined}
      className={className}
      decoding="async"
      draggable={false}
    />
  );
}
