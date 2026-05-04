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

export const getDaysUntilDeadline = (date) => {
  const today = new Date();
  const deadlineDate = new Date(date);
  const diffTime = deadlineDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};
