"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import ShopifyIntegration from "@/components/settings/integrations/shopify/shopify.component";

export default function Page() {
  return <Auth component={<ShopifyIntegration />} type={AUTH.PRIVATE} />;
}
