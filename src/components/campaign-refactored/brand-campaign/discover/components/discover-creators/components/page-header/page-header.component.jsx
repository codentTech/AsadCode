import SearchAndSortControls from "../controls/search-and-sort-controls.component";

const PageHeader = ({
  title,
  description,
  showControls = true,
  searchKeyword,
  onSearchChange,
  selectedSort,
  onSortChange,
  onFilterClick,
  onNewCampaignClick,
}) => {
  return (
    <div className="bg-white border-b p-3 rounded-lg">
      <div className="flex flex-col gap-4">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">{title}</h1>
          {description && (
            <p className="text-xs sm:text-sm md:text-base text-gray-600">{description}</p>
          )}
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
    </div>
  );
};

export default PageHeader;
