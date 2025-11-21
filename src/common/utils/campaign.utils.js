import { CAMPAIGN_TYPE } from "../constants/campaign.constant";

export const campaignTitle = (campaignType) => {
  if (campaignType === CAMPAIGN_TYPE.SPONSORED_POST) {
    return "SPONSORED POST";
  }
  if (campaignType === CAMPAIGN_TYPE.UGC) {
    return "UGC";
  }
  if (campaignType === CAMPAIGN_TYPE.GIFTED) {
    return "GIFTED";
  }
  if (campaignType === CAMPAIGN_TYPE.AFFILIATE) {
    return "AFFILIATE";
  }
};

export const campiagnDeliverable = (deliverables) => {
  return deliverables.split(",").map((item) => {
    const trimmed = item.trim();
    // Extract quantity and deliverable name
    const match = trimmed.match(/Quantity \((\d+)\) Deliverable '([^']+)'/);
    if (match) {
      const quantity = match[1];
      const deliverable = match[2];
      return `${quantity} ${deliverable}`;
    }
    return trimmed;
  });
};
