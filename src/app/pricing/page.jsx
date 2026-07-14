import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import PricingPage from "@/components/pricing/pricing.component";
import JsonLd from "@/components/seo/json-ld.component";
import { buildWebPageSchema } from "@/common/constants/seo-schema.constant";
import { SITE_NAME, SITE_URL } from "@/common/constants/site.constant";
import CrawlableContent from "@/components/seo/crawlable-content.component";

export const metadata = {
  title: `Pricing | ${SITE_NAME}`,
  description:
    "CleerCut pricing — free tier with 3 campaigns, Pay-As-You-Go at 9.9% commission, and plans from $399/month.",
  alternates: { canonical: `${SITE_URL}/pricing` },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={buildWebPageSchema({
          name: `${SITE_NAME} Pricing`,
          description:
            "Flexible influencer marketing pricing with a free tier and plans from $399/month.",
          url: `${SITE_URL}/pricing`,
        })}
      />
      <CrawlableContent>
        <h1>CleerCut Pricing</h1>
        <p>Free tier: 3 campaigns, no credit card required.</p>
        <p>Pay-As-You-Go: 9.9% commission per creator payment.</p>
        <p>Starter: $399/month, zero commission up to $5,000/month.</p>
        <p>Growth: $525/month, zero commission up to $10,000/month.</p>
        <p>Enterprise: $699/month, zero commission up to $20,000/month.</p>
      </CrawlableContent>
      <Auth component={<PricingPage />} type={AUTH.PUBLIC} />
    </>
  );
}
