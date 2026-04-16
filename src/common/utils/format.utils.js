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

export const formatFollowers = (count) => {
  if (typeof count !== "number" || Number.isNaN(count) || count < 0) return "—";
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toLocaleString();
};

export const formatCompactCurrency = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toLocaleString()}`;
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

