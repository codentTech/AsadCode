import { useEffect, useRef, useState } from "react";
import useBrandCampaignCompleted from "../../use-brand.hook";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";

export default function useCampaignOverviewCompleted(onCampaignSelect) {
  const [isMultiCreator, setIsMultiCreator] = useState(true);

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
  } = useBrandCampaignCompleted();

  // Filter campaigns based on collaboration type
  const filteredCampaignOptions = campaignOptions.filter((option) => {
    if (!option.campaign) return false;
    const collaborationType = option.campaign.collaboration_type || COLLABORATION_TYPE.MULTI_CREATOR;
    return isMultiCreator
      ? collaborationType === COLLABORATION_TYPE.MULTI_CREATOR
      : collaborationType === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;
  });

  // Check if selected campaign matches current filter
  const isSelectedCampaignValid =
    selectedCampaign &&
    (isMultiCreator
      ? (selectedCampaign.collaboration_type || COLLABORATION_TYPE.MULTI_CREATOR) === COLLABORATION_TYPE.MULTI_CREATOR
      : selectedCampaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR);

  // Determine if we should show multi-creator specific UI elements
  const showMultiCreatorUI = isMultiCreator && isSelectedCampaignValid;

  const hasNotifiedParent = useRef(false);
  const hasAutoSelectedFiltered = useRef(false);

  useEffect(() => {
    if (selectedCampaign && onCampaignSelect && !hasNotifiedParent.current) {
      onCampaignSelect(selectedCampaign);
      hasNotifiedParent.current = true;
    }
  }, [selectedCampaign, onCampaignSelect]);

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

  const handleCampaignSelect = (selectedOption) => {
    internalHandleCampaignSelect(selectedOption);
    if (onCampaignSelect && selectedOption) {
      onCampaignSelect(selectedOption.campaign);
    }
  };

  // Handle toggle change - reset selected campaign if it doesn't match new filter
  const handleToggleChange = () => {
    const newIsMultiCreator = !isMultiCreator;
    setIsMultiCreator(newIsMultiCreator);
    hasAutoSelectedFiltered.current = false; // Reset auto-selection flag

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
    isLoading,
    hasData,
    // Handlers
    handleCampaignSelect,
    handleToggleChange,
    handleExportData,
    handleViewAnalytics,
  };
}

