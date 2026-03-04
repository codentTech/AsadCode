import { useCallback } from "react";

export default function useCampaignTitle({ watch, setValue }) {
  const selectedNiches = watch("niches") || [];
  const selectedDeliverables = watch("deliverables") || [];
  const usageRightsValue = watch("usageRights") || "no_usage";
  const usageRightsRequirement = watch("usageRightsRequirement") || "negotiable";
  const exclusivityValue = watch("exclusivityClause") || "none";
  const exclusivityRequirement = watch("exclusivityClauseRequirement") || "negotiable";

  const handleNicheChange = useCallback(
    (niches) => {
      setValue("niches", niches, { shouldDirty: true, shouldValidate: true });
    },
    [setValue]
  );

  const handleDeliverableChange = useCallback(
    (deliverables) => {
      setValue("deliverables", deliverables, { shouldDirty: true, shouldValidate: true });
    },
    [setValue]
  );

  const handleNicheRemove = useCallback(
    (nicheToRemove) => {
      const updated = selectedNiches.filter((niche) => niche !== nicheToRemove);
      setValue("niches", updated, { shouldDirty: true, shouldValidate: true });
    },
    [selectedNiches, setValue]
  );

  return {
    selectedNiches,
    selectedDeliverables,
    usageRightsValue,
    usageRightsRequirement,
    exclusivityValue,
    exclusivityRequirement,
    handleNicheChange,
    handleDeliverableChange,
    handleNicheRemove,
  };
}
