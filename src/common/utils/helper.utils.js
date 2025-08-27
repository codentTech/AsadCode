export const capitalizeFirstWord = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Helper function to convert snake_case to camelCase
export const toCamelCase = (str) => str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
