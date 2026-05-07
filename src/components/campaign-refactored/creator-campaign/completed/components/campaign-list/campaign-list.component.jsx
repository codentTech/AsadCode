import { formatDateOrNA } from "@/common/utils/date.utils";

const CompletedCampaignList = ({ campaigns, selectedCampaign, onSelect }) => {
  return (
    <div className="flex w-full flex-col border-r border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-3 sm:p-4">
        <h2 className="text-sm font-semibold text-gray-900 sm:text-lg md:text-xl">Completed Campaigns</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            onClick={() => onSelect(campaign)}
            className={`cursor-pointer border-b border-gray-100 p-3 hover:bg-gray-50 sm:p-4 ${
              selectedCampaign?.id === campaign.id ? "bg-gray-100 border-l-4 border-l-primary" : ""
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg border border-gray-200 flex-shrink-0">
                <img
                  src={campaign?.brand?.logo}
                  alt="Brand Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="truncate text-sm font-semibold text-gray-900">{campaign.title}</h3>
                <div className="mt-1">
                  <p className="text-[10px] font-semibold text-gray-600 sm:text-xs">{campaign.brand.name}</p>
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px] text-gray-500 sm:text-xs">
                  <span>Start: {formatDateOrNA(campaign.startDate)}</span>
                  <span>Deadline: {formatDateOrNA(campaign.deadline)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletedCampaignList;
