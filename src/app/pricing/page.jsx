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
    "CleerCut pricing that scales with you — Pay-As-You-Go at $0, Unlimited Gifting at $99/mo, and zero-commission plans from $399/month.",
  alternates: { canonical: `${SITE_URL}/pricing` },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={buildWebPageSchema({
          name: `${SITE_NAME} Pricing`,
          description:
            "Flexible influencer marketing pricing with Pay-As-You-Go, Unlimited Gifting, and plans from $399/month.",
          url: `${SITE_URL}/pricing`,
        })}
      />
      <CrawlableContent>
        <h1>CleerCut Pricing</h1>
        <p>30-day trial: unlimited commission-free campaigns, no credit card required.</p>
        <p>Pay-As-You-Go: $0/month with 9.9% commission on creator payments.</p>
        <p>Unlimited Gifting Add-On: $99/month for unlimited gifted collaborations.</p>
        <p>Starter: $399/month, zero commission up to $5,000/month.</p>
        <p>Growth: $699/month, zero commission up to $12,500/month.</p>
        <p>Pro: $999/month, zero commission up to $30,000/month.</p>
        <p>Enterprise: custom pricing for spend above $30,000/month.</p>
      </CrawlableContent>
      <Auth component={<PricingPage />} type={AUTH.PUBLIC} />
    </>
  );
}
