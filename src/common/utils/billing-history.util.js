import {
  BILLING_CHARGE_TYPE,
  BILLING_DATE_RANGE,
  BILLING_PAYMENT_STATUS,
} from "@/common/constants/billing-history.constant";

export const formatBillingDateParts = (value) => {
  if (!value) return { monthDay: "—", year: "" };
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return { monthDay: "—", year: "" };
  return {
    monthDay: parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    year: String(parsed.getFullYear()),
  };
};

export const formatBillingAmount = (amountCents, currency = "usd") => {
  const amount = Number(amountCents || 0) / 100;
  const code = String(currency || "usd").toLowerCase();
  const symbols = { usd: "$", eur: "€", gbp: "£", cad: "$", aud: "$" };
  const symbol = symbols[code] || `${code.toUpperCase()} `;
  return `${symbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const getBillingTypeClassName = (type) => {
  switch (type) {
    case BILLING_CHARGE_TYPE.ESCROW:
      return "bg-blue-50 text-blue-700";
    case BILLING_CHARGE_TYPE.INDIVIDUAL_HIRE:
      return "bg-violet-50 text-violet-700";
    case BILLING_CHARGE_TYPE.PLATFORM_FEE:
      return "bg-slate-100 text-slate-700";
    case BILLING_CHARGE_TYPE.REFUND:
      return "bg-rose-50 text-rose-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export const getBillingStatusClassName = (status) => {
  switch (status) {
    case BILLING_PAYMENT_STATUS.RELEASED:
      return "bg-emerald-50 text-emerald-700";
    case BILLING_PAYMENT_STATUS.HELD_IN_ESCROW:
      return "bg-amber-50 text-amber-700";
    case BILLING_PAYMENT_STATUS.FAILED:
      return "bg-red-50 text-red-700";
    case BILLING_PAYMENT_STATUS.REFUNDED:
      return "bg-rose-50 text-rose-700";
    default:
      return "";
  }
};

export const isValidReceiptUrl = (url) =>
  typeof url === "string" && /^https?:\/\//i.test(url);

export const filterBillingRows = (rows, { type, dateRange, searchTerm }) => {
  const query = String(searchTerm || "").trim().toLowerCase();
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1).getTime();
  const thirtyDaysAgo = now.getTime() - 30 * 24 * 60 * 60 * 1000;
  const ninetyDaysAgo = now.getTime() - 90 * 24 * 60 * 60 * 1000;

  return rows.filter((row) => {
    const matchesType = type === BILLING_CHARGE_TYPE.ALL || row.type === type;
    const rowTime = new Date(row.date).getTime();
    const matchesDate =
      dateRange === BILLING_DATE_RANGE.ALL ||
      (dateRange === BILLING_DATE_RANGE.LAST_30 && rowTime >= thirtyDaysAgo) ||
      (dateRange === BILLING_DATE_RANGE.LAST_90 && rowTime >= ninetyDaysAgo) ||
      (dateRange === BILLING_DATE_RANGE.THIS_YEAR && rowTime >= startOfYear);
    const matchesSearch =
      !query ||
      row.title?.toLowerCase().includes(query) ||
      row.secondaryLine?.toLowerCase().includes(query) ||
      row.typeLabel?.toLowerCase().includes(query) ||
      row.paymentMethod?.toLowerCase().includes(query);
    return matchesType && matchesDate && matchesSearch;
  });
};
