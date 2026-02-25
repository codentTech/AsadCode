import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTimeline } from "@/provider/features/campaign-timeline/campaign-timeline.slice";
import { CAMPAIGN_TYPE, TIMELINE_STEPS } from "@/common/constants/campaign.constant";

/**
 * Derives per-creator post metrics from the FINAL_PUBLISHED timeline step.
 *
 * Data flow:
 *   timeline step (FINAL_PUBLISHED) → published_url + engagement fields
 *   engagement fields come from Phyllo ingestion stored on the step itself.
 *
 * Formula reference (spec §2):
 *   totalViews        = step.engagement.view_count
 *   totalEngagement   = likes + comments + shares + saves
 *   engagementRate    = totalEngagement / totalViews  (0 if views = 0)
 *   costPerEngagement = creatorFee / totalEngagement  (null if engagement = 0)
 */
export function useCreatorPostMetrics({ campaignId, creatorUserId, creatorFee = 0 }) {
  const dispatch = useDispatch();

  const timelineKey = campaignId && creatorUserId ? `${campaignId}-${creatorUserId}` : null;

  const keyedTimeline = useSelector((state) =>
    timelineKey ? state.campaignTimeline.timelinesByKey?.[timelineKey] : null
  );
  const generalTimeline = useSelector((state) => state.campaignTimeline.getTimeline || {});
  const timelineSource = keyedTimeline || generalTimeline;
  const timelineSteps = Array.isArray(timelineSource?.data) ? timelineSource.data : [];

  useEffect(() => {
    if (!campaignId || !creatorUserId) return;
    dispatch(getTimeline({ campaignId, creatorId: creatorUserId }));
  }, [campaignId, creatorUserId, dispatch]);

  const metrics = useMemo(() => {
    const publishedStep = timelineSteps.find(
      (s) =>
        s.step_type === TIMELINE_STEPS.FINAL_PUBLISHED || s.step === TIMELINE_STEPS.FINAL_PUBLISHED
    );

    const publishedUrl = publishedStep?.published_url || publishedStep?.data?.published_url || null;
    const engagement = publishedStep?.engagement || publishedStep?.data?.engagement || null;

    if (!publishedUrl) {
      return { hasPublishedPost: false, publishedUrl: null, metrics: null };
    }

    if (!engagement) {
      return {
        hasPublishedPost: true,
        publishedUrl,
        metrics: null,
        metricsUnavailable: true,
      };
    }

    const views = Number(engagement.view_count ?? engagement.views ?? 0);
    const likes = Number(engagement.like_count ?? engagement.likes ?? 0);
    const comments = Number(engagement.comment_count ?? engagement.comments ?? 0);
    const shares = Number(engagement.share_count ?? engagement.shares ?? 0);
    const saves = Number(engagement.save_count ?? engagement.saves ?? 0);

    const totalEngagement = likes + comments + shares + saves;
    const engagementRate = views > 0 ? totalEngagement / views : 0;
    const costPerEngagement = totalEngagement > 0 ? creatorFee / totalEngagement : null;

    return {
      hasPublishedPost: true,
      publishedUrl,
      metrics: {
        views,
        totalEngagement,
        engagementRate,
        costPerEngagement,
        breakdown: { likes, comments, shares, saves },
      },
    };
  }, [timelineSteps, creatorFee]);

  return metrics;
}
