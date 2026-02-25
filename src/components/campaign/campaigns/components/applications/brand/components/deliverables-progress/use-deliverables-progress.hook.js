import { useMemo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { avatar } from "@/common/constants/auth.constant";
import { getAge } from "@/common/utils/date.utils";
import {
  fetchCreatorMetrics,
  fetchCreatorAudience,
  selectCreatorMetrics,
  selectCreatorAudience,
  resetMetrics,
  resetAudience,
} from "@/provider/features/phyllo/phyllo.slice";

const useDeliverablesProgress = (selectedCreator, isIndividualCreator) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const creatorMetricsState = useSelector(selectCreatorMetrics);
  const creatorAudienceState = useSelector(selectCreatorAudience);

  const getCreatorData = () => {
    if (!selectedCreator) return null;

    if (selectedCreator.creator) {
      const creator = selectedCreator?.creator;
      const profile = creator?.creator_profile;
      const appliedDate = selectedCreator.applied_at || selectedCreator.created_at;

      return {
        id: selectedCreator.id || creator.id,
        name: `${creator.first_name || ""} ${creator.last_name || ""}`.trim(),
        image: profile?.profile_photo_url || avatar,
        location:
          `${creator.city || ""} ${creator.country || ""}`.trim() || "Location not specified",
        rating: parseFloat(profile?.rating) || 0,
        appliedDate: appliedDate ? new Date(appliedDate).toLocaleDateString() : "",
        pitch: selectedCreator.custom_message || selectedCreator.pitch || "",
        status: selectedCreator.status || "PENDING",
        profile: profile,
        bio: profile?.bio || "",
        age: getAge(creator.date_of_birth),
        reviewCount: profile?.review_count || 0,
      };
    }

    return selectedCreator;
  };

  const creatorData = useMemo(() => getCreatorData(), [selectedCreator]);

  const creatorProfileId = useMemo(() => {
    if (!selectedCreator) return null;
    return (
      selectedCreator?.creator?.creator_profile?.id || selectedCreator?.creator_profile?.id || null
    );
  }, [selectedCreator]);

  const creatorUserId = useMemo(() => {
    if (!selectedCreator) return null;
    return selectedCreator?.creator?.id || selectedCreator?.id || null;
  }, [selectedCreator]);

  const handleViewCreatorPortfolio = useCallback(() => {
    if (creatorUserId) {
      router.push(`/creator-profile/${creatorUserId}`);
    }
  }, [creatorUserId, router]);

  useEffect(() => {
    if (creatorUserId) {
      dispatch(fetchCreatorMetrics(creatorUserId));
    }
    return () => dispatch(resetMetrics());
  }, [creatorUserId, dispatch]);

  const metricsPayload = creatorMetricsState?.data?.data ?? null;
  const performanceMetrics = useMemo(() => {
    if (!metricsPayload?.metrics) return null;
    const m = metricsPayload.metrics;
    const meta = metricsPayload.metadata ?? {};
    return {
      engagement_rate:
        m.engagementRate?.value != null ? `${Number(m.engagementRate.value).toFixed(1)}%` : null,
      average_reach:
        meta.medianReach != null
          ? Number(meta.medianReach).toLocaleString()
          : m.reachEfficiency?.value != null
            ? `${Number(m.reachEfficiency.value).toFixed(1)}%`
            : null,
      average_views:
        m.averageViews?.value != null ? Number(m.averageViews.value).toLocaleString() : null,
      posting_frequency:
        meta.postsPerMonth != null ? `${Number(meta.postsPerMonth).toFixed(1)}/mo` : null,
    };
  }, [metricsPayload]);

  const audienceData = creatorAudienceState?.data ?? null;
  const audienceLoading = creatorAudienceState?.isLoading ?? false;

  return {
    creatorData,
    creatorProfileId,
    creatorUserId,
    handleViewCreatorPortfolio,
    performanceMetrics,
    performanceMetricsLoading: creatorMetricsState?.isLoading ?? false,
    audienceData,
    audienceLoading,
  };
};

export default useDeliverablesProgress;
