import { useState } from "react";
import { useSelector } from "react-redux";

export const useCreatorSpendAnalysis = (selectedCampaign) => {
  const [open, setOpen] = useState(false);
  const [showBrandCalendar, setShowBrandCalendar] = useState(false);
  const [showTaskManager, setShowTaskManager] = useState(false);

  // Redux state - use the hired creators data for active-completed tab
  const {
    isLoading: creatorsLoading,
    isSuccess: creatorsSuccess,
    isError: creatorsError,
    data: creatorsData,
  } = useSelector((state) => state.campaigns.getHiredCreators || {});

  // Process creators data from API
  const creators = Array.isArray(creatorsData?.data)
    ? creatorsData.data.map((creator) => ({
        id: creator?.creator?.creator_profile?.id,
        name:
          `${creator.creator?.first_name || ""} ${creator.creator?.last_name || ""}`.trim() ||
          "Unknown Creator",
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

  const formatFollowers = (count) => {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K`;
    return count.toString();
  };

  const getPlatformColor = (platform) => {
    const colors = {
      instagram: "text-pink-600",
      youtube: "text-red-600",
      twitter: "text-blue-600",
    };
    return colors[platform] || "text-gray-600";
  };

  const getSuccessRateColor = (rate) => {
    if (rate >= 95) return "text-green-600 bg-green-50";
    if (rate >= 90) return "text-blue-600 bg-blue-50";
    return "text-orange-600 bg-orange-50";
  };

  const handleOpenModal = () => setOpen(true);

  const handleCloseModal = () => setOpen(false);

  return {
    open,
    creators,
    creatorsLoading,
    creatorsSuccess,
    creatorsError,
    formatFollowers,
    getPlatformColor,
    getSuccessRateColor,
    handleOpenModal,
    handleCloseModal,
    showBrandCalendar,
    setShowBrandCalendar,
    showTaskManager,
    setShowTaskManager,
  };
};
