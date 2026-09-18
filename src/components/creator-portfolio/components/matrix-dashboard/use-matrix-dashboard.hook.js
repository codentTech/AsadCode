import { getDefaultCreatorPlatformFromConnectedList } from "@/common/utils/generic.util";
import {
  Activity,
  BarChart2,
  ChartLine,
  CirclePlay,
  Eye,
  Gauge,
  MessageCircle,
  Rocket,
  Shield,
  Target,
  ThumbsUp,
  TrendingUp,
} from "lucide-react";
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

  const matrixDashboardData = useMemo(() => data?.data ?? data ?? null, [data]);

  const metrics = matrixDashboardData?.metrics ?? null;
  const metadata = matrixDashboardData?.metadata ?? null;

  const contentLabel = metadata?.contentUnit === "reels" ? "Reels" : "posts";
  const hasContentStrengthMetrics = Boolean(
    metrics &&
      ("averagePercentWatched" in metrics ||
        "viralPotential" in metrics ||
        "performanceMomentum" in metrics)
  );

  const cards = useMemo(() => {
    const bind = (fallback, live) => ({
      ...fallback,
      ...live,
      label: fallback.label,
      tooltip: live?.tooltip || fallback.tooltip,
      type: fallback.type,
      value: live?.value ?? null,
    });

    return [
      {
        icon: Eye,
        tone: "blue",
        metric: bind(
          {
            label: "Typical Views",
            tooltip: "Typical number of views this creator gets per post.",
            type: "views",
          },
          metrics?.averageViews
        ),
      },
      {
        icon: Gauge,
        tone: "purple",
        metric: bind(
          {
            label: "Expected Performance Range",
            tooltip: "The view range most posts typically fall within.",
            type: "text",
          },
          metrics?.expectedPerformanceRange
        ),
      },
      {
        icon: Activity,
        tone: "teal",
        metric: bind(
          {
            label: "Performance Consistency",
            tooltip: "How often views fall within or above the expected performance range.",
            type: "score",
          },
          metrics?.performanceConsistency
        ),
      },
      {
        icon: CirclePlay,
        tone: "pink",
        metric: bind(
          {
            label: "Average % Watched",
            tooltip: "The average percentage of each video watched across recent posts.",
            type: "percentage",
          },
          metrics?.averagePercentWatched
        ),
      },
      {
        icon: Rocket,
        tone: "orange",
        metric: bind(
          {
            label: "Viral Potential",
            tooltip: "How strongly recent videos demonstrate the ability to break out.",
            type: "score",
          },
          metrics?.viralPotential
        ),
      },
      {
        icon: ChartLine,
        tone: "emerald",
        metric: bind(
          {
            label: "Performance Momentum",
            tooltip: "How recent video views are trending compared with previous posts.",
            type: "growth",
          },
          metrics?.performanceMomentum
        ),
      },
      {
        icon: TrendingUp,
        tone: "green",
        metric: bind(
          {
            label: "Engagement Rate",
            tooltip: "Interactions such as likes and comments relative to views.",
            type: "percentage",
          },
          metrics?.engagementRate
        ),
      },
      {
        icon: Shield,
        tone: "indigo",
        metric: bind(
          {
            label: "Authentic Audience",
            tooltip: "Detection of real followers vs suspicious in their audience.",
            type: "score",
          },
          metrics?.authenticAudience
        ),
      },
      {
        icon: Target,
        tone: "purple",
        metric: {
          ...bind(
            {
              label: "Reach Efficiency",
              tooltip: "How many of this creator's followers typically see their content.",
              type: "percentage",
            },
            metrics?.reachEfficiency
          ),
          label: metrics?.reachEfficiency?.label || "Reach Efficiency",
        },
      },
      {
        icon: ThumbsUp,
        tone: "blue",
        metric: bind(
          {
            label: "Typical Likes",
            tooltip: "Typical number of likes per post.",
            type: "count",
          },
          metrics?.averageLikes
        ),
      },
      {
        icon: MessageCircle,
        tone: "orange",
        metric: bind(
          {
            label: "Typical Comments",
            tooltip: "Typical number of comments per post.",
            type: "count",
          },
          metrics?.averageComments
        ),
      },
      {
        icon: BarChart2,
        tone: "green",
        metric: bind(
          {
            label: "Growth Rate (Last 30 Days)",
            tooltip: "Follower growth over the last 30 days.",
            type: "growth",
          },
          metrics?.growthRate30d
        ),
      },
    ];
  }, [metrics]);

  const isPlatformPending =
    Boolean(creatorId) &&
    !resolvedPlatform &&
    !socialAccounts.isError &&
    (socialAccounts.isLoading || (!socialAccounts.isSuccess && !socialAccounts.isError));

  const effectiveLoading =
    isPlatformPending ||
    (Boolean(resolvedPlatform) &&
      isLoading &&
      !isError &&
      (!matrixDashboardData || (Boolean(metrics) && !hasContentStrengthMetrics)));

  return {
    isLoading: effectiveLoading,
    matrixDashboardData,
    metrics,
    metadata,
    cards,
    contentLabel,
  };
};
