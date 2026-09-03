import { useCallback, useMemo, useState } from "react";
import {
  BRAND_PRICING_BILLING,
  BRAND_PRICING_FAQS,
  BRAND_PRICING_TIERS,
} from "@/common/constants/brand-pricing.constant";

function useBrandPricingPage() {
  const [billingCycle, setBillingCycle] = useState("quarterly");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const handleBillingChange = useCallback((cycle) => {
    setBillingCycle(cycle);
  }, []);

  const handleFaqToggle = useCallback((index) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  }, []);

  const pricedTiers = useMemo(() => {
    const cyclePrices = BRAND_PRICING_BILLING[billingCycle];
    return BRAND_PRICING_TIERS.map((tier) => {
      if (tier.custom) {
        return { ...tier, price: "Custom", billed: "" };
      }
      const pricing = cyclePrices[tier.priceIndex];
      return { ...tier, price: pricing.price, billed: pricing.billed };
    });
  }, [billingCycle]);

  return {
    billingCycle,
    handleBillingChange,
    openFaqIndex,
    handleFaqToggle,
    pricedTiers,
    faqs: BRAND_PRICING_FAQS,
  };
}

export default useBrandPricingPage;
