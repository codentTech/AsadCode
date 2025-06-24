"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import AutoReplyTemplate from "@/components/settings/campaign-defaults/auto-reply-template/auto-reply-template.component";

export default function Page() {
  return <Auth component={<AutoReplyTemplate />} type={AUTH.AUTH_MAIN_ROUTES} />;
}
