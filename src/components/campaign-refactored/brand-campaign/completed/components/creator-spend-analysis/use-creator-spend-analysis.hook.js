import { CAMPAIGN_TYPE } from "@/common/constants/campaign.constant";
import { getConnectedPlatformEntries } from "@/common/utils/creator-platforms.utils";
import { formatFollowers } from "@/common/utils/format.utils";
import {
  buildCreatorPublishedMetricsMap,
  resolveCreatorRowUserId,
} from "@/common/utils/published-campaign-metrics.util";
import usePrefetchCampaignCreatorTimelines from "@/common/hooks/use-prefetch-campaign-creator-timelines.hook";
import { fetchCampaignPerformanceMetrics } from "@/provider/features/phyllo/phyllo.slice";
import {
  getShopifyCompletedMetrics,
  selectShopifyCompletedMetricsState,
} from "@/provider/features/shopify/shopify.slice";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCreatorSpendAnalysis } from "../../../active/components/creator-spend-analysis/use-creator-spend-analysis.hook";

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
  currentSort = "urgency",
  isCompleted = true,
}) => {
  const dispatch = useDispatch();
  const hookData = useCreatorSpendAnalysis(
    selectedCampaign,
    isCompleted,
    true,
    onClearCreator,
    selectedCreator,
    onCreatorSelect,
    onSortChange,
    currentSort
  );

  const timelinesByKey = useSelector((state) => state.campaignTimeline.timelinesByKey || {});
  const performanceFetch = useSelector(
    (state) => state.phyllo?.fetchCampaignPerformanceMetrics || {}
  );
  const performanceData = performanceFetch?.data || null;
  const creatorBreakdown = performanceData?.creator_breakdown || {};
  const completedMetricsState = useSelector(selectShopifyCompletedMetricsState);
  const isUgc = selectedCampaign?.campaign_type === CAMPAIGN_TYPE.UGC;
  const isAffiliate = useMemo(() => {
    const type =
      selectedCampaign?.campaign_type ||
      selectedCampaign?.campaignType ||
      selectedCampaign?.type;
    const compensation = selectedCampaign?.compensation_type;
    return type === CAMPAIGN_TYPE.AFFILIATE || compensation === "COMMISSION";
  }, [selectedCampaign]);

  const creatorsListForPublishedMetrics = useMemo(
    () => (Array.isArray(hookData.creators) ? hookData.creators : []),
    [hookData.creators]
  );

  usePrefetchCampaignCreatorTimelines(
    !isUgc ? selectedCampaign?.id : null,
    creatorsListForPublishedMetrics
  );

  useEffect(() => {
    if (selectedCampaign?.id && !isUgc) {
      dispatch(fetchCampaignPerformanceMetrics(selectedCampaign.id));
    }
  }, [dispatch, selectedCampaign?.id, isUgc]);

  useEffect(() => {
    if (isAffiliate && selectedCampaign?.id) {
      dispatch(getShopifyCompletedMetrics(selectedCampaign.id));
    }
  }, [dispatch, isAffiliate, selectedCampaign?.id]);

  const salesByCreatorId = useMemo(() => {
    const map = {};
    const rows = completedMetricsState?.data?.creators;
    if (!Array.isArray(rows)) return map;
    for (const row of rows) {
      if (row?.creatorId != null) map[String(row.creatorId)] = row;
    }
    return map;
  }, [completedMetricsState?.data?.creators]);

  const getPlatformEntries = (platforms) => getConnectedPlatformEntries(platforms);

  const creatorMetricsMap = useMemo(() => {
    if (isUgc || !selectedCampaign?.id) return {};

    const base = buildCreatorPublishedMetricsMap({
      creatorsList: creatorsListForPublishedMetrics,
      timelinesByKey,
      campaignId: selectedCampaign.id,
      creatorBreakdown,
      campaign: selectedCampaign,
    });
    if (!hookData.isIndividualMode || creatorsListForPublishedMetrics.length !== 1) {
      return base;
    }

    const row = creatorsListForPublishedMetrics[0];
    const raw = row?.creator?.id ?? row?.creatorUserId;
    if (raw == null || raw === "") return base;

    const uid = String(raw);
    const existing = base[uid];
    const hasUsableRow = existing != null && !existing.metricsUnavailable && existing.views != null;

    if (hasUsableRow) return base;

    const pd = performanceData;
    const tv = Number(pd?.totalViews) || 0;
    const te = Number(pd?.totalEngagement) || 0;
    if (!pd || pd.has_data === false || (tv <= 0 && te <= 0)) return base;

    const fee =
      Number(
        row.totalSpent ??
          row.total_spent ??
          row.contract?.totalCompensation ??
          row.contract?.total_compensation ??
          row.contract?.productPrice ??
          row.contract?.product_price ??
          0
      ) || 0;
    const er = tv > 0 ? te / tv : 0;

    return {
      ...base,
      [uid]: {
        views: tv,
        totalEngagement: te,
        engagementRate: er,
        costPerView: tv > 0 ? Number((fee / tv).toFixed(4)) : null,
        costPerEngagement: te > 0 ? Number((fee / te).toFixed(4)) : null,
      },
    };
  }, [
    isUgc,
    selectedCampaign?.id,
    creatorsListForPublishedMetrics,
    timelinesByKey,
    creatorBreakdown,
    hookData.isIndividualMode,
    performanceData,
    selectedCampaign,
  ]);

  const getCreatorMetrics = useCallback(
    (creator) => {
      if (isUgc) return null;
      const uid = resolveCreatorRowUserId(creator);
      if (!uid) return null;

      let base = null;
      if (!(uid in creatorMetricsMap)) {
        const transitioning =
          performanceFetch.isLoading &&
          (!performanceFetch.campaignId ||
            String(performanceFetch.campaignId) === String(selectedCampaign?.id ?? ""));
        base = transitioning ? null : { metricsUnavailable: true };
      } else {
        base = creatorMetricsMap[uid] ?? { metricsUnavailable: true };
      }

      if (!isAffiliate) return base;

      const sales = salesByCreatorId[uid];
      const salesLoading = Boolean(completedMetricsState?.isLoading) && !sales;
      if (salesLoading && !base) return null;

      const commission = Number(sales?.commissionTotal) || 0;
      const revenue = Number(sales?.revenue) || 0;
      const orders = Number(sales?.orders) || 0;
      const unitsSold = Number(sales?.unitsSold) || 0;
      const aov = Number(sales?.aov) || 0;
      const views = base?.views ?? null;
      const totalEngagement = base?.totalEngagement ?? null;
      const engagementRate = base?.engagementRate ?? null;

      return {
        ...(base || {}),
        metricsUnavailable: false,
        isAffiliateSales: true,
        revenue,
        aov,
        orders,
        unitsSold,
        commissionTotal: commission,
        roi: commission > 0 ? Number((revenue / commission).toFixed(2)) : null,
        costPerSale: orders > 0 ? Number((commission / orders).toFixed(2)) : null,
        costPerView:
          views != null && views > 0 ? Number((commission / views).toFixed(4)) : null,
        costPerEngagement:
          totalEngagement != null && totalEngagement > 0
            ? Number((commission / totalEngagement).toFixed(4))
            : null,
        views,
        totalEngagement,
        engagementRate,
        publishedUrl: base?.publishedUrl,
      };
    },
    [
      isUgc,
      isAffiliate,
      creatorMetricsMap,
      salesByCreatorId,
      completedMetricsState?.isLoading,
      performanceFetch.isLoading,
      performanceFetch.campaignId,
      selectedCampaign?.id,
    ]
  );

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
    if (type === "currency") return `$${Number(value).toFixed(2)}`;
    if (type === "number") return String(Math.round(Number(value)));
    if (type === "ratio") return `${Number(value).toFixed(2)}x`;
    return String(value);
  };

  return {
    ...hookData,
    getPlatformEntries,
    isUgc,
    isAffiliate,
    getCreatorMetrics,
    getCreatorComparisons,
    campaignAverages,
    formatMetricValue,
    completedMetricsAsOf: completedMetricsState?.data?.asOf || null,
    completedMetrics: completedMetricsState?.data || null,
  };
};
