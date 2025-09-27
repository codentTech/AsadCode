import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUser } from "@/common/utils/users.util";
import { getCreatorById } from "@/provider/features/creator-profile/creator-profile.slice";

/**
 * Custom hook for managing creator data across portfolio components
 * Handles both creator mode (current user) and brand mode (specific creator)
 *
 * @param {string|null} creatorId - Creator ID for brand view, null for creator mode
 * @param {number} refreshKey - Key to trigger data refresh
 * @returns {Object} Creator data and loading state
 */
function useCreatorData(creatorId = null, refreshKey = 0) {
  const [creatorData, setCreatorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const loadCreatorData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (creatorId) {
        // Load creator by ID for brand view
        const result = await dispatch(getCreatorById(creatorId)).unwrap();
        if (result.success && result.data) {
          setCreatorData(result.data);
        } else {
          setError("Failed to load creator data");
        }
      } else {
        // Load current user's profile (creator mode)
        const user = getUser();
        if (user && user.creator_profile) {
          setCreatorData(user);
        } else {
          setError("No creator profile found");
        }
      }
    } catch (err) {
      console.error("Failed to load creator:", err);
      setError(err.message || "Failed to load creator data");
    } finally {
      setIsLoading(false);
    }
  }, [creatorId, dispatch]);

  // Load data on component mount and when creatorId changes
  useEffect(() => {
    loadCreatorData();
  }, [creatorId]); // Only depend on creatorId, not loadCreatorData

  // Refresh when refreshKey changes
  useEffect(() => {
    if (refreshKey > 0) {
      loadCreatorData();
    }
  }, [refreshKey]); // Only depend on refreshKey, not loadCreatorData

  // Helper functions to extract specific data
  const getCreatorProfile = useCallback(() => {
    return creatorData?.creator_profile || null;
  }, [creatorData]);

  const getCreatorCategories = useCallback(() => {
    return creatorData?.creator_profile?.categories || [];
  }, [creatorData]);

  const getCreatorGallery = useCallback(() => {
    return creatorData?.creator_profile?.gallery || [];
  }, [creatorData]);

  const getCreatorBio = useCallback(() => {
    return creatorData?.creator_profile?.bio || "";
  }, [creatorData]);

  const getCreatorPricing = useCallback(() => {
    return creatorData?.creator_profile?.content_rates || [];
  }, [creatorData]);

  const getCreatorSocialPlatforms = useCallback(() => {
    return creatorData?.creator_profile?.social_platforms || [];
  }, [creatorData]);

  const getCreatorBasicInfo = useCallback(() => {
    if (!creatorData) return null;

    return {
      id: creatorData.id,
      name: `${creatorData.first_name || ""} ${creatorData.last_name || ""}`.trim() || "Creator",
      email: creatorData.email,
      city: creatorData.city,
      country: creatorData.country,
      dateOfBirth: creatorData.date_of_birth,
      profilePhoto: creatorData.creator_profile?.profile_photo_url,
      miniProfilePictures: creatorData.creator_profile?.mini_profile_pictures || [],
    };
  }, [creatorData]);

  return {
    creatorData,
    isLoading,
    error,
    refreshData: loadCreatorData,
    // Helper functions
    getCreatorProfile,
    getCreatorCategories,
    getCreatorGallery,
    getCreatorBio,
    getCreatorPricing,
    getCreatorSocialPlatforms,
    getCreatorBasicInfo,
  };
}

export default useCreatorData;
