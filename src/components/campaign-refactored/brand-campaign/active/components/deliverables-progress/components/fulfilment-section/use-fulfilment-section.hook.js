import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CAMPAIGN_TYPE } from "@/common/constants/campaign.constant";
import {
  getShopifyConnection,
  getShopifyFulfilment,
  getShopifyProducts,
  resetShopifySendProduct,
  selectShopifyConnectionState,
  selectShopifyFulfilmentState,
  selectShopifyProductsState,
  selectShopifySendProductState,
  sendShopifyProduct,
} from "@/provider/features/shopify/shopify.slice";

const STATUS_LABELS = {
  ordered: "Ordered",
  shipped: "Shipped",
  delivered: "Delivered",
  failed: "Failed",
};

function extractNumericId(value) {
  if (!value) return null;
  const match = String(value).match(/(\d+)\s*$/);
  return match?.[1] || null;
}

function formatShippingAddress(address) {
  if (!address) return null;
  const lines = [];
  if (address.street) lines.push(address.street);
  if (address.line2) lines.push(address.line2);
  if (address.line3) lines.push(address.line3);
  const cityStateZip = [address.city, address.state, address.zipCode].filter(Boolean).join(", ");
  if (cityStateZip) lines.push(cityStateZip);
  if (address.country) lines.push(address.country);
  return lines.length ? lines : null;
}

export default function useFulfilmentSection({
  selectedCampaign,
  selectedContract,
  creator,
}) {
  const dispatch = useDispatch();
  const connectionState = useSelector(selectShopifyConnectionState);
  const fulfilmentState = useSelector(selectShopifyFulfilmentState);
  const productsState = useSelector(selectShopifyProductsState);
  const sendState = useSelector(selectShopifySendProductState);
  const sendRequestedRef = useRef(false);

  const [showSendModal, setShowSendModal] = useState(false);
  const [isAddressCopied, setIsAddressCopied] = useState(false);

  const campaignType =
    selectedCampaign?.campaign_type ||
    selectedCampaign?.campaignType ||
    selectedCampaign?.type;
  const shipsPhysical = Boolean(
    selectedCampaign?.ships_physical_product ?? selectedCampaign?.shipsPhysicalProduct
  );
  const isGifted = campaignType === CAMPAIGN_TYPE.GIFTED;
  const isEligible = shipsPhysical || isGifted;

  const contractId = selectedContract?.id || null;
  const isConnected = Boolean(connectionState?.data?.connected);
  const fulfilment = fulfilmentState?.data || null;
  const isLoading = Boolean(
    fulfilmentState?.isLoading || connectionState?.isLoading
  );
  const isSendLoading = Boolean(sendState?.isLoading);

  const defaultProductTitle = useMemo(() => {
    const products = selectedCampaign?.shopify_products || selectedCampaign?.shopifyProducts;
    if (Array.isArray(products) && products[0]?.title) return products[0].title;
    return "Campaign product";
  }, [selectedCampaign]);

  const statusLabel = fulfilment?.status
    ? STATUS_LABELS[fulfilment.status] || fulfilment.status
    : null;
  const isFailed = fulfilment?.status === "failed";
  const canSend =
    isConnected && (!fulfilment || fulfilment.status === "failed");

  useEffect(() => {
    if (!isEligible) return;
    dispatch(getShopifyConnection());
  }, [dispatch, isEligible]);

  useEffect(() => {
    if (!isEligible || !contractId) return;
    dispatch(getShopifyFulfilment(contractId));
  }, [dispatch, isEligible, contractId]);

  useEffect(() => {
    if (!showSendModal || !isConnected) return;
    dispatch(getShopifyProducts());
  }, [dispatch, showSendModal, isConnected]);

  useEffect(() => {
    if (!sendRequestedRef.current || !showSendModal) return;
    if (sendState?.isLoading) return;
    if (sendState?.isSuccess) {
      sendRequestedRef.current = false;
      setShowSendModal(false);
      dispatch(resetShopifySendProduct());
      if (contractId) dispatch(getShopifyFulfilment(contractId));
    }
  }, [dispatch, sendState, showSendModal, contractId]);

  const handleOpenSendModal = useCallback(() => {
    dispatch(resetShopifySendProduct());
    sendRequestedRef.current = false;
    setShowSendModal(true);
  }, [dispatch]);

  const handleCloseSendModal = useCallback(() => {
    if (isSendLoading) return;
    sendRequestedRef.current = false;
    setShowSendModal(false);
    dispatch(resetShopifySendProduct());
  }, [dispatch, isSendLoading]);

  const handleCopyAddress = useCallback(async () => {
    const lines = formatShippingAddress(creator?.shippingAddress);
    if (!lines?.length) return;
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    await navigator.clipboard.writeText(lines.join("\n"));
    setIsAddressCopied(true);
    setTimeout(() => setIsAddressCopied(false), 2000);
  }, [creator?.shippingAddress]);

  const handleSendProduct = useCallback(
    (payload) => {
      if (!contractId) return;
      sendRequestedRef.current = true;
      dispatch(
        sendShopifyProduct({
          contractId,
          productId: payload.productId,
          variantId: payload.variantId,
          quantity: payload.quantity,
          productTitle: payload.productTitle || undefined,
          variantTitle: payload.variantTitle || undefined,
          giftNote: payload.giftNote || undefined,
          shippingAddressOverride: payload.shippingAddressOverride || undefined,
        })
      );
    },
    [dispatch, contractId]
  );

  const productOptions = useMemo(() => {
    const products = productsState?.data?.products || [];
    return products.map((product) => ({
      label: product.title,
      value: product.id,
      variants: product.variants || [],
    }));
  }, [productsState?.data]);

  const initialProductId = useMemo(() => {
    const campaignProducts =
      selectedCampaign?.shopify_products || selectedCampaign?.shopifyProducts || [];
    const preferred = Array.isArray(campaignProducts) ? campaignProducts[0] : null;
    if (preferred?.id) {
      const match = productOptions.find(
        (p) =>
          extractNumericId(p.value) === extractNumericId(preferred.id) ||
          p.value === preferred.id
      );
      if (match) return match.value;
    }
    return productOptions[0]?.value || "";
  }, [selectedCampaign, productOptions]);

  const initialVariantId = useMemo(() => {
    const campaignProducts =
      selectedCampaign?.shopify_products || selectedCampaign?.shopifyProducts || [];
    const preferred = Array.isArray(campaignProducts) ? campaignProducts[0] : null;
    const product = productOptions.find((p) => p.value === initialProductId);
    const variants = product?.variants || [];
    if (preferred?.variantId) {
      const match = variants.find(
        (v) =>
          extractNumericId(v.id) === extractNumericId(preferred.variantId) ||
          v.id === preferred.variantId
      );
      if (match) return match.id;
    }
    const available = variants.find((v) => {
      if (v.availableForSale === false) return false;
      if (v.availableForSale === true) return true;
      return v.inventoryQuantity == null || v.inventoryQuantity > 0;
    });
    return available?.id || variants[0]?.id || "";
  }, [selectedCampaign, productOptions, initialProductId]);

  return {
    isEligible,
    isLoading,
    isConnected,
    fulfilment,
    statusLabel,
    isFailed,
    canSend,
    defaultProductTitle,
    showSendModal,
    isAddressCopied,
    isSendLoading,
    sendError: sendState?.isError ? sendState?.message : null,
    productOptions,
    productsLoading: Boolean(productsState?.isLoading),
    initialProductId,
    initialVariantId,
    shippingAddress: creator?.shippingAddress || null,
    shippingLines: formatShippingAddress(creator?.shippingAddress),
    creatorName: creator?.name || "Creator",
    handleOpenSendModal,
    handleCloseSendModal,
    handleCopyAddress,
    handleSendProduct,
  };
}
