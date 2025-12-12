import { useEffect } from "react";
import { useCreatorSpendAnalysis } from "../../../../active/brand/components/creator-spend-analysis/use-creator-spend-analysis.hook";

export const useCreatorSpendAnalysisCompleted = ({
  selectedCampaign,
  selectedCreator,
  onCreatorSelect,
  isCompleted = true,
  isMultiCreator = true,
}) => {
  const hookData = useCreatorSpendAnalysis(selectedCampaign, isCompleted, isMultiCreator);

  useEffect(() => {
    if (
      hookData.creatorsSuccess &&
      hookData.creators.length > 0 &&
      !selectedCreator &&
      selectedCampaign
    ) {
      onCreatorSelect(hookData.creators[0]);
    }
  }, [
    hookData.creatorsSuccess,
    hookData.creators,
    selectedCreator,
    selectedCampaign,
    onCreatorSelect,
  ]);

  const getPlatformEntries = (platforms) => {
    if (Array.isArray(platforms)) {
      return platforms.map((p) => [p.name, { followers: p.followers }]);
    }
    return Object.entries(platforms || {});
  };

  const getPerformanceComparison = () => {
    const isAboveAverage = Math.random() > 0.5;
    const difference = Math.floor(Math.random() * 5000) + 100;

    return {
      isAboveAverage,
      difference: hookData.formatFollowers(difference),
      textColor: isAboveAverage ? "text-green-600" : "text-red-600",
    };
  };

  return {
    ...hookData,
    getPlatformEntries,
    getPerformanceComparison,
  };
};
