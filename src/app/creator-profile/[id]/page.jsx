"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import CreatorPortfolio from "@/components/creator-portfolio/creator-portfolio.component";
import { useParams } from "next/navigation";

export default function CreatorProfilePage() {
  const params = useParams();
  const creatorId = params?.id;

  return <Auth component={<CreatorPortfolio creatorId={creatorId} />} type={AUTH.PRIVATE} />;
}
