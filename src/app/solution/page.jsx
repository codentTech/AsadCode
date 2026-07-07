import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import SolutionPage from "@/components/solution/solution.component";
import JsonLd from "@/components/seo/json-ld.component";
import { buildWebPageSchema } from "@/common/constants/seo-schema.constant";
import { SITE_NAME, SITE_URL } from "@/common/constants/site.constant";
import CrawlableContent from "@/components/seo/crawlable-content.component";

export const metadata = {
  title: `Solutions | ${SITE_NAME}`,
  description:
    "CleerCut solutions for brands and creators — discovery, contracts, escrow payments, and campaign management.",
  alternates: { canonical: `${SITE_URL}/solution` },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={buildWebPageSchema({
          name: `${SITE_NAME} Solutions`,
          description:
            "Influencer marketing solutions for brands and creators on CleerCut.",
          url: `${SITE_URL}/solution`,
        })}
      />
      <CrawlableContent>
        <h1>CleerCut Solutions</h1>
        <p>
          CleerCut provides influencer marketing solutions including creator discovery, campaign
          management, auto-generated contracts, escrow payments, and a smart inbox for brands and
          creators.
        </p>
      </CrawlableContent>
      <Auth component={<SolutionPage />} type={AUTH.PUBLIC} />
    </>
  );
}
