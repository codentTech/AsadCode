import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCreatorCollaborationHistory } from "@/provider/features/campaigns/campaigns.slice";
import { getUser } from "@/common/utils/users.util";
import { format } from "date-fns";
import {
  calculateEarningFromCampaignType,
  sumPaymentHistoryByMonth,
} from "@/common/utils/creator-collaboration-finance.util";

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

  const totalEarnings = useMemo(
    () => sumPaymentHistoryByMonth(paymentHistory),
    [paymentHistory]
  );

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
