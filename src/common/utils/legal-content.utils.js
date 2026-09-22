export function groupLegalParagraphs(paragraphs = []) {
  const blocks = [];
  let listItems = [];

  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push({ type: "list", items: [...listItems] });
      listItems = [];
    }
  };

  paragraphs.forEach((paragraph) => {
    if (paragraph.startsWith("• ")) {
      listItems.push(paragraph.slice(2));
      return;
    }
    flushList();
    blocks.push({ type: "text", text: paragraph });
  });

  flushList();
  return blocks;
}

const LEGAL_LINK_PATTERN = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;

export function parseLegalInlineContent(text = "") {
  const parts = [];
  let lastIndex = 0;

  for (const match of text.matchAll(LEGAL_LINK_PATTERN)) {
    const [fullMatch, label, href] = match;
    const start = match.index ?? 0;

    if (start > lastIndex) {
      parts.push({ type: "text", value: text.slice(lastIndex, start) });
    }

    parts.push({ type: "link", value: label, href });
    lastIndex = start + fullMatch.length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", value: text.slice(lastIndex) });
  }

  return parts.length > 0 ? parts : [{ type: "text", value: text }];
}

export function slugifyLegalGroup(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const LEGAL_SIDEBAR_WIDTH = "w-full md:w-72 xl:w-80 shrink-0";

export const LEGAL_TWO_PANEL_ROW = "flex flex-col md:flex-row md:items-start gap-4 md:gap-6";

export const LEGAL_CONTENT_PANEL = "min-w-0 flex-1";
