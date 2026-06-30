export const PAYOUT_AVAILABLE_DATETIME_FORMAT = "MMMM d, yyyy 'at' h:mm a";

export const getAge = (dateOfBirth) => {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  const ageInYears = today.getFullYear() - birthDate.getFullYear();
  return `${ageInYears}`;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const formatDateOrNA = (value) => {
  if (!value) return "N/A";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "N/A";
  return parsed.toLocaleDateString();
};

export const toHtmlDateInputValue = (value) => {
  if (value === undefined || value === null || value === "") return "";
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  const y = parsed.getFullYear();
  const m = String(parsed.getMonth() + 1).padStart(2, "0");
  const d = String(parsed.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const getTodayHtmlDateInputValue = () => toHtmlDateInputValue(new Date());

export const isValidHtmlDateInputValue = (value) => {
  if (!value || typeof value !== "string") return false;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
  );
};

export const isHtmlDateInputOnOrAfterToday = (value) => {
  if (!isValidHtmlDateInputValue(value)) return false;
  return value.trim() >= getTodayHtmlDateInputValue();
};

export const isHtmlDateInputAfter = (laterValue, earlierValue) => {
  if (!isValidHtmlDateInputValue(laterValue) || !isValidHtmlDateInputValue(earlierValue)) {
    return false;
  }
  return laterValue.trim() > earlierValue.trim();
};

export const getDaysUntilDeadline = (date) => {
  const today = new Date();
  const deadlineDate = new Date(date);
  const diffTime = deadlineDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};
