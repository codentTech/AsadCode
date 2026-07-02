import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTimeline } from "@/provider/features/campaign-timeline/campaign-timeline.slice";

export default function useBrandTimeline(campaignId, creatorId, enabled = true) {
  const dispatch = useDispatch();

  const { data: timelineData, isLoading: timelineLoading } = useSelector(
    (state) => state.campaignTimeline.getTimeline || {}
  );

  // Try to get timeline from keyed storage first, fallback to general state
  const timelineKey = campaignId && creatorId ? `${campaignId}-${creatorId}` : null;
  const keyedTimelineData = useSelector((state) =>
    timelineKey ? state.campaignTimeline.timelinesByKey?.[timelineKey] : null
  );
  const generalTimelineData = useSelector((state) => state.campaignTimeline.getTimeline || {});

  // Use keyed timeline if available, otherwise use general (for backwards compatibility)
  const timelineDataToUse = keyedTimelineData || generalTimelineData;

  const timelineSteps = Array.isArray(timelineDataToUse?.data) ? timelineDataToUse.data : [];

  useEffect(() => {
    if (!enabled || !campaignId || !creatorId) {
      return;
    }

    dispatch(getTimeline({ campaignId, creatorId }));
  }, [campaignId, creatorId, dispatch, enabled]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return {
    timelineSteps,
    timelineLoading,
    formatDate,
  };
}
