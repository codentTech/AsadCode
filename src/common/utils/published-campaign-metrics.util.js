import { TIMELINE_STEPS } from "@/common/constants/campaign.constant";

export function extractCreatorPublishedMetrics(
  timelinesByKey,
  campaignId,
  creatorUserId,
  creatorFee
) {
  if (!campaignId || !creatorUserId) return null;

  const key = `${campaignId}-${creatorUserId}`;
  const timelineSource = timelinesByKey?.[key];
  const steps = Array.isArray(timelineSource?.data) ? timelineSource.data : [];

  const publishedStep = steps.find(
    (s) =>
      s.step_type === TIMELINE_STEPS.FINAL_PUBLISHED || s.step === TIMELINE_STEPS.FINAL_PUBLISHED
  );

  const publishedUrl = publishedStep?.published_url || publishedStep?.data?.published_url || null;

  if (!publishedUrl) return null;

  const engagement = publishedStep?.engagement || publishedStep?.data?.engagement || null;

  if (!engagement) return { publishedUrl, metricsUnavailable: true };

  const views = Number(engagement.view_count ?? engagement.views ?? 0);
  const likes = Number(engagement.like_count ?? engagement.likes ?? 0);
  const comments = Number(engagement.comment_count ?? engagement.comments ?? 0);
  const shares = Number(engagement.share_count ?? engagement.shares ?? 0);
  const saves = Number(engagement.save_count ?? engagement.saves ?? 0);

  const totalEngagement = likes + comments + shares + saves;
  const engagementRate = views > 0 ? totalEngagement / views : 0;
  const fee = Number(creatorFee);
  const feeNum = Number.isFinite(fee) ? fee : 0;
  const costPerView = views > 0 ? feeNum / views : null;
  const costPerEngagement = totalEngagement > 0 ? feeNum / totalEngagement : null;

  return {
    publishedUrl,
    views,
    totalEngagement,
    engagementRate,
    costPerView,
    costPerEngagement,
  };
}

export function buildCreatorPublishedMetricsMap({
  creatorsList,
  timelinesByKey,
  campaignId,
  creatorBreakdown,
}) {
  if (!campaignId || !Array.isArray(creatorsList)) return {};

  const map = {};
  const breakdown = creatorBreakdown && typeof creatorBreakdown === "object" ? creatorBreakdown : {};

  creatorsList.forEach((c) => {
    const creatorUserId = c.creator?.id || c.creatorUserId;
    if (!creatorUserId) return;

    const feeRaw =
      c.total_spent ??
      c.totalSpent ??
      c.contract?.totalCompensation ??
      c.contract?.total_compensation ??
      0;
    const feeNum = Number(feeRaw);
    const fee = Number.isFinite(feeNum) ? feeNum : 0;
    const fromApi = breakdown[creatorUserId];
    const fromTimeline = extractCreatorPublishedMetrics(
      timelinesByKey,
      campaignId,
      creatorUserId,
      fee
    );

    if (fromApi && (fromApi.views != null || fromApi.totalEngagement != null)) {
      const apiViews = fromApi.views ?? 0;
      const apiEngagement = fromApi.totalEngagement ?? 0;
      map[creatorUserId] = {
        publishedUrl: fromApi.publishedUrl || fromTimeline?.publishedUrl,
        views: apiViews,
        totalEngagement: apiEngagement,
        engagementRate: fromApi.engagementRate ?? 0,
        costPerView:
          fromApi.costPerView != null
            ? Number(fromApi.costPerView)
            : apiViews > 0
              ? Number((fee / apiViews).toFixed(2))
              : null,
        costPerEngagement:
          fromApi.costPerEngagement != null
            ? Number(fromApi.costPerEngagement)
            : apiEngagement > 0
              ? Number((fee / apiEngagement).toFixed(2))
              : null,
      };
    } else {
      map[creatorUserId] = fromTimeline;
    }
  });

  return map;
}

export function aggregateCombinedPublishedMetrics(metricsMap) {
  const values = Object.values(metricsMap || {}).filter(
    (m) => m && !m.metricsUnavailable && m.views != null
  );
  if (values.length === 0) return null;

  const totalViews = values.reduce((s, m) => s + m.views, 0);
  const totalEngagement = values.reduce((s, m) => s + m.totalEngagement, 0);
  const avgEngagementRateDecimal =
    values.reduce((s, m) => s + m.engagementRate, 0) / values.length;
  const cpvVals = values
    .map((m) => m.costPerView)
    .filter((v) => v != null && v !== undefined && Number.isFinite(Number(v)));
  const cpeVals = values
    .map((m) => m.costPerEngagement)
    .filter((v) => v != null && v !== undefined && Number.isFinite(Number(v)));
  const avgCostPerView =
    cpvVals.length > 0 ? cpvVals.reduce((s, v) => s + v, 0) / cpvVals.length : null;
  const avgCostPerEngagement =
    cpeVals.length > 0 ? cpeVals.reduce((s, v) => s + v, 0) / cpeVals.length : null;

  return {
    totalViews,
    totalEngagement,
    avgEngagementRateDecimal,
    avgCostPerView,
    avgCostPerEngagement,
    creatorsWithData: values.length,
  };
}
