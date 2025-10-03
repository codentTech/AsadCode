import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCampaigns, getAppliedCreators } from "@/provider/features/campaigns/campaigns.slice";

export default function useActiveCompletedCampaign(isCompleted = false) {
  const dispatch = useDispatch();
  const hasAutoSelected = useRef(false);

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
    if (campaignsSuccess && campaignsData?.data) {
      // Extract campaigns from the nested structure: data.campaigns
      const campaigns = Array.isArray(campaignsData.data.campaigns)
        ? campaignsData.data.campaigns
        : Array.isArray(campaignsData.data)
          ? campaignsData.data
          : [];

      // Filter campaigns based on completion status
      const filteredCampaigns = campaigns.filter((campaign) => {
        if (isCompleted) {
          return campaign.status === "COMPLETED";
        } else {
          // For active tab, show ALL campaigns (no filtering)
          return true;
        }
      });

      // Create options for dropdown
      const options = filteredCampaigns.map((campaign) => ({
        value: campaign.id,
        label: campaign.campaign_title,
        campaign: campaign,
      }));

      setCampaignOptions(options);

      // Auto-select first campaign if none is selected and campaigns are available
      if (filteredCampaigns.length > 0 && !selectedCampaign && !hasAutoSelected.current) {
        const firstCampaign = filteredCampaigns[0];
        setSelectedCampaign(firstCampaign);
        hasAutoSelected.current = true;
      }
    } else if (campaignsSuccess && !campaignsData?.data) {
      // Handle case where API returns success but no data
      setCampaignOptions([]);
    }
  }, [campaignsSuccess, campaignsData, isCompleted]);

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
