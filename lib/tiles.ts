export type Motif =
  | "quarter"
  | "half"
  | "tri"
  | "lens"
  | "dot"
  | "arc"
  | "split"
  | "bar";
export type Glaze = "cobalt" | "glaze" | "ink" | "ochre";
export type Turn = 0 | 1 | 2 | 3;

export interface TileSpec {
  motif: Motif;
  /** Quarter turns, clockwise */
  turn: Turn;
  ground: Glaze;
  figure: Glaze;
}

/** Small deterministic PRNG so server and client lay the same panel. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface PaletteEntry {
  ground: Glaze;
  figure: Glaze;
  weight: number;
}

/** The house set: mostly cobalt on glaze, some reversed, a little ink and ochre. */
export const HOUSE: PaletteEntry[] = [
  { ground: "glaze", figure: "cobalt", weight: 6 },
  { ground: "cobalt", figure: "glaze", weight: 4 },
  { ground: "glaze", figure: "ink", weight: 1.5 },
  { ground: "cobalt", figure: "ochre", weight: 1 },
  { ground: "ink", figure: "glaze", weight: 0.8 },
];

export const MOTIFS: Motif[] = [
  "quarter",
  "half",
  "tri",
  "lens",
  "dot",
  "arc",
  "split",
  "bar",
];

function pickWeighted<T extends { weight: number }>(items: T[], r: number) {
  const total = items.reduce((s, i) => s + i.weight, 0);
  let x = r * total;
  for (const item of items) {
    x -= item.weight;
    if (x <= 0) return item;
  }
  return items[items.length - 1];
}

export function layPanel(
  count: number,
  seed: number,
  {
    motifs = MOTIFS,
    palette = HOUSE,
  }: { motifs?: Motif[]; palette?: PaletteEntry[] } = {},
): TileSpec[] {
  const next = rng(seed);
  return Array.from({ length: count }, () => {
    const motif = motifs[Math.floor(next() * motifs.length)];
    const { ground, figure } = pickWeighted(palette, next());
    return { motif, turn: Math.floor(next() * 4) as Turn, ground, figure };
  });
}
