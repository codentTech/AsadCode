import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CAMPAIGN_TYPE } from "@/common/constants/campaign.constant";
import {
  getShopifyFulfilment,
  selectShopifyFulfilmentState,
} from "@/provider/features/shopify/shopify.slice";

const STATUS_LABELS = {
  ordered: "Ordered",
  shipped: "Shipped",
  delivered: "Delivered",
  failed: "Failed",
};

export default function useCreatorFulfilmentStatus({
  selectedCampaign,
  selectedContract,
}) {
  const dispatch = useDispatch();
  const fulfilmentState = useSelector(selectShopifyFulfilmentState);

  const campaignType =
    selectedCampaign?.campaign_type ||
    selectedCampaign?.campaignType ||
    selectedCampaign?.type;
  const shipsPhysical = Boolean(
    selectedCampaign?.ships_physical_product ??
      selectedCampaign?.shipsPhysicalProduct
  );
  const isGifted = campaignType === CAMPAIGN_TYPE.GIFTED;
  const isEligible = shipsPhysical || isGifted;

  const contractId = selectedContract?.id || null;
  const fulfilment = fulfilmentState?.data || null;
  const isLoading = Boolean(fulfilmentState?.isLoading);

  const defaultProductTitle = useMemo(() => {
    const products =
      selectedCampaign?.shopify_products || selectedCampaign?.shopifyProducts;
    if (Array.isArray(products) && products[0]?.title) return products[0].title;
    return null;
  }, [selectedCampaign]);

  const statusLabel = fulfilment?.status
    ? STATUS_LABELS[fulfilment.status] || fulfilment.status
    : null;

  useEffect(() => {
    if (!isEligible || !contractId) return;
    dispatch(getShopifyFulfilment(contractId));
  }, [dispatch, isEligible, contractId]);

  return {
    isEligible,
    isLoading,
    fulfilment,
    statusLabel,
    defaultProductTitle,
  };
}
