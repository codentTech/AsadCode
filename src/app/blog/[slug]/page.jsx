"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import BlogPostPage from "@/components/blog/blog-post/blog-post.component";

export default function Page() {
  return <Auth component={<BlogPostPage />} type={AUTH.PUBLIC} />;
}
