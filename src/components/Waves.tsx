interface WavesProps {
  fill?: string;
  className?: string;
}

export default function Waves({
  fill = "#f8fafc",
  className = "",
}: WavesProps) {
  return (
    <div
      aria-hidden="true"
      className={`wave-container pointer-events-none absolute bottom-0 left-0 w-full overflow-hidden ${className}`}
    >
      <svg
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        className="wave-svg"
      >
        <defs>
          <path
            id="wave-path"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18v44h-352z"
          />
        </defs>
        <g className="wave-parallax">
          <use href="#wave-path" x="48" y="0" fill={fill} fillOpacity="0.4" />
          <use href="#wave-path" x="48" y="3" fill={fill} fillOpacity="0.6" />
          <use href="#wave-path" x="48" y="5" fill={fill} />
        </g>
      </svg>
    </div>
  );
}
