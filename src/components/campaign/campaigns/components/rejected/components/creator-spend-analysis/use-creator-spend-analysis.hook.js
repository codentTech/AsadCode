import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getBrandCampaignsExcludingCompleted } from "@/provider/features/campaigns/campaigns.slice";
import { getAllShortlists } from "@/provider/features/shortlist/shortlist.slice";

function useCreatorSpendAnalysis({
  selectedCampaign,
  onCampaignSelect,
  onReinstateCreator,
  onSaveToShortlist,
}) {
  // State
  const [showReinstateConfirmation, setShowReinstateConfirmation] = useState(false);
  const [creatorToReinstate, setCreatorToReinstate] = useState(null);
  const [originalCreatorToReinstate, setOriginalCreatorToReinstate] = useState(null);
  const [showSaveToShortlistModal, setShowSaveToShortlistModal] = useState(false);
  const [creatorToSave, setCreatorToSave] = useState(null);
  const hasAutoSelected = useRef(false);

  // Redux State
  const dispatch = useDispatch();

  const {
    data: campaignsData,
    isLoading: campaignsLoading,
    isSuccess: campaignsSuccess,
    isError: campaignsError,
  } = useSelector((state) => state.campaigns.getBrandCampaignsExcludingCompleted);

  const {
    data: shortlistsData,
    isLoading: shortlistsLoading,
    isSuccess: shortlistsSuccess,
  } = useSelector((state) => state.shortlist.getAllShortlists);

  // useEffect
  // Load campaigns when component mounts
  useEffect(() => {
    dispatch(getBrandCampaignsExcludingCompleted());
  }, [dispatch]);

  // Load shortlists when component mounts
  useEffect(() => {
    dispatch(getAllShortlists());
  }, [dispatch]);

  // Auto-select first campaign and notify parent once
  useEffect(() => {
    if (
      !selectedCampaign &&
      !hasAutoSelected.current &&
      Array.isArray(campaignsData?.data) &&
      campaignsData.data.length > 0 &&
      typeof onCampaignSelect === "function"
    ) {
      onCampaignSelect(campaignsData.data[0]);
      hasAutoSelected.current = true;
    }
  }, [selectedCampaign, campaignsData, onCampaignSelect]);

  // Functions
  const campaignOptions =
    campaignsData?.data?.map((campaign) => ({
      value: campaign.id,
      label: campaign.campaign_title,
    })) || [];

  const handleCampaignChange = (selectedOption) => {
    const campaignId = selectedOption?.value;
    const campaign = campaignsData?.data?.find((c) => c.id === campaignId);

    if (onCampaignSelect && campaign) {
      onCampaignSelect(campaign);
    }
  };

  const formatFollowers = (count) => {
    if (count === undefined || count === null || isNaN(count)) {
      return "0";
    }
    const numCount = Number(count);
    if (numCount >= 1_000_000) return `${(numCount / 1_000_000).toFixed(1)}M`;
    if (numCount >= 1_000) return `${(numCount / 1_000).toFixed(0)}K`;
    return numCount.toString();
  };

  const handleReinstateClick = (creator, e) => {
    e.stopPropagation();
    setCreatorToReinstate(creator);
    setOriginalCreatorToReinstate(creator);
    setShowReinstateConfirmation(true);
  };

  const handleConfirmReinstate = () => {
    if (
      onReinstateCreator &&
      selectedCampaign &&
      originalCreatorToReinstate &&
      originalCreatorToReinstate.creator?.id
    ) {
      onReinstateCreator(selectedCampaign.id, originalCreatorToReinstate.creator.id);
    }
    setShowReinstateConfirmation(false);
    setCreatorToReinstate(null);
    setOriginalCreatorToReinstate(null);
  };

  const handleCancelReinstate = () => {
    setShowReinstateConfirmation(false);
    setCreatorToReinstate(null);
    setOriginalCreatorToReinstate(null);
  };

  const handleSaveToShortlistClick = useCallback((creator) => {
    setCreatorToSave(creator);
    setShowSaveToShortlistModal(true);
  }, []);

  const handleConfirmSaveToShortlist = useCallback(
    (shortlistId) => {
      if (creatorToSave && onSaveToShortlist) {
        onSaveToShortlist(creatorToSave.creator, shortlistId);
      }
      setShowSaveToShortlistModal(false);
      setCreatorToSave(null);
    },
    [creatorToSave, onSaveToShortlist]
  );

  const handleCancelSaveToShortlist = useCallback(() => {
    setShowSaveToShortlistModal(false);
    setCreatorToSave(null);
  }, []);

  const shortlists = Array.isArray(shortlistsData) ? shortlistsData : [];

  return {
    // State
    showReinstateConfirmation,
    creatorToReinstate,
    campaignsData,
    campaignsLoading,
    campaignOptions,
    showSaveToShortlistModal,
    creatorToSave,
    shortlists,
    shortlistsLoading,

    // Handlers
    handleCampaignChange,
    handleReinstateClick,
    handleConfirmReinstate,
    handleCancelReinstate,
    handleSaveToShortlistClick,
    handleConfirmSaveToShortlist,
    handleCancelSaveToShortlist,
    formatFollowers,
  };
}

export default useCreatorSpendAnalysis;
