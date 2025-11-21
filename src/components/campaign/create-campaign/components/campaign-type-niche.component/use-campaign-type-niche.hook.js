import { useCallback } from "react";
import { useWatch } from "react-hook-form";

export default function useCampaignTypeNiche({ watch, setValue, control }) {
  const selectedNiches = useWatch({ control, name: "niches" }) || [];
  const selectedDeliverables = useWatch({ control, name: "deliverables" }) || [];
  const usageRightsValue = useWatch({ control, name: "usageRights" }) || "no_usage";
  const usageRightsRequirement =
    useWatch({ control, name: "usageRightsRequirement" }) || "negotiable";
  const exclusivityValue = useWatch({ control, name: "exclusivityClause" }) || "none";
  const exclusivityRequirement =
    useWatch({ control, name: "exclusivityClauseRequirement" }) || "negotiable";

  const handleNicheChange = useCallback(
    (niches) => {
      if (!setValue) return;
      setValue("niches", niches, { shouldDirty: true, shouldValidate: true });
    },
    [setValue]
  );

  const handleDeliverableChange = useCallback(
    (deliverables) => {
      if (!setValue) return;
      setValue("deliverables", deliverables, { shouldDirty: true, shouldValidate: true });
    },
    [setValue]
  );

  const handleNicheRemove = useCallback(
    (nicheToRemove) => {
      const updated = selectedNiches.filter((niche) => niche !== nicheToRemove);
      handleNicheChange(updated);
    },
    [handleNicheChange, selectedNiches]
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
