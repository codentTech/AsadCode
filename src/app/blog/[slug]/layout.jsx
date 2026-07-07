import { buildBlogPostPageMetadata } from "@/common/constants/genaric.constant";
import { fetchPublishedBlogPost } from "@/common/utils/blog-server.util";

export async function generateMetadata({ params }) {
  const post = await fetchPublishedBlogPost(params.slug);
  return buildBlogPostPageMetadata(post);
}

export default function BlogPostLayout({ children }) {
  return children;
}
