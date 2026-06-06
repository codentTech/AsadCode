export const MEDIA_KIT_PROMPT_COOLDOWN_DAYS = 30;

export const getMediaKitPromptMeta = (user) => {
  const profile = user?.creator_profile || {};
  return {
    mediaKitUrl: profile.media_kit_url || profile.mediaKitUrl || null,
    dismissedAt:
      profile.media_kit_prompt_dismissed_at || profile.mediaKitPromptDismissedAt || null,
  };
};

export const daysSinceDismiss = (dateValue) => {
  if (!dateValue) return null;
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return null;
  return (Date.now() - parsed.getTime()) / (1000 * 60 * 60 * 24);
};

export const shouldShowMediaKitPrompt = (meta) => {
  if (meta?.mediaKitUrl) return false;
  if (!meta?.dismissedAt) return true;
  const elapsed = daysSinceDismiss(meta.dismissedAt);
  if (elapsed == null) return true;
  return elapsed >= MEDIA_KIT_PROMPT_COOLDOWN_DAYS;
};

export const mergeUserWithCreatorProfile = (apiUser) => {
  if (!apiUser || typeof window !== "object") return null;

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const merged = {
    ...currentUser,
    ...apiUser,
    creator_profile: {
      ...(currentUser.creator_profile || {}),
      ...(apiUser.creator_profile || {}),
    },
  };

  localStorage.setItem("user", JSON.stringify(merged));
  return merged;
};
