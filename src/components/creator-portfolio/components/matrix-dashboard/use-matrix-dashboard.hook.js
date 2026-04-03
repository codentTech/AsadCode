import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCreatorMetrics,
  selectCreatorMetrics,
  selectCreatorSocialAccounts,
  resetMetrics,
} from "@/provider/features/phyllo/phyllo.slice";

export const useCreatorMetricsDashboard = (creatorId, selectedPlatform = null) => {
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector(selectCreatorMetrics);
  const socialAccounts = useSelector(selectCreatorSocialAccounts);

  const socialResolved =
    socialAccounts.isSuccess && Array.isArray(socialAccounts.data);

  const waitingForDefaultPlatform =
    Boolean(creatorId) &&
    !selectedPlatform &&
    !socialAccounts.isError &&
    (socialAccounts.isLoading ||
      (!socialAccounts.isSuccess && !socialAccounts.isError));

  useEffect(() => {
    if (creatorId && selectedPlatform) {
      dispatch(fetchCreatorMetrics({ creatorId, platform: selectedPlatform }));
    }
    return () => dispatch(resetMetrics());
  }, [creatorId, selectedPlatform, dispatch]);

  const matrixDashboardData = useMemo(() => data?.data ?? null, [data]);

  const metrics = matrixDashboardData?.metrics ?? null;
  const metadata = matrixDashboardData?.metadata ?? null;

  const effectiveLoading = isLoading || waitingForDefaultPlatform;

  return {
    isLoading: effectiveLoading,
    matrixDashboardData,
    metrics,
    metadata,
  };
};
