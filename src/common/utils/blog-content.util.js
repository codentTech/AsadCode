const WORDS_PER_MINUTE = 220;

export const BLOG_DEFAULT_AUTHOR = {
  name: "CleerCut Team",
  role: "Author",
  avatarUrl: null,
};

export function slugifyHeading(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function estimateReadingTime(html) {
  if (!html) return 1;
  const text = String(html).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").length : 0;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function hasBeenUpdated(publishedAt, updatedAt) {
  if (!publishedAt || !updatedAt) return false;
  return new Date(updatedAt).getTime() - new Date(publishedAt).getTime() > 60000;
}

function getHeadingLevel(tagName) {
  const level = Number(tagName?.replace("H", ""));
  return level === 2 || level === 3 ? level : null;
}

function collectUntilNextHeading(nodes, startIndex, level) {
  const parts = [];
  for (let i = startIndex; i < nodes.length; i += 1) {
    const node = nodes[i];
    if (node.tagName === "H2" || (level === 3 && node.tagName === "H3")) {
      break;
    }
    parts.push(node.outerHTML);
  }
  return parts.join("");
}

export function processBlogPostHtml(html) {
  if (!html || typeof window === "undefined") {
    return {
      bodyHtml: html || "",
      tocEntries: [],
      faqItems: [],
    };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const children = Array.from(doc.body.children);

  const tocEntries = [];
  const faqItems = [];
  const usedIds = new Set();
  let faqSectionIndex = -1;

  children.forEach((node, index) => {
    const level = getHeadingLevel(node.tagName);
    if (!level) return;

    const text = node.textContent?.trim() || "";
    if (/^faq(s)?$/i.test(text)) {
      faqSectionIndex = index;
      return;
    }

    let id = slugifyHeading(text);
    if (!id) id = `section-${index}`;
    let uniqueId = id;
    let suffix = 2;
    while (usedIds.has(uniqueId)) {
      uniqueId = `${id}-${suffix}`;
      suffix += 1;
    }
    usedIds.add(uniqueId);
    node.id = uniqueId;

    tocEntries.push({ id: uniqueId, text, level });
  });

  if (faqSectionIndex >= 0) {
    for (let i = faqSectionIndex + 1; i < children.length; i += 1) {
      const node = children[i];
      if (node.tagName === "H2") break;
      if (node.tagName === "H3") {
        const answerHtml = collectUntilNextHeading(children, i + 1, 3);
        faqItems.push({
          id: `faq-${faqItems.length + 1}`,
          question: node.textContent?.trim() || "",
          answerHtml,
        });
      }
    }

    children.splice(faqSectionIndex);
  }

  return {
    bodyHtml: children.map((node) => node.outerHTML).join(""),
    tocEntries,
    faqItems,
  };
}
