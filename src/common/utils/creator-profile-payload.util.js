export const withExistingCreatorPhotos = (defaults = {}, creatorProfile = {}) => ({
  ...defaults,
  ...(defaults?.profilePhotoUrl === undefined && creatorProfile.profile_photo_url
    ? { profilePhotoUrl: creatorProfile.profile_photo_url }
    : {}),
  ...(defaults?.miniProfilePictures === undefined &&
  Array.isArray(creatorProfile.mini_profile_pictures) &&
  creatorProfile.mini_profile_pictures.length === 3
    ? { miniProfilePictures: creatorProfile.mini_profile_pictures }
    : {}),
});
