import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCreatorMetrics,
  selectCreatorMetrics,
  resetMetrics,
} from "@/provider/features/phyllo/phyllo.slice";

export const useCreatorMetricsDashboard = (creatorId, selectedPlatform = null) => {
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector(selectCreatorMetrics);

  useEffect(() => {
    if (creatorId) {
      const payload = selectedPlatform ? { creatorId, platform: selectedPlatform } : creatorId;
      dispatch(fetchCreatorMetrics(payload));
    }
    return () => dispatch(resetMetrics());
  }, [creatorId, selectedPlatform, dispatch]);

  const matrixDashboardData = useMemo(() => data?.data ?? null, [data]);

  const metrics = matrixDashboardData?.metrics ?? null;
  const metadata = matrixDashboardData?.metadata ?? null;

  return { isLoading, matrixDashboardData, metrics, metadata };
};
