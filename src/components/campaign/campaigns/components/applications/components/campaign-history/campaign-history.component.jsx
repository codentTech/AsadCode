import React from "react";

const CampaignHistory = () => {
  const history = [
    { time: "2 hours ago", action: "Campaign started" },
    { time: "1 day ago", action: "Budget updated to $5,000" },
    { time: "3 days ago", action: "Targeting settings changed" },
    { time: "5 days ago", action: "New ad creative added" },
    { time: "1 week ago", action: "Campaign created" },
    { time: "2 weeks ago", action: "Audience analysis completed" },
    { time: "3 weeks ago", action: "Initial planning started" },
  ];

  return (
    <div className="w-full border-gray-200">
      <div className="bg-white mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Campaign History</h3>
        <p className="text-xs text-gray-600">Recent activity</p>
      </div>

      <div className="space-y-2">
        {history.map((item, index) => (
          <div
            key={index}
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
    </div>
  );
};

export default CampaignHistory;
