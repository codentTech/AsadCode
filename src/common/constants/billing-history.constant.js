export const BILLING_CHARGE_TYPE = {
  ALL: "all",
  ESCROW: "escrow",
  INDIVIDUAL_HIRE: "individual_hire",
  PLATFORM_FEE: "platform_fee",
  REFUND: "refund",
};

export const BILLING_DATE_RANGE = {
  ALL: "all",
  LAST_30: "last_30",
  LAST_90: "last_90",
  THIS_YEAR: "this_year",
};

export const BILLING_PAYMENT_STATUS = {
  HELD_IN_ESCROW: "held_in_escrow",
  RELEASED: "released",
  FAILED: "failed",
  REFUNDED: "refunded",
  NONE: "none",
};

export const BILLING_HISTORY_PAGE_SIZE = 15;

export const BILLING_TYPE_FILTER_OPTIONS = [
  { value: BILLING_CHARGE_TYPE.ALL, label: "All types" },
  { value: BILLING_CHARGE_TYPE.ESCROW, label: "Escrow payment" },
  { value: BILLING_CHARGE_TYPE.INDIVIDUAL_HIRE, label: "Individual creator hire" },
  { value: BILLING_CHARGE_TYPE.PLATFORM_FEE, label: "Platform fee" },
  { value: BILLING_CHARGE_TYPE.REFUND, label: "Refund" },
];

export const BILLING_DATE_FILTER_OPTIONS = [
  { value: BILLING_DATE_RANGE.ALL, label: "All time" },
  { value: BILLING_DATE_RANGE.LAST_30, label: "Last 30 days" },
  { value: BILLING_DATE_RANGE.LAST_90, label: "Last 90 days" },
  { value: BILLING_DATE_RANGE.THIS_YEAR, label: "This year" },
];
