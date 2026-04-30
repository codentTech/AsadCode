import CustomButton from "@/common/components/custom-button/custom-button.component";
import { Filter, FileText, X } from "lucide-react";
import CampaignFeed from "./components/campaign-feed/campaign-feed.component";
import CampaignFilters from "./components/campaign-filters/campaign-filters.component";
import PitchTemplate from "./components/pitch-template/pitch-template.component";
import useDiscover from "./use-discover.hook";

export default function CreatorDiscover() {
  const { filtersOpen, setFiltersOpen, pitchesOpen, setPitchesOpen, closeFilters, closePitches } =
    useDiscover();

  return (
    <div className="mx-auto max-w-7xl relative flex w-full flex-1 min-h-0 flex-col overflow-hidden bg-white lg:flex-row">
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

      <div className="hidden lg:flex lg:w-1/4 min-w-0 shrink-0">
        <CampaignFilters />
      </div>

      <CampaignFeed />

      <div className="hidden lg:block lg:w-1/4 min-w-0 shrink-0">
        <PitchTemplate />
      </div>

      <button
        type="button"
        aria-label="Close filters sidebar"
        className={`fixed inset-0 z-30 bg-black/30 transition-opacity duration-300 lg:hidden ${
          filtersOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeFilters}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[88%] max-w-sm border-r border-gray-200 bg-white shadow-xl transition-transform duration-300 ease-out lg:hidden ${
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
        <div className="h-[calc(100%-3rem)] overflow-y-auto">
          <CampaignFilters />
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
        className={`fixed inset-y-0 right-0 z-40 w-[88%] max-w-sm border-l border-gray-200 bg-white shadow-xl transition-transform duration-300 ease-out lg:hidden ${
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
