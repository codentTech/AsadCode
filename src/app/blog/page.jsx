"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import BlogIndexPage from "@/components/blog/blog-index/blog-index.component";

export default function Page() {
  return <Auth component={<BlogIndexPage />} type={AUTH.PUBLIC} />;
}
