"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CAMPAIGN_TYPE, COMPENSATION_TYPE } from "@/common/constants/campaign.constant";
import { CREATOR_COMPENSATION_OPTIONS } from "@/common/constants/options.constant";

export default function useCompensation({ campaignData, handleChange }) {
  const [paymentType, setPaymentType] = useState("paid");
  const [creatorCompOption, setCreatorCompOption] = useState("suggested");

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

  useEffect(() => {
    const currentType = campaignData.campaign_type;

    if (currentType === CAMPAIGN_TYPE.SPONSORED_POST || currentType === CAMPAIGN_TYPE.UGC) {
      setPaymentType("paid");
      setCreatorCompOption("suggested");
      handleChange({ target: { name: "compensation_type", value: COMPENSATION_TYPE.PAID } });
      handleChange({ target: { name: "creator_compensation_option", value: "suggested" } });
      return;
    }

    if (currentType === CAMPAIGN_TYPE.GIFTED) {
      setPaymentType("gifted");
      setCreatorCompOption("gifted");
      handleChange({
        target: { name: "compensation_type", value: COMPENSATION_TYPE.GIFTED_PRODUCT },
      });
      handleChange({ target: { name: "creator_compensation_option", value: "gifted" } });
      return;
    }

    if (currentType === CAMPAIGN_TYPE.AFFILIATE) {
      setPaymentType("paid");
      setCreatorCompOption("commission");
      handleChange({
        target: { name: "compensation_type", value: COMPENSATION_TYPE.COMMISSION },
      });
      handleChange({ target: { name: "creator_compensation_option", value: "commission" } });
      return;
    }

    setPaymentType("paid");
    setCreatorCompOption("suggested");
    handleChange({ target: { name: "compensation_type", value: COMPENSATION_TYPE.PAID } });
    handleChange({ target: { name: "creator_compensation_option", value: "suggested" } });
  }, [campaignData.campaign_type, handleChange]);

  const commissionPayment = useMemo(() => {
    const commissionPercentage = Number(campaignData.commission_percentage || 0);
    const productPrice = Number(campaignData.product_price || 0);
    return (commissionPercentage / 100) * productPrice;
  }, [campaignData.commission_percentage, campaignData.product_price]);

  const handleCampaignTypeChange = useCallback(
    (option) => {
      const nextType = option?.value || "";
      handleChange({ target: { name: "campaign_type", value: nextType } });

      [
        "budget",
        "commission_percentage",
        "product_price",
        "product_value",
        "suggested_min",
        "suggested_max",
        "creator_fixed_price",
      ].forEach((field) => {
        handleChange({ target: { name: field, value: "" } });
      });
    },
    [handleChange]
  );

  const handlePaymentTypeChange = useCallback(
    (value) => {
      setPaymentType(value);

      if (value === "gifted") {
        handleChange({
          target: { name: "compensation_type", value: COMPENSATION_TYPE.GIFTED_PRODUCT },
        });
        setCreatorCompOption("gifted");
        handleChange({ target: { name: "creator_compensation_option", value: "gifted" } });
      } else {
        handleChange({ target: { name: "compensation_type", value: COMPENSATION_TYPE.PAID } });
        setCreatorCompOption("suggested");
        handleChange({ target: { name: "creator_compensation_option", value: "suggested" } });
      }
    },
    [handleChange]
  );

  const handleCreatorCompOptionChange = useCallback(
    (value) => {
      setCreatorCompOption(value);
      handleChange({ target: { name: "creator_compensation_option", value } });

      if (value === "suggested") {
        handleChange({ target: { name: "creator_fixed_price", value: "" } });
      }

      if (value === "set-price") {
        handleChange({ target: { name: "suggested_min", value: "" } });
        handleChange({ target: { name: "suggested_max", value: "" } });
      }
    },
    [handleChange]
  );

  return {
    paymentType,
    paymentTypeOptions,
    creatorCompOption,
    creatorCompensationOptions: CREATOR_COMPENSATION_OPTIONS,
    commissionPayment,
    handleCampaignTypeChange,
    handlePaymentTypeChange,
    handleCreatorCompOptionChange,
  };
}
