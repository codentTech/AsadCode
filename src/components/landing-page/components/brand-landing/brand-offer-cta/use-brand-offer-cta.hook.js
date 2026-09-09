import { useRouter } from "next/navigation";
import { useCallback } from "react";
import {
  BRAND_LANDING_DEMO_MAIL,
  BRAND_LANDING_DEMO_SECTION_ID,
  BRAND_LANDING_WATCH_DEMO_EVENT,
} from "@/common/constants/brand-landing.constant";

function useBrandOfferCta() {
  const router = useRouter();

  const handleSignUp = useCallback(() => {
    router.push("/onboarding");
  }, [router]);

  const handleSeeHowItWorks = useCallback(() => {
    const section = document.getElementById(BRAND_LANDING_DEMO_SECTION_ID);
    section?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.dispatchEvent(new CustomEvent(BRAND_LANDING_WATCH_DEMO_EVENT));
  }, []);

  return {
    handleSignUp,
    handleSeeHowItWorks,
    demoHref: BRAND_LANDING_DEMO_MAIL,
  };
}

export default useBrandOfferCta;
