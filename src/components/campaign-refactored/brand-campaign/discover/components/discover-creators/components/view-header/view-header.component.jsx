import { ArrowLeft } from "lucide-react";
import SearchAndSortControls from "../controls/search-and-sort-controls.component";
import { capitalizeFirstWord } from "@/common/utils/helper.utils";

const ViewHeader = ({
  title,
  count,
  showBackButton = false,
  showControls = false,
  onBackClick,
  searchKeyword,
  onSearchChange,
  selectedSort,
  onSortChange,
  onFilterClick,
  onNewCampaignClick,
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        {showBackButton && (
          <button
            onClick={onBackClick}
            className="cursor-pointer hover:text-primary transition-colors"
          >
            <ArrowLeft />
          </button>
        )}
        <h3 className="text-xl font-semibold text-gray-900">
          {capitalizeFirstWord(title)}
          {count !== undefined && (
            <span className="text-lg text-gray-600"> ({count} creators)</span>
          )}
        </h3>
      </div>
      {showControls && (
        <SearchAndSortControls
          searchKeyword={searchKeyword}
          onSearchChange={onSearchChange}
          selectedSort={selectedSort}
          onSortChange={onSortChange}
          onFilterClick={onFilterClick}
          onNewCampaignClick={onNewCampaignClick}
        />
      )}
    </div>
  );
};

export default ViewHeader;
