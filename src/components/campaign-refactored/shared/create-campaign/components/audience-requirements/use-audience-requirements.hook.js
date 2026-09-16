import { useCallback, useMemo } from "react";
import useGetplatform from "@/common/hooks/use-social-platform.hook";
import { PLATFORM_OPTIONS } from "@/common/constants/options.constant";

export default function useAudienceRequirements({ setValue, watch }) {
  const { getPlatformIcon, getPlatformColor } = useGetplatform();
  const selectedPlatforms = watch?.("required_platforms") || [];

  const platformCards = useMemo(
    () =>
      PLATFORM_OPTIONS.map((platform) => ({
        ...platform,
        icon: getPlatformIcon(platform.value),
        colorClasses: getPlatformColor(platform.value),
        isSelected: selectedPlatforms.includes(platform.value),
      })),
    [getPlatformIcon, getPlatformColor, selectedPlatforms]
  );

  const handlePlatformToggle = useCallback(
    (value) => {
      const current = Array.isArray(selectedPlatforms) ? [...selectedPlatforms] : [];
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      setValue?.("required_platforms", next, { shouldDirty: true, shouldValidate: true });
    },
    [selectedPlatforms, setValue]
  );

  return {
    platformCards,
    handlePlatformToggle,
    getPlatformIcon,
    getPlatformColor,
  };
}
