import { useCallback, useState } from "react";
import { AGENCY_FAQS } from "@/common/constants/agency.constant";

function useAgencyPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const handleFaqToggle = useCallback((index) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  }, []);

  return {
    openFaqIndex,
    handleFaqToggle,
    faqs: AGENCY_FAQS,
  };
}

export default useAgencyPage;
