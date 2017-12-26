export enum CSSMeasurementTypes {
  PX = "PX",
  PERC = "%",
  VW = "vw",
  VH = "vh",
  CM = "cm",
  EM = "em",
  EX = "ex",
  IN = "in",
  MM = "mm",
  PC = "pc",
  PT = "pt",
  VMIN = "vmin"
}

export enum Axis {
  HORIZONTAL = "HORIZONTAL",
  VERTICAL = "VERTICAL",
}

// https://www.w3.org/TR/CSS21/propidx.html
export enum INHERITED_CSS_STYLE_PROPERTIES {
  "azimuth",
  "borderCollapse",
  "borderSpacing",
  "captionSide",
  "color",
  "cursor",
  "direction",
  "elevation",
  "emptyCells",
  "fontFamily",
  "fontSize",
  "fontStyle",
  "fontVariant",
  "fontWeight",
  "font",
  "letterSpacing",
  "lineHeight",
  "listStyleImage",
  "listStylePosition",
  "listStyleType",
  "listStyle",
  "orphans",
  "pitchRange",
  "pitch",
  "quotes",
  "richness",
  "speakHeader",
  "speakNumeral",
  "speakPunctuation",
  "speak",
  "speechRate",
  "stress",
  "textAlign",
  "textIndent",
  "textDecoration", // not documented as inherited, but it is under certain conditions.
  "textTransform",
  "visibility",
  "voiceFamily",
  "volume",
  "whiteSpace",
  "widows",
  "wordSpacing"
};