/** Logo A — Escudo de Transformación Estudiantil (idéntico al usado en carnet y app principal) */
export default function LogoA({ width = 80, height = 90, className = '' }) {
  return (
    <svg
      viewBox="0 0 160 180"
      width={width}
      height={height}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M80,12 L148,40 L148,95 C148,135 115,162 80,172 C45,162 12,135 12,95 L12,40 Z"
        fill="#4995F3"
        stroke="#F1C717"
        strokeWidth="4"
      />
      <path
        d="M20,110 L140,50"
        stroke="#F1C717"
        strokeWidth="12"
        strokeLinecap="round"
        opacity="0.35"
      />
      <polygon
        points="80,42 88,66 114,66 93,82 101,106 80,90 59,106 67,82 46,66 72,66"
        fill="#F1C717"
      />
      <text
        x="80"
        y="150"
        textAnchor="middle"
        fontFamily="Montserrat,Arial"
        fontWeight="900"
        fontSize="20"
        fill="white"
        letterSpacing="4"
      >
        TES
      </text>
    </svg>
  );
}
