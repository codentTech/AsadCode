import ROLES from "@/common/constants/role.constant";

export const CLEERCUT_USER_STORAGE_UPDATED = "cleercut-user-storage-updated";

export const CLEERCUT_OPEN_SHOWCASE_MODAL = "cleercut-open-showcase-modal";

export function creatorNeedsShowcaseImages(user) {
  if (!user || user.role !== ROLES.CREATOR) return false;
  const pics = user?.creator_profile?.mini_profile_pictures;
  if (!Array.isArray(pics)) return true;
  const filled = pics.filter((u) => typeof u === "string" && u.trim().length > 0);
  return filled.length < 3;
}

export function isShowcaseUploadAllowedPath(pathname) {
  if (!pathname || typeof pathname !== "string") return false;
  return (
    pathname === "/creator-portfolio" ||
    pathname.startsWith("/creator-portfolio/") ||
    pathname === "/settings" ||
    pathname.startsWith("/settings/")
  );
}
