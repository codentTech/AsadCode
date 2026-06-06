import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { CLEERCUT_USER_STORAGE_UPDATED } from "@/common/utils/creator-showcase.util";
import {
  getMediaKitPromptMeta,
  mergeUserWithCreatorProfile,
  shouldShowMediaKitPrompt,
} from "@/common/utils/media-kit-prompt.util";
import { getUser, isCreatorMode } from "@/common/utils/users.util";
import { getUserById, updateCampaignDefaults } from "@/provider/features/users/users.slice";

const isValidUrl = (value) => {
  const trimmed = value?.trim();
  if (!trimmed) return false;
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const readProfileMeta = () => getMediaKitPromptMeta(getUser());

export default function useMediaKitPrompt({ onSaved }) {
  const dispatch = useDispatch();
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileMeta, setProfileMeta] = useState(readProfileMeta);
  const [hasSyncedFromServer, setHasSyncedFromServer] = useState(false);

  const syncMetaFromUser = useCallback((user) => {
    if (!user) return;
    setProfileMeta(getMediaKitPromptMeta(user));
  }, []);

  useEffect(() => {
    if (!isCreatorMode()) return;

    const userId = getUser()?.id;
    if (!userId) {
      setHasSyncedFromServer(true);
      return;
    }

    dispatch(getUserById(userId)).then((result) => {
      setHasSyncedFromServer(true);
      if (!getUserById.fulfilled.match(result) || !result.payload?.success) return;

      const merged = mergeUserWithCreatorProfile(result.payload.data);
      window.dispatchEvent(new Event(CLEERCUT_USER_STORAGE_UPDATED));
      syncMetaFromUser(merged || result.payload.data);
    });
  }, [dispatch, syncMetaFromUser]);

  useEffect(() => {
    const handleStorageUpdate = () => syncMetaFromUser(getUser());
    window.addEventListener(CLEERCUT_USER_STORAGE_UPDATED, handleStorageUpdate);
    return () => window.removeEventListener(CLEERCUT_USER_STORAGE_UPDATED, handleStorageUpdate);
  }, [syncMetaFromUser]);

  const isVisible = useMemo(() => {
    if (!isCreatorMode() || !hasSyncedFromServer) return false;
    return shouldShowMediaKitPrompt(profileMeta);
  }, [profileMeta, hasSyncedFromServer]);

  const handleUrlChange = useCallback((value) => {
    setUrl(value);
  }, []);

  const applyProfileSetupResult = useCallback(
    (result, fallbackDismissedAt = null) => {
      if (!updateCampaignDefaults.fulfilled.match(result) || !result.payload?.success) {
        return false;
      }

      const apiUser = result.payload.data;
      const merged = mergeUserWithCreatorProfile(apiUser);
      const meta = getMediaKitPromptMeta(merged || apiUser);

      if (fallbackDismissedAt && !meta.dismissedAt) {
        meta.dismissedAt = fallbackDismissedAt;
        if (merged?.creator_profile) {
          merged.creator_profile.media_kit_prompt_dismissed_at = fallbackDismissedAt;
          localStorage.setItem("user", JSON.stringify(merged));
        }
      }

      setProfileMeta(meta);
      window.dispatchEvent(new Event(CLEERCUT_USER_STORAGE_UPDATED));
      return true;
    },
    []
  );

  const handleDismiss = useCallback(() => {
    const dismissedAt = new Date().toISOString();
    setIsSubmitting(true);
    setProfileMeta((prev) => ({ ...prev, dismissedAt }));

    dispatch(
      updateCampaignDefaults({
        mediaKitPromptDismissedAt: dismissedAt,
      })
    ).then((result) => {
      setIsSubmitting(false);
      const ok = applyProfileSetupResult(result, dismissedAt);
      if (!ok) {
        syncMetaFromUser(getUser());
      }
    });
  }, [dispatch, applyProfileSetupResult, syncMetaFromUser]);

  const handleSave = useCallback(() => {
    const trimmed = url.trim();
    if (!isValidUrl(trimmed)) return;

    setIsSubmitting(true);

    dispatch(updateCampaignDefaults({ mediaKitUrl: trimmed })).then((result) => {
      setIsSubmitting(false);
      if (applyProfileSetupResult(result)) {
        onSaved?.();
        return;
      }
      syncMetaFromUser(getUser());
    });
  }, [dispatch, url, onSaved, applyProfileSetupResult, syncMetaFromUser]);

  const canSave = isValidUrl(url);

  return {
    isVisible,
    url,
    handleUrlChange,
    handleDismiss,
    handleSave,
    canSave,
    isLoading: isSubmitting,
  };
}
