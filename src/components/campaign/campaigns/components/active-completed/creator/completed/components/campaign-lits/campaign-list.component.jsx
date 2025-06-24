import CustomInput from "@/common/components/custom-input/custom-input.component";
import SearchIcon from "@/common/icons/search-icon";

const CompletedCampaignList = ({
  campaigns,
  selectedCampaign,
  onSelect,
  searchQuery,
  onSearch,
}) => {
  return (
    <div className="w-1/5 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Completed Campaigns</h2>
        <CustomInput
          type="text"
          name="search"
          placeholder="Search campaign"
          startIcon={<SearchIcon />}
          className="!h-[36px]"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
        />
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
              <img
                src={campaign.brand.logo}
                alt={campaign.brand.name}
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 text-sm truncate">{campaign.title}</h3>
                <p className="text-xs text-gray-600 mt-1">{campaign.brand.name}</p>
                <span className="text-xs text-gray-500">
                  Completed {new Date(campaign.completedDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletedCampaignList;
