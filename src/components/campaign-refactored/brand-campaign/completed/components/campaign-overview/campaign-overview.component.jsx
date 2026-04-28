import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomSwitch from "@/common/components/custom-switch/custom-switch.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import { Skeleton } from "@/common/components/loader/skeleton-loader.component";
import NotFound from "@/common/components/not-found/not-found.component";
import AudienceDemographics from "@/components/audience-demographics/audience-demographics.component";
import useCampaignOverviewCompleted from "./use-campaign-overview.hook";

export default function CampaignOverviewCompleted({
  onCampaignSelect,
  onToggleChange,
  parentSelectedCampaign,
}) {
  const {
    isMultiCreator,
    filteredCampaignOptions,
    isSelectedCampaignValid,
    showMultiCreatorUI,
    selectedCampaign,
    budgetData,
    performanceData,
    performanceLoading,
    demographicsData,
    demographicsLoading,
    hasDemographicsData,
    showEmptyState,
    formatCurrency,
    formatNumber,
    formatMetricValue,
    isLoading,
    hasData,
    handleCampaignSelect,
    handleToggleChange,
    handleExportData,
    handleViewAnalytics,
    isUgc,
  } = useCampaignOverviewCompleted(
    onCampaignSelect,
    onToggleChange,
    undefined,
    parentSelectedCampaign
  );

  return (
    <div className="flex min-h-0 w-full flex-col gap-3 overflow-y-auto bg-white p-3 sm:gap-4 sm:p-4 md:h-full md:max-h-none">
      <div className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/80 p-2.5 shadow-inner sm:p-3">
        <CustomSwitch
          label="Campaign Type"
          checked={isMultiCreator}
          onChange={handleToggleChange}
          rightLabelText={isMultiCreator ? "Multi-Creator" : "Individual Creator"}
          parentDivClassName="justify-between"
          rightLabelClassName="flex w-full items-center justify-between gap-2 text-xs font-medium leading-6 text-text-dark-gray sm:justify-end sm:gap-8"
        />
      </div>

      {isMultiCreator && (
        <div className="min-w-0">
          <SimpleSelect
            placeHolder="Completed campaigns"
            options={filteredCampaignOptions}
            isSearchable={true}
            isMulti={false}
            onChange={handleCampaignSelect}
            isLoading={isLoading}
            value={
              isSelectedCampaignValid && selectedCampaign?.campaign_title
                ? {
                    value: selectedCampaign.id,
                    label: selectedCampaign.campaign_title,
                  }
                : null
            }
          />
        </div>
      )}

      <hr className="border-gray-200" />

      {isLoading && (
        <div className="space-y-4">
          <div className="flex justify-between bg-gray-100 p-2 rounded-lg gap-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-14" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-20 w-full rounded" />
          </div>
        </div>
      )}

      {showEmptyState && (
        <NotFound
          title={isMultiCreator ? "No Campaigns" : "No Individual Collaborations"}
          description={
            isMultiCreator
              ? "You don't have any campaigns"
              : "You don't have any individual collaborations"
          }
        />
      )}

      {selectedCampaign && !isLoading && (
        <>
          {showMultiCreatorUI && hasData && (
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              <div className="grid min-w-0 grid-cols-2 divide-x divide-gray-200">
                <div className="min-w-0 px-2 py-2 text-center sm:px-3 sm:py-2.5 sm:text-left">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-primary sm:text-[11px]">
                    Spent
                  </p>
                  <p className="mt-0.5 break-words text-sm font-semibold tabular-nums leading-tight text-primary sm:text-base">
                    {formatCurrency(budgetData?.spent ?? 0)}
                  </p>
                </div>
                <div className="min-w-0 px-2 py-2 text-center sm:px-3 sm:py-2.5 sm:text-left">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-green-600 sm:text-[11px]">
                    Saved
                  </p>
                  <p className="mt-0.5 break-words text-sm font-semibold tabular-nums leading-tight text-green-700 sm:text-base">
                    {formatCurrency(budgetData?.saved ?? 0)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {showMultiCreatorUI && !isLoading && !isUgc && (
            <>
              <hr className="border-gray-200" />
              <div className="rounded-lg bg-blue-50 p-3 sm:p-4">
                <h5 className="mb-1 text-base font-bold text-blue-800 sm:text-lg">
                  Combined Performance Overview
                </h5>
                <p className="mb-3 text-[11px] leading-relaxed text-blue-600 sm:text-xs">
                  ER &amp; CPE are averaged across creators, not recalculated from totals.
                </p>
                {performanceLoading ? (
                  <div className="space-y-2 text-sm animate-pulse">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="flex justify-between items-center">
                        <div className="h-4 w-32 bg-blue-200/60 rounded" />
                        <div className="h-4 w-16 bg-blue-200/60 rounded" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Views:</span>
                      <span className="font-medium text-blue-800">
                        {formatMetricValue(performanceData?.totalViews ?? 0, "views")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Engagement:</span>
                      <span className="font-medium text-blue-800">
                        {formatMetricValue(performanceData?.totalEngagement ?? 0, "engagement")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Engagement Rate:</span>
                      <span className="font-medium text-blue-800">
                        {formatMetricValue(performanceData?.engagementRate ?? 0, "rate")}
                      </span>
                    </div>
                    <div className="rounded-lg bg-indigo-200 p-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <span className="font-medium text-gray-700">Cost per:</span>
                        <div className="space-y-0.5 text-left sm:text-right">
                          <div className="font-medium text-blue-800">
                            View:{" "}
                            {performanceData?.costPerView == null ||
                            !Number.isFinite(Number(performanceData.costPerView))
                              ? "N/A"
                              : formatMetricValue(performanceData.costPerView, "currency")}
                          </div>
                          <div className="font-medium text-blue-800">
                            Engagement:{" "}
                            {performanceData?.costPerEngagement == null ||
                            !Number.isFinite(Number(performanceData.costPerEngagement))
                              ? "N/A"
                              : formatMetricValue(
                                  performanceData.costPerEngagement,
                                  "currency"
                                )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {performanceData?.totalPosts ? (
                      <>
                        <hr className="my-2 border-blue-200" />
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Posts:</span>
                          <span className="font-medium text-blue-800">
                            {formatMetricValue(performanceData.totalPosts, "views")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Avg Views/Post:</span>
                          <span className="font-medium text-blue-800">
                            {formatMetricValue(performanceData.averageViewsPerPost || 0, "views")}
                          </span>
                        </div>
                      </>
                    ) : null}
                  </div>
                )}
              </div>
            </>
          )}

          {isUgc ? null : (
            <>
              <hr className="border-gray-200" />
              <div className="mb-1 min-w-0">
                <div className="mb-3 sm:mb-4">
                  <h3 className="mb-1 text-base font-semibold text-gray-800 sm:text-lg">
                    {showMultiCreatorUI
                      ? "Combined Audience Demographics"
                      : "Audience Demographics"}
                    {demographicsData?.is_estimated && demographicsData?.has_data ? (
                      <span className="ml-1.5 text-sm font-medium text-amber-700">(Estimated)</span>
                    ) : null}
                  </h3>
                  {showMultiCreatorUI &&
                    hasDemographicsData &&
                    demographicsData &&
                    demographicsData.has_data &&
                    !isLoading && (
                      <p className="text-xs text-gray-500">
                        Aggregated across{" "}
                        {demographicsData.creators_with_data ??
                          demographicsData.total_creators ??
                          0}{" "}
                        creators · {(demographicsData.total_followers ?? 0).toLocaleString()} total
                        followers
                      </p>
                    )}
                  {!showMultiCreatorUI &&
                    !isLoading &&
                    (selectedCampaign?.creator || selectedCampaign?.contract?.creator) &&
                    !(demographicsData?.no_connection && !demographicsData?.has_data) && (
                      <p className="text-xs text-gray-500">
                        From{" "}
                        {[
                          selectedCampaign?.creator?.first_name ??
                            selectedCampaign?.contract?.creator?.first_name,
                          selectedCampaign?.creator?.last_name ??
                            selectedCampaign?.contract?.creator?.last_name,
                        ]
                          .filter(Boolean)
                          .join(" ") || "creator"}
                      </p>
                    )}
                </div>

                {demographicsData?.is_estimated && demographicsData?.has_data && (
                  <div className="mb-3 p-2.5 bg-amber-50 rounded-lg border border-amber-100">
                    <p className="text-xs text-amber-900">{demographicsData.estimate_disclaimer}</p>
                  </div>
                )}

                <AudienceDemographics
                  audienceData={demographicsData ?? null}
                  loading={demographicsLoading}
                  className="flex flex-col"
                />

                {showMultiCreatorUI && hasDemographicsData && demographicsData && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-xs text-green-800">
                      <strong>Campaign Completed:</strong> Your campaign reached{" "}
                      {(demographicsData.total_followers ?? 0).toLocaleString()} total followers
                      across {demographicsData.creators_with_data ?? 0} creators with diverse
                      audience demographics.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
          <hr className="border-gray-200" />
          {showMultiCreatorUI && (
            <div className="mt-1 flex flex-col gap-2">
              <CustomButton
                text="Export Campaign Data"
                onClick={handleExportData}
                className="btn-primary min-h-10 w-full !text-xs sm:!text-sm"
              />
              <CustomButton
                text="View Full Analytics"
                onClick={handleViewAnalytics}
                className="btn-outline min-h-10 w-full !text-xs sm:!text-sm"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
