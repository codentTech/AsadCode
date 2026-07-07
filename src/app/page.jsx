import LandingPage from "@/components/landing-page/landing-page.component";
import HomeCrawlableContent from "@/components/seo/crawlable/home-crawlable-content.component";
import JsonLd from "@/components/seo/json-ld.component";
import { SOFTWARE_APPLICATION_SCHEMA } from "@/common/constants/seo-schema.constant";
import { SITE_NAME, SITE_URL } from "@/common/constants/site.constant";

export const metadata = {
  title: {
    absolute: `${SITE_NAME} — Influencer Marketing Platform`,
  },
  description:
    "Discover verified creators, generate contracts in seconds, protect your budget with escrow, and manage campaigns from outreach to deliverables.",
  alternates: { canonical: SITE_URL },
};

export default function Home() {
  return (
    <>
      <JsonLd data={SOFTWARE_APPLICATION_SCHEMA} />
      <HomeCrawlableContent />
      <LandingPage />
    </>
  );
}
