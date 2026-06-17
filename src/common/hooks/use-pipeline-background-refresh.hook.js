import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { refreshBrandPipelineData } from "@/common/utils/pipeline-refresh.util";

const PIPELINE_POLL_MS = 45_000;

export default function usePipelineBackgroundRefresh({
  enabled = true,
  campaignId,
  collaborationType,
  isMultiCreator = true,
  activeFilters = { status: "HIRED", sort: "urgency" },
  applicationsFilters = { sort: "urgency" },
  completedFilters = { status: "COMPLETED", sort: "urgency" },
  includeBoard = false,
  includeActive = false,
  includeApplications = false,
  includeCompleted = false,
  treatContractsAsCompleted = false,
}) {
  const dispatch = useDispatch();
  const optionsRef = useRef({});

  optionsRef.current = {
    campaignId,
    collaborationType,
    isMultiCreator,
    activeFilters,
    applicationsFilters,
    completedFilters,
    includeBoard,
    includeActive,
    includeApplications,
    includeCompleted,
    treatContractsAsCompleted,
    silent: true,
  };

  useEffect(() => {
    if (!enabled || !campaignId) return undefined;

    const poll = () => {
      refreshBrandPipelineData(dispatch, optionsRef.current);
    };

    const intervalId = setInterval(poll, PIPELINE_POLL_MS);
    return () => clearInterval(intervalId);
  }, [
    enabled,
    campaignId,
    collaborationType,
    isMultiCreator,
    includeBoard,
    includeActive,
    includeApplications,
    includeCompleted,
    treatContractsAsCompleted,
    dispatch,
  ]);
}
