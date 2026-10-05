"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import ContentLibrary from "@/components/content-library/content-library.component";

export default function Page() {
  return <Auth component={<ContentLibrary />} type={AUTH.PRIVATE} />;
}
