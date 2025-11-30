import { useCallback, useMemo } from "react";
import { CAMPAIGN_TYPE, COMPENSATION_TYPE } from "@/common/constants/campaign.constant";
import { CREATOR_COMPENSATION_OPTIONS } from "@/common/constants/options.constant";
import { calculateCommissionPayment } from "@/common/utils/campaign.utils";

export default function useCompensation({ campaignData, setValue }) {
  const paymentType =
    campaignData.compensation_type === COMPENSATION_TYPE.GIFTED_PRODUCT ? "gifted" : "paid";

  const creatorCompOption = useMemo(() => {
    if (campaignData.creator_fixed_price) return "set-price";
    if (campaignData.suggested_min || campaignData.suggested_max) return "suggested";
    return "suggested";
  }, [campaignData.creator_fixed_price, campaignData.suggested_min, campaignData.suggested_max]);

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

  const handleCampaignTypeChange = useCallback(
    (option) => {
      const nextType = option?.value || "";
      setValue("campaign_type", nextType, { shouldDirty: true, shouldValidate: true });

      if (nextType === CAMPAIGN_TYPE.SPONSORED_POST || nextType === CAMPAIGN_TYPE.UGC) {
        setValue("compensation_type", COMPENSATION_TYPE.PAID, { shouldDirty: true });
      } else if (nextType === CAMPAIGN_TYPE.GIFTED) {
        setValue("compensation_type", COMPENSATION_TYPE.GIFTED_PRODUCT, { shouldDirty: true });
      } else if (nextType === CAMPAIGN_TYPE.AFFILIATE) {
        setValue("compensation_type", COMPENSATION_TYPE.COMMISSION, { shouldDirty: true });
      }

      setValue("budget", "", { shouldDirty: true });
      setValue("commission_percentage", "", { shouldDirty: true });
      setValue("product_price", "", { shouldDirty: true });
      setValue("product_value", "", { shouldDirty: true });
      setValue("suggested_min", "", { shouldDirty: true });
      setValue("suggested_max", "", { shouldDirty: true });
      setValue("creator_fixed_price", "", { shouldDirty: true });
    },
    [setValue]
  );

  const handlePaymentTypeChange = useCallback(
    (value) => {
      if (value === "gifted") {
        setValue("compensation_type", COMPENSATION_TYPE.GIFTED_PRODUCT, { shouldDirty: true });
      } else {
        setValue("compensation_type", COMPENSATION_TYPE.PAID, { shouldDirty: true });
      }
    },
    [setValue]
  );

  const handleCreatorCompOptionChange = useCallback(
    (value) => {
      if (value === "suggested") {
        setValue("creator_fixed_price", "", { shouldDirty: true });
      } else if (value === "set-price") {
        setValue("suggested_min", "", { shouldDirty: true });
        setValue("suggested_max", "", { shouldDirty: true });
      }
    },
    [setValue]
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
