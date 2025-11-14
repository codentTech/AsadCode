"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import BrandPortfolio from "@/components/brand-portfolio/brand-portfolio";

export default function Page() {
  return <Auth component={<BrandPortfolio />} type={AUTH.PRIVATE} />;
}
