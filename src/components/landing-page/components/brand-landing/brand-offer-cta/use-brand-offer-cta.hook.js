import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { BRAND_LANDING_DEMO_MAIL } from "@/common/constants/brand-landing.constant";

function useBrandOfferCta() {
  const router = useRouter();

  const handleSignUp = useCallback(() => {
    router.push("/onboarding");
  }, [router]);

  return {
    handleSignUp,
    demoHref: BRAND_LANDING_DEMO_MAIL,
  };
}

export default useBrandOfferCta;
