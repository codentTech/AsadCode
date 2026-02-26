import { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import useBrandCampaignCompleted from "../../use-brand.hook";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import { getIndividualCollaborationContracts } from "@/provider/features/contracts/contracts.slice";

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
    if (parentIsMultiCreator !== undefined) {
      setIsMultiCreator(parentIsMultiCreator);
    }
  }, [parentIsMultiCreator]);

  const {
    campaignOptions,
    selectedCampaign: hookSelectedCampaign,
    budgetData: hookBudgetData,
    performanceMetrics: hookPerformanceMetrics,
    handleCampaignSelect: internalHandleCampaignSelect,
    formatCurrency,
    formatNumber,
    isLoading,
    hasData,
  } = useBrandCampaignCompleted(!!parentSelectedCampaign); // Disable auto-select if parent is managing selection

  const selectedCampaign = parentSelectedCampaign || hookSelectedCampaign;

  const { data: creatorsData, isSuccess: creatorsSuccess } = useSelector(
    (state) => state.campaigns.getAppliedCreators || {}
  );
  const { data: budgetCreatorsData, isSuccess: budgetCreatorsSuccess } = useSelector(
    (state) => state.campaigns.getAppliedCreatorsForBudget || {}
  );

  const budgetData = useMemo(() => {
    if (!parentSelectedCampaign) return hookBudgetData;
    const totalBudget = Number(parentSelectedCampaign.budget) || 0;
    // Prefer getAppliedCreatorsForBudget (all creators) so spent matches active tab
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

  const performanceMetrics = useMemo(() => {
    if (parentSelectedCampaign && creatorsSuccess && creatorsData?.data) {
      const creators = Array.isArray(creatorsData.data) ? creatorsData.data : [];

      // Collect per-creator metrics from timeline FINAL_PUBLISHED steps
      const creatorMetrics = creators
        .map((c) => {
          const creatorUserId = c.creator?.id || c.creatorUserId;
          if (!creatorUserId || !parentSelectedCampaign.id) return null;

          const key = `${parentSelectedCampaign.id}-${creatorUserId}`;
          const timelineSource = timelinesByKey[key];
          const steps = Array.isArray(timelineSource?.data) ? timelineSource.data : [];

          const publishedStep = steps.find(
            (s) => s.step_type === "FINAL_PUBLISHED" || s.step === "FINAL_PUBLISHED"
          );
          const engagement = publishedStep?.engagement || publishedStep?.data?.engagement || null;
          if (!publishedStep?.published_url && !publishedStep?.data?.published_url) return null;
          if (!engagement) return null;

          const views = Number(engagement.view_count ?? engagement.views ?? 0);
          const likes = Number(engagement.like_count ?? engagement.likes ?? 0);
          const comments = Number(engagement.comment_count ?? engagement.comments ?? 0);
          const shares = Number(engagement.share_count ?? engagement.shares ?? 0);
          const saves = Number(engagement.save_count ?? engagement.saves ?? 0);
          const totalEngagement = likes + comments + shares + saves;
          const fee = c.total_spent || c.totalSpent || 0;

          return {
            views,
            totalEngagement,
            engagementRate: views > 0 ? totalEngagement / views : 0,
            costPerEngagement: totalEngagement > 0 ? fee / totalEngagement : null,
          };
        })
        .filter(Boolean);

      if (creatorMetrics.length > 0) {
        const totalViews = creatorMetrics.reduce((s, m) => s + m.views, 0);
        const totalEngagement = creatorMetrics.reduce((s, m) => s + m.totalEngagement, 0);

        // Spec §3: ER = average of individual ERs (not recalculated from totals)
        const engagementRate =
          creatorMetrics.reduce((s, m) => s + m.engagementRate, 0) / creatorMetrics.length;

        // Spec §3: CPE = average of individual CPEs (not total spend / total engagement)
        const cpeValues = creatorMetrics
          .map((m) => m.costPerEngagement)
          .filter((v) => v !== null && v !== undefined);
        const costPerEngagement =
          cpeValues.length > 0 ? cpeValues.reduce((s, v) => s + v, 0) / cpeValues.length : 0;

        return {
          totalViews,
          totalEngagement,
          engagementRate: engagementRate * 100,
          costPerEngagement,
        };
      }

      // Fallback: use stored creator-level aggregates when timeline data not yet loaded
      const spent = creators.reduce((sum, creator) => {
        const raw =
          creator.contract?.total_compensation ??
          creator.contract?.totalCompensation ??
          creator.total_spent ??
          0;
        return Number(sum) + (Number(raw) || 0);
      }, 0);
      const totalViews = creators.reduce(
        (sum, creator) => Number(sum) + (Number(creator.total_views) || 0),
        0
      );
      const totalEngagement = creators.reduce(
        (sum, creator) => Number(sum) + (Number(creator.total_engagement) || 0),
        0
      );
      const engagementRate = totalViews > 0 ? (totalEngagement / totalViews) * 100 : 0;
      const costPerEngagement = totalEngagement > 0 ? spent / totalEngagement : 0;
      return { totalViews, totalEngagement, engagementRate, costPerEngagement };
    }
    return hookPerformanceMetrics;
  }, [
    parentSelectedCampaign,
    creatorsSuccess,
    creatorsData,
    hookPerformanceMetrics,
    timelinesByKey,
  ]);

  const filteredCampaignOptions = useMemo(() => {
    return campaignOptions.filter((option) => {
      if (!option || !option.campaign) return false;
      const collaborationType =
        option.campaign.collaboration_type || COLLABORATION_TYPE.MULTI_CREATOR;
      return isMultiCreator
        ? collaborationType === COLLABORATION_TYPE.MULTI_CREATOR
        : collaborationType === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;
    });
  }, [campaignOptions, isMultiCreator]);

  const isSelectedCampaignValid =
    selectedCampaign &&
    (isMultiCreator
      ? (selectedCampaign.collaboration_type || COLLABORATION_TYPE.MULTI_CREATOR) ===
        COLLABORATION_TYPE.MULTI_CREATOR
      : selectedCampaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR);

  const showMultiCreatorUI = isMultiCreator && isSelectedCampaignValid;

  const hasNotifiedParent = useRef(false);
  const hasAutoSelectedFiltered = useRef(false);
  const hasAutoSelectedIndividual = useRef(false);
  const lastIndividualContractsDataRef = useRef(null);
  const selectedCampaignIdRef = useRef(null);

  useEffect(() => {
    const currentId = selectedCampaign?.id;
    const previousId = selectedCampaignIdRef.current;

    // Only notify parent if the campaign ID actually changed
    if (currentId !== previousId) {
      selectedCampaignIdRef.current = currentId || null;

      // Only notify if we have a campaign and haven't notified for this ID yet
      if (selectedCampaign && onCampaignSelect && !hasNotifiedParent.current) {
        onCampaignSelect(selectedCampaign);
        hasNotifiedParent.current = true;
      }
    }

    // Reset notification flag when campaign becomes null
    if (!selectedCampaign && previousId !== null) {
      hasNotifiedParent.current = false;
      selectedCampaignIdRef.current = null;
    }
  }, [selectedCampaign?.id, onCampaignSelect]);

  useEffect(() => {
    if (!isMultiCreator) {
      dispatch(getIndividualCollaborationContracts(true));
      hasAutoSelectedIndividual.current = false;
      lastIndividualContractsDataRef.current = null;
    }
  }, [isMultiCreator, dispatch]);

  const { data: individualContractsData, isSuccess: individualContractsSuccess } = useSelector(
    (state) => state.contracts.getIndividualCollaborationContracts || {}
  );

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
    if (isMultiCreator && filteredCampaignOptions.length > 0 && !isLoading) {
      if (!isSelectedCampaignValid && !hasAutoSelectedFiltered.current) {
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
    isLoading,
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

  // Use creatorsData from Redux so we show content when parent passes campaign and data has loaded
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
    performanceMetrics,
    formatCurrency,
    formatNumber,
    isLoading,
    hasData: computedHasData,
    handleCampaignSelect,
    handleToggleChange,
    handleExportData,
    handleViewAnalytics,
    individualContractsData,
    individualContractsSuccess,
  };
}
