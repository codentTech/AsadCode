export const formatUserLabel = (user) => {
  if (!user) {
    return "";
  }
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
  return fullName || user.email || "Unknown user";
};
