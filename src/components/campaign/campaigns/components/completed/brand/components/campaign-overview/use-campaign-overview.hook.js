import { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import useBrandCampaignCompleted from "../../use-brand.hook";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import { getIndividualCollaborationContracts } from "@/provider/features/contracts/contracts.slice";

export default function useCampaignOverviewCompleted(onCampaignSelect, onToggleChange, parentIsMultiCreator, parentSelectedCampaign) {
  const dispatch = useDispatch();
  const [isMultiCreator, setIsMultiCreator] = useState(parentIsMultiCreator !== undefined ? parentIsMultiCreator : true);
  
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
  } = useBrandCampaignCompleted();

  const selectedCampaign = parentSelectedCampaign || hookSelectedCampaign;

  const {
    data: creatorsData,
    isSuccess: creatorsSuccess,
  } = useSelector((state) => state.campaigns.getAppliedCreators || {});
  const budgetData = useMemo(() => {
    if (parentSelectedCampaign && creatorsSuccess && creatorsData?.data) {
      const creators = Array.isArray(creatorsData.data) ? creatorsData.data : [];
      const totalBudget = parentSelectedCampaign.budget || 0;
      const spent = creators.reduce((sum, creator) => sum + (creator.total_spent || 0), 0);
      const saved = Math.max(0, totalBudget - spent);
      return {
        totalBudget,
        spent,
        remaining: 0,
        saved,
      };
    }
    return hookBudgetData;
  }, [parentSelectedCampaign, creatorsSuccess, creatorsData, hookBudgetData]);

  const performanceMetrics = useMemo(() => {
    if (parentSelectedCampaign && creatorsSuccess && creatorsData?.data) {
      const creators = Array.isArray(creatorsData.data) ? creatorsData.data : [];
      const spent = creators.reduce((sum, creator) => sum + (creator.total_spent || 0), 0);
      const totalViews = creators.reduce((sum, creator) => sum + (creator.total_views || 0), 0);
      const totalEngagement = creators.reduce(
        (sum, creator) => sum + (creator.total_engagement || 0),
        0
      );
      const engagementRate = totalViews > 0 ? (totalEngagement / totalViews) * 100 : 0;
      const costPerEngagement = totalEngagement > 0 ? spent / totalEngagement : 0;
      return {
        totalViews,
        totalEngagement,
        engagementRate,
        costPerEngagement,
      };
    }
    return hookPerformanceMetrics;
  }, [parentSelectedCampaign, creatorsSuccess, creatorsData, hookPerformanceMetrics]);

  const filteredCampaignOptions = useMemo(() => {
    return campaignOptions.filter((option) => {
      if (!option || !option.campaign) return false;
      const collaborationType = option.campaign.collaboration_type || COLLABORATION_TYPE.MULTI_CREATOR;
      return isMultiCreator
        ? collaborationType === COLLABORATION_TYPE.MULTI_CREATOR
        : collaborationType === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;
    });
  }, [campaignOptions, isMultiCreator]);

  const isSelectedCampaignValid =
    selectedCampaign &&
    (isMultiCreator
      ? (selectedCampaign.collaboration_type || COLLABORATION_TYPE.MULTI_CREATOR) === COLLABORATION_TYPE.MULTI_CREATOR
      : selectedCampaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR);

  const showMultiCreatorUI = isMultiCreator && isSelectedCampaignValid;

  const hasNotifiedParent = useRef(false);
  const hasAutoSelectedFiltered = useRef(false);
  const hasAutoSelectedIndividual = useRef(false);
  const lastIndividualContractsDataRef = useRef(null);
  const selectedCampaignIdRef = useRef(null);

  useEffect(() => {
    if (selectedCampaign?.id !== selectedCampaignIdRef.current) {
      hasNotifiedParent.current = false;
      selectedCampaignIdRef.current = selectedCampaign?.id || null;
    }
    
    if (selectedCampaign && onCampaignSelect && !hasNotifiedParent.current) {
      onCampaignSelect(selectedCampaign);
      hasNotifiedParent.current = true;
    }
  }, [selectedCampaign, onCampaignSelect]);

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
    const dataChanged = JSON.stringify(individualContractsData) !== JSON.stringify(lastIndividualContractsDataRef.current);
    
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
        lastIndividualContractsDataRef.current = JSON.parse(JSON.stringify(individualContractsData));
        
        if (onCampaignSelect) {
          onCampaignSelect(individualCampaign);
        }
      }
    }
  }, [
    isMultiCreator,
    individualContractsSuccess,
    individualContractsData,
    selectedCampaign,
  ]);

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

  const computedHasData = useMemo(() => {
    if (!selectedCampaign) return false;
    if (isMultiCreator && isSelectedCampaignValid) {
      return hasData;
    }
    return selectedCampaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;
  }, [selectedCampaign, isMultiCreator, isSelectedCampaignValid, hasData]);
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

