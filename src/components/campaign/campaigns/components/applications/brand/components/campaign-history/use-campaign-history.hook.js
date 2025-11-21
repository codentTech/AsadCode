import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCampaignHistory } from "@/provider/features/campaigns/campaigns.slice";

export default function useCampaignHistory(campaignId) {
  const dispatch = useDispatch();

  const {
    data: historyData,
    isLoading,
    isError,
    isSuccess,
  } = useSelector((state) => state.campaigns.getCampaignHistory || {});

  useEffect(() => {
    if (campaignId) {
      dispatch(getCampaignHistory(campaignId));
    }
  }, [dispatch, campaignId]);

  const history = historyData?.data?.data || [];

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    }
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }
    if (diffInSeconds < 2592000) {
      const weeks = Math.floor(diffInSeconds / 604800);
      return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
    }
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  };

  return {
    history: history.map((item) => ({
      ...item,
      time: formatTimeAgo(item.created_at),
      action: item.description,
    })),
    isLoading,
    isError,
    isSuccess,
  };
}

