"use client";

import PropTypes from "prop-types";
import { RefreshCw, TrendingUp } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";

const formatFollowers = (count) => {
  if (typeof count !== "number" || Number.isNaN(count) || count < 0) return "—";
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toLocaleString();
};

const platformDisplayName = (name) => {
  if (!name) return "";
  return name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

function AudienceSnapshot({ connections, summary, onRefresh, isRefreshing }) {
  const totalFollowers = summary?.totalFollowers ?? 0;
  const averageEngagementRate = summary?.averageEngagementRate ?? null;

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Audience Analytics Snapshot</h3>
          <p className="text-sm text-gray-500 mt-1">
            Verified reach pulled directly from your connected social accounts.
          </p>
        </div>
        {onRefresh && (
          <CustomButton
            text={isRefreshing ? "Refreshing..." : "Refresh"}
            className="btn-outline px-4 py-2 text-xs"
            onClick={onRefresh}
            disabled={isRefreshing}
            startIcon={<RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />}
          />
        )}
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border border-indigo-100 bg-indigo-50 rounded-lg p-4">
            <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
              Combined Audience
            </p>
            <p className="text-2xl font-bold text-indigo-900 mt-1">
              {formatFollowers(totalFollowers)}
            </p>
          </div>
          {averageEngagementRate != null && (
            <div className="border border-indigo-100 bg-indigo-50 rounded-lg p-4">
              <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
                Average Engagement Rate
              </p>
              <p className="text-2xl font-bold text-indigo-900 mt-1">{averageEngagementRate}%</p>
            </div>
          )}
        </div>
      </div>

      {connections.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {connections.map((connection) => {
            const syncedLabel = (() => {
              if (!connection.lastSynced) return "recently";
              const date = new Date(connection.lastSynced);
              if (Number.isNaN(date.getTime())) return "recently";
              return date.toLocaleDateString();
            })();

            return (
              <div
                key={connection.id}
                className="border border-gray-200 rounded-lg p-4 bg-indigo-50 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-indigo-900 truncate">
                    {platformDisplayName(connection.name || connection.platform)}
                  </span>
                  <TrendingUp className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="text-2xl font-bold text-indigo-700">
                  {formatFollowers(connection.followers)}
                </div>
                <p className="text-xs text-indigo-600">Last synced {syncedLabel}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="border border-dashed border-gray-200 rounded-lg p-6 text-center bg-gray-50">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">No connections yet</h4>
          <p className="text-sm text-gray-500">
            Connect your brand’s social accounts to unlock analytics and build trust with creators.
          </p>
        </div>
      )}
    </section>
  );
}

AudienceSnapshot.propTypes = {
  connections: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string,
      platform: PropTypes.string,
      followers: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      lastSynced: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.instanceOf(Date),
      ]),
    })
  ),
  summary: PropTypes.shape({
    totalFollowers: PropTypes.number,
    averageEngagementRate: PropTypes.number,
  }),
  onRefresh: PropTypes.func,
  isRefreshing: PropTypes.bool,
};

AudienceSnapshot.defaultProps = {
  connections: [],
  summary: null,
  onRefresh: undefined,
  isRefreshing: false,
};

export default AudienceSnapshot;
