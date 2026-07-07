"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import AdminBlog from "@/components/admin/blog/admin-blog.component";

export default function Page() {
  return <Auth component={<AdminBlog />} type={AUTH.SUPER_ADMIN} />;
}
