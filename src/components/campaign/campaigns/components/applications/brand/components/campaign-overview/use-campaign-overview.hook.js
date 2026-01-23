import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllBrandCampaigns,
  createContract,
  sendContract,
} from "@/provider/features/campaigns/campaigns.slice";
import { setSelectedCampaign as setSelectedCampaignContext } from "@/provider/features/campaign-context/campaign-context.slice";

const COUNTRIES = [
  { value: "United States", label: "United States" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "Canada", label: "Canada" },
  { value: "Australia", label: "Australia" },
];

const APPLICATION_STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "HIRED", label: "Hired" },
  { value: "REJECTED", label: "Rejected" },
  { value: "DRAFT", label: "Draft" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "rating", label: "Highest Rating" },
  { value: "followers", label: "Most Followers" },
];

const NICHE_OPTIONS = [
  "Beauty",
  "Skincare",
  "Fitness",
  "Fashion",
  "Travel",
  "Food",
  "Finance",
  "Business",
  "Health",
];

const PLATFORM_OPTIONS = ["Instagram", "TikTok", "YouTube"];

const COUNTRY_FILTER_OPTIONS = ["United States", "Canada", "United Kingdom", "Australia"];

function useCampaignOverview({
  onCampaignSelect,
  selectedCampaign: externalSelectedCampaign,
  selectedCreator,
  filters,
  onFilterChange,
  onClearFilters,
  onRejectCreator,
} = {}) {
  const dispatch = useDispatch();
  const hasRestoredFromContext = useRef(false);
  const lastRestoredCampaignIdRef = useRef(null);

  const { selectedCampaignId } = useSelector((state) => state.campaignContext || {});

  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [hireCreatorData, setHireCreatorData] = useState(null);
  const [selectedCampaignForHire, setSelectedCampaignForHire] = useState(null);
  const [showRejectConfirmation, setShowRejectConfirmation] = useState(false);

  const {
    data: campaignsData,
    isLoading: campaignsLoading,
    isSuccess: campaignsSuccess,
    isError: campaignsError,
  } = useSelector((state) => state.campaigns.getAllBrandCampaigns || {});

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
    if (campaignsSuccess && campaignsData?.data && selectedCampaignId && !hasRestoredFromContext.current) {
      const campaigns = Array.isArray(campaignsData.data) ? campaignsData.data : [];
      const restoredCampaign = campaigns.find((c) => c.id === selectedCampaignId);
      if (restoredCampaign) {
        setSelectedCampaign(restoredCampaign);
        hasRestoredFromContext.current = true;
        lastRestoredCampaignIdRef.current = selectedCampaignId;
        if (onCampaignSelect) {
          onCampaignSelect(restoredCampaign);
        }
      }
    } else if (!selectedCampaignId) {
      // Reset when Redux context is cleared
      lastRestoredCampaignIdRef.current = null;
      hasRestoredFromContext.current = false;
    }
  }, [campaignsSuccess, campaignsData, selectedCampaignId, onCampaignSelect]);

  useEffect(() => {
    if (campaignsSuccess && campaignsData?.data) {
      const campaigns = Array.isArray(campaignsData.data) ? campaignsData.data : [];
      setAllCampaigns(campaigns);
      if (campaigns.length > 0 && !selectedCampaign && !hasRestoredFromContext.current) {
        setSelectedCampaign(campaigns[0]);
      }
    } else {
      setAllCampaigns([]);
    }
  }, [campaignsSuccess, campaignsData, selectedCampaign]);

  useEffect(() => {
    if (!externalSelectedCampaign && selectedCampaign && onCampaignSelect) {
      onCampaignSelect(selectedCampaign);
    }
  }, [externalSelectedCampaign, selectedCampaign, onCampaignSelect]);

  const campaignOptions = allCampaigns.map((campaign) => ({
    value: campaign.id,
    label: campaign.campaign_title || "Untitled Campaign",
  }));

  const currentSelectedCampaign = externalSelectedCampaign || selectedCampaign;

  const getSortLabel = (sortValue) => {
    const option = SORT_OPTIONS.find((opt) => opt.value === sortValue);
    return option ? option.label : "Newest First";
  };

  const handleCampaignChange = (selectedOption) => {
    const campaignId = selectedOption?.value;
    const campaign = allCampaigns.find((c) => c.id === campaignId);
    if (onCampaignSelect && campaign) {
      onCampaignSelect(campaign);
    }
  };

  const handleHireClick = () => {
    if (!selectedCreator || !currentSelectedCampaign) {
      return;
    }
    setHireCreatorData(selectedCreator);
    setSelectedCampaignForHire(currentSelectedCampaign);
    setHireModalOpen(true);
  };

  const handleSendOffer = async (contractData) => {
    if (!currentSelectedCampaign || !selectedCreator) return;

    const contractPayload = {
      campaignId: currentSelectedCampaign.id,
      creatorId: selectedCreator.creator?.id || selectedCreator.id,
      brandId: currentSelectedCampaign.created_by?.id,
      startDate: contractData.startDate,
      completionDeadline: contractData.completionDeadline,
      firstDraftDeadline: contractData.firstDraftDeadline || undefined,
      contentFormat: contractData.contentFormat,
      revisionsLimit: contractData.revisionsLimit,
      compensationType: contractData.compensationType.toUpperCase(),
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
    };

    const createResult = await dispatch(createContract(contractPayload)).unwrap();

    if (createResult.success) {
      await dispatch(sendContract(createResult.data.id)).unwrap();
      setHireModalOpen(false);
      setHireCreatorData(null);
      setSelectedCampaignForHire(null);

      setTimeout(() => {
        if (onCampaignSelect) {
          onCampaignSelect(currentSelectedCampaign);
        }
      }, 1000);
    }
  };

  const handleRejectClick = () => {
    setShowRejectConfirmation(true);
  };

  const handleConfirmReject = () => {
    if (onRejectCreator && currentSelectedCampaign && selectedCreator) {
      onRejectCreator(currentSelectedCampaign.id, selectedCreator.id);
    }
    setShowRejectConfirmation(false);
  };

  const handleCancelReject = () => {
    setShowRejectConfirmation(false);
  };

  const handleNicheToggle = (niche) => {
    if (!onFilterChange) return;
    const currentNiches = filters?.niches || [];
    const newNiches = currentNiches.includes(niche)
      ? currentNiches.filter((n) => n !== niche)
      : [...currentNiches, niche];
    onFilterChange("niches", newNiches);
  };

  const handlePlatformToggle = (platform, checked) => {
    if (!onFilterChange) return;
    const currentPlatforms = filters?.platforms || [];
    const newPlatforms = checked
      ? [...currentPlatforms, platform]
      : currentPlatforms.filter((p) => p !== platform);
    onFilterChange("platforms", newPlatforms);
  };

  const handleCountryToggle = (country, checked) => {
    if (!onFilterChange) return;
    onFilterChange("country", checked ? country : "");
  };

  return {
    openFilterModal,
    setOpenFilterModal,
    messageDialogOpen,
    setMessageDialogOpen,
    campaignsData: { data: allCampaigns },
    campaignsLoading,
    campaignsSuccess,
    campaignsError,
    campaignOptions,
    selectedCampaign: currentSelectedCampaign,
    handleCampaignChange,
    hireModalOpen,
    setHireModalOpen,
    hireCreatorData,
    selectedCampaignForHire,
    showRejectConfirmation,
    createContractLoading,
    sendContractLoading,
    createContractSuccess,
    sendContractSuccess,
    createContractError,
    sendContractError,
    handleHireClick,
    handleSendOffer,
    handleRejectClick,
    handleConfirmReject,
    handleCancelReject,
    handleNicheToggle,
    handlePlatformToggle,
    handleCountryToggle,
    getSortLabel,
    COUNTRIES,
    APPLICATION_STATUS_OPTIONS,
    SORT_OPTIONS,
    NICHE_OPTIONS,
    PLATFORM_OPTIONS,
    COUNTRY_FILTER_OPTIONS,
  };
}

export default useCampaignOverview;
