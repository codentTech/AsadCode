import { avatar } from "@/common/constants/auth.constant";
import { getUser } from "@/common/utils/users.util";
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";

function useGallary(refreshKey = 0) {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedNiche, setSelectedNiche] = useState("all");
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userRef = useRef(null);
  const lastGalleryDataRef = useRef(null);

  const refreshGallery = useCallback(() => {
    // This will now be triggered by the parent's refreshKey
    loadCreatorData();
  }, []);

  // Safe function to get user data without side effects
  const getSafeUser = useCallback(() => {
    if (typeof window === "object" && window?.localStorage?.getItem("user")) {
      try {
        return JSON.parse(localStorage.getItem("user"));
      } catch (error) {
        console.error("Error parsing user data:", error);
        return null;
      }
    }
    return null;
  }, []);

  // Function to transform gallery data
  const transformGalleryData = useCallback((user) => {
    if (!user || !user.creator_profile || !user.creator_profile.gallery) {
      console.log("No gallery data found:", { user, creator_profile: user?.creator_profile });
      return [];
    }

    console.log("Processing gallery data:", user.creator_profile.gallery);
    const transformedItems = [];

    user.creator_profile.gallery.forEach((niche) => {
      if (niche.media && Array.isArray(niche.media)) {
        niche.media.forEach((mediaUrl, index) => {
          // Determine media type from URL extension
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

    console.log("Transformed gallery items:", transformedItems);
    return transformedItems;
  }, []);

  const loadCreatorData = useCallback(() => {
    const user = getSafeUser();
    userRef.current = user;

    const transformedItems = transformGalleryData(user);
    setPortfolioItems(transformedItems);

    // Store the gallery data for comparison
    if (user?.creator_profile?.gallery) {
      lastGalleryDataRef.current = JSON.stringify(user.creator_profile.gallery);
    }

    setIsLoading(false);
  }, [getSafeUser, transformGalleryData]);

  // Initialize data on mount
  useEffect(() => {
    loadCreatorData();
  }, [loadCreatorData]);

  // Update portfolio items when refreshKey changes
  useEffect(() => {
    if (refreshKey > 0) {
      loadCreatorData();
    }
  }, [refreshKey, loadCreatorData]);

  // Memoize filtered portfolio to prevent unnecessary recalculations
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
