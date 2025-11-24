import React from "react";
import useCampaignHistory from "./use-campaign-history.hook";
import Loader from "@/common/components/loader/loader.component";

const CampaignHistory = ({ campaignId }) => {
  const { history, isLoading, isError } = useCampaignHistory(campaignId);

  return (
    <div className="w-full border rounded-lg p-3 border-gray-200">
      <div className="bg-white mb-4">
        <h3 className="text-sm font-bold text-gray-800 mb-2">Campaign History</h3>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader />
        </div>
      ) : isError ? (
        <div className="text-center py-8">
          <p className="text-xs text-gray-500">Failed to load campaign history</p>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xs text-gray-500">No history available</p>
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((item) => (
            <div
              key={item.id}
              className="rounded-lg p-2 bg-gray-100 border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-200 group"
            >
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-600 rounded-full mt-1.5 flex-shrink-0 group-hover:bg-indigo-700"></div>
                <div className="flex justify-between w-full">
                  <p className="text-xs font-medium text-gray-600 group-hover:text-indigo-900">
                    {item.action}
                  </p>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignHistory;
