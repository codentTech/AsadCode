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
  const { data, isLoading } = useSelector(selectCreatorMetrics);
  const socialAccounts = useSelector(selectCreatorSocialAccounts);

  const defaultPlatformWillApply = useMemo(() => {
    if (!socialAccounts.isSuccess || !Array.isArray(socialAccounts.data)) return false;
    return getDefaultCreatorPlatformFromConnectedList(socialAccounts.data) != null;
  }, [socialAccounts.isSuccess, socialAccounts.data]);

  const waitingForDefaultPlatform =
    Boolean(creatorId) &&
    !selectedPlatform &&
    !socialAccounts.isError &&
    (socialAccounts.isLoading ||
      (!socialAccounts.isSuccess && !socialAccounts.isError) ||
      defaultPlatformWillApply);

  useEffect(() => {
    if (creatorId && selectedPlatform) {
      dispatch(fetchCreatorMetrics({ creatorId, platform: selectedPlatform }));
    }
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
