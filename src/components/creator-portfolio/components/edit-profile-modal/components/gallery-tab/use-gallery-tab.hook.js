import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCreatorGallery,
  selectGalleryItems,
  refreshMetricsThunk,
  deleteGalleryItemThunk,
} from "@/provider/features/gallery/gallery.slice";
import {
  categoriesToNicheOptions,
  mergeNicheOptionLists,
} from "@/common/constants/genaric.constant";

const useGalleryTab = ({ activeTab, creatorCategories = [] }) => {
  const dispatch = useDispatch();
  const galleryConfirmationRef = useRef(null);

  const [showImportModal, setShowImportModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [galleryDeleteItemId, setGalleryDeleteItemId] = useState(null);
  const [openGalleryDeleteModal, setOpenGalleryDeleteModal] = useState(false);

  const galleryState = useSelector(selectGalleryItems);
  const galleryItems = galleryState?.data || [];
  const isGalleryLoading = galleryState?.isLoading || false;

  useEffect(() => {
    if (activeTab === "gallery") {
      dispatch(fetchCreatorGallery({ creatorId: null, nicheId: null }));
    }
  }, [activeTab, dispatch]);

  const hasPendingHostedVideo = useMemo(() => {
    if (activeTab !== "gallery" || !galleryItems?.length) return false;
    return galleryItems.some(
      (i) =>
        i.media_type === "video" &&
        i.source_type === "post_link" &&
        !i.file_url
    );
  }, [activeTab, galleryItems]);

  useEffect(() => {
    if (!hasPendingHostedVideo) return;
    const intervalId = setInterval(() => {
      dispatch(fetchCreatorGallery({ creatorId: null, nicheId: null }));
    }, 10000);
    const stopId = setTimeout(() => clearInterval(intervalId), 180000);
    return () => {
      clearInterval(intervalId);
      clearTimeout(stopId);
    };
  }, [hasPendingHostedVideo, dispatch]);

  const refreshGallery = useCallback(() => {
    dispatch(fetchCreatorGallery({ creatorId: null, nicheId: null }));
  }, [dispatch]);

  const handleOpenGalleryDeleteModal = useCallback((id) => {
    setGalleryDeleteItemId(id);
    setOpenGalleryDeleteModal(true);
  }, []);

  const handleGalleryDeleteItem = useCallback(
    (id) => {
      dispatch(deleteGalleryItemThunk(id));
      setOpenGalleryDeleteModal(false);
      setGalleryDeleteItemId(null);
    },
    [dispatch]
  );

  const handleRefreshMetrics = useCallback(
    (galleryId) => {
      dispatch(refreshMetricsThunk(galleryId));
    },
    [dispatch]
  );

  const canRefreshMetrics = useCallback((item) => {
    if (item.source_type !== "post_link") return false;
    if (!item.last_metrics_refresh_at) return true;
    const now = new Date();
    const lastRefresh = new Date(item.last_metrics_refresh_at);
    const hoursSince = (now.getTime() - lastRefresh.getTime()) / (1000 * 60 * 60);
    return hoursSince >= 24;
  }, []);

  const nichesFromItems = useMemo(() => {
    if (!galleryItems?.length) return [];
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

  const galleryNiches = useMemo(
    () => mergeNicheOptionLists(categoriesToNicheOptions(creatorCategories), nichesFromItems),
    [creatorCategories, nichesFromItems]
  );

  const galleryGroupedByNiche = useMemo(() => {
    if (!galleryItems?.length) return [];
    const order = [];
    const map = new Map();
    galleryItems.forEach((item) => {
      const key = item.niche_id || "__uncategorized__";
      const label = item.niche_name || "Uncategorized";
      if (!map.has(key)) {
        map.set(key, { key, label, items: [] });
        order.push(key);
      }
      map.get(key).items.push(item);
    });
    return order.map((k) => map.get(k));
  }, [galleryItems]);

  return {
    galleryItems,
    galleryNiches,
    galleryGroupedByNiche,
    isGalleryLoading,
    refreshGallery,
    showImportModal,
    setShowImportModal,
    showUploadModal,
    setShowUploadModal,
    showBulkUploadModal,
    setShowBulkUploadModal,
    galleryDeleteItemId,
    openGalleryDeleteModal,
    setOpenGalleryDeleteModal,
    galleryConfirmationRef,
    handleOpenGalleryDeleteModal,
    handleGalleryDeleteItem,
    handleRefreshMetrics,
    canRefreshMetrics,
  };
};

export default useGalleryTab;
