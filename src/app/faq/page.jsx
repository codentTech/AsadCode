import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import FAQPage from "@/components/faq/faq.component";
import FaqCrawlableContent from "@/components/seo/crawlable/faq-crawlable-content.component";
import JsonLd from "@/components/seo/json-ld.component";
import { buildFaqPageSchema } from "@/common/constants/seo-schema.constant";
import { SITE_NAME, SITE_URL } from "@/common/constants/site.constant";

export const metadata = {
  title: `FAQ | ${SITE_NAME}`,
  description:
    "Frequently asked questions about CleerCut — influencer marketing, escrow payments, contracts, pricing, and creator discovery.",
  alternates: { canonical: `${SITE_URL}/faq` },
};

export default function Page() {
  return (
    <>
      <JsonLd data={buildFaqPageSchema()} />
      <FaqCrawlableContent />
      <Auth component={<FAQPage />} type={AUTH.PUBLIC} />
    </>
  );
}
