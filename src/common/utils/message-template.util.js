import {
  DEFAULT_MESSAGE_TEMPLATE_CATEGORY,
  MESSAGE_TEMPLATE_CATEGORY_CONFIG,
  MESSAGE_TEMPLATE_CATEGORIES,
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

export function buildTemplateMessage(template, creatorName) {
  const greeting = `Hey ${creatorName || "{{creator_name}}"},`;
  return `${greeting} ${template.body}`;
}
