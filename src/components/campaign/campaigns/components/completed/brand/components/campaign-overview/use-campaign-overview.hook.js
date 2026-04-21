import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import useBrandCampaignCompleted from "../../use-brand.hook";
import { CAMPAIGN_TYPE, COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import { getAllBrandCampaigns } from "@/provider/features/campaigns/campaigns.slice";
import {
  fetchCampaignCombinedDemographics,
  fetchCampaignPerformanceMetrics,
  resetCampaignDemographics,
  resetAudience,
  resetPerformanceMetrics,
  selectCampaignCombinedDemographics,
  selectCampaignPerformanceMetrics,
} from "@/provider/features/phyllo/phyllo.slice";
import { formatFollowers } from "@/common/utils/format.utils";
import {
  aggregateCombinedPublishedMetrics,
  buildCreatorPublishedMetricsMap,
} from "@/common/utils/published-campaign-metrics.util";

export default function useCampaignOverviewCompleted(
  onCampaignSelect,
  onToggleChange,
  parentIsMultiCreator,
  parentSelectedCampaign
) {
  const dispatch = useDispatch();
  const [isMultiCreator, setIsMultiCreator] = useState(
    parentIsMultiCreator !== undefined ? parentIsMultiCreator : true
  );

  useEffect(() => {
    dispatch(getAllBrandCampaigns());
  }, [dispatch]);

  useEffect(() => {
    if (parentIsMultiCreator !== undefined) {
      setIsMultiCreator(parentIsMultiCreator);
    }
  }, [parentIsMultiCreator]);

  const {
    selectedCampaign: hookSelectedCampaign,
    budgetData: hookBudgetData,
    performanceMetrics: hookPerformanceMetrics,
    handleCampaignSelect: internalHandleCampaignSelect,
    formatCurrency,
    formatNumber,
    isLoading,
    hasData,
  } = useBrandCampaignCompleted(!!parentSelectedCampaign);

  const selectedCampaign = parentSelectedCampaign || hookSelectedCampaign;

  const isUgc = selectedCampaign?.campaign_type === CAMPAIGN_TYPE.UGC;

  const { data: campaignsApiData, isSuccess: campaignsSuccess } = useSelector(
    (state) => state.campaigns.getAllBrandCampaigns || {}
  );
  const completedCampaignOptions = useMemo(() => {
    if (!campaignsSuccess || !campaignsApiData?.data) return [];
    const list = Array.isArray(campaignsApiData.data) ? campaignsApiData.data : [];
    const completed = list.filter(
      (c) =>
        c.status === "COMPLETE" ||
        (Array.isArray(c.creators) && c.creators.some((cr) => cr.status === "COMPLETED"))
    );
    return completed.map((campaign) => ({
      value: campaign.id,
      label: campaign.campaign_title || "Untitled Campaign",
      campaign,
    }));
  }, [campaignsSuccess, campaignsApiData?.data]);

  const {
    data: creatorsData,
    isSuccess: creatorsSuccess,
    isLoading: appliedCreatorsLoading,
  } = useSelector((state) => state.campaigns.getAppliedCreators || {});
  const { data: budgetCreatorsData, isSuccess: budgetCreatorsSuccess } = useSelector(
    (state) => state.campaigns.getAppliedCreatorsForBudget || {}
  );
  const campaignDemographics = useSelector(selectCampaignCombinedDemographics);
  const campaignPerformance = useSelector(selectCampaignPerformanceMetrics);
  const {
    data: individualContractsData,
    isSuccess: individualContractsSuccess,
    isLoading: individualContractsLoading,
  } = useSelector((state) => state.contracts.getIndividualCollaborationContracts || {});

  const budgetData = useMemo(() => {
    if (!parentSelectedCampaign) return hookBudgetData;
    const totalBudget = Number(parentSelectedCampaign.budget) || 0;
    const budgetCreators = budgetCreatorsData?.data?.data ?? budgetCreatorsData?.data ?? [];
    const budgetList = Array.isArray(budgetCreators) ? budgetCreators : [];
    if (budgetCreatorsSuccess && budgetList.length >= 0) {
      const spent = budgetList.reduce((sum, creator) => {
        const raw =
          creator.contract?.total_compensation ??
          creator.contract?.totalCompensation ??
          creator.total_spent ??
          0;
        const comp = Array.isArray(raw)
          ? raw.reduce((a, b) => Number(a) + (Number(b) || 0), 0)
          : Number(raw) || 0;
        return Number(sum) + comp;
      }, 0);
      const saved = Math.max(0, totalBudget - Number(spent));
      return {
        totalBudget,
        spent: Number(spent),
        remaining: 0,
        saved: Number(saved),
      };
    }
    // Fallback: use COMPLETED-only list (will show lower spent until budget fetch completes)
    if (creatorsSuccess && creatorsData?.data) {
      const creators = Array.isArray(creatorsData.data) ? creatorsData.data : [];
      const spent = creators.reduce((sum, creator) => {
        const raw =
          creator.contract?.total_compensation ??
          creator.contract?.totalCompensation ??
          creator.total_spent ??
          0;
        const comp = Array.isArray(raw)
          ? raw.reduce((a, b) => Number(a) + (Number(b) || 0), 0)
          : Number(raw) || 0;
        return Number(sum) + comp;
      }, 0);
      const saved = Math.max(0, totalBudget - Number(spent));
      return {
        totalBudget,
        spent: Number(spent),
        remaining: 0,
        saved: Number(saved),
      };
    }
    return hookBudgetData;
  }, [
    parentSelectedCampaign,
    budgetCreatorsSuccess,
    budgetCreatorsData,
    creatorsSuccess,
    creatorsData,
    hookBudgetData,
  ]);

  const timelinesByKey = useSelector((state) => state.campaignTimeline?.timelinesByKey || {});

  // Same filter as active tab: by collaboration type (multi vs individual)
  const filteredCampaignOptions = useMemo(() => {
    return completedCampaignOptions.filter((option) => {
      if (!option || !option.campaign) return false;
      const collaborationType =
        option.campaign.collaboration_type || COLLABORATION_TYPE.MULTI_CREATOR;
      return isMultiCreator
        ? collaborationType === COLLABORATION_TYPE.MULTI_CREATOR
        : collaborationType === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;
    });
  }, [completedCampaignOptions, isMultiCreator]);

  const isSelectedCampaignValid =
    selectedCampaign &&
    (isMultiCreator
      ? (selectedCampaign.collaboration_type || COLLABORATION_TYPE.MULTI_CREATOR) ===
        COLLABORATION_TYPE.MULTI_CREATOR
      : selectedCampaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR);

  const showMultiCreatorUI = isMultiCreator && isSelectedCampaignValid;

  const campaignId =
    selectedCampaign?.id ?? selectedCampaign?.campaign?.id ?? selectedCampaign?.campaignId;
  const individualCreatorId =
    selectedCampaign?.creator?.id ??
    selectedCampaign?.creator_id ??
    selectedCampaign?.contract?.creator?.id ??
    selectedCampaign?.contract?.creator_id;

  useEffect(() => {
    if (isUgc) return;

    if (!campaignId) {
      dispatch(resetCampaignDemographics());
      dispatch(resetAudience());
      dispatch(resetPerformanceMetrics());
      return;
    }
    if (isMultiCreator) {
      dispatch(fetchCampaignCombinedDemographics({ campaignId }));
      dispatch(fetchCampaignPerformanceMetrics(campaignId));
      dispatch(resetAudience());
    } else if (individualCreatorId) {
      dispatch(
        fetchCampaignCombinedDemographics({
          campaignId,
          creatorId: individualCreatorId,
        })
      );
      dispatch(fetchCampaignPerformanceMetrics(campaignId));
      dispatch(resetAudience());
    } else {
      dispatch(resetCampaignDemographics());
      dispatch(resetAudience());
      dispatch(resetPerformanceMetrics());
    }
  }, [campaignId, isMultiCreator, individualCreatorId, dispatch]);

  const demographicsData = campaignDemographics?.data;
  const demographicsLoading = campaignDemographics?.isLoading || false;
  const hasDemographicsData =
    campaignDemographics?.isSuccess &&
    (demographicsData?.has_data || demographicsData?.no_connection);

  const campaignPerformancePayload = campaignPerformance?.data || null;
  const creatorBreakdownForMetrics = campaignPerformancePayload?.creator_breakdown || {};

  const publishedMetricsMap = useMemo(
    () =>
      buildCreatorPublishedMetricsMap({
        creatorsList: Array.isArray(creatorsData?.data) ? creatorsData.data : [],
        timelinesByKey,
        campaignId: campaignId || null,
        creatorBreakdown: creatorBreakdownForMetrics,
      }),
    [creatorsData?.data, timelinesByKey, campaignId, creatorBreakdownForMetrics]
  );

  const publishedCombined = useMemo(
    () => aggregateCombinedPublishedMetrics(publishedMetricsMap),
    [publishedMetricsMap]
  );

  const performanceData = useMemo(() => {
    const phyllo =
      campaignPerformance?.isSuccess && campaignPerformancePayload
        ? campaignPerformancePayload
        : null;

    if (publishedCombined) {
      return {
        totalViews: publishedCombined.totalViews,
        totalEngagement: publishedCombined.totalEngagement,
        engagementRate: publishedCombined.avgEngagementRateDecimal,
        costPerView: publishedCombined.avgCostPerView,
        costPerEngagement: publishedCombined.avgCostPerEngagement,
        totalPosts: phyllo?.totalPosts,
        averageViewsPerPost: phyllo?.averageViewsPerPost,
      };
    }

    if (phyllo && phyllo.has_data !== false && phyllo.totalViews != null) {
      return {
        ...phyllo,
        engagementRate:
          phyllo.engagementRate != null ? Number(phyllo.engagementRate) / 100 : 0,
      };
    }

    const fallback = hookPerformanceMetrics || {};
    return {
      ...fallback,
      engagementRate:
        fallback.engagementRate != null ? Number(fallback.engagementRate) / 100 : 0,
    };
  }, [
    publishedCombined,
    campaignPerformance?.isSuccess,
    campaignPerformancePayload,
    hookPerformanceMetrics,
  ]);

  const performanceLoading = campaignPerformance?.isLoading || false;

  const formatMetricValue = useCallback((value, type) => {
    if (value == null) return "N/A";
    if (type === "views" || type === "engagement")
      return formatFollowers(typeof value === "number" ? value : Number(value) || 0);
    if (type === "rate") {
      return `${(Number(value) * 100).toFixed(1)}%`;
    }
    if (type === "currency") return `$${Number(value).toFixed(2)}`;
    return String(value);
  }, []);

  const overviewLoading = useMemo(
    () =>
      isLoading ||
      (!!selectedCampaign && !!appliedCreatorsLoading) ||
      (!isMultiCreator && !!individualContractsLoading),
    [
      isLoading,
      selectedCampaign,
      appliedCreatorsLoading,
      isMultiCreator,
      individualContractsLoading,
    ]
  );

  const showEmptyState = useMemo(() => {
    if (overviewLoading) return false;
    if (selectedCampaign) return false;
    if (isMultiCreator) return filteredCampaignOptions.length === 0;
    const completedCount =
      individualContractsData?.filter((c) => c.campaign?.status === "COMPLETE")?.length || 0;
    return individualContractsSuccess && completedCount === 0;
  }, [
    overviewLoading,
    selectedCampaign,
    isMultiCreator,
    filteredCampaignOptions.length,
    individualContractsData,
    individualContractsSuccess,
  ]);

  const hasNotifiedParent = useRef(false);
  const hasAutoSelectedFiltered = useRef(false);
  const hasAutoSelectedIndividual = useRef(false);
  const lastIndividualContractsDataRef = useRef(null);
  const selectedCampaignIdRef = useRef(null);

  useEffect(() => {
    const currentId = selectedCampaign?.id;
    const previousId = selectedCampaignIdRef.current;

    if (currentId !== previousId) {
      selectedCampaignIdRef.current = currentId || null;
      if (selectedCampaign && onCampaignSelect && !hasNotifiedParent.current) {
        onCampaignSelect(selectedCampaign);
        hasNotifiedParent.current = true;
      }
    }
    if (!selectedCampaign && previousId !== null) {
      hasNotifiedParent.current = false;
      selectedCampaignIdRef.current = null;
    }
  }, [selectedCampaign?.id, onCampaignSelect]);

  useEffect(() => {
    if (!isMultiCreator) {
      hasAutoSelectedIndividual.current = false;
      lastIndividualContractsDataRef.current = null;
    }
  }, [isMultiCreator]);

  useEffect(() => {
    const dataChanged =
      JSON.stringify(individualContractsData) !==
      JSON.stringify(lastIndividualContractsDataRef.current);

    if (
      !isMultiCreator &&
      individualContractsSuccess &&
      Array.isArray(individualContractsData) &&
      individualContractsData.length > 0 &&
      !selectedCampaign &&
      !hasAutoSelectedIndividual.current &&
      dataChanged
    ) {
      const completedContracts = individualContractsData.filter(
        (contract) => contract.campaign?.status === "COMPLETE"
      );

      if (completedContracts.length > 0) {
        const firstContract = completedContracts[0];
        const campaignId = firstContract.campaignId || firstContract.campaign?.id;
        const individualCampaign = {
          id: campaignId || `individual-${firstContract.id}`,
          collaboration_type: COLLABORATION_TYPE.INDIVIDUAL_CREATOR,
          campaign_title: firstContract.campaign?.campaign_title || "Individual Collaboration",
          campaign: firstContract.campaign,
          contract: firstContract,
          creator: firstContract.creator,
        };
        hasAutoSelectedIndividual.current = true;
        lastIndividualContractsDataRef.current = JSON.parse(
          JSON.stringify(individualContractsData)
        );

        if (onCampaignSelect) {
          onCampaignSelect(individualCampaign);
        }
      }
    }
  }, [isMultiCreator, individualContractsSuccess, individualContractsData, selectedCampaign]);

  useEffect(() => {
    if (isMultiCreator && filteredCampaignOptions.length > 0 && !overviewLoading) {
      const parentHasNoCampaign = !parentSelectedCampaign;
      const needToSyncParent =
        (parentHasNoCampaign || !isSelectedCampaignValid) && !hasAutoSelectedFiltered.current;
      if (needToSyncParent) {
        const firstFilteredOption = filteredCampaignOptions[0];
        if (firstFilteredOption && firstFilteredOption.campaign) {
          internalHandleCampaignSelect(firstFilteredOption);
          if (onCampaignSelect) {
            onCampaignSelect(firstFilteredOption.campaign);
          }
          hasAutoSelectedFiltered.current = true;
        }
      }
    } else {
      hasAutoSelectedFiltered.current = false;
    }
  }, [
    isMultiCreator,
    filteredCampaignOptions,
    isSelectedCampaignValid,
    overviewLoading,
    parentSelectedCampaign,
    internalHandleCampaignSelect,
    onCampaignSelect,
  ]);

  const handleCampaignSelect = (selectedOption) => {
    internalHandleCampaignSelect(selectedOption);
    if (onCampaignSelect && selectedOption) {
      onCampaignSelect(selectedOption.campaign);
    }
  };

  const handleToggleChange = (event) => {
    const newIsMultiCreator = event?.target?.checked ?? !isMultiCreator;
    setIsMultiCreator(newIsMultiCreator);
    hasAutoSelectedFiltered.current = false;

    if (onToggleChange) {
      onToggleChange(newIsMultiCreator);
    }

    if (selectedCampaign) {
      const campaignType = selectedCampaign.collaboration_type || COLLABORATION_TYPE.MULTI_CREATOR;
      const shouldReset =
        (newIsMultiCreator && campaignType !== COLLABORATION_TYPE.MULTI_CREATOR) ||
        (!newIsMultiCreator && campaignType !== COLLABORATION_TYPE.INDIVIDUAL_CREATOR);

      if (shouldReset) {
        internalHandleCampaignSelect(null);
        if (onCampaignSelect) {
          onCampaignSelect(null);
        }
      }
    }
  };

  const handleExportData = () => {};

  const handleViewAnalytics = () => {};

  const computedHasData = useMemo(() => {
    if (!selectedCampaign) return false;
    if (isMultiCreator && isSelectedCampaignValid) {
      return Array.isArray(creatorsData?.data) && creatorsData.data.length > 0;
    }
    return selectedCampaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;
  }, [selectedCampaign, isMultiCreator, isSelectedCampaignValid, creatorsData]);
  useEffect(() => {
    if (parentSelectedCampaign && parentSelectedCampaign.id !== hookSelectedCampaign?.id) {
      internalHandleCampaignSelect(
        parentSelectedCampaign.id
          ? {
              value: parentSelectedCampaign.id,
              label: parentSelectedCampaign.campaign_title || "Campaign",
              campaign: parentSelectedCampaign,
            }
          : null
      );
    }
  }, [parentSelectedCampaign?.id, hookSelectedCampaign?.id, internalHandleCampaignSelect]);

  return {
    isMultiCreator,
    filteredCampaignOptions,
    isSelectedCampaignValid,
    showMultiCreatorUI,
    selectedCampaign,
    budgetData,
    performanceData,
    performanceLoading,
    demographicsData,
    demographicsLoading,
    hasDemographicsData,
    showEmptyState,
    formatCurrency,
    formatNumber,
    formatMetricValue,
    isLoading: overviewLoading,
    hasData: computedHasData,
    handleCampaignSelect,
    handleToggleChange,
    handleExportData,
    handleViewAnalytics,
    individualContractsData,
    individualContractsSuccess,
    isUgc,
  };
}
