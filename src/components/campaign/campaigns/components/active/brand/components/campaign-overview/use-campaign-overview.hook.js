import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useBrandCampaign from "../../use-brand.hook";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import { getIndividualCollaborationContracts } from "@/provider/features/contracts/contracts.slice";

export default function useCampaignOverview(onCampaignSelect, onToggleChange) {
  const dispatch = useDispatch();
  const [isMultiCreator, setIsMultiCreator] = useState(true); // Default to Multi-Creator

  const {
    campaignOptions,
    selectedCampaign,
    budgetData,
    deliverables,
    performanceMetrics,
    handleCampaignSelect: internalHandleCampaignSelect,
    formatCurrency,
    formatNumber,
    isLoading,
    hasData,
  } = useBrandCampaign();

  // Filter campaigns based on collaboration type
  const filteredCampaignOptions = campaignOptions.filter((option) => {
    if (!option.campaign) return false;
    const collaborationType =
      option.campaign.collaboration_type || COLLABORATION_TYPE.MULTI_CREATOR;
    return isMultiCreator
      ? collaborationType === COLLABORATION_TYPE.MULTI_CREATOR
      : collaborationType === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;
  });

  // Check if selected campaign matches current filter
  const isSelectedCampaignValid =
    selectedCampaign &&
    (isMultiCreator
      ? (selectedCampaign.collaboration_type || COLLABORATION_TYPE.MULTI_CREATOR) ===
        COLLABORATION_TYPE.MULTI_CREATOR
      : selectedCampaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR);

  // Determine if we should show multi-creator specific UI elements
  const showMultiCreatorUI = isMultiCreator && isSelectedCampaignValid;

  const hasNotifiedParent = useRef(false);
  const hasAutoSelectedFiltered = useRef(false);

  // Notify parent component when campaign is auto-selected (only once)
  useEffect(() => {
    if (selectedCampaign && onCampaignSelect && !hasNotifiedParent.current) {
      onCampaignSelect(selectedCampaign);
      hasNotifiedParent.current = true;
    }
  }, [selectedCampaign, onCampaignSelect]);

  // Fetch individual collaborations when switch is toggled to Individual Creator
  useEffect(() => {
    if (!isMultiCreator) {
      dispatch(getIndividualCollaborationContracts(false)); // false = active (not completed)
    }
  }, [isMultiCreator, dispatch]);

  // Auto-select first individual collaboration when contracts are loaded
  const { 
    data: individualContractsData, 
    isSuccess: individualContractsSuccess,
    isLoading: individualContractsLoading 
  } = useSelector(
    (state) => state.contracts.getIndividualCollaborationContracts || {}
  );

  const hasAutoSelectedIndividual = useRef(false);

  // For individual creator mode, check if we have individual contracts
  const hasIndividualData = !isMultiCreator && Array.isArray(individualContractsData) && individualContractsData.length > 0;
  const isLoadingIndividual = !isMultiCreator && individualContractsLoading;

  useEffect(() => {
    // Reset flag when switching back to multi-creator
    if (isMultiCreator) {
      hasAutoSelectedIndividual.current = false;
      return;
    }

    // Only auto-select once when data is loaded
    if (
      !isMultiCreator &&
      !hasAutoSelectedIndividual.current &&
      individualContractsSuccess &&
      Array.isArray(individualContractsData) &&
      individualContractsData.length > 0 &&
      !selectedCampaign
    ) {
      hasAutoSelectedIndividual.current = true;
      const firstContract = individualContractsData[0];
      const individualCampaign = {
        id: `individual-${firstContract.id}`,
        collaboration_type: COLLABORATION_TYPE.INDIVIDUAL_CREATOR,
        campaign_title: "Individual Collaboration",
        contract: firstContract,
        creator: firstContract.creator,
      };
      if (onCampaignSelect) {
        onCampaignSelect(individualCampaign);
      }
    }
  }, [
    isMultiCreator,
    individualContractsSuccess,
    individualContractsData,
    selectedCampaign,
    onCampaignSelect,
  ]);

  // Auto-select first campaign from filtered list when toggle changes or filtered list updates
  useEffect(() => {
    // Only auto-select for multi-creator mode
    if (isMultiCreator && filteredCampaignOptions.length > 0 && !isLoading) {
      // If no valid campaign is selected, or selected campaign doesn't match filter, select first
      if (!isSelectedCampaignValid) {
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
      // Reset flag when switching away from multi-creator or when list is empty
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

  // Enhanced campaign selection handler
  const handleCampaignSelect = (selectedOption) => {
    internalHandleCampaignSelect(selectedOption);
    if (onCampaignSelect && selectedOption) {
      onCampaignSelect(selectedOption.campaign);
    }
  };

  // Handle toggle change - reset selected campaign if it doesn't match new filter
  const handleToggleChange = (event) => {
    const newIsMultiCreator = event?.target?.checked ?? !isMultiCreator;
    setIsMultiCreator(newIsMultiCreator);
    hasAutoSelectedFiltered.current = false; // Reset auto-selection flag

    // Notify parent component about toggle change
    if (onToggleChange) {
      onToggleChange(newIsMultiCreator);
    }

    // Reset selected campaign if it doesn't match the new filter
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

  return {
    // State
    isMultiCreator,
    filteredCampaignOptions,
    isSelectedCampaignValid,
    showMultiCreatorUI,
    selectedCampaign,
    budgetData,
    performanceMetrics,
    formatCurrency,
    formatNumber,
    isLoading: isMultiCreator ? isLoading : isLoadingIndividual,
    hasData: isMultiCreator ? hasData : hasIndividualData,
    // Handlers
    handleCampaignSelect,
    handleToggleChange,
    handleExportData,
    handleViewAnalytics,
  };
}

