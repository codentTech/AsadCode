"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import ApplicantSummary from "@/components/campaign-refactored/brand-campaign/applications/components/applicant-summary/applicant-summary.component";

export default function Page() {
  return <Auth component={<ApplicantSummary />} type={AUTH.PRIVATE} />;
}
