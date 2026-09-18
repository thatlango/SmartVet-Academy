export function SmartVetLogo({ className = "h-9 w-auto" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 520 130"
      role="img"
      aria-label="SmartVet Africa"
      className={className}
    >
      <image
        href="/smartvet-chicken.png"
        x="0"
        y="3"
        width="104"
        height="104"
        preserveAspectRatio="xMidYMid meet"
      />
      <g fontFamily="Arial, Helvetica, sans-serif" fill="#0b6f3c">
        <text x="112" y="67" fontSize="54" fontWeight="800" letterSpacing="-2.1">
          SmartVet
        </text>
        <text x="114" y="101" fontSize="21" fontWeight="700" letterSpacing="7.5">
          AFRICA
        </text>
      </g>
    </svg>
  );
}
