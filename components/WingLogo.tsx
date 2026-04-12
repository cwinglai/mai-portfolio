export default function WingLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="32" cy="32" r="30" fill="white" fillOpacity="0.1" stroke="white" strokeOpacity="0.2" strokeWidth="1.5" />
      {/* Clean geometric W as path */}
      <path
        d="M14 18L22 46L32 28L42 46L50 18"
        stroke="white"
        strokeOpacity="0.9"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
