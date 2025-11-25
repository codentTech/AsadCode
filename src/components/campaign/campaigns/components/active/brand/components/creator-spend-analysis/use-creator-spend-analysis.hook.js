import { useState } from "react";
import { useSelector } from "react-redux";
import { getAge } from "@/common/utils/date.utils";

// When used on completed tab, pass isCompleted=true so it reads from getAppliedCreators
export const useCreatorSpendAnalysis = (selectedCampaign, isCompleted = false) => {
  const [showBrandCalendar, setShowBrandCalendar] = useState(false);
  const [showTaskManager, setShowTaskManager] = useState(false);

  // Redux state - pick source based on tab
  const {
    isLoading: creatorsLoading,
    isSuccess: creatorsSuccess,
    isError: creatorsError,
    data: creatorsData,
  } = useSelector(
    (state) =>
      (isCompleted ? state.campaigns.getAppliedCreators : state.campaigns.getHiredCreators) || {}
  );

  // Process creators data from API
  const creators = Array.isArray(creatorsData?.data)
    ? creatorsData.data.map((creator) => ({
        ...creator,
        id: creator?.creator?.creator_profile?.id,
        age: getAge(creator?.creator?.date_of_birth),
        creatorUserId: creator?.creator?.id, // Add the actual user ID for chat
        name:
          `${creator.creator?.first_name || ""} ${creator.creator?.last_name || ""}`.trim() ||
          "Unknown Creator",
        bio: creator.creator?.creator_profile?.bio || "No bio available",
        image: creator.creator?.creator_profile?.profile_photo_url,
        location:
          `${creator.creator?.city || ""}, ${creator.creator?.country || ""}`.replace(
            /^,\s*|,\s*$/g,
            ""
          ) || "Location not specified",
        totalSpent: creator.total_spent || 0,
        rating: creator.creator?.rating || 0,
        reviewCount: creator.creator?.review_count || 0,
        platforms: {
          instagram: {
            followers: creator.creator?.instagram_followers || 0,
            verified: creator.creator?.instagram_verified || false,
          },
          youtube: {
            followers: creator.creator?.youtube_followers || 0,
            verified: creator.creator?.youtube_verified || false,
          },
          twitter: {
            followers: creator.creator?.twitter_followers || 0,
            verified: creator.creator?.twitter_verified || false,
          },
        },
        projects: creator.creator?.total_projects || 0,
        successRate: creator.creator?.success_rate || 0,
        avgDeliveryTime: creator.creator?.avg_delivery_time || "N/A",
        specialty: creator.creator?.specialty || "General",
        deadline:
          creator.status === "HIRED"
            ? "On time"
            : creator.status === "REJECTED"
              ? "Cancelled"
              : "Pending",
        status: creator.status,
        appliedAt: creator.applied_at,
        hiredAt: creator.hired_at,
      }))
    : [];

  const getSuccessRateColor = (rate) => {
    if (rate >= 95) return "text-green-600 bg-green-50";
    if (rate >= 90) return "text-blue-600 bg-blue-50";
    return "text-orange-600 bg-orange-50";
  };

  return {
    creators,
    creatorsLoading,
    creatorsSuccess,
    creatorsError,
    getSuccessRateColor,
    showBrandCalendar,
    setShowBrandCalendar,
    showTaskManager,
    setShowTaskManager,
  };
};
