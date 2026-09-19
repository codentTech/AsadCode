import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { groupLegalParagraphs } from "@/common/utils/legal-content.utils";
import {
  getLegalAudienceDescription,
  getLegalAudienceLabel,
} from "@/common/utils/legal.utils";
import { isValidLegalDocSlug } from "@/content/legal/legal-docs.config";
import { loadLegalDocument } from "@/content/legal/legal-docs.loader";

export default function useLegalDocument({ audience, doc }) {
  const router = useRouter();
  const [document, setDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const slugIsKnown = useMemo(
    () => isValidLegalDocSlug(audience, doc),
    [audience, doc]
  );

  useEffect(() => {
    if (!slugIsKnown) {
      setDocument(null);
      setIsLoading(false);
      return undefined;
    }

    let cancelled = false;
    setDocument(null);
    setIsLoading(true);

    loadLegalDocument(audience, doc).then(
      (result) => {
        if (cancelled) return;
        setDocument(result);
        setIsLoading(false);
      },
      () => {
        if (cancelled) return;
        setDocument(null);
        setIsLoading(false);
      }
    );

    return () => {
      cancelled = true;
    };
  }, [audience, doc, slugIsKnown]);

  const isValid = slugIsKnown && (isLoading || Boolean(document));

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
    if (!isLoading && !isValid) {
      router.replace("/");
    }
  }, [isLoading, isValid, router]);

  return {
    document,
    formattedSections,
    isLoading,
    isValid,
    backHref: `/legal/${audience}`,
    audienceLabel: getLegalAudienceLabel(audience),
    audienceDescription: getLegalAudienceDescription(audience),
  };
}
