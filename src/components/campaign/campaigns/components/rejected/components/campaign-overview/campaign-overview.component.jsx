import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import useCampaignList from "@/common/hooks/use-campaign-list.hook";

export default function CampaignOverview({ isCompleted = false }) {
  const { options, handleChange } = useCampaignList();

  return (
    <div className="w-1/4 border-r flex flex-col bg-white p-4 gap-4 pb-20">
      <SimpleSelect
        placeHolder={isCompleted ? "Filter completed campaigns" : "Select a campaign"}
        options={options}
        isSearchable={true}
        isMulti={false}
        onChange={handleChange}
      />

      <hr />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Sort By</label>
        <div className="space-y-2">
          {[
            { value: "most-recent", label: "Most Recently Rejected" },
            { value: "highest-rated", label: "Highest Rated" },
            { value: "most-followers", label: "Most Followers" },
          ].map((option) => (
            <label key={option.value} className="flex items-center">
              <input
                type="radio"
                name="sort"
                value={option.value}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
