import { findCreatorCollaborationHistoryItem } from "@/common/utils/creator-collaboration-history.util";
import { CAMPAIGN_TYPE, COMPENSATION_TYPE } from "@/common/constants/campaign.constant";

export function calculateEarningFromCampaignType(item) {
  const contract = item?.contract || {};
  const giftedValue = Number(
    contract.productValue ||
      contract.product_value ||
      contract.productPrice ||
      contract.product_price ||
      item?.productValue ||
      item?.product_value ||
      item?.campaign?.product_value ||
      item?.campaign?.productPrice ||
      item?.campaign?.product_price ||
      0
  );
  const compensationType =
    item?.campaign?.compensation_type ||
    item?.campaign?.compensationType ||
    contract.compensation_type ||
    contract.compensationType;

  if (!item.campaign) {
    const fallbackTotal = Number(
      item.totalCompensation ||
        item.total_compensation ||
        contract.totalCompensation ||
        contract.total_compensation ||
        0
    );
    if (compensationType === COMPENSATION_TYPE.GIFTED_PRODUCT) {
      return fallbackTotal > 0 ? fallbackTotal : giftedValue;
    }
    return fallbackTotal;
  }

  const campaign = item.campaign;
  const totalCompensation = Number(item.totalCompensation || item.total_compensation || 0);

  if (compensationType === COMPENSATION_TYPE.COMMISSION || campaign.campaign_type === CAMPAIGN_TYPE.AFFILIATE) {
    const commissionPercentage = Number(campaign.commission_percentage || 0);
    if (totalCompensation > 0 && commissionPercentage > 0) {
      return (commissionPercentage / 100) * totalCompensation;
    }
    return 0;
  }

  if (compensationType === COMPENSATION_TYPE.PAID) {
    return totalCompensation > 0 ? totalCompensation : Number(campaign.creator_fixed_price || 0);
  }

  if (
    compensationType === COMPENSATION_TYPE.GIFTED_PRODUCT ||
    campaign.campaign_type === CAMPAIGN_TYPE.GIFTED
  ) {
    return totalCompensation > 0 ? totalCompensation : giftedValue;
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
