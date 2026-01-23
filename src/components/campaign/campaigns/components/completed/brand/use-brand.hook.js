import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBrandCampaigns,
  getAppliedCreators,
} from "@/provider/features/campaigns/campaigns.slice";
import { setSelectedCampaign as setSelectedCampaignContext } from "@/provider/features/campaign-context/campaign-context.slice";

export default function useBrandCampaignCompleted(disableAutoSelect = false) {
  const dispatch = useDispatch();
  const hasAutoSelected = useRef(false);
  const hasRestoredFromContext = useRef(false);
  const previousCampaignIdsRef = useRef(null);
  const lastRestoredCampaignIdRef = useRef(null);

  const { selectedCampaignId } = useSelector((state) => state.campaignContext || {});
  const {
    isLoading: campaignsLoading,
    isSuccess: campaignsSuccess,
    isError: campaignsError,
    data: campaignsData,
  } = useSelector((state) => state.campaigns.getAllBrandCampaigns || {});

  const {
    isLoading: creatorsLoading,
    isSuccess: creatorsSuccess,
    isError: creatorsError,
    data: creatorsData,
  } = useSelector((state) => state.campaigns.getAppliedCreators || {});

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaignOptions, setCampaignOptions] = useState([]);
  const [budgetData, setBudgetData] = useState({
    totalBudget: 0,
    spent: 0,
    remaining: 0,
    saved: 0,
  });
  const [deliverables, setDeliverables] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    totalViews: 0,
    totalEngagement: 0,
    engagementRate: 0,
    costPerEngagement: 0,
  });

  useEffect(() => {
    dispatch(getAllBrandCampaigns());
  }, [dispatch]);

  useEffect(() => {
    // Reset restoration flag if selectedCampaignId from Redux changed
    if (selectedCampaignId !== lastRestoredCampaignIdRef.current) {
      hasRestoredFromContext.current = false;
    }
  }, [selectedCampaignId]);

  useEffect(() => {
    if (campaignsSuccess && campaignsData?.data && selectedCampaignId && !hasRestoredFromContext.current) {
      const allCampaigns = Array.isArray(campaignsData.data) ? campaignsData.data : [];
      const restoredCampaign = allCampaigns.find((c) => c.id === selectedCampaignId);
      if (restoredCampaign) {
        setSelectedCampaign(restoredCampaign);
        hasAutoSelected.current = true;
        hasRestoredFromContext.current = true;
        lastRestoredCampaignIdRef.current = selectedCampaignId;
      }
    } else if (!selectedCampaignId) {
      // Reset when Redux context is cleared
      lastRestoredCampaignIdRef.current = null;
      hasRestoredFromContext.current = false;
    }
  }, [campaignsSuccess, campaignsData, selectedCampaignId]);

  // Memoize campaigns array to prevent unnecessary re-renders
  const allCampaigns = useMemo(() => {
    if (!campaignsSuccess || !campaignsData?.data) return [];
    return Array.isArray(campaignsData.data) ? campaignsData.data : [];
  }, [campaignsSuccess, campaignsData?.data]);

  // Create stable reference for campaign IDs to detect actual changes
  const campaignIdsString = useMemo(() => {
    return allCampaigns.map((c) => c.id).sort().join(",");
  }, [allCampaigns]);

  // Update campaign options only when campaign IDs actually change
  useEffect(() => {
    if (campaignsSuccess && allCampaigns.length > 0) {
      // Only update if campaign IDs have changed
      if (campaignIdsString !== previousCampaignIdsRef.current) {
        const options = allCampaigns.map((campaign) => ({
          value: campaign.id,
          label: campaign.campaign_title || "Untitled Campaign",
          campaign: campaign,
        }));
        setCampaignOptions(options);
        previousCampaignIdsRef.current = campaignIdsString;
      }
    } else if (campaignsSuccess && allCampaigns.length === 0) {
      setCampaignOptions([]);
      previousCampaignIdsRef.current = null;
    }
  }, [campaignsSuccess, allCampaigns, campaignIdsString]);

  // Handle auto-selection separately to avoid loops
  useEffect(() => {
    if (!campaignsSuccess || allCampaigns.length === 0) return;

    const selectedCampaignId = selectedCampaign?.id;

    // If selected campaign is no longer in the list, select first one
    if (
      selectedCampaignId &&
      !allCampaigns.some((c) => c.id === selectedCampaignId)
    ) {
      if (!hasAutoSelected.current) {
        setSelectedCampaign(allCampaigns[0]);
        hasAutoSelected.current = true;
      }
      return;
    }

    // Auto-select first campaign if none selected and auto-select is enabled
    if (
      !disableAutoSelect &&
      !selectedCampaignId &&
      !hasAutoSelected.current &&
      !hasRestoredFromContext.current
    ) {
      setSelectedCampaign(allCampaigns[0]);
      hasAutoSelected.current = true;
      dispatch(
        setSelectedCampaignContext({
          campaignId: allCampaigns[0].id,
          collaborationType: allCampaigns[0].collaboration_type || null,
        })
      );
    }
  }, [campaignsSuccess, allCampaigns, selectedCampaign?.id, disableAutoSelect, dispatch]);

  useEffect(() => {
    if (selectedCampaign?.id) {
      dispatch(
        getAppliedCreators({ campaignId: selectedCampaign.id, filters: { status: "COMPLETED" } })
      );
    }
  }, [selectedCampaign?.id, dispatch]);

  useEffect(() => {
    if (creatorsSuccess && creatorsData?.data && selectedCampaign) {
      const creators = Array.isArray(creatorsData.data) ? creatorsData.data : [];
      const totalBudget = selectedCampaign.budget || 0;
      const spent = creators.reduce((sum, creator) => sum + (creator.total_spent || 0), 0);
      const remaining = totalBudget - spent;
      const saved = Math.max(0, remaining);

      setBudgetData({
        totalBudget,
        spent,
        remaining: 0,
        saved,
      });

      setDeliverables(selectedCampaign.deliverables || []);

      const totalViews = creators.reduce((sum, creator) => sum + (creator.total_views || 0), 0);
      const totalEngagement = creators.reduce(
        (sum, creator) => sum + (creator.total_engagement || 0),
        0
      );
      const engagementRate = totalViews > 0 ? (totalEngagement / totalViews) * 100 : 0;
      const costPerEngagement = totalEngagement > 0 ? spent / totalEngagement : 0;

      setPerformanceMetrics({
        totalViews,
        totalEngagement,
        engagementRate,
        costPerEngagement,
      });
    } else if (creatorsSuccess && !creatorsData?.data && selectedCampaign) {
      setBudgetData({
        totalBudget: selectedCampaign.budget || 0,
        spent: 0,
        remaining: 0,
        saved: selectedCampaign.budget || 0,
      });
      setDeliverables(selectedCampaign.deliverables || []);
      setPerformanceMetrics({
        totalViews: 0,
        totalEngagement: 0,
        engagementRate: 0,
        costPerEngagement: 0,
      });
    }
  }, [creatorsSuccess, creatorsData, selectedCampaign?.id, selectedCampaign?.budget, selectedCampaign?.deliverables]);

  const handleCampaignSelect = useCallback((selectedOption) => {
    if (selectedOption) {
      setSelectedCampaign(selectedOption.campaign);
      dispatch(
        setSelectedCampaignContext({
          campaignId: selectedOption.campaign.id,
          collaborationType: selectedOption.campaign.collaboration_type || null,
        })
      );
    } else {
      setSelectedCampaign(null);
      dispatch(
        setSelectedCampaignContext({
          campaignId: null,
          collaborationType: null,
        })
      );
    }
  }, [dispatch]);

  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }, []);

  const formatNumber = useCallback((num) => {
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(1)}M`;
    }
    if (num >= 1_000) {
      return `${(num / 1_000).toFixed(0)}K`;
    }
    return num.toString();
  }, []);

  return {
    campaignsLoading,
    campaignsSuccess,
    campaignsError,
    campaignOptions,
    selectedCampaign,
    creatorsLoading,
    creatorsSuccess,
    creatorsError,
    creators: Array.isArray(creatorsData?.data) ? creatorsData.data : [],
    budgetData,
    deliverables,
    performanceMetrics,
    handleCampaignSelect,
    formatCurrency,
    formatNumber,
    isLoading: campaignsLoading || creatorsLoading,
    hasData: selectedCampaign && Array.isArray(creatorsData?.data) && creatorsData.data.length > 0,
  };
}
