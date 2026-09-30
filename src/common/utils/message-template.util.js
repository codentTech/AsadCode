import {
  DEFAULT_MESSAGE_TEMPLATE_CATEGORY,
  MESSAGE_TEMPLATE_CATEGORY_CONFIG,
  MESSAGE_TEMPLATE_CATEGORIES,
  MESSAGE_TEMPLATE_LOCKED_GREETING,
} from "@/common/constants/message-template.constant";

export function normalizeTemplateCategory(category) {
  const values = Object.values(MESSAGE_TEMPLATE_CATEGORIES);
  if (values.includes(category)) {
    return category;
  }
  return DEFAULT_MESSAGE_TEMPLATE_CATEGORY;
}

export function groupTemplatesByCategory(templates = []) {
  const grouped = MESSAGE_TEMPLATE_CATEGORY_CONFIG.reduce((acc, category) => {
    acc[category.value] = [];
    return acc;
  }, {});

  templates.forEach((template) => {
    const category = normalizeTemplateCategory(template.category);
    grouped[category].push(template);
  });

  return grouped;
}

export function getCategoryLabel(category) {
  return (
    MESSAGE_TEMPLATE_CATEGORY_CONFIG.find((item) => item.value === category)?.label || "Outreach"
  );
}

export function resolveTemplatePlaceholders(message, creatorName) {
  const resolvedName = creatorName?.trim() || "there";
  return String(message || "")
    .replace(/\{\{Name\}\}/gi, resolvedName)
    .replace(/\{\{creator_name\}\}/gi, resolvedName);
}

const GREETING_PREFIX_PATTERN =
  /^hey\s+(\{\{name\}\}|\{\{creator_name\}\}|[^\s,]+)\s*,\s*/i;

export function stripLockedTemplateGreeting(body = "") {
  return String(body || "").replace(GREETING_PREFIX_PATTERN, "").replace(/^\s+/, "");
}

export function composeTemplateBody(editableBody = "") {
  const rest = stripLockedTemplateGreeting(editableBody).replace(/\s+$/, "");
  return rest
    ? `${MESSAGE_TEMPLATE_LOCKED_GREETING} ${rest}`
    : MESSAGE_TEMPLATE_LOCKED_GREETING;
}

export function buildTemplateMessage(template, creatorName) {
  const composed = composeTemplateBody(template?.body || "");
  return resolveTemplatePlaceholders(composed, creatorName);
}
