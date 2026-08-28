import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CAMPAIGN_TYPE, COMPENSATION_TYPE } from "@/common/constants/campaign.constant";
import {
  CREATOR_COMPENSATION_OPTIONS,
  CAMPAIGN_TYPE_OPTIONS,
} from "@/common/constants/options.constant";
import { calculateCommissionPayment } from "@/common/utils/campaign.utils";
import { formatShopifyProductOptionLabel } from "@/common/utils/shopify-product-label.utils";
import {
  getShopifyConnection,
  getShopifyConnectUrl,
  getShopifyProducts,
  resetShopifyConnectUrl,
  selectShopifyConnectionState,
  selectShopifyConnectUrlState,
  selectShopifyProductsState,
} from "@/provider/features/shopify/shopify.slice";

export default function useCompensation({ campaignData, setValue }) {
  const dispatch = useDispatch();
  const [shopInput, setShopInput] = useState("");
  const [productValueFromShopify, setProductValueFromShopify] = useState(false);

  const { data: connection, isLoading: connectionLoading } = useSelector(
    selectShopifyConnectionState
  );
  const {
    data: connectUrlData,
    isLoading: connectLoading,
    isSuccess: connectSuccess,
  } = useSelector(selectShopifyConnectUrlState);
  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
    message: productsErrorMessage,
  } = useSelector(selectShopifyProductsState);

  const isShopifyConnected = connection?.connected === true;
  const shopifyProducts = productsData?.products || [];
  const hasLoadedProducts = Boolean(productsData);

  const paymentType =
    campaignData.compensation_type === COMPENSATION_TYPE.GIFTED_PRODUCT ? "gifted" : "paid";

  const creatorCompOption = useMemo(() => {
    if (campaignData.creator_compensation_option) {
      return campaignData.creator_compensation_option;
    }
    if (campaignData.creator_fixed_price) return "set-price";
    if (campaignData.suggested_min || campaignData.suggested_max) return "suggested";
    return "none";
  }, [
    campaignData.creator_compensation_option,
    campaignData.creator_fixed_price,
    campaignData.suggested_min,
    campaignData.suggested_max,
  ]);

  const paymentTypeOptions = useMemo(() => {
    if (campaignData.campaign_type === CAMPAIGN_TYPE.SPONSORED_POST) {
      return [{ label: "Paid Collaboration", value: "paid" }];
    }
    if (campaignData.campaign_type === CAMPAIGN_TYPE.UGC) {
      return [
        { label: "Paid Collaboration", value: "paid" },
        { label: "Product Gifting", value: "gifted" },
      ];
    }
    return [];
  }, [campaignData.campaign_type]);

  const commissionPayment = useMemo(() => {
    return calculateCommissionPayment(
      campaignData.commission_percentage,
      campaignData.product_price
    );
  }, [campaignData.commission_percentage, campaignData.product_price]);

  const isGiftedCampaign = useMemo(() => {
    return (
      campaignData.campaign_type === CAMPAIGN_TYPE.GIFTED ||
      campaignData.compensation_type === COMPENSATION_TYPE.GIFTED_PRODUCT ||
      paymentType === "gifted"
    );
  }, [campaignData.campaign_type, campaignData.compensation_type, paymentType]);

  const isAffiliateCampaign = campaignData.campaign_type === CAMPAIGN_TYPE.AFFILIATE;

  const showPhysicalProductToggle = [
    CAMPAIGN_TYPE.AFFILIATE,
    CAMPAIGN_TYPE.SPONSORED_POST,
    CAMPAIGN_TYPE.UGC,
  ].includes(campaignData.campaign_type);

  const selectedCampaignTypeOption = useMemo(() => {
    if (!campaignData.campaign_type) return null;
    return (
      CAMPAIGN_TYPE_OPTIONS.find((option) => option.value === campaignData.campaign_type) || null
    );
  }, [campaignData.campaign_type]);

  const productOptions = useMemo(() => {
    return shopifyProducts.map((product) => ({
      label: formatShopifyProductOptionLabel(product),
      value: product.id,
      product,
    }));
  }, [shopifyProducts]);

  const selectedProductOptions = useMemo(() => {
    const selected = campaignData.shopify_products || [];
    return selected
      .map((item) => productOptions.find((option) => option.value === item.id))
      .filter(Boolean);
  }, [campaignData.shopify_products, productOptions]);

  const selectedGiftedProductOption = useMemo(() => {
    const selected = campaignData.shopify_products?.[0];
    if (!selected) return null;
    return productOptions.find((option) => option.value === selected.id) || null;
  }, [campaignData.shopify_products, productOptions]);

  const creatorFee = useMemo(() => {
    if (isGiftedCampaign) {
      return 0;
    }
    if (
      campaignData.campaign_type === CAMPAIGN_TYPE.SPONSORED_POST ||
      campaignData.campaign_type === CAMPAIGN_TYPE.UGC
    ) {
      if (creatorCompOption === "set-price") {
        return campaignData.creator_fixed_price || 0;
      }
      if (
        creatorCompOption === "suggested" &&
        (campaignData.suggested_min || campaignData.suggested_max)
      ) {
        return `${campaignData.suggested_min || 0} - ${campaignData.suggested_max || 0}`;
      }
      if (creatorCompOption === "none") {
        return "Negotiable";
      }
      return 0;
    }
    if (isAffiliateCampaign) {
      return campaignData.commission_percentage
        ? `${campaignData.commission_percentage}%`
        : 0;
    }
    return 0;
  }, [
    isGiftedCampaign,
    isAffiliateCampaign,
    campaignData.campaign_type,
    campaignData.commission_percentage,
    creatorCompOption,
    campaignData.creator_fixed_price,
    campaignData.suggested_min,
    campaignData.suggested_max,
  ]);

  useEffect(() => {
    dispatch(getShopifyConnection());
  }, [dispatch]);

  useEffect(() => {
    if (isShopifyConnected && (isAffiliateCampaign || isGiftedCampaign)) {
      dispatch(getShopifyProducts());
    }
  }, [dispatch, isShopifyConnected, isAffiliateCampaign, isGiftedCampaign]);

  useEffect(() => {
    if (connectSuccess && connectUrlData?.authUrl) {
      window.location.href = connectUrlData.authUrl;
      dispatch(resetShopifyConnectUrl());
    }
  }, [connectSuccess, connectUrlData, dispatch]);

  useEffect(() => {
    if (isGiftedCampaign) {
      setValue("creator_fee", 0, { shouldDirty: true });
    }
  }, [isGiftedCampaign, setValue]);

  const mapProductSelection = useCallback((product) => {
    const variant = product.variants?.[0] || null;
    return {
      id: product.id,
      title: product.title,
      imageUrl: product.imageUrl || null,
      variantId: variant?.id || null,
      variantTitle: variant?.title || null,
      sku: variant?.sku || null,
      price: variant?.price ?? null,
      cost: variant?.cost ?? null,
    };
  }, []);

  const handleCampaignTypeChange = useCallback(
    (option) => {
      const nextType = option?.value || "";
      setValue("campaign_type", nextType, { shouldDirty: true, shouldValidate: true });

      if (nextType === CAMPAIGN_TYPE.SPONSORED_POST || nextType === CAMPAIGN_TYPE.UGC) {
        setValue("compensation_type", COMPENSATION_TYPE.PAID, { shouldDirty: true });
      } else if (nextType === CAMPAIGN_TYPE.GIFTED) {
        setValue("compensation_type", COMPENSATION_TYPE.GIFTED_PRODUCT, { shouldDirty: true });
        setValue("creator_fee", 0, { shouldDirty: true });
      } else if (nextType === CAMPAIGN_TYPE.AFFILIATE) {
        setValue("compensation_type", COMPENSATION_TYPE.COMMISSION, { shouldDirty: true });
      }

      setValue("budget", "", { shouldDirty: true });
      setValue("commission_percentage", "", { shouldDirty: true });
      setValue("product_price", "", { shouldDirty: true });
      setValue("product_value", "", { shouldDirty: true });
      setValue("customer_discount_percent", "", { shouldDirty: true });
      setValue("tracking_end_date", "", { shouldDirty: true });
      setValue("shopify_products", [], { shouldDirty: true });
      setValue("ships_physical_product", nextType === CAMPAIGN_TYPE.GIFTED, {
        shouldDirty: true,
      });
      setValue("suggested_min", "", { shouldDirty: true });
      setValue("suggested_max", "", { shouldDirty: true });
      setValue("creator_fixed_price", "", { shouldDirty: true });
      setProductValueFromShopify(false);
    },
    [setValue]
  );

  const handlePaymentTypeChange = useCallback(
    (value) => {
      if (value === "gifted") {
        setValue("compensation_type", COMPENSATION_TYPE.GIFTED_PRODUCT, { shouldDirty: true });
        setValue("creator_fee", 0, { shouldDirty: true });
        setValue("creator_fixed_price", "", { shouldDirty: true });
        setValue("suggested_min", "", { shouldDirty: true });
        setValue("suggested_max", "", { shouldDirty: true });
      } else {
        setValue("compensation_type", COMPENSATION_TYPE.PAID, { shouldDirty: true });
      }
    },
    [setValue]
  );

  const handleCreatorCompOptionChange = useCallback(
    (value) => {
      setValue("creator_compensation_option", value, { shouldDirty: true });
      if (value === "none") {
        setValue("creator_fixed_price", "", { shouldDirty: true });
        setValue("suggested_min", "", { shouldDirty: true });
        setValue("suggested_max", "", { shouldDirty: true });
      } else if (value === "suggested") {
        setValue("creator_fixed_price", "", { shouldDirty: true });
      } else if (value === "set-price") {
        setValue("suggested_min", "", { shouldDirty: true });
        setValue("suggested_max", "", { shouldDirty: true });
      }
    },
    [setValue]
  );

  const handleShopInputChange = useCallback((event) => {
    setShopInput(event?.target?.value ?? "");
  }, []);

  const handleInlineConnect = useCallback(() => {
    const shop = shopInput.trim();
    if (!shop) return;
    dispatch(getShopifyConnectUrl({ shop }));
  }, [dispatch, shopInput]);

  const handleAffiliateProductsChange = useCallback(
    (options) => {
      const selected = Array.isArray(options) ? options : [];
      const mapped = selected
        .map((option) => option?.product)
        .filter(Boolean)
        .map(mapProductSelection);
      setValue("shopify_products", mapped, { shouldDirty: true, shouldValidate: true });
    },
    [mapProductSelection, setValue]
  );

  const handleGiftedProductChange = useCallback(
    (option) => {
      if (!option?.product) {
        setValue("shopify_products", [], { shouldDirty: true, shouldValidate: true });
        setProductValueFromShopify(false);
        return;
      }

      const mapped = mapProductSelection(option.product);
      setValue("shopify_products", [mapped], { shouldDirty: true, shouldValidate: true });

      const autoCost =
        mapped.cost != null && mapped.cost !== ""
          ? mapped.cost
          : mapped.price != null
            ? mapped.price
            : null;

      if (autoCost != null) {
        setValue("product_value", autoCost, { shouldDirty: true, shouldValidate: true });
        setProductValueFromShopify(true);
      }
    },
    [mapProductSelection, setValue]
  );

  const handleShipsPhysicalChange = useCallback(
    (event) => {
      setValue("ships_physical_product", Boolean(event?.target?.checked), {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [setValue]
  );

  const handleRefreshProducts = useCallback(() => {
    if (!isShopifyConnected || productsLoading) return;
    dispatch(getShopifyProducts());
  }, [dispatch, isShopifyConnected, productsLoading]);

  return {
    paymentType,
    paymentTypeOptions,
    creatorCompOption,
    creatorCompensationOptions: CREATOR_COMPENSATION_OPTIONS,
    commissionPayment,
    isGiftedCampaign,
    isAffiliateCampaign,
    showPhysicalProductToggle,
    selectedCampaignTypeOption,
    creatorFee,
    isShopifyConnected,
    connectionLoading,
    connectLoading,
    shopInput,
    handleShopInputChange,
    handleInlineConnect,
    shopName: connection?.shopName || connection?.shopDomain || "",
    productOptions,
    selectedProductOptions,
    selectedGiftedProductOption,
    productsLoading,
    productsError,
    productsErrorMessage,
    hasLoadedProducts,
    productValueFromShopify,
    handleRefreshProducts,
    handleCampaignTypeChange,
    handlePaymentTypeChange,
    handleCreatorCompOptionChange,
    handleAffiliateProductsChange,
    handleGiftedProductChange,
    handleShipsPhysicalChange,
  };
}
