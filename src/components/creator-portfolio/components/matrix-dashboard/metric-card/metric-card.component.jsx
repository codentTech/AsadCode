import React from "react";
import { Info } from "lucide-react";
import { tones, useMetricCard } from "./use-metric-card.hook";

const MetricCard = ({ icon: Icon, metric, tone = "blue" }) => {
  const { showTooltip, onEnter, onLeave, formatValue, getGrowthColor } = useMetricCard();
  const t = tones[tone] || tones.blue;
  const valueColor =
    metric?.type === "growth" ? getGrowthColor(metric?.value) : "text-gray-900";

  return (
    <div
      className={[
        "group relative rounded-xl bg-gray-100",
        "p-2.5 sm:p-3 md:p-4",
        "border border-gray-100 shadow-sm",
        "transition-all hover:shadow-md hover:-translate-y-[1px]",
        "ring-1 ring-transparent hover:" + t.ring,
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${t.badge}`}>
            <Icon className={`h-4 w-4 ${t.icon}`} />
          </span>

          <div className="min-w-0">
            <div className="text-[10px] font-medium text-gray-600 truncate sm:text-[11px] md:text-xs">
              {metric?.label ?? "Metric"}
            </div>
            <div className={`text-sm font-semibold leading-tight sm:text-lg md:text-xl ${valueColor}`}>
              {formatValue(metric?.value, metric?.type)}
            </div>
          </div>
        </div>

        {metric?.tooltip ? (
          <div className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
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

      <div className="mt-2 h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />
    </div>
  );
};

export default MetricCard;
