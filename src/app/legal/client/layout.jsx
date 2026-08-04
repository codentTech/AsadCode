import { SITE_NAME, SITE_URL } from "@/common/constants/site.constant";

export const metadata = {
  title: `Brand Legal Documents | ${SITE_NAME}`,
  description:
    "CleerCut legal documents for brands — terms of service, privacy policy, escrow terms, and more.",
  alternates: { canonical: `${SITE_URL}/legal/client` },
};

export default function ClientLegalIndexLayout({ children }) {
  return children;
}
