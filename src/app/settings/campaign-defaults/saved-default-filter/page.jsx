"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import SavedDefaultFilters from "@/components/settings/campaign-defaults/components/saved-default-filter/saved-default-filter.component";

export default function Page() {
  return <Auth component={<SavedDefaultFilters />} type={AUTH.AUTH_MAIN_ROUTES} />;
}
