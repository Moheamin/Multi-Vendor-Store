export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Left link */}
        <path d="M10 18C8.5 18 7 16.5 7 15C7 13.5 8.5 12 10 12H14" />

        {/* Right link */}
        <path d="M22 14C23.5 14 25 15.5 25 17C25 18.5 23.5 20 22 20H18" />

        {/* Center connection */}
        <path d="M12 16H20" />

        {/* Subtle box/store hint */}
        <rect x="11" y="21" width="10" height="6" rx="1.5" />
      </g>
    </svg>
  );
}
