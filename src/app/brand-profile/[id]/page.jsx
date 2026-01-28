"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import BrandPortfolio from "@/components/brand-portfolio/brand-portfolio";

export default function BrandProfilePage({ params }) {
  const brandId = params.id;

  return <Auth component={<BrandPortfolio brandId={brandId} />} type={AUTH.PRIVATE} />;
}
