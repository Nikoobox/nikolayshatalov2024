// Is page content painted at this screen point?
// The ships live in a pointer-events: none layer, so elementFromPoint only
// ever sees page content.
const CONTENT_TAGS = new Set([
  "IMG",
  "CANVAS",
  "VIDEO",
  "INPUT",
  "TEXTAREA",
  "BUTTON",
  "A",
  "P",
  "SPAN",
  "LABEL",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "LI",
  "SVG",
  "PATH",
  "RECT",
  "LINE",
  "G",
  "CIRCLE",
]);

export const isCovered = (x: number, y: number) => {
  const el = document.elementFromPoint(x, y);
  if (!el || el === document.body || el === document.documentElement) {
    return false;
  }
  if (CONTENT_TAGS.has(el.tagName.toUpperCase())) return true;
  const hasText = [...el.childNodes].some(
    (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
  );
  if (hasText) return true;
  const style = getComputedStyle(el);
  const paintsBackground =
    !["rgba(0, 0, 0, 0)", "transparent"].includes(style.backgroundColor) ||
    style.backgroundImage !== "none" ||
    style.boxShadow !== "none";
  return paintsBackground;
};
