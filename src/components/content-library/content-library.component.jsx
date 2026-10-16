"use client";

import { ListFilter, Search } from "lucide-react";
import HeaderLayout from "@/common/layouts/header.layout";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import { CONTENT_LIBRARY_SORT_OPTIONS } from "@/common/constants/content-library.constant";
import useContentLibrary from "./use-content-library.hook";
import AssetCard from "./components/asset-card/asset-card.component";
import AssetCardSkeleton from "./components/asset-card-skeleton/asset-card-skeleton.component";
import AssetDetailPanel from "./components/asset-detail-panel/asset-detail-panel.component";
import FilterPanel from "./components/filter-panel/filter-panel.component";
import FullscreenPreview from "./components/fullscreen-preview/fullscreen-preview.component";
import SidebarEmpty from "./components/sidebar-empty/sidebar-empty.component";

const PANEL_WIDTH_CLASS = "w-[350px] max-w-[350px] min-w-[350px]";
const ASSET_GRID_CLASS =
  "grid grid-cols-2 justify-items-stretch gap-3 sm:gap-4 sm:grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(15.5rem,1fr))]";

export default function ContentLibrary() {
  const {
    assets,
    total,
    filters,
    draftFilters,
    searchInput,
    setSearchInput,
    isFilterOpen,
    selectedAssetId,
    selectedAsset,
    isFullscreenOpen,
    isGridLoading,
    isLoadingMore,
    hasMore,
    hasActiveFilters,
    isDetailLoading,
    isDownloading,
    isArchiving,
    filterOptions,
    openFilters,
    closeFilters,
    applyFilters,
    clearFilters,
    onSortChange,
    onDraftFilterChange,
    loadMore,
    selectAsset,
    closeDetail,
    openFullscreen,
    closeFullscreen,
    downloadAsset,
    archiveAsset,
    unarchiveAsset,
  } = useContentLibrary();

  const showDetail = Boolean(selectedAssetId) && !isFilterOpen;
  const showFilter = isFilterOpen;
  const isEmpty = !isGridLoading && assets.length === 0 && !hasActiveFilters;
  const isNoResults = !isGridLoading && assets.length === 0 && hasActiveFilters;

  let desktopSidebarContent = <SidebarEmpty />;
  if (showFilter) {
    desktopSidebarContent = (
      <FilterPanel
        draftFilters={draftFilters}
        filterOptions={filterOptions}
        onChange={onDraftFilterChange}
        onClear={clearFilters}
        onApply={applyFilters}
        onClose={closeFilters}
      />
    );
  } else if (selectedAssetId) {
    desktopSidebarContent = (
      <AssetDetailPanel
        asset={selectedAsset}
        isLoading={isDetailLoading}
        isDownloading={isDownloading}
        isArchiving={isArchiving}
        onClose={closeDetail}
        onDownload={downloadAsset}
        onFullscreen={openFullscreen}
        onArchive={archiveAsset}
        onUnarchive={unarchiveAsset}
      />
    );
  }

  return (
    <HeaderLayout className="bg-gray-50" mainClassName="overflow-hidden">
      {/* Exactly two columns: library | sidebar */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-r border-gray-200 bg-gray-50">
          <div className="shrink-0 border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
            <div className="mb-4">
              <h1 className="text-sm font-semibold text-gray-900 sm:text-lg md:text-xl">
                Content Library
              </h1>
              <p className="mt-1 text-[10px] leading-snug text-gray-500 sm:text-xs md:text-sm">
                Every approved creator asset across your campaigns.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="w-full max-w-md">
                <CustomInput
                  placeholder="Search creator, campaign, filename or product"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  startIcon={<Search className="h-4 w-4 text-gray-400" />}
                />
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <CustomButton
                  text="Filters"
                  className="btn-primary shrink-0"
                  onClick={openFilters}
                  startIcon={<ListFilter className="h-3.5 w-3.5" />}
                />
                <div className="w-[200px] shrink-0 sm:w-[220px]">
                  <SimpleSelect
                    placeHolder="Sort by"
                    options={CONTENT_LIBRARY_SORT_OPTIONS}
                    value={filters.sort}
                    onChange={onSortChange}
                  />
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-500 sm:text-xs">
              <span>
                {total} {filters.libraryStatus === "archived" ? "archived" : "active"}{" "}
                {total === 1 ? "asset" : "assets"}
              </span>
              <span>Archived assets live inside Filters</span>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6">
            {isGridLoading ? (
              <div className={ASSET_GRID_CLASS}>
                {Array.from({ length: 8 }).map((_, index) => (
                  <AssetCardSkeleton key={`skeleton-${index}`} />
                ))}
              </div>
            ) : isEmpty ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
                <h2 className="text-sm font-semibold text-gray-900">No assets yet</h2>
                <p className="mx-auto mt-2 max-w-md text-xs text-gray-500 sm:text-sm">
                  Approved creator deliverables will automatically appear here.
                </p>
              </div>
            ) : isNoResults ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
                <h2 className="text-sm font-semibold text-gray-900">No matching assets</h2>
                <p className="mx-auto mt-2 max-w-md text-xs text-gray-500 sm:text-sm">
                  Try adjusting search or filters. Your library filters are still applied.
                </p>
                <div className="mt-4 flex justify-center">
                  <CustomButton
                    text="Clear filters"
                    className="btn-outline"
                    onClick={clearFilters}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className={ASSET_GRID_CLASS}>
                  {assets.map((asset) => (
                    <AssetCard
                      key={asset.id}
                      asset={asset}
                      isSelected={selectedAssetId === asset.id}
                      onSelect={selectAsset}
                    />
                  ))}
                </div>
                {hasMore ? (
                  <div className="mt-6 flex justify-center pb-2">
                    <CustomButton
                      text={isLoadingMore ? "Loading…" : "Load more"}
                      className="btn-outline"
                      onClick={loadMore}
                      disabled={isLoadingMore}
                      loading={isLoadingMore}
                    />
                  </div>
                ) : null}
              </>
            )}
          </div>
        </section>

        <aside
          className={`hidden h-full min-h-0 shrink-0 self-stretch overflow-hidden bg-white lg:flex lg:flex-col ${PANEL_WIDTH_CLASS}`}
        >
          {desktopSidebarContent}
        </aside>
      </div>

      {showDetail ? (
        <div className="fixed inset-0 z-40 flex flex-col bg-white lg:hidden">
          <AssetDetailPanel
            asset={selectedAsset}
            isLoading={isDetailLoading}
            isDownloading={isDownloading}
            isArchiving={isArchiving}
            onClose={closeDetail}
            onDownload={downloadAsset}
            onFullscreen={openFullscreen}
            onArchive={archiveAsset}
            onUnarchive={unarchiveAsset}
          />
        </div>
      ) : null}

      {showFilter ? (
        <div className="fixed inset-0 z-40 flex flex-col bg-white lg:hidden">
          <FilterPanel
            draftFilters={draftFilters}
            filterOptions={filterOptions}
            onChange={onDraftFilterChange}
            onClear={clearFilters}
            onApply={applyFilters}
            onClose={closeFilters}
          />
        </div>
      ) : null}

      {isFullscreenOpen ? (
        <FullscreenPreview
          asset={selectedAsset}
          isDownloading={isDownloading}
          onClose={closeFullscreen}
          onDownload={downloadAsset}
        />
      ) : null}
    </HeaderLayout>
  );
}
