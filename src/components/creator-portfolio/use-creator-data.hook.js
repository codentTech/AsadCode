import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { getUser } from "@/common/utils/users.util";
import { getCreatorById } from "@/provider/features/creator-profile/creator-profile.slice";

/**
 * Custom hook to fetch and manage creator data
 */
function useCreatorData(creatorId = null, refreshKey = 0) {
  const [creatorData, setCreatorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const loadCreatorData = useCallback(async () => {
    setIsLoading(true);

    if (creatorId) {
      const result = await dispatch(getCreatorById(creatorId)).unwrap();
      if (result.success && result.data) {
        setCreatorData(result.data);
      } else {
        setCreatorData(null);
      }
    } else {
      const user = getUser();
      if (user && user.creator_profile) setCreatorData(user);
      else setCreatorData(null);
    }

    setIsLoading(false);
  }, [creatorId, dispatch]);

  useEffect(() => {
    loadCreatorData();
  }, [creatorId]);

  useEffect(() => {
    if (refreshKey > 0) loadCreatorData();
  }, [refreshKey]);

  const getCreatorProfile = useCallback(() => creatorData?.creator_profile || null, [creatorData]);

  const getCreatorCategories = useCallback(
    () => creatorData?.creator_profile?.categories || [],
    [creatorData]
  );

  const getCreatorGallery = useCallback(
    () => creatorData?.creator_profile?.gallery || [],
    [creatorData]
  );

  const getCreatorBio = useCallback(() => creatorData?.creator_profile?.bio || "", [creatorData]);

  const getCreatorPricing = useCallback(
    () => creatorData?.creator_profile?.content_rates || [],
    [creatorData]
  );

  const getCreatorSocialPlatforms = useCallback(
    () => creatorData?.creator_profile?.social_platforms || [],
    [creatorData]
  );

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
    refreshData: loadCreatorData,
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
