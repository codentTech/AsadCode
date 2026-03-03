import React, { useMemo } from "react";
import {
  Eye,
  Target,
  TrendingUp,
  Shield,
  Activity,
  Heart,
  ThumbsUp,
  MessageCircle,
  Clock,
} from "lucide-react";

import MetricCard from "./metric-card/metric-card.component";
import { useCreatorMetricsDashboard } from "./use-matrix-dashboard.hook";

const CreatorMetricsDashboard = ({ creatorId, selectedPlatform = null }) => {
  const { isLoading, matrixDashboardData, metrics, metadata } =
    useCreatorMetricsDashboard(creatorId, selectedPlatform);

  const cards = useMemo(
    () => [
      { icon: Eye, metric: metrics?.averageViews, tone: "blue" },
      { icon: Target, metric: metrics?.reachEfficiency, tone: "purple" },
      { icon: TrendingUp, metric: metrics?.engagementRate, tone: "green" },
      { icon: Shield, metric: metrics?.authenticAudience, tone: "indigo" },
      { icon: Activity, metric: metrics?.performanceConsistency, tone: "teal" },
      { icon: Heart, metric: metrics?.engagementDepth, tone: "pink" },
      { icon: ThumbsUp, metric: metrics?.averageLikes, tone: "blue" },
      { icon: MessageCircle, metric: metrics?.averageComments, tone: "orange" },
      { icon: Clock, metric: metrics?.onTimeDelivery, tone: "emerald" },
    ],
    [metrics]
  );

  if (isLoading) {
    return (
      <section className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm animate-pulse">
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
    <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-primary">Performance Metrics</h2>
          <p className="text-xs md:text-sm text-gray-600 mt-1 mb-3">
            Based on {metadata?.postsAnalyzed ?? "—"} recent posts •{" "}
            {(metadata?.totalFollowers ?? 0).toLocaleString()} followers
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {cards.map((c, idx) => (
          <MetricCard key={idx} icon={c.icon} metric={c.metric} tone={c.tone} />
        ))}
      </div>
    </section>
  );
};

export default CreatorMetricsDashboard;
