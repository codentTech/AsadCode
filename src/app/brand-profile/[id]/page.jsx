"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import BrandPortfolio from "@/components/brand-portfolio/brand-portfolio.component";
import { useParams } from "next/navigation";

export default function BrandProfilePage() {
  const params = useParams();
  const brandId = params?.id;

  return <Auth component={<BrandPortfolio brandId={brandId} />} type={AUTH.PRIVATE} />;
}
