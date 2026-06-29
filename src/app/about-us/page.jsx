import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import AboutUsPage from "@/components/about-us/about-us.component";
import JsonLd from "@/components/seo/json-ld.component";
import { buildWebPageSchema } from "@/common/constants/seo-schema.constant";
import { SITE_NAME, SITE_URL } from "@/common/constants/site.constant";
import CrawlableContent from "@/components/seo/crawlable-content.component";

export const metadata = {
  title: `About Us | ${SITE_NAME}`,
  description:
    "Learn about CleerCut — the all-in-one influencer marketing platform connecting brands and creators with escrow, contracts, and campaign tools.",
  alternates: { canonical: `${SITE_URL}/about-us` },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={buildWebPageSchema({
          name: `About ${SITE_NAME}`,
          description:
            "CleerCut connects brands and creators for streamlined influencer marketing collaborations.",
          url: `${SITE_URL}/about-us`,
        })}
      />
      <CrawlableContent>
        <h1>About CleerCut</h1>
        <p>
          CleerCut is an all-in-one influencer marketing platform for brands and creators. We help
          teams discover verified creators, manage campaigns, automate contracts, and pay securely
          with escrow.
        </p>
      </CrawlableContent>
      <Auth component={<AboutUsPage />} type={AUTH.PUBLIC} />
    </>
  );
}
