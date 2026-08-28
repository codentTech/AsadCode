function normalizeVariantTitle(variantTitle) {
  if (variantTitle == null || variantTitle === "") return "";
  if (variantTitle === "Default Title") return "Default";
  return String(variantTitle).trim();
}

/**
 * Selectable label: product name, variant, SKU (omit empty parts).
 */
export function formatShopifySelectionLabel({
  productTitle,
  variantTitle,
  sku,
  available = true,
} = {}) {
  const parts = [
    productTitle ? String(productTitle).trim() : "",
    normalizeVariantTitle(variantTitle),
    sku ? String(sku).trim() : "",
  ].filter(Boolean);

  const label = parts.join(", ") || "Untitled";
  return available ? label : `${label} (Out of stock)`;
}

export function formatShopifyProductOptionLabel(product) {
  const variant = product?.variants?.[0] || null;
  return formatShopifySelectionLabel({
    productTitle: product?.title,
    variantTitle: variant?.title,
    sku: variant?.sku,
  });
}
