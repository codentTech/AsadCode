import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useBrandCampaignCompleted from "../../use-brand.hook";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import { getIndividualCollaborationContracts } from "@/provider/features/contracts/contracts.slice";

export default function useCampaignOverviewCompleted(onCampaignSelect) {
  const dispatch = useDispatch();
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

  const filteredCampaignOptions = campaignOptions.filter((option) => {
    if (!option.campaign) return false;
    const collaborationType = option.campaign.collaboration_type || COLLABORATION_TYPE.MULTI_CREATOR;
    return isMultiCreator
      ? collaborationType === COLLABORATION_TYPE.MULTI_CREATOR
      : collaborationType === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;
  });

  const isSelectedCampaignValid =
    selectedCampaign &&
    (isMultiCreator
      ? (selectedCampaign.collaboration_type || COLLABORATION_TYPE.MULTI_CREATOR) === COLLABORATION_TYPE.MULTI_CREATOR
      : selectedCampaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR);

  const showMultiCreatorUI = isMultiCreator && isSelectedCampaignValid;

  const hasNotifiedParent = useRef(false);
  const hasAutoSelectedFiltered = useRef(false);

  useEffect(() => {
    if (selectedCampaign && onCampaignSelect && !hasNotifiedParent.current) {
      onCampaignSelect(selectedCampaign);
      hasNotifiedParent.current = true;
    }
  }, [selectedCampaign, onCampaignSelect]);

  useEffect(() => {
    if (!isMultiCreator) {
      dispatch(getIndividualCollaborationContracts(true));
    }
  }, [isMultiCreator, dispatch]);

  const { data: individualContractsData, isSuccess: individualContractsSuccess } = useSelector(
    (state) => state.contracts.getIndividualCollaborationContracts || {}
  );

  useEffect(() => {
    if (
      !isMultiCreator &&
      individualContractsSuccess &&
      Array.isArray(individualContractsData) &&
      individualContractsData.length > 0 &&
      !selectedCampaign
    ) {
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

  useEffect(() => {
    if (isMultiCreator && filteredCampaignOptions.length > 0 && !isLoading) {
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
    hasData,
    handleCampaignSelect,
    handleToggleChange,
  };
}

