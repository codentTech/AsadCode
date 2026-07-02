import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { getTimeline } from "@/provider/features/campaign-timeline/campaign-timeline.slice";

export default function usePrefetchCampaignCreatorTimelines(campaignId, creators) {
  const dispatch = useDispatch();

  const creatorUserIds = useMemo(() => {
    if (!campaignId || !Array.isArray(creators) || creators.length === 0) return [];
    const ids = creators
      .map((row) => row?.creatorUserId ?? row?.creator?.id)
      .filter((id) => id != null && id !== "")
      .map((id) => String(id));
    return [...new Set(ids)];
  }, [campaignId, creators]);

  useEffect(() => {
    if (!campaignId || creatorUserIds.length === 0) return;
    creatorUserIds.forEach((creatorId) => {
      dispatch(getTimeline({ campaignId, creatorId }));
    });
  }, [campaignId, creatorUserIds, dispatch]);
}
