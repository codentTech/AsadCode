import React, { useMemo } from "react";
import {
  Eye,
  Gauge,
  Target,
  TrendingUp,
  Shield,
  Activity,
  BarChart2,
  ThumbsUp,
  MessageCircle,
} from "lucide-react";

import MetricCard from "./metric-card/metric-card.component";
import { useCreatorMetricsDashboard } from "./use-matrix-dashboard.hook";

const CreatorMetricsDashboard = ({ creatorId, selectedPlatform = null }) => {
  const { isLoading, matrixDashboardData, metrics, metadata } =
    useCreatorMetricsDashboard(creatorId, selectedPlatform);

  const cards = useMemo(
    () => [
      { icon: Eye, metric: metrics?.averageViews, tone: "blue" },
      { icon: Gauge, metric: metrics?.expectedPerformanceRange, tone: "purple" },
      { icon: Activity, metric: metrics?.performanceConsistency, tone: "teal" },
      { icon: TrendingUp, metric: metrics?.engagementRate, tone: "green" },
      { icon: Shield, metric: metrics?.authenticAudience, tone: "indigo" },
      { icon: Target, metric: metrics?.reachEfficiency, tone: "purple" },
      { icon: ThumbsUp, metric: metrics?.averageLikes, tone: "blue" },
      { icon: MessageCircle, metric: metrics?.averageComments, tone: "orange" },
      { icon: BarChart2, metric: metrics?.growthRate30d, tone: "green" },
    ],
    [metrics]
  );

  if (isLoading) {
    return (
      <section className="animate-pulse rounded-xl border border-gray-100 bg-white p-3 shadow-sm sm:p-4">
        <div className="h-8 w-40 bg-gray-200 rounded mb-3" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  if (!matrixDashboardData) return null;

  return (
    <section className="rounded-2xl bg-white p-3 shadow-lg sm:p-6 md:p-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-primary sm:text-lg md:text-xl">Performance Metrics</h2>
          <p className="mb-3 mt-1 text-[10px] text-gray-600 sm:text-xs md:text-sm">
            Based on {metadata?.postsAnalyzed ?? "—"} recent posts •{" "}
            {(metadata?.totalFollowers ?? 0).toLocaleString()} followers
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 md:grid-cols-3">
        {cards.map((c, idx) => (
            <MetricCard key={idx} icon={c.icon} metric={c.metric} tone={c.tone} />
          ))}
      </div>
    </section>
  );
};

export default CreatorMetricsDashboard;
