import { avatar } from "@/common/constants/auth.constant";

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
    <div className="bg-white w-[23%]">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Campaigns by Deadline</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {campaigns.map((campaign) => {
          const daysLeft = getDaysUntilDeadline(campaign.deadline);
          return (
            <div
              key={campaign.id}
              onClick={() => setSelectedCampaign(index)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedCampaign?.id === campaign.id
                  ? "bg-gray-100 border-l-4 border-l-primary"
                  : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <img
                  src={avatar}
                  alt={campaign.brand.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm truncate">{campaign.title}</h3>
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CampaignList;
