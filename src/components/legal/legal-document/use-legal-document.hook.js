import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { groupLegalParagraphs } from "@/common/utils/legal-content.utils";
import {
  getLegalAudienceDescription,
  getLegalAudienceLabel,
} from "@/common/utils/legal.utils";
import { getLegalDocument } from "@/content/legal/legal-docs.config";

export default function useLegalDocument({ audience, doc }) {
  const router = useRouter();

  const document = useMemo(() => getLegalDocument(audience, doc), [audience, doc]);
  const isValid = Boolean(document);

  const formattedSections = useMemo(
    () =>
      document?.sections.map((section, index) => ({
        id: `section-${index}`,
        heading: section.heading,
        blocks: groupLegalParagraphs(section.paragraphs),
      })) ?? [],
    [document]
  );

  useEffect(() => {
    if (!isValid) {
      router.replace("/");
    }
  }, [isValid, router]);

  return {
    document,
    formattedSections,
    isValid,
    backHref: `/legal/${audience}`,
    audienceLabel: getLegalAudienceLabel(audience),
    audienceDescription: getLegalAudienceDescription(audience),
  };
}
