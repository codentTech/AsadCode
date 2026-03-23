export const getUploadedFileUrl = (payload) => {
  if (!payload) return "";
  if (payload.url) return payload.url;
  if (Array.isArray(payload) && payload[0]?.url) return payload[0].url;
  return payload.location || payload.fileUrl || "";
};

export const sanitizeGuidelineList = (list) => {
  if (!Array.isArray(list) || list.length === 0) return [""];
  const normalized = list.map((item) => (typeof item === "string" ? item : ""));
  return normalized.length ? normalized : [""];
};

export const capitalizeFirstLetter = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
