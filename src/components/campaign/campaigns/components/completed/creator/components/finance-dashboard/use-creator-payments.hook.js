import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCreatorCollaborationHistory } from "@/provider/features/campaigns/campaigns.slice";
import { getUser } from "@/common/utils/users.util";
import { format } from "date-fns";
import { CAMPAIGN_TYPE, COMPENSATION_TYPE } from "@/common/constants/campaign.constant";

function calculateEarningFromCampaignType(item) {
  const totalCompensation = Number(item.totalCompensation || item.total_compensation || 0);

  if (!item.campaign) {
    return totalCompensation;
  }

  const campaign = item.campaign;

  if (campaign.campaign_type === CAMPAIGN_TYPE.AFFILIATE) {
    const commissionPercentage = Number(campaign.commission_percentage || 0);
    if (totalCompensation > 0 && commissionPercentage > 0) {
      return (commissionPercentage / 100) * totalCompensation;
    }
    return 0;
  }

  if (
    campaign.campaign_type === CAMPAIGN_TYPE.SPONSORED_POST ||
    campaign.campaign_type === CAMPAIGN_TYPE.UGC
  ) {
    if (campaign.compensation_type === COMPENSATION_TYPE.PAID) {
      return totalCompensation > 0 ? totalCompensation : Number(campaign.creator_fixed_price || 0);
    }
    return 0;
  }

  if (campaign.campaign_type === CAMPAIGN_TYPE.GIFTED) {
    return totalCompensation > 0 ? totalCompensation : Number(campaign.product_value || 0);
  }

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

  const paymentHistory = useMemo(() => {
    if (!isSuccess || !historyData?.data || !Array.isArray(historyData.data)) {
      return {};
    }

    const history = historyData.data;
    const selectedCampaignId = selectedCampaign?.id || selectedCampaign?.campaign?.id;

    const filteredHistory = selectedCampaignId
      ? history.filter((item) => item.campaignId === selectedCampaignId)
      : history;

    const paymentsByMonth = {};

    filteredHistory.forEach((item) => {
      const paymentAmount = calculateEarningFromCampaignType(item);
      const completionDate = item.completionDate || item.completed_at || item.completedAt;

      // Include if paymentAmount > 0, even if completionDate is missing
      // Use contract created_at or updated_at as fallback for date
      if (paymentAmount > 0) {
        const dateToUse = completionDate || item.created_at || item.updated_at || new Date();
        const completedDate = new Date(dateToUse);

        const monthKey = format(completedDate, "MMMM yyyy");
        const dayKey = format(completedDate, "MMMM d");

        if (!paymentsByMonth[monthKey]) {
          paymentsByMonth[monthKey] = {
            total: 0,
            payments: [],
          };
        }

        paymentsByMonth[monthKey].total += Number(paymentAmount);

        paymentsByMonth[monthKey].payments.push({
          campaign: item.campaignName || "Campaign",
          amount: Number(paymentAmount).toFixed(2),
          date: dayKey,
          completedAt: completedDate,
          compensationType: item.campaign?.compensation_type || null,
          campaignType: item.campaign?.campaign_type || null,
          commissionPercentage: item.campaign?.commission_percentage || null,
          creatorFixedPrice: item.campaign?.creator_fixed_price || null,
          productValue: item.campaign?.product_value || null,
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

  const totalEarnings = useMemo(() => {
    if (!isSuccess || !historyData?.data || !Array.isArray(historyData.data)) {
      return 0;
    }

    const selectedCampaignId = selectedCampaign?.id || selectedCampaign?.campaign?.id;

    const filteredData = selectedCampaignId
      ? historyData.data.filter((item) => item.campaignId === selectedCampaignId)
      : historyData.data;

    const total = filteredData.reduce((sum, item) => {
      const paymentAmount = calculateEarningFromCampaignType(item);
      const amount = paymentAmount > 0 ? Number(paymentAmount) : 0;
      return sum + amount;
    }, 0);
    
    return total;
  }, [isSuccess, historyData, selectedCampaign]);

  return {
    paymentHistory,
    totalEarnings,
    isLoading,
    isError,
  };
}
