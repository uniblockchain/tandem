

export enum SEnvNodeTypes {
  ELEMENT = 1,
  ATTR = 2,
  TEXT = 3,
  CDATA_SECTION = 4,
  ENTITY_REFERENCE = 5,
  ENTITY = 6,
  PROCESSING_INSTRUCTION = 7,
  COMMENT = 8,
  DOCUMENT = 9,
  DOCUMENT_TYPE = 10,
  DOCUMENT_FRAGMENT = 11,
  NOTATION = 12
};

// https://developer.mozilla.org/en-US/docs/Web/API/CSSRule
export enum CSSRuleType {
  STYLE_RULE, // 1
  CHARSET_RULE,
  IMPORT_RULE,
  MEDIA_RULE,
  FONT_FACE_RULE,
  PAGE_RULE,
  KEYFRAMES_RULE,
  KEYFRAME_RULE,
  __FUTURE_NS,  // 9
  NAMESPACE_RULE,
  COUNTER_STYLE_RULE,
  SUPPORTS_RULE,
  DOCUMENT_RULE,
  FONT_FEATURE_VALUES_RULE,
  VIEWPORT_RULE,
  REGION_STYLE_RULE,
  UNKNOWN_RULE
};


export const DEFAULT_WINDOW_WIDTH = 1366;
export const DEFAULT_WINDOW_HEIGHT = 768;

export const SVG_XMLNS  = "http://www.w3.org/2000/svg";
export const HTML_XMLNS = "http://www.w3.org/1999/xhtml";