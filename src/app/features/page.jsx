import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import FeaturesPage from "@/components/features-page/features-page.component";
import JsonLd from "@/components/seo/json-ld.component";
import { buildWebPageSchema } from "@/common/constants/seo-schema.constant";
import { SITE_NAME, SITE_URL } from "@/common/constants/site.constant";
import CrawlableContent from "@/components/seo/crawlable-content.component";

export const metadata = {
  title: "Features",
  description:
    "One platform for creator discovery, contracts, payments, sales tracking, messaging, deadlines, tasks, and reporting.",
  alternates: { canonical: `${SITE_URL}/features` },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={buildWebPageSchema({
          name: `${SITE_NAME} Features`,
          description:
            "Campaign marketplace, creator discovery, manage and track, and pay and report on CleerCut.",
          url: `${SITE_URL}/features`,
        })}
      />
      <CrawlableContent>
        <h1>CleerCut Features</h1>
        <p>
          Campaign Marketplace, Creator Discovery, Manage and Track, and Pay and Report — all in one
          influencer marketing platform.
        </p>
      </CrawlableContent>
      <Auth component={<FeaturesPage />} type={AUTH.PUBLIC} />
    </>
  );
}
