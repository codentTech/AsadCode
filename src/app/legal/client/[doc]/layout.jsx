import { SITE_NAME, SITE_URL } from "@/common/constants/site.constant";
import { getLegalDocument } from "@/content/legal/legal-docs.config";

function firstParagraph(document) {
  const section = document?.sections?.[0];
  const text = section?.paragraphs?.[0];
  if (!text) return `${document.title} — CleerCut legal document.`;
  return text.length > 155 ? `${text.slice(0, 152)}...` : text;
}

export async function generateMetadata({ params }) {
  const { doc } = await params;
  const document = getLegalDocument("client", doc);

  if (!document) {
    return { title: `Not Found | ${SITE_NAME}` };
  }

  const canonical = `${SITE_URL}/legal/client/${doc}`;
  const description = firstParagraph(document);

  return {
    title: `${document.title} | ${SITE_NAME}`,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${document.title} | ${SITE_NAME}`,
      description,
      url: canonical,
      type: "website",
    },
  };
}

export default function ClientLegalDocLayout({ children }) {
  return children;
}
