const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const getDaysUntilDeadline = (deadline) => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const CampaignList = ({ campaigns, selectedCampaign, setSelectedCampaign }) => {
  return (
    <div className="bg-white w-1/5">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Campaigns by Deadline</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {campaigns.map((campaign, index) => {
          const daysLeft = getDaysUntilDeadline(campaign.deadline);
          return (
            <div
              key={campaign.id}
              onClick={() => setSelectedCampaign(index)}
              className={`py-2 px-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedCampaign + 1 === campaign.id
                  ? "bg-gray-100 border-l-4 border-l-primary"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900 truncate">{campaign.title}</h3>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{formatDate(campaign.deadline)}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    daysLeft <= 3
                      ? "bg-red-100 text-red-800"
                      : daysLeft <= 7
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                  }`}
                >
                  {daysLeft}d left
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CampaignList;
