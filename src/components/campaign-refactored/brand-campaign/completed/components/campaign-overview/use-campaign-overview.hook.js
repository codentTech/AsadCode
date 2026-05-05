import { useEffect, useLayoutEffect, useRef, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import useBrandCampaignCompleted from "../../use-completed.hook";
import { CAMPAIGN_TYPE, COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
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
import {
  resolveEffectiveCollaborationType,
  isCampaignCompatibleWithOverviewToggle,
  isIndividualCollaborationFlow,
  creatorRowHasIdentity,
  individualCreatorDisplayLabel,
} from "@/common/utils/brand-campaign-context.utils";

const campaignIdKey = (id) => (id == null || id === "" ? null : String(id));

export default function useCampaignOverviewCompleted(
  onCampaignSelect,
  onToggleChange,
  _parentIsMultiCreator,
  parentSelectedCampaign,
  parentSelectedCreator
) {
  const dispatch = useDispatch();
  const isMultiCreator = useSelector(
    (state) => state.campaignContext?.isBrandCampaignMultiCreatorMode ?? true
  );
  const selectedCollaborationTypeFromContext = useSelector(
    (state) => state.campaignContext?.selectedCollaborationType ?? null
  );

  const {
    selectedCampaign: hookSelectedCampaign,
    performanceMetrics: hookPerformanceMetrics,
    handleCampaignSelect: internalHandleCampaignSelect,
    formatCurrency,
    formatNumber,
    isLoading,
    hasData,
  } = useBrandCampaignCompleted(true);

  const resolvedCampaign =
    parentSelectedCampaign === undefined ? hookSelectedCampaign : parentSelectedCampaign;

  const effectiveCollaborationType = useMemo(
    () =>
      resolveEffectiveCollaborationType(resolvedCampaign, selectedCollaborationTypeFromContext),
    [resolvedCampaign, selectedCollaborationTypeFromContext]
  );

  const isSelectedCampaignValid =
    !!resolvedCampaign &&
    isCampaignCompatibleWithOverviewToggle(isMultiCreator, effectiveCollaborationType);

  const displayCampaign = isSelectedCampaignValid ? resolvedCampaign : null;

  const isUgc = displayCampaign?.campaign_type === CAMPAIGN_TYPE.UGC;

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
    isError: creatorsError,
  } = useSelector((state) => state.campaigns.getAppliedCreators || {});
  const appliedCreatorsCampaignId = useSelector(
    (state) => state.campaigns.getAppliedCreators?.campaignId ?? null
  );
  const { data: budgetCreatorsData, isSuccess: budgetCreatorsSuccess } = useSelector(
    (state) => state.campaigns.getAppliedCreatorsForBudget || {}
  );
  const campaignDemographics = useSelector(selectCampaignCombinedDemographics);
  const campaignPerformance = useSelector(selectCampaignPerformanceMetrics);
  const {
    data: individualContractsData,
    isSuccess: individualContractsSuccess,
    isLoading: individualContractsLoading,
    isError: individualContractsError,
  } = useSelector((state) => state.contracts.getIndividualCollaborationContracts || {});

  const normalizedIndividualContracts = useMemo(() => {
    if (Array.isArray(individualContractsData)) return individualContractsData;
    if (Array.isArray(individualContractsData?.data)) return individualContractsData.data;
    return [];
  }, [individualContractsData]);

  const budgetData = useMemo(() => {
    if (!displayCampaign) {
      return { totalBudget: 0, spent: 0, remaining: 0, saved: 0 };
    }
    const totalBudget = Number(displayCampaign.budget) || 0;
    const budgetCreators = budgetCreatorsData?.data?.data ?? budgetCreatorsData?.data ?? [];
    const budgetList = Array.isArray(budgetCreators) ? budgetCreators : [];
    if (
      budgetCreatorsSuccess &&
      budgetList.length >= 0 &&
      campaignIdKey(appliedCreatorsCampaignId) === campaignIdKey(displayCampaign.id)
    ) {
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
    if (
      creatorsSuccess &&
      creatorsData?.data &&
      campaignIdKey(appliedCreatorsCampaignId) === campaignIdKey(displayCampaign.id)
    ) {
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
    return {
      totalBudget,
      spent: 0,
      remaining: 0,
      saved: Number(totalBudget),
    };
  }, [
    displayCampaign,
    budgetCreatorsSuccess,
    budgetCreatorsData,
    creatorsSuccess,
    creatorsData,
    appliedCreatorsCampaignId,
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

  const showMultiCreatorUI = isMultiCreator && isSelectedCampaignValid;

  const campaignId =
    displayCampaign?.id ?? displayCampaign?.campaign?.id ?? displayCampaign?.campaignId;

  const creatorsRowsScopedToDisplayCampaign = useMemo(() => {
    if (
      !showMultiCreatorUI ||
      !displayCampaign?.id ||
      campaignIdKey(appliedCreatorsCampaignId) !== campaignIdKey(displayCampaign.id)
    ) {
      return [];
    }
    return Array.isArray(creatorsData?.data) ? creatorsData.data : [];
  }, [
    showMultiCreatorUI,
    displayCampaign?.id,
    appliedCreatorsCampaignId,
    creatorsData?.data,
  ]);

  const individualCreatorId = useMemo(() => {
    const key = campaignIdKey(campaignId);
    const fromSelected =
      displayCampaign?.creator?.id ??
      displayCampaign?.creator_id ??
      displayCampaign?.contract?.creatorId ??
      displayCampaign?.contract?.creator_id ??
      displayCampaign?.contract?.creator?.id;
    if (fromSelected != null && fromSelected !== "") return fromSelected;
    if (!key) return undefined;
    const match = normalizedIndividualContracts.find((contract) => {
      const cid = contract?.campaignId ?? contract?.campaign?.id;
      return campaignIdKey(cid) === key;
    });
    return match?.creatorId ?? match?.creator?.id;
  }, [displayCampaign, normalizedIndividualContracts, campaignId]);

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
      return;
    }
    if (individualCreatorId) {
      dispatch(
        fetchCampaignCombinedDemographics({
          campaignId,
          creatorId: individualCreatorId,
        })
      );
      dispatch(fetchCampaignPerformanceMetrics(campaignId));
      dispatch(resetAudience());
      return;
    }
    if (individualContractsSuccess) {
      dispatch(fetchCampaignCombinedDemographics({ campaignId }));
      dispatch(fetchCampaignPerformanceMetrics(campaignId));
      dispatch(resetAudience());
    }
  }, [
    campaignId,
    isMultiCreator,
    individualCreatorId,
    individualContractsSuccess,
    dispatch,
  ]);

  const demographicsData = campaignDemographics?.data;
  const awaitingIndividualDemographicsContext =
    !isUgc &&
    !isMultiCreator &&
    !!campaignId &&
    !individualCreatorId &&
    individualContractsLoading;
  const demographicsFetchSettled =
    campaignDemographics?.isSuccess || campaignDemographics?.isError;
  const demographicsLoading = isUgc
    ? false
    : campaignDemographics?.isLoading ||
      awaitingIndividualDemographicsContext ||
      (!!campaignId &&
        (isMultiCreator || !!individualCreatorId) &&
        !demographicsFetchSettled);
  const hasDemographicsData =
    campaignDemographics?.isSuccess &&
    (demographicsData?.has_data || demographicsData?.no_connection);

  const campaignPerformancePayload = campaignPerformance?.data || null;
  const creatorBreakdownForMetrics = campaignPerformancePayload?.creator_breakdown || {};

  const publishedMetricsMap = useMemo(
    () =>
      buildCreatorPublishedMetricsMap({
        creatorsList: creatorsRowsScopedToDisplayCampaign,
        timelinesByKey,
        campaignId: campaignId || null,
        creatorBreakdown: creatorBreakdownForMetrics,
      }),
    [creatorsRowsScopedToDisplayCampaign, timelinesByKey, campaignId, creatorBreakdownForMetrics]
  );

  const publishedCombined = useMemo(
    () => aggregateCombinedPublishedMetrics(publishedMetricsMap),
    [publishedMetricsMap]
  );

  const performanceData = useMemo(() => {
    if (!showMultiCreatorUI) {
      return {
        totalViews: 0,
        totalEngagement: 0,
        engagementRate: 0,
        costPerView: null,
        costPerEngagement: null,
        totalPosts: undefined,
        averageViewsPerPost: undefined,
      };
    }

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
    showMultiCreatorUI,
    publishedCombined,
    campaignPerformance?.isSuccess,
    campaignPerformancePayload,
    hookPerformanceMetrics,
  ]);

  const performanceLoading = campaignPerformance?.isLoading || false;
  const performanceFetchSettled =
    campaignPerformance?.isSuccess || campaignPerformance?.isError;
  const performanceSectionLoading =
    !isUgc &&
    showMultiCreatorUI &&
    !!campaignId &&
    (performanceLoading || !performanceFetchSettled);

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

  const overviewLoading = useMemo(() => {
    if (!isMultiCreator && individualContractsLoading) return true;
    if (
      displayCampaign &&
      isMultiCreator &&
      isSelectedCampaignValid
    ) {
      return false;
    }
    if (
      !isMultiCreator &&
      displayCampaign &&
      isSelectedCampaignValid &&
      individualContractsSuccess
    ) {
      return false;
    }
    return isLoading;
  }, [
    isLoading,
    displayCampaign,
    isMultiCreator,
    isSelectedCampaignValid,
    individualContractsLoading,
    individualContractsSuccess,
  ]);

  const individualCreatorLabel = useMemo(() => {
    if (isMultiCreator) return "";
    const sc = displayCampaign;
    const fromCampaign = [
      sc?.creator?.first_name ?? sc?.contract?.creator?.first_name,
      sc?.creator?.last_name ?? sc?.contract?.creator?.last_name,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();
    if (fromCampaign) return fromCampaign;
    const row = parentSelectedCreator;
    const fromRow = [row?.creator?.first_name, row?.creator?.last_name]
      .filter(Boolean)
      .join(" ")
      .trim();
    return fromRow || (typeof row?.name === "string" ? row.name.trim() : "") || "";
  }, [isMultiCreator, displayCampaign, parentSelectedCreator]);

  const showEmptyState = useMemo(() => {
    if (overviewLoading) return false;

    const hasIndividualCreatorContext = (campaign) =>
      !!(
        campaign?.creator?.id ||
        campaign?.contract?.creator?.id ||
        campaign?.creator_id
      );

    if (
      !isMultiCreator &&
      individualContractsSuccess &&
      displayCampaign &&
      !hasIndividualCreatorContext(displayCampaign) &&
      !creatorRowHasIdentity(parentSelectedCreator)
    ) {
      return true;
    }

    if (displayCampaign) return false;
    if (isMultiCreator) return filteredCampaignOptions.length === 0;
    if (!individualContractsSuccess && !individualContractsError) return false;
    const completedCount = normalizedIndividualContracts.filter(
      (c) => c.campaign?.status === "COMPLETE"
    ).length;
    return completedCount === 0;
  }, [
    overviewLoading,
    displayCampaign,
    isMultiCreator,
    filteredCampaignOptions.length,
    normalizedIndividualContracts,
    individualContractsSuccess,
    individualContractsError,
    parentSelectedCreator,
  ]);

  const hasAutoSelectedFiltered = useRef(false);
  const hasAutoSelectedIndividual = useRef(false);
  const lastIndividualContractsDataRef = useRef(null);

  useEffect(() => {
    if (parentSelectedCampaign === undefined) return;
    if (parentSelectedCampaign !== null) return;
    if (hookSelectedCampaign == null) return;
    internalHandleCampaignSelect(null);
  }, [parentSelectedCampaign, hookSelectedCampaign?.id, internalHandleCampaignSelect]);

  useLayoutEffect(() => {
    const dataChanged =
      JSON.stringify(normalizedIndividualContracts) !==
      JSON.stringify(lastIndividualContractsDataRef.current);

    if (
      !isMultiCreator &&
      individualContractsSuccess &&
      normalizedIndividualContracts.length > 0 &&
      !displayCampaign &&
      !hasAutoSelectedIndividual.current &&
      dataChanged
    ) {
      const completedContracts = normalizedIndividualContracts.filter(
        (contract) => contract.campaign?.status === "COMPLETE"
      );

      if (completedContracts.length > 0) {
        const firstContract = completedContracts[0];
        const firstCampaignId = firstContract.campaignId || firstContract.campaign?.id;
        const individualCampaign = {
          id: firstCampaignId || `individual-${firstContract.id}`,
          collaboration_type: COLLABORATION_TYPE.INDIVIDUAL_CREATOR,
          campaign_title: firstContract.campaign?.campaign_title || "Individual Collaboration",
          campaign: firstContract.campaign,
          contract: firstContract,
          creator: firstContract.creator,
        };
        hasAutoSelectedIndividual.current = true;
        lastIndividualContractsDataRef.current = JSON.parse(
          JSON.stringify(normalizedIndividualContracts)
        );

        if (onCampaignSelect) {
          onCampaignSelect(individualCampaign);
        }
      }
    }
  }, [
    isMultiCreator,
    individualContractsSuccess,
    normalizedIndividualContracts,
    displayCampaign,
    onCampaignSelect,
  ]);

  useLayoutEffect(() => {
    if (
      !isMultiCreator ||
      filteredCampaignOptions.length === 0 ||
      overviewLoading
    ) {
      return;
    }
    const parentHasNoCampaign = !parentSelectedCampaign;
    const needInitialSelection =
      (parentHasNoCampaign || !isSelectedCampaignValid) &&
      !hasAutoSelectedFiltered.current;
    if (!needInitialSelection) return;
    const firstFilteredOption = filteredCampaignOptions[0];
    if (firstFilteredOption?.campaign) {
      internalHandleCampaignSelect(firstFilteredOption);
      if (onCampaignSelect) {
        onCampaignSelect(firstFilteredOption.campaign);
      }
      hasAutoSelectedFiltered.current = true;
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

  const handleToggleChange = (eventOrValue) => {
    const newIsMultiCreator =
      typeof eventOrValue === "boolean"
        ? eventOrValue
        : (eventOrValue?.target?.checked ?? !isMultiCreator);
    hasAutoSelectedFiltered.current = false;

    hasAutoSelectedIndividual.current = false;
    if (!newIsMultiCreator) {
      lastIndividualContractsDataRef.current = null;
    }

    if (onToggleChange) {
      onToggleChange(newIsMultiCreator);
    }

    if (resolvedCampaign) {
      const campaignType =
        effectiveCollaborationType || COLLABORATION_TYPE.MULTI_CREATOR;
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

  const budgetStatsLoading = useMemo(
    () =>
      showMultiCreatorUI &&
      !!displayCampaign &&
      !budgetCreatorsSuccess &&
      !creatorsSuccess &&
      !creatorsError,
    [
      showMultiCreatorUI,
      displayCampaign,
      budgetCreatorsSuccess,
      creatorsSuccess,
      creatorsError,
    ]
  );

  const computedHasData = useMemo(() => {
    if (!displayCampaign) return false;
    if (isMultiCreator && isSelectedCampaignValid) {
      return Array.isArray(creatorsData?.data) && creatorsData.data.length > 0;
    }
    return isIndividualCollaborationFlow(isMultiCreator, effectiveCollaborationType);
  }, [
    displayCampaign,
    isMultiCreator,
    isSelectedCampaignValid,
    creatorsData,
    effectiveCollaborationType,
  ]);
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
    selectedCampaign: displayCampaign,
    budgetData,
    performanceData,
    performanceLoading,
    performanceSectionLoading,
    budgetStatsLoading,
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
    individualCreatorLabel,
  };
}
