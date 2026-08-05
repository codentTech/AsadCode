import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import { fetchPublishedBlogPosts } from "@/common/utils/blog-server.util";
import BlogIndexPage from "@/components/blog/blog-index/blog-index.component";

export const revalidate = 60;

export default async function Page() {
  const posts = await fetchPublishedBlogPosts();

  return <Auth component={<BlogIndexPage initialPosts={posts} />} type={AUTH.PUBLIC} />;
}
