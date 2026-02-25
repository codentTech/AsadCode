import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCreatorMetrics,
  selectCreatorMetrics,
  resetMetrics,
} from "@/provider/features/phyllo/phyllo.slice";

export const useCreatorMetricsDashboard = (creatorId) => {
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector(selectCreatorMetrics);

  useEffect(() => {
    if (creatorId) dispatch(fetchCreatorMetrics(creatorId));
    return () => dispatch(resetMetrics());
  }, [creatorId, dispatch]);

  const matrixDashboardData = useMemo(() => data?.data ?? null, [data]);

  const metrics = matrixDashboardData?.metrics ?? null;
  const metadata = matrixDashboardData?.metadata ?? null;

  return { isLoading, matrixDashboardData, metrics, metadata };
};
