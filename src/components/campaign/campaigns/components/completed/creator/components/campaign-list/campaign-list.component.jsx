const CompletedCampaignList = ({ campaigns, selectedCampaign, onSelect }) => {
  return (
    <div className="w-[23%] bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Completed Campaigns</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            onClick={() => onSelect(campaign)}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
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
                <h3 className="font-medium text-gray-900 text-sm truncate">{campaign.title}</h3>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs font-bold text-gray-600">{campaign.brand.name}</p>
                  <span className="text-xs text-gray-500">
                    Completed on{" "}
                    {campaign.completedDate
                      ? new Date(campaign.completedDate).toLocaleDateString()
                      : "N/A"}
                  </span>
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
