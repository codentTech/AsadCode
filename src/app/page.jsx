import LandingPage from "@/components/landing-page/landing-page.component";
import HomeCrawlableContent from "@/components/seo/crawlable/home-crawlable-content.component";
import HomeSeoArticle from "@/components/seo/crawlable/home-seo-article.component";
import JsonLd from "@/components/seo/json-ld.component";
import { SOFTWARE_APPLICATION_SCHEMA } from "@/common/constants/seo-schema.constant";
import { SITE_NAME, SITE_URL } from "@/common/constants/site.constant";

const HOME_DESCRIPTION =
  "CleerCut is an all-in-one influencer marketing platform. Discover verified creators, generate contracts in seconds, protect your budget with escrow, and manage campaigns from outreach to deliverables.";

export const metadata = {
  title: {
    absolute: `${SITE_NAME} — Influencer Marketing Platform`,
  },
  description: HOME_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${SITE_NAME} — Influencer Marketing Platform`,
    description: HOME_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Influencer Marketing Platform`,
    description: HOME_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function Home() {
  return (
    <>
      <JsonLd data={SOFTWARE_APPLICATION_SCHEMA} />
      <noscript>
        <HomeSeoArticle />
      </noscript>
      <HomeCrawlableContent />
      <LandingPage />
    </>
  );
}
