import { getDefaultCreatorPlatformFromConnectedList } from "@/common/utils/generic.util";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCreatorMetrics,
  selectCreatorMetrics,
  selectCreatorSocialAccounts,
} from "@/provider/features/phyllo/phyllo.slice";

export const useCreatorMetricsDashboard = (creatorId, selectedPlatform = null) => {
  const dispatch = useDispatch();
  const { data, isLoading, isError } = useSelector(selectCreatorMetrics);
  const socialAccounts = useSelector(selectCreatorSocialAccounts);

  const resolvedPlatform = useMemo(() => {
    if (selectedPlatform) return selectedPlatform;
    if (!socialAccounts.isSuccess || !Array.isArray(socialAccounts.data)) return null;
    return getDefaultCreatorPlatformFromConnectedList(socialAccounts.data);
  }, [selectedPlatform, socialAccounts.isSuccess, socialAccounts.data]);

  useEffect(() => {
    if (creatorId && resolvedPlatform) {
      dispatch(fetchCreatorMetrics({ creatorId, platform: resolvedPlatform }));
    }
  }, [creatorId, resolvedPlatform, dispatch]);

  const matrixDashboardData = useMemo(() => data?.data ?? null, [data]);

  const metrics = matrixDashboardData?.metrics ?? null;
  const metadata = matrixDashboardData?.metadata ?? null;

  const isPlatformPending =
    Boolean(creatorId) &&
    !resolvedPlatform &&
    !socialAccounts.isError &&
    (socialAccounts.isLoading || (!socialAccounts.isSuccess && !socialAccounts.isError));

  const effectiveLoading =
    isPlatformPending || (Boolean(resolvedPlatform) && isLoading && !matrixDashboardData && !isError);

  return {
    isLoading: effectiveLoading,
    matrixDashboardData,
    metrics,
    metadata,
  };
};
