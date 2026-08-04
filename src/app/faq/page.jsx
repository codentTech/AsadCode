import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import { FAQ_DATA } from "@/common/constants/faq.constant";
import { buildFaqPageSchema } from "@/common/constants/seo-schema.constant";
import { SITE_NAME, SITE_URL } from "@/common/constants/site.constant";
import FAQPage from "@/components/faq/faq.component";
import FaqCrawlableContent from "@/components/seo/crawlable/faq-crawlable-content.component";
import JsonLd from "@/components/seo/json-ld.component";

export const metadata = {
  title: `FAQ | ${SITE_NAME}`,
  description:
    "Frequently asked questions about CleerCut — influencer marketing, escrow payments, contracts, pricing, and creator discovery.",
  alternates: { canonical: `${SITE_URL}/faq` },
};

function buildFaqSchemaFromFullData() {
  const items = FAQ_DATA.flatMap((category) =>
    category.questions.map((qa) => ({
      question: qa.question,
      answer: qa.answer,
    }))
  );
  return buildFaqPageSchema(items);
}

export default function Page() {
  return (
    <>
      <JsonLd data={buildFaqSchemaFromFullData()} />
      <FaqCrawlableContent />
      <Auth component={<FAQPage />} type={AUTH.PUBLIC} />
    </>
  );
}
