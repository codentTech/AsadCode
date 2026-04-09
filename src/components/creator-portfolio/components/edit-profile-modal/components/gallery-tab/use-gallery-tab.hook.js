import {
  categoriesToNicheOptions,
  mergeNicheOptionLists,
} from "@/common/constants/genaric.constant";
import {
  deleteGalleryItemThunk,
  fetchCreatorGallery,
  refreshMetricsThunk,
  selectGalleryItems,
  selectRefreshMetrics,
} from "@/provider/features/gallery/gallery.slice";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
  const refreshMetricsState = useSelector(selectRefreshMetrics);
  const [metricsRefreshGalleryId, setMetricsRefreshGalleryId] = useState(null);
  const wasMetricsRefreshing = useRef(false);

  useEffect(() => {
    if (activeTab === "gallery") {
      dispatch(fetchCreatorGallery({ creatorId: null, nicheId: null }));
    }
  }, [activeTab, dispatch]);

  const hasPendingHostedVideo = useMemo(() => {
    if (activeTab !== "gallery" || !galleryItems?.length) return false;
    return galleryItems.some(
      (i) => i.media_type === "video" && i.source_type === "post_link" && !i.file_url
    );
  }, [activeTab, galleryItems]);

  useEffect(() => {
    if (!hasPendingHostedVideo) return;
    const intervalId = setInterval(() => {
      dispatch(fetchCreatorGallery({ creatorId: null, nicheId: null, silent: true }));
    }, 10000);
    const stopId = setTimeout(() => clearInterval(intervalId), 180000);
    return () => {
      clearInterval(intervalId);
      clearTimeout(stopId);
    };
  }, [hasPendingHostedVideo, dispatch]);

  useEffect(() => {
    const loading = refreshMetricsState.isLoading;
    if (
      wasMetricsRefreshing.current &&
      !loading &&
      metricsRefreshGalleryId !== null
    ) {
      setMetricsRefreshGalleryId(null);
    }
    wasMetricsRefreshing.current = loading;
  }, [refreshMetricsState.isLoading, metricsRefreshGalleryId]);

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
      setMetricsRefreshGalleryId(galleryId);
      dispatch(refreshMetricsThunk(galleryId));
    },
    [dispatch]
  );

  const isRefreshingMetricsFor = useCallback(
    (galleryId) => metricsRefreshGalleryId === galleryId,
    [metricsRefreshGalleryId]
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
    isRefreshingMetricsFor,
  };
};

export default useGalleryTab;
