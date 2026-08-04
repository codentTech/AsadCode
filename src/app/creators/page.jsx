import LandingPage from "@/components/landing-page/landing-page.component";
import JsonLd from "@/components/seo/json-ld.component";
import { SOFTWARE_APPLICATION_SCHEMA } from "@/common/constants/seo-schema.constant";
import { SITE_NAME, SITE_URL } from "@/common/constants/site.constant";

const CREATORS_DESCRIPTION =
  "CleerCut for creators — showcase your value, quick-apply to collaborations, and get paid securely with 0% commission. Just the standard 3.2% payment processing fee.";

export const metadata = {
  title: {
    absolute: `For Creators | ${SITE_NAME}`,
  },
  description: CREATORS_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/creators` },
  openGraph: {
    title: `For Creators | ${SITE_NAME}`,
    description: CREATORS_DESCRIPTION,
    url: `${SITE_URL}/creators`,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `For Creators | ${SITE_NAME}`,
    description: CREATORS_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function CreatorsPage() {
  return (
    <>
      <JsonLd data={SOFTWARE_APPLICATION_SCHEMA} />
      <LandingPage isCreatorMode />
    </>
  );
}
