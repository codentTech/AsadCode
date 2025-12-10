import { useCallback, useEffect, useState } from "react";
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

function useRejected() {
  // State
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("newest");

  // Redux State
  const dispatch = useDispatch();

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

  useEffect(() => {
    const isIndividual = !selectedCampaign;

    if (isIndividual) {
      const hasIndividualData =
        rejectedIndividualCollaborationsData &&
        Array.isArray(rejectedIndividualCollaborationsData.data) &&
        rejectedIndividualCollaborationsData.data.length > 0;

      if (hasIndividualData) {
        const isCreatorFromIndividual =
          selectedCreator?.creator && !selectedCreator.campaign_id && !selectedCreator.creator_id;
        const isCreatorFromMultiCreator =
          selectedCreator?.creator_id || selectedCreator?.campaign_id;

        if (!selectedCreator || isCreatorFromMultiCreator) {
          const creators = rejectedIndividualCollaborationsData.data;
          if (creators.length > 0) {
            setSelectedCreator(creators[0]);
          }
        }
      } else if (selectedCreator) {
        const isCreatorFromMultiCreator =
          selectedCreator?.creator_id || selectedCreator?.campaign_id;
        if (isCreatorFromMultiCreator) {
          setSelectedCreator(null);
        }
      }
    } else if (selectedCampaign) {
      const isCreatorFromIndividual =
        selectedCreator?.creator && !selectedCreator.campaign_id && !selectedCreator.creator_id;
      const isCreatorFromMultiCreator = selectedCreator?.creator_id || selectedCreator?.campaign_id;

      if (isCreatorFromIndividual) {
        setSelectedCreator(null);
      } else if (!selectedCreator && rejectedCreatorsSuccess) {
        const creators = rejectedCreatorsData?.data;
        if (Array.isArray(creators) && creators.length > 0) {
          setSelectedCreator(creators[0]);
        }
      }
    }
  }, [
    rejectedCreatorsSuccess,
    rejectedCreatorsData,
    rejectedIndividualCollaborationsSuccess,
    rejectedIndividualCollaborationsData,
    selectedCampaign,
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
    if (reinstateSuccess && selectedCampaign) {
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
      setSelectedCreator(null);
    }
  }, [reinstateSuccess, selectedCampaign, dispatch, filters, sortBy]);

  useEffect(() => {
    if (reinstateInvitationSuccess) {
      dispatch(getBrandRejectedIndividualCollaborations());
      setSelectedCreator(null);
    }
  }, [reinstateInvitationSuccess, dispatch]);

  useEffect(() => {
    dispatch(getBrandRejectedIndividualCollaborations());
  }, [dispatch]);

  const handleCampaignSelect = useCallback(
    (campaign) => {
      setSelectedCreator(null);
      setSelectedCampaign(campaign);

      if (campaign?.id) {
        if (campaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR) {
          dispatch(getBrandRejectedIndividualCollaborations());
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
        dispatch(getBrandRejectedIndividualCollaborations());
      }
    },
    [dispatch, filters, sortBy]
  );

  const handleCreatorSelect = useCallback((creator) => {
    setSelectedCreator(creator);
  }, []);

  const handleClearCreator = useCallback(() => {
    setSelectedCreator(null);
  }, []);

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

  return {
    selectedCampaign,
    selectedCreator,
    filters,
    sortBy,
    rejectedCreatorsLoading: isLoading,
    reinstateLoading: isIndividual ? reinstateInvitationLoading : reinstateLoading,
    rejectedCreatorsData: isIndividual
      ? rejectedIndividualCollaborationsData
      : rejectedCreatorsData,
    handleCampaignSelect,
    handleCreatorSelect,
    handleClearCreator,
    handleFilterChange,
    handleClearFilters,
    handleSortChange,
    handleReinstateCreator,
    handleSaveToShortlist,
  };
}

export default useRejected;
