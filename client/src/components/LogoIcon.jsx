export default function LogoIcon({ className, stroke = "currentColor" }) {
  return (
    <svg
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Top Left */}
      <rect
        x="12"
        y="12"
        width="72"
        height="72"
        rx="20"
        stroke={stroke}
        strokeWidth="6"
        fill="none"
      />

      {/* Bottom Right */}
      <rect
        x="44"
        y="44"
        width="72"
        height="72"
        rx="20"
        stroke={stroke}
        strokeWidth="6"
        fill="none"
      />
    </svg>
  );
}
