export const P = {
  // backgrounds
  pageBg:    "linear-gradient(155deg, #fdf0f3 0%, #f5ede8 35%, #edf5ed 70%, #f0f8f0 100%)",
  cardBg:    "rgba(255,255,255,0.62)",
  cardBorder:"rgba(240,195,210,0.45)",
  // pinks
  rose:      "#e8829a",
  roseSoft:  "#f4b8c8",
  blush:     "#fce8ee",
  // greens
  sage:      "#7aaa78",
  sageSoft:  "#aed4a8",
  mint:      "#e8f5e8",
  // text
  bark:      "#5a3a38",
  bark2:     "#8a6060",
  bark3:     "#b89090",
  // ground
  soil:      "#c4906a",
  soilDark:  "#a07050",
} as const;

export type Palette = typeof P;

export const serif = "'DM Serif Display', Georgia, serif";
export const sans  = "'Nunito', sans-serif";
