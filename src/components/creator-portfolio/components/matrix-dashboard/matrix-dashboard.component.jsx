import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  Info,
} from "lucide-react";
import {
  fetchCreatorMetrics,
  selectCreatorMetrics,
  resetMetrics,
} from "@/provider/features/phyllo/phyllo.slice";

const CreatorMetricsDashboard = ({ creatorId }) => {
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector(selectCreatorMetrics);

  // ✅ Hooks MUST be called before any conditional return
  useEffect(() => {
    if (creatorId) dispatch(fetchCreatorMetrics(creatorId));
    return () => dispatch(resetMetrics());
  }, [creatorId, dispatch]);

  // If your API shape is { data: { metrics, metadata } }
  const matrixDashboardData = useMemo(() => data?.data ?? null, [data]);

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

  const { metrics, metadata } = matrixDashboardData;

  const cards = [
    { icon: Eye, metric: metrics?.averageViews, tone: "blue" },
    { icon: Target, metric: metrics?.reachEfficiency, tone: "purple" },
    { icon: TrendingUp, metric: metrics?.engagementRate, tone: "green" },
    { icon: Shield, metric: metrics?.authenticAudience, tone: "indigo" },
    { icon: Activity, metric: metrics?.performanceConsistency, tone: "teal" },
    { icon: Heart, metric: metrics?.engagementDepth, tone: "pink" },
    { icon: ThumbsUp, metric: metrics?.averageLikes, tone: "blue" },
    { icon: MessageCircle, metric: metrics?.averageComments, tone: "orange" },
    { icon: Clock, metric: metrics?.onTimeDelivery, tone: "emerald" },
  ];

  return (
    <div className="space-y-4 bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-primary">Performance Metrics</h2>
          <p className="text-sm text-gray-600 mt-1">
            Based on {metadata?.postsAnalyzed ?? "—"} recent posts •{" "}
            {(metadata?.totalFollowers ?? 0).toLocaleString()} followers
          </p>
        </div>
      </div>

      {/* Compact grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {cards.map((c, idx) => (
          <MetricCard key={idx} icon={c.icon} metric={c.metric} tone={c.tone} />
        ))}
      </div>
    </div>
  );
};

const tones = {
  blue: { ring: "ring-blue-200", icon: "text-blue-600", badge: "bg-blue-100 text-blue-700" },
  purple: {
    ring: "ring-purple-200",
    icon: "text-purple-600",
    badge: "bg-purple-100 text-purple-700",
  },
  green: { ring: "ring-green-200", icon: "text-green-600", badge: "bg-green-100 text-green-700" },
  indigo: {
    ring: "ring-indigo-200",
    icon: "text-indigo-600",
    badge: "bg-indigo-100 text-indigo-700",
  },
  teal: { ring: "ring-teal-200", icon: "text-teal-600", badge: "bg-teal-100 text-teal-700" },
  pink: { ring: "ring-pink-200", icon: "text-pink-600", badge: "bg-pink-100 text-pink-700" },
  orange: {
    ring: "ring-orange-200",
    icon: "text-orange-600",
    badge: "bg-orange-100 text-orange-700",
  },
  emerald: {
    ring: "ring-emerald-200",
    icon: "text-emerald-600",
    badge: "bg-emerald-100 text-emerald-700",
  },
};

const MetricCard = ({ icon: Icon, metric, tone = "blue" }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const t = tones[tone] || tones.blue;

  const formatValue = (value, type) => {
    if (value === null || value === undefined) return "—";
    switch (type) {
      case "percentage":
        return `${Number(value).toFixed(1)}%`;
      case "score":
        return Number(value).toFixed(0);
      case "count":
      case "views":
        return Number(value).toLocaleString();
      default:
        return value;
    }
  };

  return (
    <div
      className={[
        "group relative rounded-xl bg-white",
        "p-3 md:p-4",
        "border border-gray-100 shadow-lg",
        "transition-all hover:shadow-md hover:-translate-y-[1px]",
        "ring-1 ring-transparent hover:" + t.ring,
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0">
          <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${t.badge}`}>
            <Icon className={`h-4 w-4 ${t.icon}`} />
          </span>

          <div className="min-w-0">
            <div className="text-[11px] md:text-xs font-medium text-gray-600 truncate">
              {metric?.label ?? "Metric"}
            </div>
            <div className="text-lg md:text-xl font-semibold text-gray-900 leading-tight">
              {formatValue(metric?.value, metric?.type)}
            </div>
          </div>
        </div>

        {/* Tooltip */}
        {metric?.tooltip ? (
          <div
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Info className="h-4 w-4 text-gray-400 cursor-help mt-1" />
            {showTooltip && (
              <div className="absolute right-0 top-6 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl z-10">
                {metric.tooltip}
                <div className="absolute -top-1 right-2 w-2 h-2 bg-gray-900 rotate-45" />
              </div>
            )}
          </div>
        ) : (
          <span className="h-4 w-4" />
        )}
      </div>

      {/* tiny footer line (subtle) */}
      <div className="mt-2 h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />
    </div>
  );
};

export default CreatorMetricsDashboard;
