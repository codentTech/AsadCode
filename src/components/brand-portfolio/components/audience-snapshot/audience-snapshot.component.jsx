"use client";

import PropTypes from "prop-types";
import { RefreshCw, TrendingUp } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import { formatFollowers } from "@/common/utils/format.utils";
import { platformDisplayName } from "@/common/utils/helper.utils";

function AudienceSnapshot({ connections, summary, onRefresh, isRefreshing }) {
  const totalFollowers = summary?.totalFollowers ?? 0;
  const averageEngagementRate = summary?.averageEngagementRate ?? null;

  return (
    <section className="rounded-lg bg-white p-3 shadow-md sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 sm:text-lg md:text-xl">Audience Analytics Snapshot</h3>
          <p className="mt-1 text-[10px] leading-snug text-gray-500 sm:text-xs md:text-sm">
            Verified reach pulled directly from your connected social accounts.
          </p>
        </div>
        {onRefresh && (
          <CustomButton
            text={isRefreshing ? "Refreshing..." : "Refresh"}
            className="btn-outline"
            onClick={onRefresh}
            disabled={isRefreshing}
            startIcon={<RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />}
          />
        )}
      </div>

      <div className="mb-4 sm:mb-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-3 sm:p-4">
            <p className="text-[10px] font-medium uppercase tracking-wide text-indigo-600 sm:text-xs">
              Combined Audience
            </p>
            <p className="mt-1 text-sm font-bold text-indigo-900 sm:text-2xl">
              {formatFollowers(totalFollowers)}
            </p>
          </div>
          {averageEngagementRate != null && (
            <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-3 sm:p-4">
              <p className="text-[10px] font-medium uppercase tracking-wide text-indigo-600 sm:text-xs">
                Average Engagement Rate
              </p>
              <p className="mt-1 text-sm font-bold text-indigo-900 sm:text-2xl">{averageEngagementRate}%</p>
            </div>
          )}
        </div>
      </div>

      {connections.length ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
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
                className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-indigo-50 p-3 sm:p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="truncate text-xs font-semibold text-indigo-900 sm:text-sm">
                    {platformDisplayName(connection.name || connection.platform)}
                  </span>
                  <TrendingUp className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="text-sm font-bold text-indigo-700 sm:text-2xl">
                  {formatFollowers(connection.followers)}
                </div>
                <p className="text-[10px] text-indigo-600 sm:text-xs">Last synced {syncedLabel}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-center sm:p-6">
          <h4 className="mb-2 text-xs font-semibold text-gray-800 sm:text-sm">No connections yet</h4>
          <p className="text-xs text-gray-500 sm:text-sm">
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
