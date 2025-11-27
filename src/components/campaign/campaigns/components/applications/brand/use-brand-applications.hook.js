import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createContract,
  getAppliedCreators,
  rejectCreator,
  sendContract,
} from "@/provider/features/campaigns/campaigns.slice";
import useMessageThread from "../../message-thread-modal/use-message-thread.hook";
import { avatar } from "@/common/constants/auth.constant";
import invitationService from "@/provider/features/invitation/invitation.service";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";

function useBrandApplications() {
  const dispatch = useDispatch();

  const {
    data: appliedCreatorsData,
    isLoading: appliedCreatorsLoading,
    isSuccess: appliedCreatorsSuccess,
  } = useSelector((state) => state.campaigns.getAppliedCreators || {});
  const { isLoading: rejectLoading, isSuccess: rejectSuccess } = useSelector(
    (state) => state.campaigns.rejectCreator || {}
  );
  const {
    isLoading: createContractLoading,
    isSuccess: createContractSuccess,
    isError: createContractError,
  } = useSelector((state) => state.campaigns.createContract || {});
  const {
    isLoading: sendContractLoading,
    isSuccess: sendContractSuccess,
    isError: sendContractError,
  } = useSelector((state) => state.campaigns.sendContract || {});

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const autoSelectedForCampaignRef = useRef(null);
  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [hireCreatorData, setHireCreatorData] = useState(null);
  const [selectedCampaignForHire, setSelectedCampaignForHire] = useState(null);
  const [showRejectConfirmation, setShowRejectConfirmation] = useState(false);
  const [individualCollaborations, setIndividualCollaborations] = useState([]);
  const [individualCollaborationsLoading, setIndividualCollaborationsLoading] = useState(false);
  const [filters, setFilters] = useState({
    min_followers: "",
    max_followers: "",
    min_rating: "",
    max_rating: "",
    country: "",
    city: "",
    niches: [],
    platforms: [],
    status: "PENDING",
    sort: "newest",
  });

  const fetchIndividualCollaborations = async () => {
    setIndividualCollaborationsLoading(true);
    const response = await invitationService
      .getBrandIndividualCollaborations()
      .catch(() => ({ data: [] }));
    const collaborations = response?.data || [];
    setIndividualCollaborations(collaborations);
    setIndividualCollaborationsLoading(false);
  };

  const handleCampaignSelect = (campaign) => {
    setSelectedCampaign(campaign);
    setSelectedCreator(null);
    autoSelectedForCampaignRef.current = null;
    if (campaign) {
      if (campaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR) {
        fetchIndividualCollaborations();
      } else {
        dispatch(
          getAppliedCreators({
            campaignId: campaign.id,
            filters: filters,
          })
        );
      }
    }
  };

  useEffect(() => {
    const creators = appliedCreatorsData?.data;
    if (
      selectedCampaign &&
      appliedCreatorsSuccess &&
      Array.isArray(creators) &&
      creators.length > 0 &&
      !selectedCreator &&
      autoSelectedForCampaignRef.current !== selectedCampaign.id
    ) {
      setSelectedCreator(creators[0]);
      autoSelectedForCampaignRef.current = selectedCampaign.id;
    }
  }, [appliedCreatorsSuccess, appliedCreatorsData, selectedCampaign, selectedCreator]);

  const handleCreatorSelect = (creator) => {
    setSelectedCreator(creator);
  };

  const handleHireClick = () => {
    if (!selectedCreator || !selectedCampaign) return;
    setHireCreatorData(selectedCreator);
    setSelectedCampaignForHire(selectedCampaign);
    setHireModalOpen(true);
  };

  const handleSendOffer = async (contractData) => {
    const isIndividual =
      selectedCampaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;
    const contractPayload = {
      ...(isIndividual ? {} : { campaignId: selectedCampaign.id }),
      creatorId: selectedCreator.creator?.id || selectedCreator.id,
      brandId: selectedCampaign?.created_by?.id || selectedCampaign?.brand?.id,
      startDate: contractData.startDate,
      completionDeadline: contractData.completionDeadline,
      contentFormat: contractData.contentFormat,
      revisionsLimit: contractData.revisionsLimit,
      compensationType: contractData.compensationType?.toUpperCase(),
      totalCompensation: contractData.totalCompensation
        ? parseFloat(contractData.totalCompensation)
        : undefined,
      productPrice: contractData.productPrice ? parseFloat(contractData.productPrice) : undefined,
      usageRights:
        contractData.usageRights === "no_usage"
          ? "no_usage"
          : contractData.usageRights === "permanent"
            ? "permanent"
            : `${contractData.usageRights}_months`,
      exclusivityClause:
        contractData.exclusivityClause === "none"
          ? "none"
          : `${contractData.exclusivityClause}_months`,
      hashtags: contractData.hashtags,
      mentions: contractData.mentions,
      inPersonRequired: contractData.inPersonRequired,
      eligibleCountry: contractData.eligibleCountry,
      eligibleCity: contractData.eligibleCity,
      ageRange: contractData.ageRange,
      gender: contractData.gender,
      language: contractData.language,
      ...(isIndividual && contractData.campaignType
        ? { campaignType: contractData.campaignType }
        : {}),
      ...(isIndividual && contractData.contentGuidelines
        ? { contentGuidelines: contractData.contentGuidelines }
        : {}),
    };

    const createResult = await dispatch(createContract(contractPayload)).unwrap();
    if (createResult.success) {
      await dispatch(sendContract(createResult.data.id)).unwrap();
      setHireModalOpen(false);
      setHireCreatorData(null);
      setSelectedCampaignForHire(null);
      setTimeout(() => {
        if (selectedCampaign) {
          handleCampaignSelect(selectedCampaign);
        } else if (isIndividual) {
          fetchIndividualCollaborations();
        }
      }, 1000);
    }
  };

  const handleRejectClick = () => setShowRejectConfirmation(true);

  const handleConfirmReject = () => {
    if (selectedCampaign && selectedCreator) {
      dispatch(rejectCreator({ campaignId: selectedCampaign.id, creatorId: selectedCreator.id }));
    }
    setShowRejectConfirmation(false);
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    if (
      selectedCampaign &&
      selectedCampaign.collaboration_type !== COLLABORATION_TYPE.INDIVIDUAL_CREATOR
    ) {
      dispatch(
        getAppliedCreators({
          campaignId: selectedCampaign.id,
          filters: newFilters,
        })
      );
    }
  };

  const clearFilters = () => {
    const clearedFilters = {
      min_followers: "",
      max_followers: "",
      min_rating: "",
      max_rating: "",
      country: "",
      city: "",
      niches: [],
      platforms: [],
      status: "PENDING",
      sort: "newest",
    };
    setFilters(clearedFilters);
    if (
      selectedCampaign &&
      selectedCampaign.collaboration_type !== COLLABORATION_TYPE.INDIVIDUAL_CREATOR
    ) {
      dispatch(
        getAppliedCreators({
          campaignId: selectedCampaign.id,
          filters: clearedFilters,
        })
      );
    }
  };

  useEffect(() => {
    if (rejectSuccess && selectedCampaign) {
      if (selectedCampaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR) {
        fetchIndividualCollaborations();
      } else {
        dispatch(
          getAppliedCreators({
            campaignId: selectedCampaign.id,
            filters: { ...filters, status: "PENDING" },
          })
        );
      }
      setSelectedCreator(null);
    }
  }, [rejectSuccess, selectedCampaign, dispatch, filters]);

  const messageThreadHook = useMessageThread(selectedCreator?.creator?.id || null);

  const creator = {
    id: selectedCreator?.creator?.id,
    name: selectedCreator?.creator?.first_name + " " + selectedCreator?.creator?.last_name,
    avatar: selectedCreator?.creator?.creator_profile?.profile_photo_url || avatar,
    isOnline: true,
  };

  const creators = Array.isArray(appliedCreatorsData?.data) ? appliedCreatorsData.data : [];

  const individualCreators = individualCollaborations.map((invitation) => ({
    ...invitation,
    creator: invitation.creator,
    applied_at: invitation.created_at,
    status: invitation.status || "PENDING",
  }));

  const displayCreators =
    selectedCampaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR
      ? individualCreators
      : creators;

  const handleMessageClick = () => {
    messageThreadHook.openMessageModal();
  };

  return {
    appliedCreatorsData,
    appliedCreatorsLoading: appliedCreatorsLoading || individualCollaborationsLoading,
    selectedCampaign,
    selectedCreator,
    hireModalOpen,
    setHireModalOpen,
    hireCreatorData,
    selectedCampaignForHire,
    showRejectConfirmation,
    setShowRejectConfirmation,
    createContractLoading,
    sendContractLoading,
    createContractSuccess,
    sendContractSuccess,
    createContractError,
    sendContractError,
    filters,
    creators: displayCreators,
    creator,
    messageThreadHook,
    handleCampaignSelect,
    handleCreatorSelect,
    handleHireClick,
    handleSendOffer,
    handleRejectClick,
    handleConfirmReject,
    handleFilterChange,
    clearFilters,
    handleMessageClick,
    fetchIndividualCollaborations,
  };
}

export default useBrandApplications;
