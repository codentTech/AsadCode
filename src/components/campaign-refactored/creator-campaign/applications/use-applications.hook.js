import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCreatorApplications,
  withdrawApplication,
} from "@/provider/features/campaigns/campaigns.slice";
import { getPendingContractsForCreator } from "@/provider/features/contracts/contracts.slice";
import invitationService from "@/provider/features/invitation/invitation.service";
import { COMPENSATION_TYPE } from "@/common/constants/campaign.constant";
import { DEFAULT_PAGE_LIMIT } from "@/common/constants/genaric.constant";
import { useSearchParams } from "next/navigation";
import useMessageThread from "@/components/campaign-refactored/shared/message-thread-modal/use-message-thread.hook";

function useApplications() {
  const searchParams = useSearchParams();
  const tab = Number(searchParams.get("application")) || 2;
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(tab || 2);
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
  const [tabPages, setTabPages] = useState({
    1: 1,
    2: 1,
    3: 1,
    4: 1,
  });
  const hasOpenedMessageThreadRef = useRef(false);

  const { isLoading: applicationsLoading, isError: applicationsError } = useSelector(
    (state) => state.campaigns.getCreatorApplications || {}
  );

  const { data: offersDataRaw } = useSelector(
    (state) => state.contracts.getPendingContractsForCreator || {}
  );

  // Handle both array and nested data structure
  const offersData = (() => {
    if (Array.isArray(offersDataRaw)) {
      return offersDataRaw;
    }
    if (offersDataRaw?.data && Array.isArray(offersDataRaw.data)) {
      return offersDataRaw.data;
    }
    return [];
  })();

  const { isLoading: withdrawLoading } = useSelector(
    (state) => state.campaigns.withdrawApplication || {}
  );

  useEffect(() => {
    fetchAllApplications();
    // Fetch pending contracts for offers count
    dispatch(getPendingContractsForCreator());
  }, [dispatch]);

  useEffect(() => {
    setActiveTab(tab || 2);
  }, [tab]);

  useEffect(() => {
    setTabPages((prev) => ({
      ...prev,
      [activeTab]: 1,
    }));
  }, [activeTab, allApplications]);

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
          id: invitation.campaign_id || null,
          campaign_title:
            invitation.collaboration_type === "INDIVIDUAL_CREATOR"
              ? "Individual Collaboration"
              : "Campaign",
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
          collaboration_type: invitation.collaboration_type,
        },
    brand: invitation.brand,
    custom_message: invitation.custom_message,
    collaboration_type: invitation.collaboration_type,
    campaign_id: invitation.campaign_id || invitation.campaign?.id || null,
    isInvitation: true,
  });

  const fetchAllApplications = async () => {
    const pendingResponse = await dispatch(getCreatorApplications("PENDING")).unwrap();
    const pendingApps = (pendingResponse?.data || []).filter((app) => !app.isInvitation);

    const negotiationsResponse = await dispatch(getCreatorApplications("NEGOTIATIONS")).unwrap();
    const negotiationsApps = (negotiationsResponse?.data || []).filter((app) => !app.isInvitation);

    const rejectedResponse = await dispatch(getCreatorApplications("REJECTED")).unwrap();
    const rejectedApps = (rejectedResponse?.data || []).filter((app) => !app.isInvitation);

    const hiredResponse = await dispatch(getCreatorApplications("HIRED")).unwrap();
    const hiredApps = (hiredResponse?.data || []).filter((app) => !app.isInvitation);

    let invites = [];
    const invitesResponse = await invitationService
      .getCreatorInvitations()
      .catch(() => ({ data: [] }));
    const rawInvites = invitesResponse?.data || [];
    invites = rawInvites.map(normalizeInvitation).filter((invite) => invite.isInvitation === true);

    setAllApplications({
      invites,
      negotiations: negotiationsApps,
      pending: pendingApps,
      rejected: rejectedApps,
      offers: hiredApps,
    });
  };

  const handleWithdrawApplication = async (campaignId) => {
    await dispatch(withdrawApplication(campaignId)).unwrap();
    await fetchAllApplications();
  };

  const filteredData =
    activeTab === 1
      ? allApplications.invites.filter((item) => item.isInvitation === true)
      : activeTab === 2
        ? allApplications.negotiations.filter((item) => !item.isInvitation)
        : activeTab === 5
          ? allApplications.offers.filter((item) => !item.isInvitation)
          : activeTab === 3
            ? allApplications.pending.filter((item) => !item.isInvitation)
            : allApplications.rejected.filter((item) => !item.isInvitation);
  const currentPage = tabPages[activeTab] || 1;
  const totalFilteredItems = filteredData.length;
  const paginatedData = filteredData.slice(0, currentPage * DEFAULT_PAGE_LIMIT);
  const hasMoreItems = paginatedData.length < totalFilteredItems;

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

  const handleLoadMore = () => {
    setTabPages((prev) => ({
      ...prev,
      [activeTab]: (prev[activeTab] || 1) + 1,
    }));
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
    const brandId =
      item.brand?.id ||
      item.brand_id ||
      item.brandId ||
      item.campaign?.created_by?.id ||
      item.campaign?.brand_id;
    const campaignId =
      item.campaign?.id ||
      item.campaign_id ||
      item.campaignId ||
      item.campaign?.campaign_id;

    if (brandId && campaignId) {
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

  const messageThreadCampaignId =
    messageModalState.application?.campaign?.id ||
    messageModalState.application?.campaign_id ||
    messageModalState.application?.campaignId ||
    messageModalState.application?.campaign?.campaign_id ||
    null;

  const initialInvitationMessage = useMemo(() => {
    const app = messageModalState.application;
    if (!app) return null;
    const inviteMessage = app.custom_message?.trim();
    return inviteMessage || null;
  }, [messageModalState.application]);

  const messageThreadHook = useMessageThread(
    messageModalState.brandId || null,
    messageThreadCampaignId || null,
    null,
    initialInvitationMessage
      ? { content: initialInvitationMessage, senderRole: "BRAND" }
      : null
  );

  useEffect(() => {
    if (!messageModalState.isOpen) {
      hasOpenedMessageThreadRef.current = false;
      return;
    }

    if (
      messageModalState.brandId &&
      messageThreadCampaignId &&
      messageThreadHook.openMessageModal &&
      !hasOpenedMessageThreadRef.current
    ) {
      hasOpenedMessageThreadRef.current = true;
      messageThreadHook.openMessageModal();
    }
  }, [
    messageModalState.isOpen,
    messageModalState.brandId,
    messageThreadCampaignId,
    messageThreadHook.openMessageModal,
  ]);

  const handleCloseMessageThread = useCallback(() => {
    messageThreadHook.closeMessageModal();
    handleCloseMessageModal();
  }, [messageThreadHook.closeMessageModal]);

  const messageThreadBrand = useMemo(() => {
    const app = messageModalState.application;
    const brandData = app?.brand || app?.campaign?.created_by;
    return {
      id: messageModalState.brandId,
      name:
        brandData?.first_name && brandData?.last_name
          ? `${brandData.first_name} ${brandData.last_name}`
          : brandData?.first_name ||
            brandData?.brand_name ||
            app?.brand_name ||
            "Brand",
      avatar:
        brandData?.brand_profile?.logo ||
        brandData?.brand_profile?.brand_logo_url ||
        brandData?.profile_photo_url ||
        null,
    };
  }, [messageModalState.application, messageModalState.brandId]);

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
    paginatedData,
    hasMoreItems,
    totalFilteredItems,
    handleLoadMore,
    handleTabChange,
    handleViewCampaign,
    handleCloseCampaignBrief,
    handleWithdraw,
    handleConfirmWithdraw,
    handleCancelWithdraw,
    handleMessageClick,
    handleCloseMessageModal,
    handleCloseMessageThread,
    messageModalState,
    messageThreadHook,
    messageThreadBrand,
    fetchAllApplications,
    formatCompensationType,
    offersData,
  };
}

export default useApplications;
