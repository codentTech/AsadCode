import { useCallback, useState } from "react";
import { BRAND_LANDING_FAQS } from "@/common/constants/brand-landing.constant";

function useBrandFaq() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = useCallback((index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  return {
    faqs: BRAND_LANDING_FAQS,
    openIndex,
    handleToggle,
  };
}

export default useBrandFaq;
