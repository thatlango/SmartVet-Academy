export function SmartVetLogo({ className = "h-9 w-auto" }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="SmartVet Africa"
      className={`inline-flex shrink-0 items-center gap-2 ${className}`}
    >
      <img
        src="/smartvet-mark.png?v=20260927"
        alt=""
        aria-hidden="true"
        className="h-full w-auto shrink-0 object-contain"
      />
      <span aria-hidden="true" className="flex flex-col justify-center leading-none text-[#0b6f3c]">
        <span className="text-xl font-black tracking-[-0.055em]">SmartVet</span>
        <span className="mt-1 pl-px text-[9px] font-extrabold tracking-[0.34em]">AFRICA</span>
      </span>
    </span>
  );
}
