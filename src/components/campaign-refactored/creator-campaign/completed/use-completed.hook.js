import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCreatorApplications } from "@/provider/features/campaigns/campaigns.slice";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  CAMPAIGN_TYPE,
  COLLABORATION_TYPE,
} from "@/common/constants/campaign.constant";
import { resolveCollaborationIdFromRawApplication } from "@/common/utils/creator-collaboration-history.util";
import { useCampaignTabBarMobileSlot } from "@/components/campaign-refactored/campaign-tab-bar-mobile-slot.context";

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
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [mobilePane, setMobilePane] = useState("list");
  const tabBarMobileSlot = useCampaignTabBarMobileSlot();
  const registerMobileSlot = tabBarMobileSlot?.registerMobileSlot;
  const clearMobileSlot = tabBarMobileSlot?.clearMobileSlot;

  // ============================================
  // 4. CALLBACKS
  // ============================================
  const formatCampaignData = useCallback((campaign) => {
    if (!campaign) return null;

    const isIndividualCollaboration =
      campaign.campaign?.collaboration_type ===
      COLLABORATION_TYPE.INDIVIDUAL_CREATOR;
    const contract = campaign.contract || {};
    const campaignTypeRaw = isIndividualCollaboration
      ? contract.campaignType || campaign.campaign?.campaign_type
      : campaign.campaign?.campaign_type;
    const compensationTypeRaw = isIndividualCollaboration
      ? contract.compensationType || campaign.campaign?.compensation_type
      : campaign.campaign?.compensation_type;
    const paidAmountRaw = isIndividualCollaboration
      ? contract.totalCompensation
      : campaign.campaign?.budget || campaign.campaign?.creator_fixed_price;
    const giftedValueRaw = isIndividualCollaboration
      ? contract.productValue || contract.product_value || contract.productPrice || contract.product_price
      : campaign.campaign?.product_value;
    const giftedAmount = Number(giftedValueRaw || 0);

    const normalizedType =
      campaignTypeRaw === "SPONSORED_POST"
        ? "Sponsored Post"
        : campaignTypeRaw === "GIFTED"
          ? "Gifted"
          : campaignTypeRaw || "UGC";
    const startDate =
      contract.startDate ||
      contract.start_date ||
      campaign.hired_at ||
      campaign.hiredAt ||
      campaign.campaign?.active_date ||
      campaign.campaign?.start_date ||
      null;
    const deadline =
      contract.completionDeadline ||
      contract.completion_deadline ||
      campaign.campaign?.application_deadline ||
      campaign.campaign?.application_date ||
      null;

    return {
      ...campaign,
      collaborationId: resolveCollaborationIdFromRawApplication(campaign),
      id: campaign.campaign?.id,
      title: campaign.campaign?.campaign_title,
      brand: {
        id:
          campaign.campaign?.created_by?.id ||
          campaign.brand?.id ||
          null,
        name:
          campaign.campaign?.created_by?.brand_profile?.brand_name ||
          campaign.brand?.brand_profile?.brand_name ||
          campaign.brand?.name ||
          "Unknown Brand",
        logo:
          campaign.campaign?.created_by?.brand_profile?.brand_logo_url ||
          campaign.brand?.brand_profile?.brand_logo_url ||
          "🌟",
      },
      platforms: campaign.campaign?.required_platforms || [],
      completedDate: campaign.campaign?.completed_date || campaign.campaign?.updated_at,
      paymentStatus: "Paid",
      totalEarned: campaign.campaign?.budget || campaign.campaign?.creator_fixed_price || 0,
      deliverables: campaign.campaign?.deliverables || [],
      productImage: "🧴",
      hasReview: false,
      startDate,
      deadline,
      type: normalizedType,
      compensation: compensationTypeRaw || null,
      compensationAmount:
        compensationTypeRaw === "PAID"
          ? `$${paidAmountRaw || 0}`
          : compensationTypeRaw === "GIFTED_PRODUCT"
            ? `$${giftedAmount.toFixed(2)}`
            : "Commission-based",
      description:
        campaign.campaign?.long_description ||
        campaign.campaign?.short_description ||
        "No description available",
      completionRate: 100,
      progress:
        campaignTypeRaw === CAMPAIGN_TYPE.UGC
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

  const handleCampaignSelectWithPane = useCallback(
    (campaign) => {
      handleCampaignSelect(campaign);
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        setMobilePane("detail");
      }
    },
    [handleCampaignSelect]
  );

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
    if (applicationsLoading) {
      return;
    }
    if (formattedCampaigns.length > 0 && !selectedCampaign) {
      setSelectedCampaign(formattedCampaigns[0]);
    } else if (formattedCampaigns.length === 0) {
      setSelectedCampaign(null);
    }
  }, [formattedCampaigns, selectedCampaign, applicationsLoading]);

  useEffect(() => {
    if (!selectedCampaign) setMobilePane("list");
  }, [selectedCampaign]);

  useEffect(() => {
    if (!registerMobileSlot || !clearMobileSlot) return undefined;
    if (mobilePane === "detail") {
      registerMobileSlot(
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => setMobilePane("list")}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            aria-label="Back to campaigns"
          >
            <ChevronLeft className="h-3.5 w-3.5 text-primary" strokeWidth={2.25} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => setMobilePane("finance")}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            aria-label="Go to finance"
          >
            <ChevronRight className="h-3.5 w-3.5 text-primary" strokeWidth={2.25} aria-hidden />
          </button>
        </div>
      );
    } else if (mobilePane === "finance") {
      registerMobileSlot(
        <button
          type="button"
          onClick={() => setMobilePane("detail")}
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          aria-label="Back to campaign detail"
        >
          <ChevronLeft className="h-3.5 w-3.5 text-primary" strokeWidth={2.25} aria-hidden />
        </button>
      );
    } else {
      clearMobileSlot();
    }
    return () => clearMobileSlot();
  }, [mobilePane, registerMobileSlot, clearMobileSlot]);

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
    handleCampaignSelectWithPane,
    setExpandedMonths,
    formatCampaignData,
    fetchCompletedApplications,
    mobilePane,
    reviewRating,
    setReviewRating,
    reviewText,
    setReviewText,
  };
}
