import { SITE_NAME, SITE_URL } from "@/common/constants/site.constant";

export const metadata = {
  title: `Creator Legal Documents | ${SITE_NAME}`,
  description:
    "CleerCut legal documents for creators — creator agreement, privacy policy, escrow terms, and more.",
  alternates: { canonical: `${SITE_URL}/legal/creator` },
};

export default function CreatorLegalIndexLayout({ children }) {
  return children;
}
