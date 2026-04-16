export const capitalizeFirstWord = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const platformDisplayName = (name) => {
  if (!name) return "";
  return name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Helper function to convert snake_case to camelCase
export const toCamelCase = (str) => str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

/**
 * Helper utility functions
 */

/**
 * Formats a date into a readable time ago format
 * Shows minutes for < 1 hour, hours for < 24 hours, then switches to days
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted time ago string
 */
export const formatTimeAgo = (date) => {
  if (!date) return "Recently";

  const now = new Date();
  const targetDate = date instanceof Date ? date : new Date(date);

  // Check if the date is valid
  if (isNaN(targetDate.getTime())) return "Recently";

  const diffInMs = now - targetDate;

  // Convert to minutes and hours
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

  // If less than 1 hour, show minutes
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  // If less than 24 hours, show hours
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  // If 24 hours or more, show days
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

/**
 * Formats a date into a detailed time ago format
 * Shows hours for < 24 hours, then switches to days, weeks, months, years
 * @param {Date|string} date - The date to format
 * @returns {string} Detailed formatted time ago string
 */
export const formatDetailedTimeAgo = (date) => {
  if (!date) return "Recently";

  const now = new Date();
  const targetDate = date instanceof Date ? date : new Date(date);

  // Check if the date is valid
  if (isNaN(targetDate.getTime())) return "Recently";

  const diffInMs = now - targetDate;

  // Convert to different time units
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`;
  } else {
    return `${diffInYears}y ago`;
  }
};
