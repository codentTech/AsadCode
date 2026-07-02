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

export function slugifyLegalGroup(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const LEGAL_SIDEBAR_WIDTH = "w-full md:w-72 xl:w-80 shrink-0";

export const LEGAL_TWO_PANEL_ROW = "flex flex-col md:flex-row md:items-start gap-4 md:gap-6";

export const LEGAL_CONTENT_PANEL = "min-w-0 flex-1";
