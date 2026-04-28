import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCreatorApplications } from "@/provider/features/campaigns/campaigns.slice";
import {
  CAMPAIGN_TYPE,
  COLLABORATION_TYPE,
} from "@/common/constants/campaign.constant";

export default function useCompleted() {
  const dispatch = useDispatch();

  // ============================================
  // 2. REDUX SELECTORS
  // ============================================
  const {
    data: applicationsData,
    isLoading: applicationsLoading,
    isSuccess: applicationsSuccess,
    isError: applicationsError,
  } = useSelector((state) => state.campaigns.getCreatorApplications || {});

  const applications = applicationsData?.data || [];

  // ============================================
  // 3. LOCAL STATE
  // ============================================
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [expandedMonths, setExpandedMonths] = useState({});

  // ============================================
  // 4. CALLBACKS
  // ============================================
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
      paymentStatus: "Paid",
      totalEarned: campaign.campaign?.budget || campaign.campaign?.creator_fixed_price || 0,
      deliverables: campaign.campaign?.deliverables || [],
      productImage: "🧴",
      hasReview: false,
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
      completionRate: 100,
      progress:
        campaign.campaign?.campaign_type === CAMPAIGN_TYPE.UGC
          ? [
              { task: "Content recorded", completed: true },
              { task: "Draft review", completed: true },
            ]
          : [
              { task: "Content recorded", completed: true },
              { task: "1st draft sent", completed: true },
              { task: "Final post published", completed: true },
            ],
      campaign: campaign.campaign,
      application: campaign,
    };
  }, []);

  const handleCampaignSelect = useCallback((campaign) => {
    setSelectedCampaign(campaign);
  }, []);

  // ============================================
  // 5. COMPUTED VALUES
  // ============================================
  const completedCampaigns = (applications || []).filter((app) => {
    if (app.status === "COMPLETED") {
      return true;
    }

    const isIndividualCollaboration =
      app.invitation ||
      app.campaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;

    if (isIndividualCollaboration && app.campaign) {
      return app.campaign.status === "COMPLETE";
    }

    return false;
  });

  const formattedCampaigns = useMemo(
    () => completedCampaigns.map((campaign) => formatCampaignData(campaign)),
    [completedCampaigns, formatCampaignData]
  );

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

  const upcomingPayments = formattedCampaigns
    .filter((campaign) => campaign.paymentStatus === "Pending")
    .map((campaign) => ({
      campaign: campaign.title,
      amount: campaign.totalEarned,
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    }));

  // ============================================
  // 6. USEEFFECTS
  // ============================================
  const fetchCompletedApplications = useCallback(() => {
    dispatch(getCreatorApplications("COMPLETED"));
  }, [dispatch]);

  useEffect(() => {
    fetchCompletedApplications();
  }, [fetchCompletedApplications]);

  useEffect(() => {
    if (formattedCampaigns.length > 0 && !selectedCampaign) {
      setSelectedCampaign(formattedCampaigns[0]);
    } else if (formattedCampaigns.length === 0) {
      setSelectedCampaign(null);
    }
  }, [formattedCampaigns, selectedCampaign]);

  // ============================================
  // 7. RETURN OBJECT
  // ============================================
  return {
    selectedCampaign,
    completedCampaigns: formattedCampaigns,
    expandedMonths,
    applicationsData,
    applicationsLoading,
    applicationsSuccess,
    applicationsError,
    paymentHistory,
    upcomingPayments,
    handleCampaignSelect,
    setExpandedMonths,
    formatCampaignData,
    fetchCompletedApplications,
  };
}
