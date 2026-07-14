export const getCreatorFirstName = (creator) => {
  if (!creator) return null;

  const directFirstName = creator.first_name || creator.firstName;
  if (directFirstName) {
    return String(directFirstName).trim();
  }

  const nestedFirstName = creator.creator?.first_name || creator.creator?.firstName;
  if (nestedFirstName) {
    return String(nestedFirstName).trim();
  }

  const fullName = creator.name || creator.full_name || creator.fullName;
  if (fullName) {
    const firstToken = String(fullName).trim().split(/\s+/)[0];
    if (firstToken) {
      return firstToken;
    }
  }

  return null;
};
