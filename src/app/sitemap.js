import { SITE_URL } from "@/common/constants/site.constant";
import { fetchPublishedBlogPosts } from "@/common/utils/blog-server.util";

const STATIC_ROUTES = [
  "",
  "/about-us",
  "/pricing",
  "/faq",
  "/solution",
  "/blog",
  "/legal/creator",
  "/legal/client",
];

export default async function sitemap() {
  const now = new Date();
  const staticUrls = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
  }));

  const posts = await fetchPublishedBlogPosts();
  const blogUrls = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updated_at ? new Date(post.updated_at) : new Date(post.published_at),
  }));

  return [...staticUrls, ...blogUrls];
}
