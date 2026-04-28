import { useCallback, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getRejectedCreators,
  reinstateCreator,
} from "@/provider/features/campaigns/campaigns.slice";
import {
  getBrandRejectedIndividualCollaborations,
  reinstateInvitation,
} from "@/provider/features/invitation/invitation.slice";
import { addUserToShortlist } from "@/provider/features/shortlist/shortlist.slice";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import { setSelectedCampaign as setSelectedCampaignContext } from "@/provider/features/campaign-context/campaign-context.slice";
import { getAllBrandCampaigns } from "@/provider/features/campaigns/campaigns.slice";

const MD_BREAKPOINT = 768;

function useRejected() {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("newest");
  const [mobilePane, setMobilePane] = useState("list");

  // Redux State
  const dispatch = useDispatch();
  const hasRestoredFromContext = useRef(false);
  const lastRestoredCampaignIdRef = useRef(null);

  const { selectedCampaignId } = useSelector((state) => state.campaignContext || {});
  const {
    data: campaignsData,
    isLoading: campaignsLoading,
    isSuccess: campaignsSuccess,
  } = useSelector((state) => state.campaigns.getAllBrandCampaigns || {});

  const {
    data: rejectedCreatorsData,
    isLoading: rejectedCreatorsLoading,
    isSuccess: rejectedCreatorsSuccess,
  } = useSelector((state) => state.campaigns.getRejectedCreators || {});

  const { isSuccess: rejectSuccess } = useSelector((state) => state.campaigns.rejectCreator || {});

  const { isLoading: reinstateLoading, isSuccess: reinstateSuccess } = useSelector(
    (state) => state.campaigns.reinstateCreator || {}
  );

  const {
    data: rejectedIndividualCollaborationsData,
    isLoading: rejectedIndividualCollaborationsLoading,
    isSuccess: rejectedIndividualCollaborationsSuccess,
  } = useSelector((state) => state.invitation.getBrandRejectedIndividualCollaborations || {});

  const { isLoading: reinstateInvitationLoading, isSuccess: reinstateInvitationSuccess } =
    useSelector((state) => state.invitation.reinstateInvitation || {});

  const { isSuccess: rejectInvitationSuccess } = useSelector(
    (state) => state.invitation.rejectInvitation || {}
  );

  const autoSelectedForCampaignRef = useRef(null);
  const initialLoadRef = useRef(false);
  const lastModeRef = useRef(null);
  const justReinstatedRef = useRef(false);

  // Fetch campaigns on mount
  useEffect(() => {
    dispatch(getAllBrandCampaigns());
  }, [dispatch]);

  // Restore campaign from Redux context
  useEffect(() => {
    // Reset restoration flag if selectedCampaignId from Redux changed
    if (selectedCampaignId !== lastRestoredCampaignIdRef.current) {
      hasRestoredFromContext.current = false;
    }
  }, [selectedCampaignId]);

  useEffect(() => {
    // Restore campaign from Redux context - check if campaigns data exists (regardless of success flag)
    if (
      !campaignsLoading &&
      campaignsData?.data &&
      Array.isArray(campaignsData.data) &&
      selectedCampaignId &&
      !hasRestoredFromContext.current
    ) {
      const campaigns = campaignsData.data;
      const restoredCampaign = campaigns.find((c) => c.id === selectedCampaignId);
      
      // Only restore if the current selectedCampaign doesn't match the Redux context
      if (restoredCampaign && selectedCampaign?.id !== selectedCampaignId) {
        setSelectedCampaign(restoredCampaign);
        hasRestoredFromContext.current = true;
        lastRestoredCampaignIdRef.current = selectedCampaignId;

        // Fetch data for restored campaign
        if (restoredCampaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR) {
          if (!rejectedIndividualCollaborationsData?.data && !rejectedIndividualCollaborationsLoading) {
            dispatch(getBrandRejectedIndividualCollaborations());
          }
        } else {
          dispatch(
            getRejectedCreators({
              campaignId: restoredCampaign.id,
              filters: { ...filters, status: "REJECTED" },
              sortBy,
            })
          );
        }
      } else if (restoredCampaign && selectedCampaign?.id === selectedCampaignId) {
        // Already have the correct campaign selected, just mark as restored
        hasRestoredFromContext.current = true;
        lastRestoredCampaignIdRef.current = selectedCampaignId;
      }
    } else if (!selectedCampaignId) {
      // Reset when Redux context is cleared
      lastRestoredCampaignIdRef.current = null;
      hasRestoredFromContext.current = false;
    }
  }, [
    campaignsLoading,
    campaignsData,
    selectedCampaignId,
    selectedCampaign?.id,
    dispatch,
    filters,
    sortBy,
    rejectedIndividualCollaborationsData?.data,
    rejectedIndividualCollaborationsLoading,
  ]);

  useEffect(() => {
    if (!initialLoadRef.current) {
      dispatch(getBrandRejectedIndividualCollaborations());
      initialLoadRef.current = true;
    }
  }, [dispatch]);

  useEffect(() => {
    const isIndividualMode = !selectedCampaign;
    const currentMode = isIndividualMode ? "individual" : selectedCampaign?.id;

    if (lastModeRef.current !== currentMode) {
      autoSelectedForCampaignRef.current = null;
      lastModeRef.current = currentMode;
      justReinstatedRef.current = false;
      
      if (isIndividualMode) {
        const isCreatorFromMultiCreator = selectedCreator?.creator_id || selectedCreator?.campaign_id;
        if (isCreatorFromMultiCreator) {
          setSelectedCreator(null);
        }
      } else {
        const isCreatorFromIndividual = selectedCreator?.creator && !selectedCreator.campaign_id && !selectedCreator.creator_id;
        if (isCreatorFromIndividual) {
          setSelectedCreator(null);
        }
      }
    }

    const isLoading = isIndividualMode ? rejectedIndividualCollaborationsLoading : rejectedCreatorsLoading;
    if (justReinstatedRef.current && !isLoading) {
      justReinstatedRef.current = false;
      autoSelectedForCampaignRef.current = null;
    }

    if (!selectedCampaign) {
      if (
        !rejectedIndividualCollaborationsLoading &&
        rejectedIndividualCollaborationsData?.data &&
        Array.isArray(rejectedIndividualCollaborationsData.data) &&
        rejectedIndividualCollaborationsData.data.length > 0 &&
        autoSelectedForCampaignRef.current !== "individual" &&
        !justReinstatedRef.current
      ) {
        const isCreatorFromMultiCreator = selectedCreator?.creator_id || selectedCreator?.campaign_id;
        if (!selectedCreator || isCreatorFromMultiCreator) {
          setSelectedCreator(rejectedIndividualCollaborationsData.data[0]);
          autoSelectedForCampaignRef.current = "individual";
        }
      }
    } else if (selectedCampaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR) {
      if (
        !rejectedIndividualCollaborationsLoading &&
        rejectedIndividualCollaborationsData?.data &&
        Array.isArray(rejectedIndividualCollaborationsData.data) &&
        rejectedIndividualCollaborationsData.data.length > 0 &&
        autoSelectedForCampaignRef.current !== selectedCampaign.id &&
        !justReinstatedRef.current
      ) {
        const isCreatorFromMultiCreator = selectedCreator?.creator_id || selectedCreator?.campaign_id;
        if (!selectedCreator || isCreatorFromMultiCreator) {
          setSelectedCreator(rejectedIndividualCollaborationsData.data[0]);
          autoSelectedForCampaignRef.current = selectedCampaign.id;
        }
      }
    } else {
      if (
        !rejectedCreatorsLoading &&
        rejectedCreatorsData?.data &&
        Array.isArray(rejectedCreatorsData.data) &&
        rejectedCreatorsData.data.length > 0 &&
        autoSelectedForCampaignRef.current !== selectedCampaign.id &&
        !justReinstatedRef.current
      ) {
        const isCreatorFromIndividual = selectedCreator?.creator && !selectedCreator.campaign_id && !selectedCreator.creator_id;
        if (!selectedCreator || isCreatorFromIndividual) {
          setSelectedCreator(rejectedCreatorsData.data[0]);
          autoSelectedForCampaignRef.current = selectedCampaign.id;
        }
      }
    }
  }, [
    selectedCampaign?.id,
    selectedCampaign?.collaboration_type,
    rejectedIndividualCollaborationsLoading,
    rejectedIndividualCollaborationsData?.data?.length,
    rejectedCreatorsLoading,
    rejectedCreatorsData?.data?.length,
    selectedCreator,
  ]);

  useEffect(() => {
    if (rejectSuccess && selectedCampaign) {
      if (selectedCampaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR) {
        dispatch(getBrandRejectedIndividualCollaborations());
      } else {
        dispatch(
          getRejectedCreators({
            campaignId: selectedCampaign.id,
            filters: { ...filters, status: "REJECTED" },
            sortBy,
          })
        );
      }
    }
  }, [rejectSuccess, selectedCampaign, dispatch, filters, sortBy]);

  useEffect(() => {
    if (rejectInvitationSuccess) {
      dispatch(getBrandRejectedIndividualCollaborations());
    }
  }, [rejectInvitationSuccess, dispatch]);

  useEffect(() => {
    if (reinstateSuccess) {
      setSelectedCreator(null);
      autoSelectedForCampaignRef.current = null;
      justReinstatedRef.current = true;
      
      if (selectedCampaign) {
        if (selectedCampaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR) {
          dispatch(getBrandRejectedIndividualCollaborations());
        } else {
          dispatch(
            getRejectedCreators({
              campaignId: selectedCampaign.id,
              filters: { ...filters, status: "REJECTED" },
              sortBy,
            })
          );
        }
      } else {
        dispatch(getBrandRejectedIndividualCollaborations());
      }
    }
  }, [reinstateSuccess, selectedCampaign, dispatch, filters, sortBy]);

  useEffect(() => {
    if (reinstateInvitationSuccess) {
      setSelectedCreator(null);
      autoSelectedForCampaignRef.current = null;
      justReinstatedRef.current = true;
      dispatch(getBrandRejectedIndividualCollaborations());
    }
  }, [reinstateInvitationSuccess, dispatch]);



  const handleCampaignSelect = useCallback(
    (campaign) => {
      setSelectedCreator(null);
      autoSelectedForCampaignRef.current = null;
      setSelectedCampaign(campaign);

      // Save to Redux context for persistence across tabs
      if (campaign) {
        dispatch(
          setSelectedCampaignContext({
            campaignId: campaign.id,
            collaborationType: campaign.collaboration_type || null,
          })
        );
      } else {
        dispatch(setSelectedCampaignContext({ campaignId: null, collaborationType: null }));
      }

      if (campaign?.id) {
        if (campaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR) {
          if (!rejectedIndividualCollaborationsData?.data && !rejectedIndividualCollaborationsLoading) {
            dispatch(getBrandRejectedIndividualCollaborations());
          }
        } else {
          dispatch(
            getRejectedCreators({
              campaignId: campaign.id,
              filters: { ...filters, status: "REJECTED" },
              sortBy,
            })
          );
        }
      } else if (!campaign) {
        if (!rejectedIndividualCollaborationsData?.data && !rejectedIndividualCollaborationsLoading) {
          dispatch(getBrandRejectedIndividualCollaborations());
        }
      }
    },
    [dispatch, filters, sortBy, rejectedIndividualCollaborationsData?.data, rejectedIndividualCollaborationsLoading]
  );

  const handleCreatorSelect = useCallback((creator) => {
    setSelectedCreator(creator);
  }, []);

  const handleClearCreator = useCallback(() => {
    setSelectedCreator(null);
  }, []);

  useEffect(() => {
    if (!selectedCreator) {
      setMobilePane("list");
    }
  }, [selectedCreator]);

  const handleCreatorSelectWithPane = useCallback(
    (creator) => {
      handleCreatorSelect(creator);
      if (typeof window !== "undefined" && window.innerWidth < MD_BREAKPOINT) {
        setMobilePane("detail");
      }
    },
    [handleCreatorSelect]
  );

  const backToRejectedList = useCallback(() => {
    handleClearCreator();
    setMobilePane("list");
  }, [handleClearCreator]);

  const handleFilterChange = useCallback(
    (key, value) => {
      const newFilters = { ...filters, [key]: value };
      setFilters(newFilters);

      if (selectedCampaign) {
        dispatch(
          getRejectedCreators({
            campaignId: selectedCampaign.id,
            filters: { ...newFilters, status: "REJECTED" },
            sortBy,
          })
        );
      }
    },
    [filters, selectedCampaign, dispatch, sortBy]
  );

  const handleClearFilters = useCallback(() => {
    setFilters({});
    if (selectedCampaign) {
      dispatch(
        getRejectedCreators({
          campaignId: selectedCampaign.id,
          filters: { status: "REJECTED" },
          sortBy,
        })
      );
    }
  }, [selectedCampaign, dispatch, sortBy]);

  const handleSortChange = useCallback(
    (newSortBy) => {
      setSortBy(newSortBy);
      if (selectedCampaign) {
        dispatch(
          getRejectedCreators({
            campaignId: selectedCampaign.id,
            filters: { ...filters, status: "REJECTED" },
            sortBy: newSortBy,
          })
        );
      }
    },
    [selectedCampaign, dispatch, filters]
  );

  const handleReinstateCreator = useCallback(
    (campaignId, creatorId, invitationId = null) => {
      if (invitationId) {
        dispatch(reinstateInvitation(invitationId));
      } else {
        dispatch(reinstateCreator({ campaignId, creatorId }));
      }
    },
    [dispatch]
  );

  const handleSaveToShortlist = useCallback(
    (creator, shortlistId) => {
      dispatch(
        addUserToShortlist({
          shortlistId,
          userId: creator.id,
        })
      );
    },
    [dispatch]
  );

  const hasIndividualData =
    rejectedIndividualCollaborationsData &&
    (rejectedIndividualCollaborationsSuccess ||
      rejectedIndividualCollaborationsData.data !== undefined);

  const isIndividual =
    selectedCampaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR ||
    (!selectedCampaign && hasIndividualData);

  const isLoading = isIndividual
    ? rejectedIndividualCollaborationsLoading
    : rejectedCreatorsLoading;

  const rightPaneState = (() => {
    if (isLoading) {
      return { type: "loading" };
    }

    if (!selectedCampaign && !selectedCreator) {
      return {
        type: "notFound",
        title: "No Campaign Selected",
        description: "Select a campaign to view details.",
      };
    }

    const dataLength = isIndividual
      ? rejectedIndividualCollaborationsData?.data?.length || 0
      : rejectedCreatorsData?.data?.length || 0;

    if (!selectedCampaign && dataLength === 0) {
      return {
        type: "notFound",
        title: "No Creators Found",
        description: "No rejected individual collaborations found.",
      };
    }

    if (selectedCampaign && dataLength === 0) {
      return {
        type: "notFound",
        title: "No Creators Found",
        description: "No creators have been rejected for this campaign yet.",
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
      (!selectedCreator?.campaign_id && !selectedCreator?.creator_id && selectedCreator?.creator);

    return { type: "content", isIndividualCreator };
  })();

  return {
    selectedCampaign,
    selectedCreator,
    filters,
    sortBy,
    mobilePane,
    rejectedCreatorsLoading: isLoading,
    reinstateLoading: isIndividual ? reinstateInvitationLoading : reinstateLoading,
    rejectedCreatorsData: isIndividual
      ? rejectedIndividualCollaborationsData
      : rejectedCreatorsData,
    rightPaneState,
    handleCampaignSelect,
    handleCreatorSelect,
    handleCreatorSelectWithPane,
    handleClearCreator,
    backToRejectedList,
    handleFilterChange,
    handleClearFilters,
    handleSortChange,
    handleReinstateCreator,
    handleSaveToShortlist,
  };
}

export default useRejected;
