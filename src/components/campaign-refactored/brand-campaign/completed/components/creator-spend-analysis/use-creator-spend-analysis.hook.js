import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCreatorSpendAnalysis } from "../../../active/components/creator-spend-analysis/use-creator-spend-analysis.hook";
import { getTimeline } from "@/provider/features/campaign-timeline/campaign-timeline.slice";
import { fetchCampaignPerformanceMetrics } from "@/provider/features/phyllo/phyllo.slice";
import { CAMPAIGN_TYPE } from "@/common/constants/campaign.constant";
import { formatFollowers } from "@/common/utils/format.utils";
import { buildCreatorPublishedMetricsMap } from "@/common/utils/published-campaign-metrics.util";

/**
 * Builds comparison label relative to campaign average for a given metric value.
 */
function buildComparison(value, campaignAverage, formatFn, isRate = false, isCurrency = false) {
  if (value == null || campaignAverage == null) {
    return { label: "N/A", textColor: "text-gray-400" };
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
  onClearCreator,
  onSortChange,
  isCompleted = true,
  isMultiCreator = true,
}) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const hookData = useCreatorSpendAnalysis(
    selectedCampaign,
    isCompleted,
    isMultiCreator,
    onClearCreator,
    selectedCreator,
    onCreatorSelect,
    onSortChange
  );

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
    return buildCreatorPublishedMetricsMap({
      creatorsList: Array.isArray(creatorsData?.data) ? creatorsData.data : [],
      timelinesByKey,
      campaignId: selectedCampaign.id,
      creatorBreakdown,
    });
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
    const cpvValues = values.map((m) => m.costPerView).filter((v) => v !== null && v !== undefined);
    const avgCPV =
      cpvValues.length > 0 ? cpvValues.reduce((s, v) => s + v, 0) / cpvValues.length : null;

    return { avgViews, avgEngagement, avgER, avgCPE, avgCPV };
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
        views: { label: "N/A", textColor: "text-gray-400" },
        engagement: { label: "N/A", textColor: "text-gray-400" },
        er: { label: "N/A", textColor: "text-gray-400" },
        cpv: { label: "N/A", textColor: "text-gray-400" },
        cpe: { label: "N/A", textColor: "text-gray-400" },
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
      cpv: buildComparison(creatorMetrics.costPerView, campaignAverages.avgCPV, null, false, true),
      cpe: buildComparison(
        creatorMetrics.costPerEngagement,
        campaignAverages.avgCPE,
        null,
        false,
        true
      ),
    };
  };

  const formatMetricValue = (value, type) => {
    if (value == null) return "N/A";
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
    formatMetricValue,
  };
};
