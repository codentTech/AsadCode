import { useState, useCallback } from "react";

export const tones = {
  blue: {
    ring: "ring-blue-200",
    icon: "text-blue-600",
    badge: "bg-blue-50 text-blue-700",
  },
  purple: {
    ring: "ring-purple-200",
    icon: "text-purple-600",
    badge: "bg-purple-50 text-purple-700",
  },
  green: {
    ring: "ring-green-200",
    icon: "text-green-600",
    badge: "bg-green-50 text-green-700",
  },
  indigo: {
    ring: "ring-indigo-200",
    icon: "text-indigo-600",
    badge: "bg-indigo-50 text-indigo-700",
  },
  teal: {
    ring: "ring-teal-200",
    icon: "text-teal-600",
    badge: "bg-teal-50 text-teal-700",
  },
  pink: {
    ring: "ring-pink-200",
    icon: "text-pink-600",
    badge: "bg-pink-50 text-pink-700",
  },
  orange: {
    ring: "ring-orange-200",
    icon: "text-orange-600",
    badge: "bg-orange-50 text-orange-700",
  },
  emerald: {
    ring: "ring-emerald-200",
    icon: "text-emerald-600",
    badge: "bg-emerald-50 text-emerald-700",
  },
};

export const useMetricCard = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  const onEnter = useCallback(() => setShowTooltip(true), []);
  const onLeave = useCallback(() => setShowTooltip(false), []);

  const formatValue = useCallback((value, type) => {
    if (value === null || value === undefined) return "—";
    switch (type) {
      case "percentage":
        return `${Number(value).toFixed(1)}%`;
      case "score":
        return Number(value).toFixed(0);
      case "count":
      case "views":
        return Number(value).toLocaleString();
      case "growth": {
        const sign = value > 0 ? "+" : "";
        return `${sign}${Number(value).toFixed(1)}%`;
      }
      case "text":
        return typeof value === "string" ? value : "—";
      default:
        return value;
    }
  }, []);

  const getGrowthColor = useCallback((value) => {
    if (value === null || value === undefined) return "";
    if (value > 3) return "text-green-600";
    if (value >= 0) return "text-orange-500";
    return "text-red-500";
  }, []);

  return { showTooltip, onEnter, onLeave, formatValue, getGrowthColor };
};
