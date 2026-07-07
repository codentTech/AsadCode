import { SITE_NAME, SITE_URL } from "./site.constant";

export const PLATFORM_PRIORITY = ["instagram", "tiktok", "youtube"];
export const KNOWN_PLATFORMS = ["instagram", "tiktok", "youtube"];

export const DEFAULT_PAGE_LIMIT = 10;

export const MD_BREAKPOINT = 768;
export const IP_LOOKUP_ENDPOINT = "https://ip-api.com/json/?fields=status,countryCode";
export const DEFAULT_RESULTS_LIMIT = 12;

export const BLOG_REVALIDATE_SECONDS = 60;

export const BLOG_INDEX_PAGE_METADATA = {
  title: "Blog",
  description:
    "CleerCut blog — influencer marketing strategy, creator economy insights, and platform updates.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: `Blog | ${SITE_NAME}`,
    description:
      "Insights on influencer marketing, the creator economy, and platform updates.",
    url: `${SITE_URL}/blog`,
    type: "website",
  },
};

export function buildBlogPostPageMetadata(post) {
  if (!post) {
    return { title: `Not Found | ${SITE_NAME}` };
  }

  const canonical = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: `${post.title} | CleerCut Blog`,
    description: post.excerpt,
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: canonical,
      type: "article",
      images: [{ url: post.cover_image_url }],
      publishedTime: post.published_at,
      modifiedTime: post.updated_at || post.published_at,
    },
  };
}
