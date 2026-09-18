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
      <g fontFamily="Arial, Helvetica, sans-serif" fill="#1c7e02">
        <text x="112" y="67" fontSize="54" fontWeight="800" letterSpacing="-2.1">
          SmartVet
        </text>
        <text x="114" y="101" fontSize="21" fontWeight="700" letterSpacing="7.5" fill="#0d7e5f">
          AFRICA
        </text>
      </g>
      <circle cx="493" cy="33" r="5" fill="#e5c020" aria-hidden="true" />
    </svg>
  );
}
