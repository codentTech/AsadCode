import { useState } from "react";
import { useCreatorSpendAnalysis } from "../../../../active/brand/components/creator-spend-analysis/use-creator-spend-analysis.hook";

export const useCreatorSpendAnalysisCompleted = ({
  selectedCampaign,
  selectedCreator,
  onCreatorSelect,
  isCompleted = true,
  isMultiCreator = true,
}) => {
  const [open, setOpen] = useState(false);
  const hookData = useCreatorSpendAnalysis(selectedCampaign, isCompleted, isMultiCreator);

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

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
    open,
    handleOpenModal,
    handleCloseModal,
    getPlatformEntries,
    getPerformanceComparison,
  };
};
