import type { Glaze, Motif } from "@/lib/tiles";

const FILL: Record<Glaze, string> = {
  cobalt: "var(--color-cobalt)",
  glaze: "var(--color-glaze)",
  ink: "var(--color-ink)",
  ochre: "var(--color-ochre)",
};

interface TileArtProps {
  motif: Motif;
  ground: Glaze;
  figure: Glaze;
  className?: string;
  style?: React.CSSProperties;
}

/** One tile face drawn in a 100 × 100 box; rotation is applied by the caller. */
export function TileArt({
  motif,
  ground,
  figure,
  className = "tile-art",
  style,
}: TileArtProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="100" height="100" fill={FILL[ground]} />
      <g fill={FILL[figure]}>
        {motif === "quarter" && <path d="M0 0H100A100 100 0 0 1 0 100Z" />}
        {motif === "half" && <path d="M0 100A50 50 0 0 1 100 100Z" />}
        {motif === "tri" && <path d="M0 0H100L0 100Z" />}
        {motif === "lens" && (
          <path d="M0 0A100 100 0 0 0 100 100A100 100 0 0 0 0 0Z" />
        )}
        {motif === "dot" && <circle cx="50" cy="50" r="24" />}
        {motif === "arc" && (
          <path
            fillRule="evenodd"
            d="M0 0H72A72 72 0 0 1 0 72Z M0 0H38A38 38 0 0 1 0 38Z"
          />
        )}
        {motif === "split" && <rect width="50" height="100" />}
        {motif === "bar" && <rect y="38" width="100" height="24" />}
      </g>
    </svg>
  );
}
