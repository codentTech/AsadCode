import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCreatorApplications } from "@/provider/features/campaigns/campaigns.slice";

export default function useCompletedCampaign() {
  const dispatch = useDispatch();

  // Redux state - following the same pattern as useCreatorApplications
  const {
    data: applicationsData,
    isLoading: applicationsLoading,
    isSuccess: applicationsSuccess,
    isError: applicationsError,
  } = useSelector((state) => state.campaigns.getCreatorApplications || {});

  // Get applications from Redux state
  const applications = applicationsData?.data || [];

  // Local state
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedMonths, setExpandedMonths] = useState({});

  // Function to fetch completed applications
  const fetchCompletedApplications = useCallback(() => {
    dispatch(getCreatorApplications("COMPLETED"));
  }, [dispatch]);

  // Load creator applications on component mount
  useEffect(() => {
    fetchCompletedApplications();
  }, [fetchCompletedApplications]);

  // Filter completed campaigns from applications
  const completedCampaigns = applications?.filter((app) => app.status === "COMPLETED") || [];

  // Format campaign data for display
  const formatCampaignData = useCallback((campaign) => {
    if (!campaign) return null;

    return {
      ...campaign,
      id: campaign.campaign?.id,
      title: campaign.campaign?.campaign_title,
      brand: {
        name: campaign.campaign?.created_by?.brand_profile?.brand_name || "Unknown Brand",
        logo: campaign.campaign?.created_by?.brand_profile?.brand_logo_url || "🌟",
      },
      platforms: campaign.campaign?.required_platforms || [],
      completedDate: campaign.campaign?.completed_date || campaign.campaign?.updated_at,
      paymentStatus: "Paid", // This would come from payment system
      totalEarned: campaign.campaign?.budget || campaign.campaign?.creator_fixed_price || 0,
      deliverables: campaign.campaign?.deliverables || [],
      productImage: "🧴", // Default product image
      hasReview: false, // This would come from review system
      deadline: campaign.campaign?.application_date,
      type: campaign.campaign?.campaign_type || "UGC",
      compensation: campaign.campaign?.compensation_type || "PAID",
      compensationAmount:
        campaign.campaign?.compensation_type === "PAID"
          ? `$${campaign.campaign?.budget || campaign.campaign?.creator_fixed_price || 0}`
          : campaign.campaign?.compensation_type === "GIFTED_PRODUCT"
            ? "Free Product"
            : "Commission-based",
      description:
        campaign.campaign?.long_description ||
        campaign.campaign?.short_description ||
        "No description available",
      completionRate: 100, // Completed campaigns are 100% complete
      progress: [
        { task: "Content recorded", completed: true },
        { task: "1st draft sent", completed: true },
        { task: "Final post published", completed: true },
      ],
      // Additional campaign data
      campaign: campaign.campaign,
      application: campaign,
    };
  }, []);

  // Filter campaigns based on search query
  const filteredCampaigns = completedCampaigns.filter((campaign) => {
    const formattedCampaign = formatCampaignData(campaign);
    return (
      formattedCampaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formattedCampaign.brand.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Format campaigns for display
  const formattedCampaigns = useMemo(
    () => filteredCampaigns.map((campaign) => formatCampaignData(campaign)),
    [filteredCampaigns, formatCampaignData]
  );

  // Auto-select first campaign when campaigns are loaded
  useEffect(() => {
    if (formattedCampaigns.length > 0 && !selectedCampaign) {
      // Always select the first campaign when campaigns are available and none is selected
      setSelectedCampaign(formattedCampaigns[0]);
    } else if (formattedCampaigns.length === 0) {
      // Clear selection when no campaigns are available
      setSelectedCampaign(null);
    }
  }, [formattedCampaigns, selectedCampaign]);

  // Handle campaign selection
  const handleCampaignSelect = useCallback((campaign) => {
    setSelectedCampaign(campaign);
  }, []);

  // Mock payment history (this would come from a separate API)
  const paymentHistory = {
    "June 2025": {
      total: 2750,
      payments: [
        { campaign: "Skincare Routine Campaign", amount: 950, date: "June 8" },
        { campaign: "Fitness Gear Review", amount: 800, date: "June 12" },
        { campaign: "Home Decor Showcase", amount: 1000, date: "June 18" },
      ],
    },
    "May 2025": {
      total: 3200,
      payments: [
        { campaign: "Spring Fashion Haul", amount: 1200, date: "May 5" },
        { campaign: "Travel Essentials", amount: 900, date: "May 15" },
        { campaign: "Beauty Basics", amount: 1100, date: "May 25" },
      ],
    },
  };

  // Mock upcoming payments (this would come from a separate API)
  const upcomingPayments = formattedCampaigns
    .filter((campaign) => campaign.paymentStatus === "Pending")
    .map((campaign) => ({
      campaign: campaign.title,
      amount: campaign.totalEarned,
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days from now
    }));

  return {
    // State
    selectedCampaign,
    completedCampaigns: formattedCampaigns,
    searchQuery,
    expandedMonths,

    // Redux states - following the same pattern as useCreatorApplications
    applicationsData,
    applicationsLoading,
    applicationsSuccess,
    applicationsError,

    // Mock data
    paymentHistory,
    upcomingPayments,

    // Actions
    handleCampaignSelect,
    setSearchQuery,
    setExpandedMonths,
    formatCampaignData,
    fetchCompletedApplications,
  };
}
