import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCreatorApplications,
  withdrawApplication,
} from "@/provider/features/campaigns/campaigns.slice";
import invitationService from "@/provider/features/invitation/invitation.service";
import { COMPENSATION_TYPE } from "@/common/constants/campaign.constant";

function useCreatorApplications() {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("negotiations");
  const [allApplications, setAllApplications] = useState({
    invites: [],
    negotiations: [],
    pending: [],
    rejected: [],
    offers: [],
  });
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showCampaignBrief, setShowCampaignBrief] = useState(false);
  const [showWithdrawConfirmation, setShowWithdrawConfirmation] = useState(false);
  const [campaignToWithdraw, setCampaignToWithdraw] = useState(null);
  const [showOffersModal, setShowOffersModal] = useState(false);
  const [messageModalState, setMessageModalState] = useState({
    isOpen: false,
    brandId: null,
    application: null,
  });

  const { isLoading: applicationsLoading, isError: applicationsError } = useSelector(
    (state) => state.campaigns.getCreatorApplications || {}
  );

  const { isLoading: withdrawLoading } = useSelector(
    (state) => state.campaigns.withdrawApplication || {}
  );

  useEffect(() => {
    fetchAllApplications();
  }, []);

  const normalizeInvitation = (invitation) => ({
    ...invitation,
    id: invitation.id,
    status: invitation.status || "PENDING",
    applied_at: invitation.created_at,
    created_at: invitation.created_at,
    campaign: invitation.campaign
      ? {
          ...invitation.campaign,
          created_by: invitation.brand,
        }
      : {
          id: null,
          campaign_title: "Individual Collaboration",
          campaign_type: null,
          compensation_type: null,
          budget: null,
          creator_fee: null,
          niches: [],
          location_options: [],
          language_requirement: null,
          min_combined_followers: null,
          deliverables: [],
          short_description: invitation.custom_message || "",
          long_description: invitation.custom_message || "",
          campaign_image: null,
          created_by: invitation.brand,
        },
    brand: invitation.brand,
    custom_message: invitation.custom_message,
    collaboration_type: invitation.collaboration_type,
    isInvitation: true,
  });

  const fetchAllApplications = async () => {
    const pendingResponse = await dispatch(getCreatorApplications("PENDING")).unwrap();
    const pendingApps = pendingResponse?.data || [];

    const rejectedResponse = await dispatch(getCreatorApplications("REJECTED")).unwrap();
    const rejectedApps = rejectedResponse?.data || [];

    const hiredResponse = await dispatch(getCreatorApplications("HIRED")).unwrap();
    const hiredApps = hiredResponse?.data || [];

    let invites = [];
    const invitesResponse = await invitationService
      .getCreatorInvitations()
      .catch(() => ({ data: [] }));
    const rawInvites = invitesResponse?.data || [];
    invites = rawInvites.map(normalizeInvitation);

    const negotiationsApps = [];
    const truePendingApps = pendingApps;

    setAllApplications({
      invites,
      negotiations: negotiationsApps,
      pending: truePendingApps,
      rejected: rejectedApps,
      offers: hiredApps,
    });
  };

  const handleWithdrawApplication = async (campaignId) => {
    await dispatch(withdrawApplication(campaignId)).unwrap();
    await fetchAllApplications();
  };

  const filteredData =
    activeTab === "invites"
      ? allApplications.invites
      : activeTab === "negotiations"
        ? allApplications.negotiations
        : activeTab === "offers"
          ? allApplications.offers
          : activeTab === "pending"
            ? allApplications.pending
            : allApplications.rejected;

  const formatCompensationType = (type) => {
    switch (type) {
      case COMPENSATION_TYPE.PAID:
        return "Paid";
      case COMPENSATION_TYPE.GIFTED_PRODUCT:
        return "Gifted";
      case COMPENSATION_TYPE.COMMISSION:
        return "Commission";
      default:
        return type;
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleViewCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setShowCampaignBrief(true);
  };

  const handleCloseCampaignBrief = () => {
    setShowCampaignBrief(false);
    setSelectedCampaign(null);
  };

  const handleWithdraw = (campaignId) => {
    setCampaignToWithdraw(campaignId);
    setShowWithdrawConfirmation(true);
  };

  const handleConfirmWithdraw = async () => {
    if (campaignToWithdraw) {
      await handleWithdrawApplication(campaignToWithdraw);
      setShowWithdrawConfirmation(false);
      setCampaignToWithdraw(null);
    }
  };

  const handleCancelWithdraw = () => {
    setShowWithdrawConfirmation(false);
    setCampaignToWithdraw(null);
  };

  const handleMessageClick = (item) => {
    const brandId = item.brand?.id || item.campaign?.created_by?.id;
    if (brandId) {
      setMessageModalState({
        isOpen: true,
        brandId,
        application: item,
      });
    }
  };

  const handleCloseMessageModal = () => {
    setMessageModalState({
      isOpen: false,
      brandId: null,
      application: null,
    });
  };

  return {
    activeTab,
    allApplications,
    selectedCampaign,
    showCampaignBrief,
    showWithdrawConfirmation,
    showOffersModal,
    setShowOffersModal,
    applicationsLoading,
    applicationsError,
    withdrawLoading,
    filteredData,
    handleTabChange,
    handleViewCampaign,
    handleCloseCampaignBrief,
    handleWithdraw,
    handleConfirmWithdraw,
    handleCancelWithdraw,
    handleMessageClick,
    handleCloseMessageModal,
    messageModalState,
    fetchAllApplications,
    formatCompensationType,
  };
}

export default useCreatorApplications;
