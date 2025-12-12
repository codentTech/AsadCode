import SearchAndSortControls from "./search-and-sort-controls.component";

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{title}</h1>
          {description && <p className="text-gray-600">{description}</p>}
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

