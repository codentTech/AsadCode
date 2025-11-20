export const getAge = (dateOfBirth) => {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  const ageInYears = today.getFullYear() - birthDate.getFullYear();
  return `${ageInYears}`;
};
