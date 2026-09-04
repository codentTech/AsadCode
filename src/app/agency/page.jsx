import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import AgencyPage from "@/components/agency/agency.component";
import JsonLd from "@/components/seo/json-ld.component";
import { buildWebPageSchema } from "@/common/constants/seo-schema.constant";
import { SITE_NAME, SITE_URL } from "@/common/constants/site.constant";
import CrawlableContent from "@/components/seo/crawlable-content.component";

export const metadata = {
  title: "Agency Services",
  description:
    "Full-service creator sourcing, vetting, and campaign management by the CleerCut team — with full dashboard oversight.",
  alternates: { canonical: `${SITE_URL}/agency` },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={buildWebPageSchema({
          name: `${SITE_NAME} Agency Services`,
          description:
            "Managed influencer campaigns with creator sourcing, vetting, and reporting on CleerCut.",
          url: `${SITE_URL}/agency`,
        })}
      />
      <CrawlableContent>
        <h1>CleerCut Agency Services</h1>
        <p>
          We run the campaign. You keep full oversight and control. Full-service creator sourcing,
          vetting, and campaign management on the CleerCut platform.
        </p>
      </CrawlableContent>
      <Auth component={<AgencyPage />} type={AUTH.PUBLIC} />
    </>
  );
}
