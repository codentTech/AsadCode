import { avatar } from "@/common/constants/auth.constant";
import { getUser } from "@/common/utils/users.util";
import React, { useState, useEffect, useMemo, useCallback } from "react";

function useGallary(refreshKey = 0) {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedNiche, setSelectedNiche] = useState("all");
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const transformGalleryData = useCallback((user) => {
    if (!user || !user.creator_profile || !user.creator_profile.gallery) {
      return [];
    }

    const transformedItems = [];

    user.creator_profile.gallery.forEach((niche) => {
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

  const loadCreatorData = useCallback(() => {
    const user = getUser();
    if (user && user.creator_profile) {
      const transformedItems = transformGalleryData(user);
      setPortfolioItems(transformedItems);
    }
    setIsLoading(false);
  }, [transformGalleryData]);

  const refreshGallery = useCallback(() => {
    loadCreatorData();
  }, [loadCreatorData]);

  // Load data on component mount
  useEffect(() => {
    loadCreatorData();
  }, [loadCreatorData]);

  // Refresh when refreshKey changes (following the same pattern as other components)
  useEffect(() => {
    if (refreshKey > 0) {
      // Force immediate refresh when refreshKey changes
      const user = getUser();
      if (user && user.creator_profile) {
        const transformedItems = transformGalleryData(user);
        setPortfolioItems(transformedItems);
      }
    }
  }, [refreshKey, transformGalleryData]);

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
    isLoading,
    refreshGallery,
  };
}

export default useGallary;
