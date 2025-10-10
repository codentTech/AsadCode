import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCampaigns,
  getBrandCampaignsExcludingCompleted,
  getAppliedCreators,
  resetGetAllCampaigns,
  resetGetBrandCampaignsExcludingCompleted,
  resetGetAppliedCreators,
} from "@/provider/features/campaigns/campaigns.slice";

export default function useBrandCampaign(isCompleted = false) {
  const dispatch = useDispatch();
  const hasAutoSelected = useRef(false);

  // Redux state - use different data sources for active vs completed tabs
  const {
    isLoading: campaignsLoading,
    isSuccess: campaignsSuccess,
    isError: campaignsError,
    data: campaignsData,
  } = useSelector((state) =>
    isCompleted
      ? state.campaigns.getAllCampaigns || {}
      : state.campaigns.getBrandCampaignsExcludingCompleted || {}
  );

  console.log(campaignsData);

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

  // Fetch campaigns on component mount and when tab changes - use different APIs for active vs completed tabs
  useEffect(() => {
    if (isCompleted) {
      dispatch(getAllCampaigns());
    } else {
      dispatch(getBrandCampaignsExcludingCompleted());
    }
  }, [dispatch, isCompleted]);

  // Reset selected campaign and clear stale Redux data when switching tabs
  useEffect(() => {
    setSelectedCampaign(null);
    hasAutoSelected.current = false;
    setCampaignOptions([]);

    // Clear the appropriate Redux state to prevent stale data
    if (isCompleted) {
      dispatch(resetGetAllCampaigns());
    } else {
      dispatch(resetGetBrandCampaignsExcludingCompleted());
    }

    // Always clear applied creators data when switching tabs
    dispatch(resetGetAppliedCreators());
  }, [isCompleted, dispatch]);

  // Process campaigns data and create options
  useEffect(() => {
    if (campaignsSuccess && campaignsData?.data) {
      let campaigns = [];

      if (isCompleted) {
        // For completed tab: getAllCampaigns returns nested structure
        campaigns = Array.isArray(campaignsData.data.campaigns)
          ? campaignsData.data.campaigns
          : Array.isArray(campaignsData.data)
            ? campaignsData.data
            : [];

        // Filter for completed campaigns only
        campaigns = campaigns.filter((campaign) => campaign.status === "COMPLETE");
      } else {
        // For active tab: getBrandCampaignsExcludingCompleted returns direct array
        campaigns = Array.isArray(campaignsData.data) ? campaignsData.data : [];
        // No filtering needed - backend already excludes completed campaigns
      }

      console.log(campaigns);

      // Create options for dropdown
      const options = campaigns.map((campaign) => ({
        value: campaign.id,
        label: campaign.campaign_title,
        campaign: campaign,
      }));

      setCampaignOptions(options);

      // If currently selected campaign no longer exists in refreshed list, reselect first
      if (
        selectedCampaign &&
        campaigns.length > 0 &&
        !campaigns.some((c) => c.id === selectedCampaign.id)
      ) {
        setSelectedCampaign(campaigns[0]);
        hasAutoSelected.current = true;
        return;
      }

      // Auto-select first campaign if none is selected and campaigns are available
      if (campaigns.length > 0 && !selectedCampaign && !hasAutoSelected.current) {
        const firstCampaign = campaigns[0];
        console.log(firstCampaign);
        setSelectedCampaign(firstCampaign);
        hasAutoSelected.current = true;
      }
    } else if (campaignsSuccess && !campaignsData?.data) {
      // Handle case where API returns success but no data
      setCampaignOptions([]);
    }
  }, [campaignsSuccess, campaignsData, isCompleted, selectedCampaign]);

  // Fetch applied creators when campaign is selected
  useEffect(() => {
    if (selectedCampaign?.id) {
      // For active tab, show only HIRED creators
      const filters = isCompleted ? {} : { status: "HIRED" };
      dispatch(getAppliedCreators({ campaignId: selectedCampaign.id, filters }));
    }
  }, [selectedCampaign, dispatch, isCompleted]);

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
      const saved = isCompleted ? Math.max(0, remaining) : 0;

      setBudgetData({
        totalBudget,
        spent,
        remaining: isCompleted ? 0 : remaining,
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
        remaining: selectedCampaign.budget || 0,
        saved: 0,
      });

      setDeliverables(selectedCampaign.deliverables || []);
      setPerformanceMetrics({
        totalViews: 0,
        totalEngagement: 0,
        engagementRate: 0,
        costPerEngagement: 0,
      });
    }
  }, [creatorsSuccess, creatorsData, selectedCampaign, isCompleted]);

  // Handle campaign selection
  const handleCampaignSelect = useCallback((selectedOption) => {
    console.log(selectedOption);
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
