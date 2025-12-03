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

  const filteredCampaignOptions = campaignOptions.filter((option) => {
    if (!option.campaign) return false;
    const collaborationType =
      option.campaign.collaboration_type || COLLABORATION_TYPE.MULTI_CREATOR;
    return isMultiCreator
      ? collaborationType === COLLABORATION_TYPE.MULTI_CREATOR
      : collaborationType === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;
  });

  const isSelectedCampaignValid =
    selectedCampaign &&
    (isMultiCreator
      ? (selectedCampaign.collaboration_type || COLLABORATION_TYPE.MULTI_CREATOR) ===
        COLLABORATION_TYPE.MULTI_CREATOR
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
      dispatch(getIndividualCollaborationContracts(false));
    }
  }, [isMultiCreator, dispatch]);

  const {
    data: individualContractsData,
    isSuccess: individualContractsSuccess,
    isLoading: individualContractsLoading,
  } = useSelector((state) => state.contracts.getIndividualCollaborationContracts || {});

  const hasAutoSelectedIndividual = useRef(false);
  const hasIndividualData =
    !isMultiCreator && Array.isArray(individualContractsData) && individualContractsData.length > 0;
  const isLoadingIndividual = !isMultiCreator && individualContractsLoading;

  useEffect(() => {
    if (isMultiCreator) {
      hasAutoSelectedIndividual.current = false;
      return;
    }

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
    if (selectedOption) {
      internalHandleCampaignSelect(selectedOption);
      if (onCampaignSelect) {
        onCampaignSelect(selectedOption.campaign);
      }
    } else {
      internalHandleCampaignSelect(null);
      if (onCampaignSelect) {
        onCampaignSelect(null);
      }
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
    isLoading: isMultiCreator ? isLoading : isLoadingIndividual,
    hasData: isMultiCreator ? hasData : hasIndividualData,
    handleCampaignSelect,
    handleToggleChange,
  };
}
