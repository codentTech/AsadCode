import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCreatorCollaborationHistory } from "@/provider/features/campaigns/campaigns.slice";
import { getUser } from "@/common/utils/users.util";
import { format } from "date-fns";
import { calculateCommissionPayment } from "@/common/utils/campaign.utils";
import { CAMPAIGN_TYPE, COMPENSATION_TYPE } from "@/common/constants/campaign.constant";

// Calculate earning based on campaign type
// For commission campaigns: commission_percentage is applied to total_compensation
// total_compensation = total sales/revenue, commission earned = (commission_percentage / 100) * total_compensation
function calculateEarningFromCampaignType(item) {
  if (!item.campaign) {
    // If no campaign data, use totalCompensation directly
    return Number(item.totalCompensation || 0);
  }

  const campaign = item.campaign;
  const totalCompensation = Number(item.totalCompensation || 0);

  // AFFILIATE/COMMISSION campaigns
  // Calculate commission from total_compensation using commission_percentage
  if (campaign.campaign_type === CAMPAIGN_TYPE.AFFILIATE) {
    const commissionPercentage = Number(campaign.commission_percentage || 0);
    if (totalCompensation > 0 && commissionPercentage > 0) {
      // Commission earned = (commission_percentage / 100) * total_compensation
      return (commissionPercentage / 100) * totalCompensation;
    }
    return 0;
  }

  // SPONSORED_POST or UGC
  if (
    campaign.campaign_type === CAMPAIGN_TYPE.SPONSORED_POST ||
    campaign.campaign_type === CAMPAIGN_TYPE.UGC
  ) {
    if (campaign.compensation_type === COMPENSATION_TYPE.PAID) {
      // Use totalCompensation if available, otherwise use creator_fixed_price
      return totalCompensation > 0 ? totalCompensation : Number(campaign.creator_fixed_price || 0);
    }
    // For range, return 0 (can't calculate exact amount from range)
    return 0;
  }

  // GIFTED
  if (campaign.campaign_type === CAMPAIGN_TYPE.GIFTED) {
    // Use totalCompensation if available, otherwise use product_value
    return totalCompensation > 0 ? totalCompensation : Number(campaign.product_value || 0);
  }

  // Default: use totalCompensation
  return totalCompensation;
}

export default function useCreatorPayments(selectedCampaign = null) {
  const dispatch = useDispatch();
  const user = getUser();
  const creatorProfileId = user?.creator_profile?.id;

  const {
    data: historyData,
    isLoading,
    isSuccess,
    isError,
  } = useSelector((state) => state.campaigns.getCreatorCollaborationHistory || {});

  useEffect(() => {
    if (creatorProfileId) {
      dispatch(getCreatorCollaborationHistory(creatorProfileId));
    }
  }, [dispatch, creatorProfileId]);

  // Format payment history by month
  // Filter by selected campaign if one is selected, otherwise show all
  const paymentHistory = useMemo(() => {
    if (!isSuccess || !historyData?.data || !Array.isArray(historyData.data)) {
      return {};
    }

    const history = historyData.data;
    const selectedCampaignId = selectedCampaign?.id || selectedCampaign?.campaign?.id;

    // Filter by selected campaign if one is selected
    const filteredHistory = selectedCampaignId
      ? history.filter((item) => item.campaignId === selectedCampaignId)
      : history;

    const paymentsByMonth = {};

    filteredHistory.forEach((item) => {
      // Calculate payment amount based on campaign type
      const paymentAmount = calculateEarningFromCampaignType(item);

      // Only include collaborations with completion dates and payment amounts
      if (item.completionDate && paymentAmount > 0) {
        const completedDate = new Date(item.completionDate);

        const monthKey = format(completedDate, "MMMM yyyy");
        const dayKey = format(completedDate, "MMMM d");

        if (!paymentsByMonth[monthKey]) {
          paymentsByMonth[monthKey] = {
            total: 0,
            payments: [],
          };
        }

        paymentsByMonth[monthKey].total += Number(paymentAmount);

        // Get commission percentage for display
        const commissionPercentage = item.campaign?.commission_percentage || null;

        paymentsByMonth[monthKey].payments.push({
          campaign: item.campaignName || "Campaign",
          amount: Number(paymentAmount).toFixed(2),
          date: dayKey,
          completedAt: completedDate,
          compensationType: item.campaign?.compensation_type || null,
          campaignType: item.campaign?.campaign_type || null,
          commissionPercentage: commissionPercentage,
          creatorFixedPrice: item.campaign?.creator_fixed_price || null,
          productValue: item.campaign?.product_value || null,
          expectedPayoutAvailableAt: item.expectedPayoutAvailableAt || null,
          payoutStatus: item.payoutStatus || null,
          payoutBlockReason: item.payoutBlockReason || null,
        });
      }
    });

    // Remove months with no payments
    Object.keys(paymentsByMonth).forEach((month) => {
      if (paymentsByMonth[month].total === 0) {
        delete paymentsByMonth[month];
      } else {
        // Sort payments within each month by date (newest first)
        paymentsByMonth[month].payments.sort(
          (a, b) => new Date(b.completedAt) - new Date(a.completedAt)
        );
      }
    });

    // Sort months (newest first)
    const sortedMonths = Object.keys(paymentsByMonth).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateB - dateA;
    });

    const sortedPaymentHistory = {};
    sortedMonths.forEach((month) => {
      sortedPaymentHistory[month] = paymentsByMonth[month];
    });

    return sortedPaymentHistory;
  }, [isSuccess, historyData, selectedCampaign]);

  // Calculate total earnings
  // If a campaign is selected, show earnings for that campaign only
  // Otherwise, show total earnings from all completed collaborations
  const totalEarnings = useMemo(() => {
    if (!isSuccess || !historyData?.data || !Array.isArray(historyData.data)) {
      return 0;
    }

    const selectedCampaignId = selectedCampaign?.id || selectedCampaign?.campaign?.id;

    // Filter by selected campaign if one is selected
    const filteredData = selectedCampaignId
      ? historyData.data.filter((item) => item.campaignId === selectedCampaignId)
      : historyData.data;

    // Sum all earnings calculated from campaign type
    return filteredData.reduce((sum, item) => {
      const paymentAmount = calculateEarningFromCampaignType(item);
      // Only include collaborations with payment amounts
      return sum + (paymentAmount > 0 ? Number(paymentAmount) : 0);
    }, 0);
  }, [isSuccess, historyData, selectedCampaign]);

  const expectedPayoutAvailableAt = useMemo(() => {
    if (!isSuccess || !historyData?.data || !Array.isArray(historyData.data)) {
      return null;
    }
    const selectedCampaignId =
      selectedCampaign?.id || selectedCampaign?.campaign?.id;
    const list = selectedCampaignId
      ? historyData.data.filter((item) => item.campaignId === selectedCampaignId)
      : historyData.data;
    const row = list.find((item) => item.expectedPayoutAvailableAt);
    return row?.expectedPayoutAvailableAt ?? null;
  }, [isSuccess, historyData, selectedCampaign]);

  return {
    paymentHistory,
    totalEarnings,
    expectedPayoutAvailableAt,
    isLoading,
    isError,
  };
}
