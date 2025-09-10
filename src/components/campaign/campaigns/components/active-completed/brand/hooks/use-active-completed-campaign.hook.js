import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCampaigns, getAppliedCreators } from "@/provider/features/campaigns/campaigns.slice";

export default function useActiveCompletedCampaign(isCompleted = false) {
  const dispatch = useDispatch();

  // Redux state
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

  // Fetch campaigns on component mount
  useEffect(() => {
    dispatch(getAllCampaigns());
  }, [dispatch]);

  // Process campaigns data and create options
  useEffect(() => {
    console.log("Processing campaigns data:", {
      campaignsSuccess,
      campaignsData,
      isCompleted,
      hasData: !!campaignsData?.data,
    });

    // Debug the full API response structure
    console.log("Full campaignsData object:", campaignsData);
    console.log("campaignsData.data type:", typeof campaignsData?.data);
    console.log("campaignsData.data is array:", Array.isArray(campaignsData?.data));
    console.log("campaignsData.data.campaigns:", campaignsData?.data?.campaigns);
    console.log(
      "campaignsData.data.campaigns is array:",
      Array.isArray(campaignsData?.data?.campaigns)
    );

    if (campaignsSuccess && campaignsData?.data) {
      // Extract campaigns from the nested structure: data.campaigns
      const campaigns = Array.isArray(campaignsData.data.campaigns)
        ? campaignsData.data.campaigns
        : Array.isArray(campaignsData.data)
          ? campaignsData.data
          : [];

      console.log("Raw campaigns data:", campaigns);
      console.log(
        "Campaign statuses:",
        campaigns.map((c) => ({ id: c.id, title: c.campaign_title, status: c.status }))
      );

      // Filter campaigns based on completion status
      const filteredCampaigns = campaigns.filter((campaign) => {
        if (isCompleted) {
          return campaign.status === "COMPLETED";
        } else {
          // For active tab, show ALL campaigns (no filtering)
          return true;
        }
      });

      console.log("Filtered campaigns:", filteredCampaigns);
      console.log("Filter criteria:", isCompleted ? "COMPLETED" : "ALL CAMPAIGNS");

      // Create options for dropdown
      const options = filteredCampaigns.map((campaign) => ({
        value: campaign.id,
        label: campaign.campaign_title,
        campaign: campaign,
      }));

      console.log("Campaign options for dropdown:", options);
      setCampaignOptions(options);
    } else if (campaignsSuccess && !campaignsData?.data) {
      // Handle case where API returns success but no data
      console.log("No campaigns data received");
      setCampaignOptions([]);
    } else {
      console.log("Campaigns not ready yet:", { campaignsSuccess, campaignsData });
    }
  }, [campaignsSuccess, campaignsData, isCompleted]);

  // Fetch applied creators when campaign is selected
  useEffect(() => {
    console.log("Selected campaign changed:", selectedCampaign);
    if (selectedCampaign?.id) {
      console.log("Fetching creators for campaign:", selectedCampaign.id);
      // For active tab, show only HIRED creators
      const filters = isCompleted ? {} : { status: "HIRED" };
      console.log("Filters for creators:", filters);
      dispatch(getAppliedCreators({ campaignId: selectedCampaign.id, filters }));
    } else {
      console.log("No campaign selected or campaign has no ID");
    }
  }, [selectedCampaign, dispatch, isCompleted]);

  // Process creators data and calculate metrics
  useEffect(() => {
    if (creatorsSuccess && creatorsData?.data && selectedCampaign) {
      // Ensure creatorsData.data is an array
      const creators = Array.isArray(creatorsData.data) ? creatorsData.data : [];

      console.log("Creators data:", creators); // Debug log

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
      console.log("No creators data received for campaign:", selectedCampaign.id);
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
    console.log("Campaign selected:", selectedOption);
    if (selectedOption) {
      console.log("Setting selected campaign:", selectedOption.campaign);
      setSelectedCampaign(selectedOption.campaign);
    } else {
      console.log("Clearing selected campaign");
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
