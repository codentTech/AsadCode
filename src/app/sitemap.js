import { COMPARISON_ALTERNATIVE_SLUGS, COMPARISON_VS_SLUGS } from "@/common/constants/comparison-pages.constant";
import { SITE_URL } from "@/common/constants/site.constant";
import { LEGAL_DOC_INDEX } from "@/content/legal/legal-docs.config";

const STATIC_ROUTES = [
  "",
  "/about-us",
  "/pricing",
  "/faq",
  "/solution",
  "/legal/creator",
  "/legal/client",
];

export default function sitemap() {
  const now = new Date();

  const staticUrls = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
  }));

  const legalUrls = Object.entries(LEGAL_DOC_INDEX).flatMap(([audience, docs]) =>
    docs.map((doc) => ({
      url: `${SITE_URL}/legal/${audience}/${doc.slug}`,
      lastModified: now,
    }))
  );

  const vsUrls = COMPARISON_VS_SLUGS.map((slug) => ({
    url: `${SITE_URL}/vs/${slug}`,
    lastModified: now,
  }));

  const alternativeUrls = COMPARISON_ALTERNATIVE_SLUGS.map((slug) => ({
    url: `${SITE_URL}/alternatives/${slug}`,
    lastModified: now,
  }));

  return [...staticUrls, ...legalUrls, ...vsUrls, ...alternativeUrls];
}
