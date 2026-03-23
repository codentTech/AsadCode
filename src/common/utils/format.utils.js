export const formatCurrency = (value) => {
  if (!value && value !== 0) return "—";
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return String(value);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(numericValue);
};

export const formatNumber = (value) => {
  if (!value && value !== 0) return "—";
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return String(value);
  return new Intl.NumberFormat("en-US").format(numericValue);
};

export const extractFileName = (url) => {
  if (!url) return "";
  try {
    return decodeURIComponent(url.split("/").pop() || "");
  } catch {
    return url;
  }
};

