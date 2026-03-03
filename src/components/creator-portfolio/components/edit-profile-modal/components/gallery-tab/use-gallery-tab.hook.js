import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCreatorGallery,
  selectGalleryItems,
  refreshMetricsThunk,
  deleteGalleryItemThunk,
} from "@/provider/features/gallery/gallery.slice";

const useGalleryTab = ({ activeTab }) => {
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

  const galleryNiches = useMemo(() => {
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

  return {
    galleryItems,
    galleryNiches,
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
