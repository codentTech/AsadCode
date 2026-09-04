import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import PricingPage from "@/components/pricing/pricing.component";
import JsonLd from "@/components/seo/json-ld.component";
import { buildWebPageSchema } from "@/common/constants/seo-schema.constant";
import { SITE_NAME, SITE_URL } from "@/common/constants/site.constant";
import CrawlableContent from "@/components/seo/crawlable-content.component";

export const metadata = {
  title: "Pricing",
  description:
    "CleerCut pricing — Pay-As-You-Go at $0, Unlimited Gifting at $99/mo, and zero-commission plans with monthly, quarterly, and yearly billing.",
  alternates: { canonical: `${SITE_URL}/pricing` },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={buildWebPageSchema({
          name: `${SITE_NAME} Pricing`,
          description:
            "Flexible influencer marketing pricing with Pay-As-You-Go, Unlimited Gifting, and zero-commission plans.",
          url: `${SITE_URL}/pricing`,
        })}
      />
      <CrawlableContent>
        <h1>CleerCut Pricing</h1>
        <p>30-day trial: unlimited commission-free campaigns, no credit card required.</p>
        <p>Pay-As-You-Go: $0/month with 9.9% commission on creator payments.</p>
        <p>Unlimited Gifting Add-On: $99/month for unlimited gifted collaborations.</p>
        <p>
          Starter: $399/mo billed monthly, $359/mo quarterly, or $319/mo yearly. Zero commission on
          creator payments up to $5,000/month.
        </p>
        <p>
          Growth: $699/mo billed monthly, $629/mo quarterly, or $559/mo yearly. Zero commission on
          creator payments up to $12,500/month.
        </p>
        <p>
          Pro: $999/mo billed monthly, $899/mo quarterly, or $799/mo yearly. Zero commission on
          creator payments up to $30,000/month.
        </p>
        <p>Enterprise: custom pricing for spend above $30,000/month.</p>
        <p>
          The pricing page defaults to quarterly billing. Switch to Monthly or Yearly to see those
          rates.
        </p>
      </CrawlableContent>
      <Auth component={<PricingPage />} type={AUTH.PUBLIC} />
    </>
  );
}
