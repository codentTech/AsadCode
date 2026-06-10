import { RotateCcw } from "lucide-react";
import CampaignFiltersForm from "../campaign-filters-form/campaign-filters-form.component";

function CampaignFiltersPanel({
  filters,
  setFilters,
  expandedFilters,
  toggleFilter,
  resetFilters,
  hasActiveFilters,
}) {
  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-white">
      <div className="flex items-center justify-end border-b border-gray-200 bg-gray-50 px-3 py-2 sm:px-4">
        <button
          type="button"
          onClick={resetFilters}
          disabled={!hasActiveFilters()}
          className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-500 transition-colors hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 sm:text-xs"
        >
          <RotateCcw size={12} />
          Clear all
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <CampaignFiltersForm
          filters={filters}
          setFilters={setFilters}
          expandedFilters={expandedFilters}
          toggleFilter={toggleFilter}
        />
      </div>
    </div>
  );
}

export default CampaignFiltersPanel;
