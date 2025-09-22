import { avatar } from "@/common/constants/auth.constant";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import useCreatorData from "../../use-creator-data.hook";

function useGallary(refreshKey = 0, creatorId = null) {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedNiche, setSelectedNiche] = useState("all");
  const [portfolioItems, setPortfolioItems] = useState([]);
  const { isLoading, error, getCreatorGallery, getCreatorCategories, refreshData } = useCreatorData(
    creatorId,
    refreshKey
  );

  const transformGalleryData = useCallback((gallery) => {
    if (!gallery || !Array.isArray(gallery)) {
      return [];
    }

    const transformedItems = [];

    gallery.forEach((niche) => {
      if (niche.media && Array.isArray(niche.media)) {
        niche.media.forEach((mediaUrl, index) => {
          const isVideo =
            mediaUrl.includes(".mp4") ||
            mediaUrl.includes(".mov") ||
            mediaUrl.includes(".avi") ||
            mediaUrl.includes(".webm");
          const isImage =
            mediaUrl.includes(".jpg") ||
            mediaUrl.includes(".jpeg") ||
            mediaUrl.includes(".png") ||
            mediaUrl.includes(".gif") ||
            mediaUrl.includes(".webp");

          if (isVideo || isImage) {
            transformedItems.push({
              id: `${niche.niche}-${index}`,
              image: mediaUrl,
              caption: `${niche.niche} - ${isVideo ? "Video" : "Image"}`,
              type: isVideo ? "video" : "image",
              niche: niche.niche,
              url: mediaUrl,
            });
          }
        });
      }
    });

    return transformedItems;
  }, []);

  // Transform gallery data when it changes
  useEffect(() => {
    if (!isLoading && !error) {
      const gallery = getCreatorGallery();
      const transformedItems = transformGalleryData(gallery);
      setPortfolioItems(transformedItems);
    }
  }, [isLoading, error, getCreatorGallery, transformGalleryData]);

  const refreshGallery = useCallback(() => {
    refreshData();
  }, [refreshData]);

  const filteredPortfolio = useMemo(() => {
    return portfolioItems.filter((item) => {
      const matchesTab = activeTab === "all" || item.type === activeTab;
      const matchesNiche = selectedNiche === "all" || item.niche === selectedNiche;
      return matchesTab && matchesNiche;
    });
  }, [portfolioItems, activeTab, selectedNiche]);

  return {
    activeTab,
    setActiveTab,
    selectedNiche,
    setSelectedNiche,
    filteredPortfolio,
    portfolioItems,
    creatorCategories: getCreatorCategories(),
    isLoading,
    error,
    refreshGallery,
  };
}

export default useGallary;
