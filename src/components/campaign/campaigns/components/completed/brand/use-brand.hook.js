import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCampaigns,
  getAppliedCreators,
  resetGetAllCampaigns,
  resetGetAppliedCreators,
} from "@/provider/features/campaigns/campaigns.slice";

export default function useBrandCampaignCompleted() {
  const dispatch = useDispatch();
  const hasAutoSelected = useRef(false);

  // Redux state - use getAllCampaigns for completed campaigns
  const {
    isLoading: campaignsLoading,
    isSuccess: campaignsSuccess,
    isError: campaignsError,
    data: campaignsData,
  } = useSelector((state) => state.campaigns.getAllCampaigns || {});

  const {
    isLoading: creatorsLoading,
    isSuccess: creatorsSuccess,
    isError: creatorsError,
    data: creatorsData,
  } = useSelector((state) => state.campaigns.getAppliedCreators || {});

  // Local state
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

  // Fetch completed campaigns on component mount (request only COMPLETE)
  useEffect(() => {
    dispatch(getAllCampaigns({ status: "COMPLETE" }));
  }, [dispatch]);

  // Reset selected campaign and clear stale Redux data
  useEffect(() => {
    setSelectedCampaign(null);
    hasAutoSelected.current = false;
    setCampaignOptions([]);

    // Clear Redux state to prevent stale data
    dispatch(resetGetAllCampaigns());
    dispatch(resetGetAppliedCreators());
  }, [dispatch]);

  // Process campaigns data and create options
  useEffect(() => {
    if (campaignsSuccess && campaignsData?.data) {
      let campaigns = [];

      // For completed tab: getAllCampaigns returns nested structure
      campaigns = Array.isArray(campaignsData.data.campaigns)
        ? campaignsData.data.campaigns
        : Array.isArray(campaignsData.data)
          ? campaignsData.data
          : [];

      // Filter for completed campaigns only (backend now returns COMPLETE)
      campaigns = campaigns.filter((campaign) => campaign.status === "COMPLETE");

      // Create options for dropdown
      const options = campaigns.map((campaign) => ({
        value: campaign.id,
        label: campaign.campaign_title,
        campaign: campaign,
      }));

      setCampaignOptions(options);

      // Auto-select first campaign if none is selected and campaigns are available
      if (campaigns.length > 0 && !selectedCampaign && !hasAutoSelected.current) {
        const firstCampaign = campaigns[0];
        setSelectedCampaign(firstCampaign);
        hasAutoSelected.current = true;
      }
    } else if (campaignsSuccess && !campaignsData?.data) {
      // Handle case where API returns success but no data
      setCampaignOptions([]);
    }
  }, [campaignsSuccess, campaignsData, selectedCampaign]);

  // Fetch applied creators when campaign is selected
  useEffect(() => {
    if (selectedCampaign?.id) {
      // For completed tab, show only COMPLETED creators
      dispatch(
        getAppliedCreators({ campaignId: selectedCampaign.id, filters: { status: "COMPLETED" } })
      );
    }
  }, [selectedCampaign, dispatch]);

  // Process creators data and calculate metrics
  useEffect(() => {
    if (creatorsSuccess && creatorsData?.data && selectedCampaign) {
      // Ensure creatorsData.data is an array
      const creators = Array.isArray(creatorsData.data) ? creatorsData.data : [];

      // Calculate budget metrics
      const totalBudget = selectedCampaign.budget || 0;
      const spent = creators.reduce((sum, creator) => {
        return sum + (creator.total_spent || 0);
      }, 0);
      const remaining = totalBudget - spent;
      const saved = Math.max(0, remaining); // For completed campaigns, remaining is saved

      setBudgetData({
        totalBudget,
        spent,
        remaining: 0, // No remaining budget for completed campaigns
        saved,
      });

      // Set deliverables from campaign
      setDeliverables(selectedCampaign.deliverables || []);

      // Calculate performance metrics (mock for now - replace with real API)
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
      // Handle case where API returns success but no creators data
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
  }, [creatorsSuccess, creatorsData, selectedCampaign]);

  // Handle campaign selection
  const handleCampaignSelect = useCallback((selectedOption) => {
    if (selectedOption) {
      setSelectedCampaign(selectedOption.campaign);
    } else {
      setSelectedCampaign(null);
    }
  }, []);

  // Format currency
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }, []);

  // Format numbers (views, engagement)
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
    // Campaign data
    campaignsLoading,
    campaignsSuccess,
    campaignsError,
    campaignOptions,
    selectedCampaign,

    // Creators data
    creatorsLoading,
    creatorsSuccess,
    creatorsError,
    creators: Array.isArray(creatorsData?.data) ? creatorsData.data : [],

    // Calculated data
    budgetData,
    deliverables,
    performanceMetrics,

    // Actions
    handleCampaignSelect,

    // Utilities
    formatCurrency,
    formatNumber,

    // Loading states
    isLoading: campaignsLoading || creatorsLoading,
    hasData: selectedCampaign && Array.isArray(creatorsData?.data),
  };
}
