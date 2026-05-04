import { findCreatorCollaborationHistoryItem } from "@/common/utils/creator-collaboration-history.util";
import { CAMPAIGN_TYPE, COMPENSATION_TYPE } from "@/common/constants/campaign.constant";

export function calculateEarningFromCampaignType(item) {
  if (!item.campaign) {
    return Number(item.totalCompensation || 0);
  }

  const campaign = item.campaign;
  const totalCompensation = Number(item.totalCompensation || 0);

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

export function historyRowsForSelection(rows, selectedCampaign) {
  if (!selectedCampaign) {
    return rows;
  }
  const row = findCreatorCollaborationHistoryItem(rows, selectedCampaign);
  return row ? [row] : [];
}

export function sumPaymentHistoryByMonth(paymentHistoryByMonth) {
  if (!paymentHistoryByMonth || typeof paymentHistoryByMonth !== "object") {
    return 0;
  }
  return Object.values(paymentHistoryByMonth).reduce((sum, month) => {
    const t = month?.total;
    return sum + (typeof t === "number" && !Number.isNaN(t) ? t : 0);
  }, 0);
}
