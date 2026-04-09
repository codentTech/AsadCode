import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCreatorGallery,
  selectGalleryItems,
  refreshMetricsThunk,
} from "@/provider/features/gallery/gallery.slice";
import { getCreatorById } from "@/provider/features/creator-profile/creator-profile.slice";
import {
  categoriesToNicheOptions,
  mergeNicheOptionLists,
} from "@/common/constants/genaric.constant";
import { getUser, isCreatorMode } from "@/common/utils/users.util";

function useGallary(refreshKey = 0, creatorId = null) {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("all");
  const [selectedNiche, setSelectedNiche] = useState("all");
  const [profileCategoryNiches, setProfileCategoryNiches] = useState([]);

  const galleryState = useSelector(selectGalleryItems);
  const { data: galleryItems, isLoading } = galleryState;

  useEffect(() => {
    let cancelled = false;
    async function loadProfileCategories() {
      if (!creatorId) {
        if (isCreatorMode()) {
          const cats = getUser()?.creator_profile?.categories ?? [];
          if (!cancelled) setProfileCategoryNiches(categoriesToNicheOptions(cats));
        } else {
          setProfileCategoryNiches([]);
        }
        return;
      }
      try {
        const result = await dispatch(getCreatorById(creatorId)).unwrap();
        if (cancelled) return;
        const user = result?.data ?? result;
        const cats = user?.creator_profile?.categories ?? [];
        setProfileCategoryNiches(categoriesToNicheOptions(cats));
      } catch {
        if (!cancelled) setProfileCategoryNiches([]);
      }
    }
    loadProfileCategories();
    return () => {
      cancelled = true;
    };
  }, [creatorId, dispatch, refreshKey]);

  useEffect(() => {
    dispatch(fetchCreatorGallery({ creatorId, nicheId: null }));
  }, [creatorId, refreshKey, dispatch]);

  const hasPendingHostedVideo = useMemo(() => {
    if (!galleryItems?.length) return false;
    return galleryItems.some(
      (i) =>
        i.media_type === "video" &&
        i.source_type === "post_link" &&
        !i.file_url
    );
  }, [galleryItems]);

  useEffect(() => {
    if (!hasPendingHostedVideo) return;
    const intervalId = setInterval(() => {
      dispatch(fetchCreatorGallery({ creatorId, nicheId: null, silent: true }));
    }, 10000);
    const stopId = setTimeout(() => clearInterval(intervalId), 180000);
    return () => {
      clearInterval(intervalId);
      clearTimeout(stopId);
    };
  }, [hasPendingHostedVideo, creatorId, dispatch]);

  const refreshGallery = useCallback(() => {
    dispatch(fetchCreatorGallery({ creatorId, nicheId: null }));
  }, [creatorId, dispatch]);

  const handleRefreshMetrics = useCallback(
    (galleryId) => {
      dispatch(refreshMetricsThunk(galleryId));
    },
    [dispatch]
  );

  const nichesFromGallery = useMemo(() => {
    if (!galleryItems?.length) return [];
    const seen = new Set();
    const out = [];
    galleryItems.forEach((item) => {
      if (item.niche_id && item.niche_name && !seen.has(item.niche_id)) {
        seen.add(item.niche_id);
        out.push({ id: item.niche_id, name: item.niche_name });
      }
    });
    return out;
  }, [galleryItems]);

  const niches = useMemo(
    () => mergeNicheOptionLists(profileCategoryNiches, nichesFromGallery),
    [profileCategoryNiches, nichesFromGallery]
  );

  const filteredPortfolio = useMemo(() => {
    if (!galleryItems) return [];
    return galleryItems.filter((item) => {
      const matchesTab = activeTab === "all" || item.media_type === activeTab;
      const matchesNiche =
        selectedNiche === "all" || String(item.niche_id) === String(selectedNiche);
      return matchesTab && matchesNiche;
    });
  }, [galleryItems, activeTab, selectedNiche]);

  const canRefreshMetrics = useCallback((item) => {
    if (item.source_type !== "post_link") return false;
    if (!item.last_metrics_refresh_at) return true;
    const now = new Date();
    const lastRefresh = new Date(item.last_metrics_refresh_at);
    const hoursSince = (now.getTime() - lastRefresh.getTime()) / (1000 * 60 * 60);
    return hoursSince >= 24;
  }, []);

  return {
    activeTab,
    setActiveTab,
    selectedNiche,
    setSelectedNiche,
    filteredPortfolio,
    galleryItems,
    niches,
    isLoading,
    refreshGallery,
    handleRefreshMetrics,
    canRefreshMetrics,
  };
}

export default useGallary;
