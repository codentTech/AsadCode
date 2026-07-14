import { buildBlogPostPageMetadata } from "@/common/constants/genaric.constant";
import { fetchPublishedBlogPost } from "@/common/utils/blog-server.util";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await fetchPublishedBlogPost(slug);
  return buildBlogPostPageMetadata(post);
}

export default function BlogPostLayout({ children }) {
  return children;
}
