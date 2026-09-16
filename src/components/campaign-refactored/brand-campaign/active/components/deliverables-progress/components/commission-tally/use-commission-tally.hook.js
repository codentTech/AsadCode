import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CAMPAIGN_TYPE } from "@/common/constants/campaign.constant";
import {
  getShopifyCommissionTally,
  selectShopifyCommissionTallyState,
} from "@/provider/features/shopify/shopify.slice";

export default function useCommissionTally({ selectedCampaign, selectedContract }) {
  const dispatch = useDispatch();
  const tallyState = useSelector(selectShopifyCommissionTallyState);

  const isAffiliate = useMemo(() => {
    const type =
      selectedCampaign?.campaign_type ||
      selectedCampaign?.campaignType ||
      selectedCampaign?.campaign?.campaign_type;
    return type === CAMPAIGN_TYPE.AFFILIATE;
  }, [selectedCampaign]);

  const contractId = selectedContract?.id || selectedContract?.contractId;

  useEffect(() => {
    if (!isAffiliate || !contractId) return;
    dispatch(getShopifyCommissionTally(contractId));
  }, [dispatch, isAffiliate, contractId]);

  const tally = tallyState?.data || null;
  const isLoading = Boolean(tallyState?.isLoading);

  const formatMoney = useCallback(
    (value) => {
      const amount = Number(value) || 0;
      const currency = tally?.currency || "USD";
      try {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency,
          maximumFractionDigits: 2,
        }).format(amount);
      } catch {
        return `$${amount.toFixed(2)}`;
      }
    },
    [tally?.currency]
  );

  const lockHint = useMemo(() => {
    if (!tally?.lockAt) return null;
    const date = new Date(tally.lockAt);
    if (Number.isNaN(date.getTime())) return null;
    return `Settlement lock around ${date.toLocaleDateString()}`;
  }, [tally?.lockAt]);

  return {
    isAffiliate,
    isLoading,
    tally,
    formatMoney,
    lockHint,
  };
}
