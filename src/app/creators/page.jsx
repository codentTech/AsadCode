import LandingPage from "@/components/landing-page/landing-page.component";
import { SITE_NAME, SITE_URL } from "@/common/constants/site.constant";

const CREATORS_DESCRIPTION =
  "CleerCut for creators — showcase your portfolio, quick-apply to brand campaigns, and get paid securely with escrow. 0% commission.";

export const metadata = {
  title: {
    absolute: `${SITE_NAME} for Creators — Land More Brand Collaborations`,
  },
  description: CREATORS_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/creators` },
  openGraph: {
    title: `${SITE_NAME} for Creators — Land More Brand Collaborations`,
    description: CREATORS_DESCRIPTION,
    url: `${SITE_URL}/creators`,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} for Creators — Land More Brand Collaborations`,
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

export default function CreatorsLandingPage() {
  return <LandingPage audience="creator" />;
}
