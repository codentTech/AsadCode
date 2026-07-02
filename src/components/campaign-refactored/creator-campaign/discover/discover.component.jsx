import CustomButton from "@/common/components/custom-button/custom-button.component";
import { Filter, FileText, X } from "lucide-react";
import CampaignFeed from "./components/campaign-feed/campaign-feed.component";
import CampaignFiltersModal from "./components/campaign-filters/campaign-filters-modal/campaign-filters-modal.component";
import CampaignFiltersPanel from "./components/campaign-filters/campaign-filters-panel/campaign-filters-panel.component";
import PitchTemplate from "./components/pitch-template/pitch-template.component";
import useDiscover from "./use-discover.hook";

export default function CreatorDiscover() {
  const {
    filtersOpen,
    setFiltersOpen,
    pitchesOpen,
    setPitchesOpen,
    closeFilters,
    closePitches,
    handleFiltersDone,
    handleClearAllFilters,
    isDesktop,
    campaignFilter,
    campaignFeed,
  } = useDiscover();

  const { filters, setFilters, expandedFilters, toggleFilter, resetFilters, hasActiveFilters } =
    campaignFilter;

  return (
    <div className=" relative flex w-full flex-1 min-h-0 flex-col overflow-hidden bg-white lg:flex-row">
      <div className="flex shrink-0 items-stretch gap-2 border-b border-gray-200 bg-white px-2 py-1.5 sm:px-3 sm:py-2 lg:hidden">
        <CustomButton
          text="Filters"
          className="btn-secondary flex-1"
          startIcon={<Filter size={14} />}
          onClick={() => setFiltersOpen(true)}
        />
        <CustomButton
          text="My pitches"
          className="btn-secondary flex-1"
          startIcon={<FileText size={14} />}
          onClick={() => setPitchesOpen(true)}
        />
      </div>

      <CampaignFeed
        {...campaignFeed}
        onOpenFilters={() => setFiltersOpen(true)}
        hasCampaignFilters={hasActiveFilters()}
        onClearAllFilters={handleClearAllFilters}
      />

      <div className="hidden lg:block lg:w-1/4 min-w-0 shrink-0">
        <PitchTemplate />
      </div>

      <CampaignFiltersModal
        show={filtersOpen && isDesktop}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        setFilters={setFilters}
        expandedFilters={expandedFilters}
        toggleFilter={toggleFilter}
        resetFilters={() => {
          resetFilters();
          campaignFeed.clearCampaignFilters();
        }}
        onDone={handleFiltersDone}
        isLoading={campaignFeed.isLoading}
      />

      <button
        type="button"
        aria-label="Close filters sidebar"
        className={`fixed inset-0 z-30 bg-black/30 transition-opacity duration-300 lg:hidden ${
          filtersOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeFilters}
      />
      <aside
        className={`fixed left-0 top-0 bottom-[calc(env(safe-area-inset-bottom)+3rem)] z-40 flex w-[88%] max-w-sm flex-col border-r border-gray-200 bg-white shadow-xl transition-transform duration-300 ease-out lg:hidden ${
          filtersOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2.5">
          <h3 className="text-sm font-semibold text-gray-900">Campaign filters</h3>
          <button
            type="button"
            aria-label="Close filters"
            className="rounded-md p-1 text-gray-600 transition-colors hover:bg-gray-100"
            onClick={closeFilters}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 min-h-0">
          <CampaignFiltersPanel
            filters={filters}
            setFilters={setFilters}
            expandedFilters={expandedFilters}
            toggleFilter={toggleFilter}
            resetFilters={() => {
              resetFilters();
              campaignFeed.clearCampaignFilters();
            }}
            hasActiveFilters={hasActiveFilters}
          />
        </div>
      </aside>

      <button
        type="button"
        aria-label="Close pitches sidebar"
        className={`fixed inset-0 z-30 bg-black/30 transition-opacity duration-300 lg:hidden ${
          pitchesOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closePitches}
      />
      <aside
        className={`fixed right-0 top-0 bottom-[calc(env(safe-area-inset-bottom)+4rem)] z-40 w-[88%] max-w-sm border-l border-gray-200 bg-white shadow-xl transition-transform duration-300 ease-out lg:hidden ${
          pitchesOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2.5">
          <h3 className="text-sm font-semibold text-gray-900">My pitches</h3>
          <button
            type="button"
            aria-label="Close pitches"
            className="rounded-md p-1 text-gray-600 transition-colors hover:bg-gray-100"
            onClick={closePitches}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="h-[calc(100%-3rem)] overflow-y-auto">
          <PitchTemplate />
        </div>
      </aside>
    </div>
  );
}
