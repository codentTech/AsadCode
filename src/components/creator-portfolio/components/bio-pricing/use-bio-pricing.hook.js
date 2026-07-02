import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { getUser } from "@/common/utils/users.util";
import { getCreatorById } from "@/provider/features/creator-profile/creator-profile.slice";

function useBioPricing(creatorId = null, refreshKey = 0) {
  const dispatch = useDispatch();
  const [creatorData, setCreatorData] = useState(null);
  const [creator, setCreator] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      if (user && user.creator_profile) {
        setCreatorData(user);
      } else {
        setCreatorData(null);
      }
    }

    setIsLoading(false);
  }, [creatorId, dispatch]);

  useEffect(() => {
    loadCreatorData();
  }, [loadCreatorData]);

  useEffect(() => {
    if (refreshKey > 0) {
      loadCreatorData();
    }
  }, [refreshKey, loadCreatorData]);

  useEffect(() => {
    if (!isLoading && creatorData) {
      const bio = creatorData?.creator_profile?.bio || "";
      const pricing = creatorData?.creator_profile?.content_rates || [];

      setCreator({
        bio,
        pricing: pricing.map((rate) => ({
          type: rate.contentType,
          price: `$${rate.price || 0}`,
        })),
      });
      return;
    }

    if (!isLoading) {
      setCreator(null);
    }
  }, [isLoading, creatorData]);

  const handleManualRefresh = useCallback(() => {
    loadCreatorData();
  }, [loadCreatorData]);

  return {
    creator,
    isLoading,
    handleManualRefresh,
  };
}

export default useBioPricing;
