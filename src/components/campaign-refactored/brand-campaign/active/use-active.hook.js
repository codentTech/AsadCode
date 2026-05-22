import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHiredCreators } from "@/provider/features/campaigns/campaigns.slice";
import { CAMPAIGN_TYPE, COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import {
  setSelectedCampaign as setSelectedCampaignContext,
  setBrandCampaignMultiCreatorMode,
} from "@/provider/features/campaign-context/campaign-context.slice";
import { getIndividualCollaborationContracts } from "@/provider/features/contracts/contracts.slice";
import { isMobileViewport } from "@/common/utils/viewport.utils";
import { formatCreatorLocation } from "@/common/utils/creator-location.util";

export default function useActive() {
  const dispatch = useDispatch();

  // ============================================
  // 1. REFS
  // ============================================
  const autoSelectedForCampaignRef = useRef(null);
  const initialLoadRef = useRef(false);

  // ============================================
  // 2. REDUX SELECTORS
  // ============================================
  const campaignCtx = useSelector((state) => state.campaignContext || {});
  const { selectedCampaignId } = campaignCtx;
  const isMultiCreator = campaignCtx.isBrandCampaignMultiCreatorMode ?? true;

  const {
    data: hiredCreatorsData,
    isLoading: hiredCreatorsLoading,
    isSuccess: hiredCreatorsSuccess,
  } = useSelector((state) => state.campaigns.getHiredCreators || {});

  const { data: individualContractsData, isSuccess: individualContractsSuccess } = useSelector(
    (state) => state.contracts.getIndividualCollaborationContracts || {}
  );

  const normalizedIndividualContracts = useMemo(() => {
    if (Array.isArray(individualContractsData)) return individualContractsData;
    if (Array.isArray(individualContractsData?.data)) return individualContractsData.data;
    return [];
  }, [individualContractsData]);

  // ============================================
  // 3. LOCAL STATE
  // ============================================
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [filters, setFilters] = useState({
    status: "HIRED",
    sort: "newest",
  });
  const [mobilePane, setMobilePane] = useState("overview");

  // ============================================
  // 4. USEEFFECTS
  // ============================================
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

  useEffect(() => {
    if (!selectedCreator && mobilePane === "detail") {
      setMobilePane("creators");
    }
  }, [selectedCreator, mobilePane]);

  // Auto-select first creator for individual collaborations
  useEffect(() => {
    if (
      selectedCampaign &&
      selectedCampaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR &&
      individualContractsSuccess &&
      normalizedIndividualContracts.length > 0 &&
      !selectedCreator &&
      autoSelectedForCampaignRef.current !== selectedCampaign.id
    ) {
      const matchingContracts = normalizedIndividualContracts.filter((contract) => {
        const contractCampaignId = contract.campaignId || contract.campaign?.id;
        if (contractCampaignId !== selectedCampaign.id) {
          return false;
        }
        return true;
      });

      const taskCreatorId = sessionStorage.getItem("taskCreatorId");
      const taskCampaignId = sessionStorage.getItem("taskCampaignId");

      let contractToSelect = null;

      if (taskCampaignId === selectedCampaign.id && taskCreatorId) {
        contractToSelect = matchingContracts.find(
          (contract) =>
            contract.creator?.id === taskCreatorId ||
            contract.creator?.creator_profile?.id === taskCreatorId
        );

        if (contractToSelect) {
          sessionStorage.removeItem("taskCreatorId");
          sessionStorage.removeItem("taskCampaignId");
          sessionStorage.removeItem("taskType");
          sessionStorage.removeItem("taskConversationId");
        }
      }

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
            formatCreatorLocation({
              city: creator?.city,
              country: creator?.country,
              state: creator?.state,
              stateShort: creator?.state_short,
            }) || "Location not specified",
          rating: Number(creatorProfile?.rating) || 0,
          reviewCount: Number(creatorProfile?.review_count ?? creatorProfile?.reviewCount) || 0,
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
    normalizedIndividualContracts,
    individualContractsSuccess,
    selectedCreator,
  ]);

  // Auto-select first creator for multi-creator campaigns
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
      const taskCreatorId = sessionStorage.getItem("taskCreatorId");
      const taskCampaignId = sessionStorage.getItem("taskCampaignId");

      if (taskCampaignId === selectedCampaign.id && taskCreatorId) {
        const matchingCreator = hiredCreatorsData.data.find(
          (creator) =>
            creator.creatorUserId === taskCreatorId ||
            creator.creator?.id === taskCreatorId ||
            creator.creator?.creator_profile?.id === taskCreatorId
        );

        if (matchingCreator) {
          setSelectedCreator(matchingCreator);
          autoSelectedForCampaignRef.current = selectedCampaign.id;
          sessionStorage.removeItem("taskCreatorId");
          sessionStorage.removeItem("taskCampaignId");
          sessionStorage.removeItem("taskType");
          sessionStorage.removeItem("taskConversationId");
          return;
        }
      }

      setSelectedCreator(hiredCreatorsData.data[0]);
      autoSelectedForCampaignRef.current = selectedCampaign.id;
    }
  }, [hiredCreatorsSuccess, hiredCreatorsData, selectedCampaign, selectedCreator]);

  // ============================================
  // 5. CALLBACKS
  // ============================================
  const handleCampaignSelect = useCallback(
    (campaign) => {
      setSelectedCreator(null);
      autoSelectedForCampaignRef.current = null;
      setSelectedCampaign(campaign);

      const taskIsIndividualCreator = sessionStorage.getItem("taskIsIndividualCreator");
      if (campaign && taskIsIndividualCreator !== null) {
        const shouldBeIndividualCreator = taskIsIndividualCreator === "true";
        const campaignIsIndividual =
          campaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;

        if (shouldBeIndividualCreator === campaignIsIndividual) {
          const newIsMultiCreator = !shouldBeIndividualCreator;
          dispatch(setBrandCampaignMultiCreatorMode(newIsMultiCreator));
          sessionStorage.removeItem("taskIsIndividualCreator");
        }
      } else if (campaign) {
        const isIndividual = campaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;
        dispatch(setBrandCampaignMultiCreatorMode(!isIndividual));
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

      if (!campaign) {
        if (isMobileViewport()) {
          setMobilePane("overview");
        }
      }

      if (campaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR) {
        if (isMobileViewport()) {
          setMobilePane("creators");
        }
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

      if (campaign && isMobileViewport()) {
        setMobilePane("creators");
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

      if (isMobileViewport()) {
        setMobilePane("detail");
      }
    },
    [isMultiCreator, selectedCampaign, dispatch]
  );

  const handleClearCreator = useCallback(() => {
    setSelectedCreator(null);
    autoSelectedForCampaignRef.current = null;
    if (isMobileViewport()) {
      setMobilePane((prev) => (prev === "detail" ? "creators" : prev));
    }
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

  const handleToggleChange = useCallback(
    (newIsMultiCreator) => {
      dispatch(setBrandCampaignMultiCreatorMode(newIsMultiCreator));
      setSelectedCampaign(null);
      setSelectedCreator(null);
      autoSelectedForCampaignRef.current = null;
      setMobilePane("overview");
    },
    [dispatch]
  );

  const goToCreatorsPane = useCallback(() => {
    setMobilePane("creators");
  }, []);

  const backFromCreatorsToOverview = useCallback(() => {
    setMobilePane("overview");
  }, []);

  const backFromDetailToCreators = useCallback(() => {
    setSelectedCreator(null);
    autoSelectedForCampaignRef.current = null;
    setMobilePane("creators");
  }, []);

  // ============================================
  // 6. COMPUTED VALUES
  // ============================================
  const hiredCreators = useMemo(() => {
    return Array.isArray(hiredCreatorsData?.data) ? hiredCreatorsData.data : [];
  }, [hiredCreatorsData]);

  const individualContracts = useMemo(() => {
    if (!isMultiCreator && normalizedIndividualContracts.length > 0) {
      return normalizedIndividualContracts;
    }
    return [];
  }, [isMultiCreator, normalizedIndividualContracts]);

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

  // ============================================
  // 7. RETURN OBJECT
  // ============================================
  return {
    selectedCampaign,
    selectedCreator,
    isMultiCreator,
    filters,
    isLoading,
    displayCreators,
    mobilePane,
    rightPaneState,
    handleCampaignSelect,
    handleCreatorSelect,
    handleClearCreator,
    handleFilterChange,
    handleSortChange,
    handleToggleChange,
    goToCreatorsPane,
    backFromCreatorsToOverview,
    backFromDetailToCreators,
  };
}
