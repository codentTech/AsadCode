import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHiredCreators } from "@/provider/features/campaigns/campaigns.slice";
import { CAMPAIGN_TYPE, COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import { setSelectedCampaign as setSelectedCampaignContext } from "@/provider/features/campaign-context/campaign-context.slice";
import { getIndividualCollaborationContracts } from "@/provider/features/contracts/contracts.slice";

function useActiveBrand() {
  const dispatch = useDispatch();
  const { selectedCampaignId } = useSelector((state) => state.campaignContext || {});

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [isMultiCreator, setIsMultiCreator] = useState(true);
  const [filters, setFilters] = useState({
    status: "HIRED",
    sort: "newest",
  });

  const autoSelectedForCampaignRef = useRef(null);
  const initialLoadRef = useRef(false);

  const {
    data: hiredCreatorsData,
    isLoading: hiredCreatorsLoading,
    isSuccess: hiredCreatorsSuccess,
  } = useSelector((state) => state.campaigns.getHiredCreators || {});

  const { data: individualContractsData, isSuccess: individualContractsSuccess } = useSelector(
    (state) => state.contracts.getIndividualCollaborationContracts || {}
  );

  useEffect(() => {
    if (!initialLoadRef.current && selectedCampaignId) {
      initialLoadRef.current = true;
    }
  }, [selectedCampaignId]);

  useEffect(() => {
    if (!isMultiCreator) {
      dispatch(getIndividualCollaborationContracts(false));
    }
  }, [isMultiCreator, dispatch]);

  const handleCampaignSelect = useCallback(
    (campaign) => {
      setSelectedCreator(null);
      autoSelectedForCampaignRef.current = null;
      setSelectedCampaign(campaign);

      // Check if this is a task navigation and set isMultiCreator accordingly
      const taskIsIndividualCreator = sessionStorage.getItem("taskIsIndividualCreator");
      if (campaign && taskIsIndividualCreator !== null) {
        const shouldBeIndividualCreator = taskIsIndividualCreator === "true";
        const campaignIsIndividual =
          campaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;

        // Only update if the campaign type matches what we stored
        if (shouldBeIndividualCreator === campaignIsIndividual) {
          const newIsMultiCreator = !shouldBeIndividualCreator;
          setIsMultiCreator(newIsMultiCreator);
          // Clear the sessionStorage flag after use
          sessionStorage.removeItem("taskIsIndividualCreator");
        }
      } else if (campaign) {
        // Normal selection - set based on campaign type
        const isIndividual = campaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;
        setIsMultiCreator(!isIndividual);
      }

      if (campaign) {
        dispatch(
          setSelectedCampaignContext({
            campaignId: campaign.id || null,
            collaborationType: campaign.collaboration_type || null,
          })
        );
      } else {
        dispatch(
          setSelectedCampaignContext({
            campaignId: null,
            collaborationType: null,
          })
        );
      }

      if (campaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR) {
        return;
      }

      const isPaidCampaign =
        campaign?.campaign_type === CAMPAIGN_TYPE.SPONSORED_POST ||
        campaign?.campaign_type === CAMPAIGN_TYPE.UGC;
      const isGiftedOrAffiliate =
        campaign?.campaign_type === CAMPAIGN_TYPE.GIFTED ||
        campaign?.campaign_type === CAMPAIGN_TYPE.AFFILIATE;

      let defaultSort = "newest";
      if (isPaidCampaign) {
        defaultSort = "most-expensive";
      } else if (isGiftedOrAffiliate) {
        defaultSort = "newest";
      }

      const updatedFilters = {
        ...filters,
        sort: filters.sort || defaultSort,
      };
      setFilters(updatedFilters);

      if (campaign?.id) {
        dispatch(
          getHiredCreators({
            campaignId: campaign.id,
            filters: updatedFilters,
          })
        );
      }
    },
    [dispatch, filters]
  );

  const handleCreatorSelect = useCallback(
    (creator) => {
      setSelectedCreator(creator);

      if (!isMultiCreator && creator?.campaign_id && !selectedCampaign) {
        const individualCampaign = {
          id: creator.campaign_id,
          collaboration_type: COLLABORATION_TYPE.INDIVIDUAL_CREATOR,
          campaign_title: creator.campaign?.campaign_title || "Individual Collaboration",
          campaign: creator.campaign,
          created_by: creator.campaign?.created_by,
          brand: creator.campaign?.created_by,
        };
        setSelectedCampaign(individualCampaign);
        dispatch(
          setSelectedCampaignContext({
            campaignId: individualCampaign.id,
            collaborationType: COLLABORATION_TYPE.INDIVIDUAL_CREATOR,
          })
        );
      }
    },
    [isMultiCreator, selectedCampaign, dispatch]
  );

  useEffect(() => {
    if (
      selectedCampaign &&
      selectedCampaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR &&
      individualContractsSuccess &&
      Array.isArray(individualContractsData) &&
      !selectedCreator &&
      autoSelectedForCampaignRef.current !== selectedCampaign.id
    ) {
      const matchingContracts = individualContractsData.filter((contract) => {
        const contractCampaignId = contract.campaignId || contract.campaign?.id;
        if (contractCampaignId !== selectedCampaign.id) {
          return false;
        }
        const now = new Date();
        const deadline = new Date(contract.completionDeadline || contract.completion_deadline);
        return deadline >= now && contract.campaign?.status !== "COMPLETE";
      });

      // Check if we have task navigation data in sessionStorage
      const taskCreatorId = sessionStorage.getItem("taskCreatorId");
      const taskCampaignId = sessionStorage.getItem("taskCampaignId");

      let contractToSelect = null;

      if (taskCampaignId === selectedCampaign.id && taskCreatorId) {
        // Find the contract matching the creator ID
        contractToSelect = matchingContracts.find(
          (contract) =>
            contract.creator?.id === taskCreatorId ||
            contract.creator?.creator_profile?.id === taskCreatorId
        );

        // Clear sessionStorage after use
        if (contractToSelect) {
          sessionStorage.removeItem("taskCreatorId");
          sessionStorage.removeItem("taskCampaignId");
          sessionStorage.removeItem("taskType");
          sessionStorage.removeItem("taskConversationId");
        }
      }

      // Use task creator if found, otherwise use first contract
      const selectedContract = contractToSelect || matchingContracts[0];

      if (selectedContract) {
        const creator = selectedContract.creator;
        const creatorProfile = creator?.creator_profile;

        const formattedCreator = {
          id: selectedContract.id,
          contractId: selectedContract.id,
          campaign_id: selectedContract.campaignId || selectedContract.campaign?.id,
          campaign: selectedContract.campaign,
          creatorUserId: creator?.id,
          creator: creator,
          name:
            `${creator?.first_name || ""} ${creator?.last_name || ""}`.trim() || "Unknown Creator",
          bio: creatorProfile?.bio || "No bio available",
          image: creatorProfile?.profile_photo_url,
          location:
            `${creator?.city || ""}, ${creator?.country || ""}`.replace(/^,\s*|,\s*$/g, "") ||
            "Location not specified",
          rating: creatorProfile?.rating || 0,
          age: creator?.date_of_birth
            ? new Date().getFullYear() - new Date(creator.date_of_birth).getFullYear()
            : null,
          contract: selectedContract,
        };

        if (formattedCreator.creator) {
          setSelectedCreator(formattedCreator);
          autoSelectedForCampaignRef.current = selectedCampaign.id;
        }
      } else {
        autoSelectedForCampaignRef.current = selectedCampaign.id;
      }
    }
  }, [
    selectedCampaign?.id,
    selectedCampaign?.collaboration_type,
    individualContractsData,
    individualContractsSuccess,
    selectedCreator,
  ]);

  useEffect(() => {
    if (
      selectedCampaign &&
      selectedCampaign.collaboration_type !== COLLABORATION_TYPE.INDIVIDUAL_CREATOR &&
      hiredCreatorsSuccess &&
      Array.isArray(hiredCreatorsData?.data) &&
      hiredCreatorsData.data.length > 0 &&
      !selectedCreator &&
      autoSelectedForCampaignRef.current !== selectedCampaign.id
    ) {
      // Check if we have task navigation data in sessionStorage
      const taskCreatorId = sessionStorage.getItem("taskCreatorId");
      const taskCampaignId = sessionStorage.getItem("taskCampaignId");

      if (taskCampaignId === selectedCampaign.id && taskCreatorId) {
        // Find the creator by creatorUserId or creator.id
        const matchingCreator = hiredCreatorsData.data.find(
          (creator) =>
            creator.creatorUserId === taskCreatorId ||
            creator.creator?.id === taskCreatorId ||
            creator.creator?.creator_profile?.id === taskCreatorId
        );

        if (matchingCreator) {
          setSelectedCreator(matchingCreator);
          autoSelectedForCampaignRef.current = selectedCampaign.id;
          // Clear sessionStorage after use
          sessionStorage.removeItem("taskCreatorId");
          sessionStorage.removeItem("taskCampaignId");
          sessionStorage.removeItem("taskType");
          sessionStorage.removeItem("taskConversationId");
          return;
        }
      }

      // Default: select first creator
      setSelectedCreator(hiredCreatorsData.data[0]);
      autoSelectedForCampaignRef.current = selectedCampaign.id;
    }
  }, [hiredCreatorsSuccess, hiredCreatorsData, selectedCampaign, selectedCreator]);

  const handleClearCreator = useCallback(() => {
    setSelectedCreator(null);
    autoSelectedForCampaignRef.current = null;
  }, []);

  const handleFilterChange = useCallback(
    (filterName, value) => {
      const newFilters = { ...filters, [filterName]: value };
      setFilters(newFilters);

      if (
        selectedCampaign?.id &&
        selectedCampaign?.collaboration_type !== COLLABORATION_TYPE.INDIVIDUAL_CREATOR
      ) {
        dispatch(
          getHiredCreators({
            campaignId: selectedCampaign.id,
            filters: newFilters,
          })
        );
      }
    },
    [filters, selectedCampaign, dispatch]
  );

  const handleSortChange = useCallback(
    (sortValue) => {
      handleFilterChange("sort", sortValue);
    },
    [handleFilterChange]
  );

  const handleToggleChange = useCallback((newIsMultiCreator) => {
    setIsMultiCreator(newIsMultiCreator);
    setSelectedCampaign(null);
    setSelectedCreator(null);
    autoSelectedForCampaignRef.current = null;
  }, []);

  const hiredCreators = useMemo(() => {
    return Array.isArray(hiredCreatorsData?.data) ? hiredCreatorsData.data : [];
  }, [hiredCreatorsData]);

  const individualContracts = useMemo(() => {
    if (!isMultiCreator && Array.isArray(individualContractsData)) {
      return individualContractsData.filter((contract) => {
        const now = new Date();
        const deadline = new Date(contract.completionDeadline || contract.completion_deadline);
        return deadline >= now && contract.campaign?.status !== "COMPLETE";
      });
    }
    return [];
  }, [isMultiCreator, individualContractsData]);

  const displayCreators = useMemo(() => {
    if (
      selectedCampaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR ||
      !isMultiCreator
    ) {
      return individualContracts;
    }
    return hiredCreators;
  }, [selectedCampaign, isMultiCreator, individualContracts, hiredCreators]);

  const isLoading = useMemo(() => {
    if (
      selectedCampaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR ||
      !isMultiCreator
    ) {
      return false;
    }
    return hiredCreatorsLoading;
  }, [selectedCampaign, isMultiCreator, hiredCreatorsLoading]);

  const rightPaneState = useMemo(() => {
    if (isLoading) {
      return { type: "loading" };
    }

    if (!selectedCampaign && !selectedCreator && isMultiCreator) {
      return {
        type: "notFound",
        title: "No Campaign Selected",
        description: "Select a campaign to view details.",
      };
    }

    if (!selectedCampaign && !selectedCreator && !isMultiCreator) {
      return {
        type: "notFound",
        title: "No Individual Collaborations",
        description: "You don't have any active individual collaborations at the moment.",
      };
    }

    if (!selectedCampaign && displayCreators.length === 0) {
      return {
        type: "notFound",
        title: "No Creators Found",
        description: "No active creators found.",
      };
    }

    if (selectedCampaign && displayCreators.length === 0) {
      return {
        type: "notFound",
        title: "No Creators Found",
        description: "No creators have been hired for this campaign yet.",
      };
    }

    if (!selectedCreator) {
      return {
        type: "notFound",
        title: "No Creator Selected",
        description: "Select a creator to view details.",
      };
    }

    const isIndividualCreator =
      !selectedCampaign ||
      selectedCampaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR ||
      !isMultiCreator;

    return { type: "content", isIndividualCreator };
  }, [isLoading, selectedCampaign, selectedCreator, isMultiCreator, displayCreators]);

  return {
    selectedCampaign,
    selectedCreator,
    isMultiCreator,
    filters,
    isLoading,
    displayCreators,
    rightPaneState,
    handleCampaignSelect,
    handleCreatorSelect,
    handleClearCreator,
    handleFilterChange,
    handleSortChange,
    handleToggleChange,
  };
}

export default useActiveBrand;
