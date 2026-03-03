import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCreatorGallery,
  selectGalleryItems,
  refreshMetricsThunk,
} from "@/provider/features/gallery/gallery.slice";

function useGallary(refreshKey = 0, creatorId = null) {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("all");
  const [selectedNiche, setSelectedNiche] = useState("all");

  const galleryState = useSelector(selectGalleryItems);
  const { data: galleryItems, isLoading } = galleryState;

  useEffect(() => {
    dispatch(fetchCreatorGallery({ creatorId, nicheId: null }));
  }, [creatorId, refreshKey, dispatch]);

  const refreshGallery = useCallback(() => {
    dispatch(fetchCreatorGallery({ creatorId, nicheId: null }));
  }, [creatorId, dispatch]);

  const handleRefreshMetrics = useCallback(
    (galleryId) => {
      dispatch(refreshMetricsThunk(galleryId));
    },
    [dispatch]
  );

  const niches = useMemo(() => {
    if (!galleryItems) return [];
    const seen = new Set();
    const result = [];
    galleryItems.forEach((item) => {
      if (item.niche_id && item.niche_name && !seen.has(item.niche_id)) {
        seen.add(item.niche_id);
        result.push({ id: item.niche_id, name: item.niche_name });
      }
    });
    return result;
  }, [galleryItems]);

  const filteredPortfolio = useMemo(() => {
    if (!galleryItems) return [];
    return galleryItems.filter((item) => {
      const matchesTab = activeTab === "all" || item.media_type === activeTab;
      const matchesNiche = selectedNiche === "all" || item.niche_id === selectedNiche;
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
    niches,
    isLoading,
    refreshGallery,
    handleRefreshMetrics,
    canRefreshMetrics,
  };
}

export default useGallary;
