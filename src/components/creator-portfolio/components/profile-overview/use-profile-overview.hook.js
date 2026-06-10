import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CLEERCUT_OPEN_SHOWCASE_MODAL } from "@/common/utils/creator-showcase.util";
import { getUser, isCreatorMode } from "@/common/utils/users.util";
import { getCreatorById } from "@/provider/features/creator-profile/creator-profile.slice";
import {
  addUserToShortlist,
  getAllShortlists,
} from "@/provider/features/shortlist/shortlist.slice";
import { selectCreatorSocialAccounts } from "@/provider/features/phyllo/phyllo.slice";

export default function useProfileOverview(creatorId = null, refreshKey = 0) {
  const dispatch = useDispatch();
  const [creator, setCreator] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [focusShowcaseSection, setFocusShowcaseSection] = useState(false);
  const [saveToShortlistDialogOpen, setSaveToShortlistDialogOpen] = useState(false);

  const connectedAccounts = useSelector(selectCreatorSocialAccounts);

  const shortlists = useSelector((state) =>
    Array.isArray(state.shortlist?.getAllShortlists?.data)
      ? state.shortlist.getAllShortlists.data
      : []
  );

  const loadCreatorData = useCallback(async () => {
    setIsLoading(true);
    let data;

    if (creatorId) {
      const result = await dispatch(getCreatorById(creatorId)).unwrap();
      data = result.success ? result.data : null;
    } else {
      const user = getUser();
      data = user && user.creator_profile ? user : null;
    }

    if (data) {
      setCreator({
        name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || "Creator",
        handle: `@${data.email?.split("@")[0] || "creator"}`,
        location:
          data.city && data.country
            ? `${data.city}, ${data.country}`
            : data.city || data.country || "Location not set",
        rating: data.creator_profile?.rating || 0,
        reviewCount: data.creator_profile?.review_count || 0,
        profilePic: data.creator_profile?.profile_photo_url || null,
        bio: data.creator_profile?.bio || "",
        categories: data.creator_profile?.categories || [],
        contentRates: data.creator_profile?.content_rates || [],
        gallery: data.creator_profile?.gallery || [],
        user: data,
        miniProfilePictures: data.creator_profile?.mini_profile_pictures || [],
        mediaKitUrl: data.creator_profile?.media_kit_url || null,
      });
    }

    setIsLoading(false);
  }, [creatorId, dispatch]);

  useEffect(() => {
    loadCreatorData();
  }, [loadCreatorData]);

  useEffect(() => {
    if (refreshKey > 0) loadCreatorData();
  }, [refreshKey, loadCreatorData]);

  useEffect(() => {
    const user = getUser();
    if (creatorId && user?.id && creatorId !== user.id) return;
    if (!isCreatorMode()) return;
    if (typeof window === "undefined") return;
    const fromQuery =
      new URLSearchParams(window.location.search).get("showcase") === "1";
    let fromStorage = false;
    try {
      fromStorage = sessionStorage.getItem(CLEERCUT_OPEN_SHOWCASE_MODAL) === "1";
    } catch {
      fromStorage = false;
    }

    if (!fromQuery && !fromStorage) return;

    setFocusShowcaseSection(true);
    setIsEditModalOpen(true);

    if (fromQuery) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [creatorId]);

  const handleEditModalClose = useCallback(() => {
    setIsEditModalOpen(false);
    setFocusShowcaseSection(false);
    try {
      sessionStorage.removeItem(CLEERCUT_OPEN_SHOWCASE_MODAL);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (creatorId) dispatch(getAllShortlists());
  }, [creatorId, dispatch]);

  const handleShare = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleSaveToShortlist = () => {
    if (creatorId && creator?.user?.id) setSaveToShortlistDialogOpen(true);
  };

  const confirmSaveToShortlist = (shortlistId) => {
    if (creator?.user?.id) {
      dispatch(addUserToShortlist({ shortlistId, userId: creator.user.id }));
      setSaveToShortlistDialogOpen(false);
    }
  };

  const renderRatingStars = useCallback(() => {
    const ratingValue = Number(creator?.rating) || 0;
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue - fullStars >= 0.5;

    return Array.from({ length: 5 }).map((_, index) => {
      if (index < fullStars) return "full";
      if (hasHalfStar && index === fullStars) return "half";
      return "empty";
    });
  }, [creator]);

  return {
    creator,
    isLoading,
    shortlists,
    connectedAccounts,
    isEditModalOpen,
    setIsEditModalOpen,
    focusShowcaseSection,
    setFocusShowcaseSection,
    handleEditModalClose,
    saveToShortlistDialogOpen,
    setSaveToShortlistDialogOpen,
    handleShare,
    handleSaveToShortlist,
    confirmSaveToShortlist,
    renderRatingStars,
    isCreatorMode: isCreatorMode(),
  };
}
