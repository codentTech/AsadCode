import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCreatorSpendAnalysis } from "../../../../active/brand/components/creator-spend-analysis/use-creator-spend-analysis.hook";
import { getTimeline } from "@/provider/features/campaign-timeline/campaign-timeline.slice";
import { fetchCampaignPerformanceMetrics } from "@/provider/features/phyllo/phyllo.slice";
import { TIMELINE_STEPS, CAMPAIGN_TYPE } from "@/common/constants/campaign.constant";
import { COMPENSATION_TYPE } from "@/common/constants/campaign.constant";

/**
 * Extracts post-level metrics from the FINAL_PUBLISHED timeline step for a creator.
 * Returns null if no published post exists or no engagement data is available.
 */
function extractCreatorMetrics(timelinesByKey, campaignId, creatorUserId, creatorFee) {
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
  const costPerEngagement = totalEngagement > 0 ? (creatorFee || 0) / totalEngagement : null;

  return {
    publishedUrl,
    views,
    totalEngagement,
    engagementRate,
    costPerEngagement,
  };
}

/**
 * Builds comparison label relative to campaign average for a given metric value.
 */
function buildComparison(value, campaignAverage, formatFn, isRate = false, isCurrency = false) {
  if (value == null || campaignAverage == null) {
    return { label: "—", textColor: "text-gray-400" };
  }
  const diff = value - campaignAverage;
  const isAbove = diff >= 0;
  let formatted;
  if (isRate) {
    formatted = `${Math.abs(diff * 100).toFixed(1)}%`;
  } else if (isCurrency) {
    formatted = `$${Math.abs(diff).toFixed(2)}`;
  } else {
    formatted = formatFn ? formatFn(Math.abs(diff)) : Math.abs(diff).toString();
  }
  return {
    label: `${isAbove ? "+" : "-"}${formatted} vs avg`,
    textColor: isAbove ? "text-green-600" : "text-red-600",
  };
}

export const useCreatorSpendAnalysisCompleted = ({
  selectedCampaign,
  selectedCreator,
  onCreatorSelect,
  isCompleted = true,
  isMultiCreator = true,
}) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const hookData = useCreatorSpendAnalysis(selectedCampaign, isCompleted, isMultiCreator);

  const timelinesByKey = useSelector((state) => state.campaignTimeline.timelinesByKey || {});
  const performanceData = useSelector(
    (state) => state.phyllo?.fetchCampaignPerformanceMetrics?.data || null
  );
  const creatorBreakdown = performanceData?.creator_breakdown || {};

  const { data: creatorsData } = useSelector((state) => state.campaigns.getAppliedCreators || {});

  const isUgc = selectedCampaign?.campaign_type === CAMPAIGN_TYPE.UGC;

  useEffect(() => {
    if (selectedCampaign?.id && !isUgc) {
      dispatch(fetchCampaignPerformanceMetrics(selectedCampaign.id));
    }
  }, [dispatch, selectedCampaign?.id, isUgc]);

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  const getPlatformEntries = (platforms) => {
    if (Array.isArray(platforms)) {
      return platforms.map((p) => [p.name, { followers: p.followers }]);
    }
    return Object.entries(platforms || {});
  };

  /**
   * Per-creator metrics map: creatorUserId → metrics object.
   * Prefer API creator_breakdown (from campaign performance metrics); fallback to timeline engagement.
   */
  const creatorMetricsMap = useMemo(() => {
    if (isUgc || !selectedCampaign?.id) return {};

    const creators = Array.isArray(creatorsData?.data) ? creatorsData.data : [];
    const map = {};

    creators.forEach((c) => {
      const creatorUserId = c.creator?.id || c.creatorUserId;
      if (!creatorUserId) return;

      const fee = c.total_spent || c.totalSpent || c.contract?.totalCompensation || 0;
      const fromApi = creatorBreakdown[creatorUserId];
      const fromTimeline = extractCreatorMetrics(
        timelinesByKey,
        selectedCampaign.id,
        creatorUserId,
        fee
      );

      if (fromApi && (fromApi.views != null || fromApi.totalEngagement != null)) {
        map[creatorUserId] = {
          publishedUrl: fromApi.publishedUrl || fromTimeline?.publishedUrl,
          views: fromApi.views ?? 0,
          totalEngagement: fromApi.totalEngagement ?? 0,
          engagementRate: fromApi.engagementRate ?? 0,
          costPerEngagement:
            fromApi.costPerEngagement != null
              ? fromApi.costPerEngagement
              : fromApi.totalEngagement > 0 && fee
                ? fee / fromApi.totalEngagement
                : null,
        };
      } else {
        map[creatorUserId] = fromTimeline;
      }
    });

    return map;
  }, [isUgc, selectedCampaign?.id, creatorsData, timelinesByKey, creatorBreakdown]);

  /**
   * Campaign-level averages (for comparison labels).
   * ER and CPE use the averaged formula per spec §3.
   */
  const campaignAverages = useMemo(() => {
    const values = Object.values(creatorMetricsMap).filter(
      (m) => m && !m.metricsUnavailable && m.views != null
    );
    if (values.length === 0) return null;

    const avgViews = values.reduce((s, m) => s + m.views, 0) / values.length;
    const avgEngagement = values.reduce((s, m) => s + m.totalEngagement, 0) / values.length;
    const avgER = values.reduce((s, m) => s + m.engagementRate, 0) / values.length;
    const cpeValues = values
      .map((m) => m.costPerEngagement)
      .filter((v) => v !== null && v !== undefined);
    const avgCPE =
      cpeValues.length > 0 ? cpeValues.reduce((s, v) => s + v, 0) / cpeValues.length : null;

    return { avgViews, avgEngagement, avgER, avgCPE };
  }, [creatorMetricsMap]);

  /**
   * Returns per-creator metrics for a given creator object.
   */
  const getCreatorMetrics = (creator) => {
    if (isUgc) return null;
    const uid = creator?.creator?.id || creator?.creatorUserId;
    return uid ? (creatorMetricsMap[uid] ?? null) : null;
  };

  /**
   * Returns comparison labels for a creator's metrics vs campaign average.
   */
  const getCreatorComparisons = (creatorMetrics) => {
    if (!creatorMetrics || creatorMetrics.metricsUnavailable || !campaignAverages) {
      return {
        views: { label: "—", textColor: "text-gray-400" },
        engagement: { label: "—", textColor: "text-gray-400" },
        er: { label: "—", textColor: "text-gray-400" },
        cpe: { label: "—", textColor: "text-gray-400" },
      };
    }
    return {
      views: buildComparison(
        creatorMetrics.views,
        campaignAverages.avgViews,
        hookData.formatFollowers
      ),
      engagement: buildComparison(
        creatorMetrics.totalEngagement,
        campaignAverages.avgEngagement,
        hookData.formatFollowers
      ),
      er: buildComparison(creatorMetrics.engagementRate, campaignAverages.avgER, null, true),
      cpe: buildComparison(
        creatorMetrics.costPerEngagement,
        campaignAverages.avgCPE,
        null,
        false,
        true
      ),
    };
  };

  const handleSortChange = (option) => {
    if (onSortChange && option?.value) {
      onSortChange(option.value);
    }
  };

  const formatMetricValue = (value, type) => {
    if (value == null) return "—";
    if (type === "views" || type === "engagement") return formatFollowers(value);
    if (type === "rate") return `${(value * 100).toFixed(1)}%`;
    if (type === "currency") return `$${value.toFixed(2)}`;
    return String(value);
  };

  return {
    ...hookData,
    open,
    handleOpenModal,
    handleCloseModal,
    getPlatformEntries,
    isUgc,
    getCreatorMetrics,
    getCreatorComparisons,
    campaignAverages,
    handleSortChange,
    formatMetricValue,
  };
};
