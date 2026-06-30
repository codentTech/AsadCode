import { useMemo } from "react";
import { getLegalDocGroups } from "@/content/legal/legal-docs.config";
import { slugifyLegalGroup } from "@/common/utils/legal-content.utils";
import {
  getLegalAudienceDescription,
  getLegalAudienceLabel,
} from "@/common/utils/legal.utils";

export default function useLegalIndex({ audience }) {
  return useMemo(() => {
    const groups = getLegalDocGroups(audience).map((group) => ({
      ...group,
      id: slugifyLegalGroup(group.title),
    }));
    const documentCount = groups.reduce((total, group) => total + group.documents.length, 0);

    return {
      groups,
      documentCount,
      audienceLabel: getLegalAudienceLabel(audience),
      audienceDescription: getLegalAudienceDescription(audience),
      isValid: documentCount > 0,
    };
  }, [audience]);
}
