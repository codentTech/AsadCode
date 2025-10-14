import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCreatorApplications,
  withdrawApplication,
} from "@/provider/features/campaigns/campaigns.slice";
import { getUser } from "@/common/utils/users.util";

function useCreatorApplications() {
  const dispatch = useDispatch();
  const user = getUser();

  // State management
  const [activeTab, setActiveTab] = useState("responded");
  const [allApplications, setAllApplications] = useState({
    responded: [],
    pending: [],
    rejected: [],
  });
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showCampaignBrief, setShowCampaignBrief] = useState(false);
  const [showWithdrawConfirmation, setShowWithdrawConfirmation] = useState(false);
  const [campaignToWithdraw, setCampaignToWithdraw] = useState(null);

  // Get creator applications state from Redux
  const {
    data: applicationsData,
    isLoading: applicationsLoading,
    isSuccess: applicationsSuccess,
    isError: applicationsError,
  } = useSelector((state) => state.campaigns.getCreatorApplications || {});

  // Get withdraw application state from Redux
  const {
    isLoading: withdrawLoading,
    isSuccess: withdrawSuccess,
    isError: withdrawError,
  } = useSelector((state) => state.campaigns.withdrawApplication || {});

  // Mock conversations data - TODO: Replace with real chat integration when available
  // For now, using empty array so all applications stay in "pending"
  // const conversations = [];

  // Function to fetch all applications (pending, rejected, and categorize responded)
  const fetchAllApplications = async () => {
    try {
      // Fetch pending applications
      const pendingResponse = await dispatch(getCreatorApplications("PENDING")).unwrap();
      const pendingApps = pendingResponse?.data || [];

      // Fetch rejected applications
      const rejectedResponse = await dispatch(getCreatorApplications("REJECTED")).unwrap();
      const rejectedApps = rejectedResponse?.data || [];

      // Categorize pending applications into "responded" and "pending"
      // TODO: When chat feature is integrated, uncomment the categorization logic
      // For now, since conversations is empty, all apps stay in pending
      const respondedApps = [];
      const truePendingApps = pendingApps; // All pending apps stay in pending for now

      setAllApplications({
        responded: respondedApps,
        pending: truePendingApps,
        rejected: rejectedApps,
      });
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    }
  };

  // Function to withdraw application
  const handleWithdrawApplication = async (campaignId) => {
    try {
      await dispatch(withdrawApplication(campaignId)).unwrap();
      // Refresh all applications after successful withdrawal
      await fetchAllApplications();
    } catch (error) {
      // Error handling is done globally in api.js
      console.error("Withdrawal failed:", error);
    }
  };

  // Fetch all applications on component mount only
  useEffect(() => {
    fetchAllApplications();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter data based on active tab - use local state for display
  const filteredData =
    activeTab === "responded"
      ? allApplications.responded
      : activeTab === "pending"
        ? allApplications.pending
        : allApplications.rejected;

  // Helper functions
  const formatCompensationType = (type) => {
    switch (type) {
      case "FIXED":
        return "Paid";
      case "GIFTED":
        return "Gifted";
      case "COMMISSION":
        return "Commission";
      default:
        return type;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getBrandLogo = (brand) => {
    return (
      brand?.profile_photo_url ||
      "https://images.unsplash.com/photo-1549924231-f129b911e442?w=40&h=40&fit=crop&crop=center"
    );
  };

  // Tab change handler
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Campaign brief handlers
  const handleViewCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setShowCampaignBrief(true);
  };

  const handleCloseCampaignBrief = () => {
    setShowCampaignBrief(false);
    setSelectedCampaign(null);
  };

  // Withdraw handlers
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

  return {
    // State
    activeTab,
    allApplications,
    selectedCampaign,
    showCampaignBrief,
    showWithdrawConfirmation,

    // Redux state
    applicationsData,
    applicationsLoading,
    applicationsSuccess,
    applicationsError,
    withdrawLoading,
    withdrawSuccess,
    withdrawError,

    // Computed data
    filteredData,

    // Handlers
    handleTabChange,
    handleViewCampaign,
    handleCloseCampaignBrief,
    handleWithdraw,
    handleConfirmWithdraw,
    handleCancelWithdraw,

    // Helper functions
    formatCompensationType,
    formatDate,
    getBrandLogo,
  };
}

export default useCreatorApplications;
