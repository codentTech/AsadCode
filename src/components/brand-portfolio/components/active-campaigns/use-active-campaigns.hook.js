import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  closeCampaignListing,
  getAllBrandCampaigns,
} from "@/provider/features/campaigns/campaigns.slice";
import { isCampaignListingOpen } from "@/common/utils/campaign-listing.util";

const getCampaignTypeStyle = (type) => {
  const styles = {
    SPONSORED_POST: "bg-green-100 text-green-800 border-green-200",
    UGC: "bg-blue-100 text-blue-800 border-blue-200",
    BRANDED_CONTENT: "bg-blue-100 text-blue-800 border-blue-200",
    PRODUCT_REVIEW: "bg-orange-100 text-orange-800 border-orange-200",
    AFFILIATE: "bg-purple-100 text-purple-800 border-purple-200",
    GIVEAWAY: "bg-pink-100 text-pink-800 border-pink-200",
    EVENT: "bg-indigo-100 text-indigo-800 border-indigo-200",
    APP_PROMOTION: "bg-teal-100 text-teal-800 border-teal-200",
    GIFTED: "bg-yellow-100 text-yellow-800 border-yellow-200",
    COMMISSION: "bg-purple-100 text-purple-800 border-purple-200",
  };

  return styles[type] || styles.SPONSORED_POST;
};

const normalizeCampaigns = (data) => {
  if (!data) return [];

  if (Array.isArray(data)) return data;

  if (Array.isArray(data?.data)) return data.data;

  if (Array.isArray(data?.campaigns)) return data.campaigns;

  return [];
};

export default function useActiveCampaigns(refreshKey) {
  const dispatch = useDispatch();
  const { data, isLoading, isError, message } = useSelector(
    (state) => state.campaigns.getAllBrandCampaigns || {}
  );
  const { isLoading: isClosingListing, isSuccess: isCloseListingSuccess } = useSelector(
    (state) => state.campaigns.closeCampaignListing || {}
  );

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuCampaignId, setMenuCampaignId] = useState(null);
  const [showCloseListingModal, setShowCloseListingModal] = useState(false);
  const [confirmCloseCampaignId, setConfirmCloseCampaignId] = useState(null);
  const closeListingSubmittedRef = useRef(false);

  useEffect(() => {
    dispatch(getAllBrandCampaigns());
  }, [dispatch, refreshKey]);

  const activeCampaignsData = useMemo(() => {
    if (!data?.data || !Array.isArray(data.data)) return null;
    return {
      ...data,
      data: data.data.filter((campaign) => campaign.status !== "COMPLETE"),
    };
  }, [data]);

  const campaigns = useMemo(() => normalizeCampaigns(activeCampaignsData), [activeCampaignsData]);

  const handleRefresh = useCallback(() => {
    dispatch(getAllBrandCampaigns());
  }, [dispatch]);

  const handleMenuOpen = useCallback((event, campaignId) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setMenuCampaignId(campaignId);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuAnchorEl(null);
    setMenuCampaignId(null);
  }, []);

  const handleRequestCloseListing = useCallback(() => {
    if (!menuCampaignId) return;
    setConfirmCloseCampaignId(menuCampaignId);
    setShowCloseListingModal(true);
    handleMenuClose();
  }, [menuCampaignId, handleMenuClose]);

  const handleCancelCloseListing = useCallback(() => {
    closeListingSubmittedRef.current = false;
    setShowCloseListingModal(false);
    setConfirmCloseCampaignId(null);
  }, []);

  const handleConfirmCloseListing = useCallback(() => {
    if (!confirmCloseCampaignId) return;
    closeListingSubmittedRef.current = true;
    dispatch(closeCampaignListing(confirmCloseCampaignId));
  }, [confirmCloseCampaignId, dispatch]);

  useEffect(() => {
    if (
      !showCloseListingModal ||
      isClosingListing ||
      !isCloseListingSuccess ||
      !closeListingSubmittedRef.current
    ) {
      return;
    }
    closeListingSubmittedRef.current = false;
    setShowCloseListingModal(false);
    setConfirmCloseCampaignId(null);
  }, [showCloseListingModal, isClosingListing, isCloseListingSuccess]);

  const menuCampaign = useMemo(
    () => campaigns.find((campaign) => campaign.id === menuCampaignId) || null,
    [campaigns, menuCampaignId]
  );

  const campaignToClose = useMemo(
    () => campaigns.find((campaign) => campaign.id === confirmCloseCampaignId) || null,
    [campaigns, confirmCloseCampaignId]
  );

  return {
    campaigns,
    isLoading,
    isError,
    message,
    isClosingListing,
    menuAnchorEl,
    menuCampaign,
    showCloseListingModal,
    campaignToClose,
    isCampaignListingOpen,
    getCampaignTypeStyle,
    handleRefresh,
    handleMenuOpen,
    handleMenuClose,
    handleRequestCloseListing,
    handleCancelCloseListing,
    handleConfirmCloseListing,
  };
}
