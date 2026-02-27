import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomSwitch from "@/common/components/custom-switch/custom-switch.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Loader from "@/common/components/loader/loader.component";
import AudienceDemographics from "@/components/audience-demographics/audience-demographics.component";
import NotFound from "@/common/components/not-found/not-found.component";
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
    isLoading,
    hasData,
    handleCampaignSelect,
    handleToggleChange,
    handleExportData,
    handleViewAnalytics,
  } = useCampaignOverviewCompleted(
    onCampaignSelect,
    onToggleChange,
    undefined,
    parentSelectedCampaign
  );

  return (
    <div className="w-[23%] border-r flex flex-col h-screen overflow-y-scroll bg-white p-4 gap-4">
      <div className="bg-gray-100 rounded-lg p-3">
        <CustomSwitch
          label="Campaign Type"
          checked={isMultiCreator}
          onChange={handleToggleChange}
          rightLabelText={isMultiCreator ? "Multi-Creator" : "Individual Creator"}
          parentDivClassName="justify-between"
        />
      </div>

      {isMultiCreator && (
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
      )}

      <hr />

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Loader loading={true} />
          <p className="text-sm text-gray-500 mt-3">Loading campaigns...</p>
        </div>
      )}

      {showEmptyState && (
        <NotFound
          title={
            isMultiCreator ? "No Completed Campaigns" : "No Completed Individual Collaborations"
          }
          description={
            isMultiCreator
              ? "You don't have any completed campaigns."
              : "You don't have any completed individual collaborations."
          }
        />
      )}

      {selectedCampaign && (
        <>
          {showMultiCreatorUI && hasData && (
            <div className="flex justify-between bg-gray-100 p-2 rounded-lg">
              <div className="flex flex-col justify-between">
                <h5 className="text-primary text-sm">Budget Spent</h5>
                <h6 className="text-primary text-sm font-bold">
                  {formatCurrency(budgetData?.spent ?? 0)}
                </h6>
              </div>
              <div className="flex flex-col justify-between">
                <h5 className="text-green-600 text-sm">Budget Saved</h5>
                <h6 className="text-green-600 text-sm font-bold">
                  {formatCurrency(budgetData?.saved ?? 0)}
                </h6>
              </div>
            </div>
          )}

          {showMultiCreatorUI && (
            <>
              <hr />
              <div className="bg-blue-50 rounded-lg p-4">
                <h5 className="font-bold text-blue-800 mb-1">Combined Performance Overview</h5>
                <p className="text-[11px] text-blue-500 mb-3">
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
                        {formatNumber(performanceData?.totalViews || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Engagement:</span>
                      <span className="font-medium text-blue-800">
                        {formatNumber(performanceData?.totalEngagement || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Engagement Rate:</span>
                      <span className="font-medium text-blue-800">
                        {(performanceData?.engagementRate || 0).toFixed(1)}%
                      </span>
                    </div>
                    <div className="rounded-lg bg-indigo-200 p-3">
                      <div className="flex justify-between items-start">
                        <span className="text-gray-700 font-medium">Cost per:</span>
                        <div className="text-right space-y-0.5">
                          <div className="font-medium text-blue-800">
                            View:{" "}
                            {performanceData?.costPerView != null && performanceData.costPerView > 0
                              ? formatCurrency(performanceData.costPerView)
                              : performanceData?.totalViews > 0 && budgetData?.spent != null
                                ? formatCurrency(
                                    Number(budgetData.spent) / Number(performanceData.totalViews)
                                  )
                                : 0}
                          </div>
                          <div className="font-medium text-blue-800">
                            Engagement:{" "}
                            {performanceData?.costPerEngagement != null &&
                            performanceData.costPerEngagement > 0
                              ? formatCurrency(performanceData.costPerEngagement)
                              : 0}
                          </div>
                        </div>
                      </div>
                    </div>
                    {performanceData?.totalPosts && (
                      <>
                        <hr className="my-2 border-blue-200" />
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Posts:</span>
                          <span className="font-medium text-blue-800">
                            {formatNumber(performanceData.totalPosts)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Avg Views/Post:</span>
                          <span className="font-medium text-blue-800">
                            {formatNumber(performanceData.averageViewsPerPost || 0)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          <hr />
          <div className="mb-1">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {showMultiCreatorUI ? "Combined Audience Demographics" : "Audience Demographics"}
              </h3>
              {showMultiCreatorUI && hasDemographicsData && demographicsData && (
                <p className="text-xs text-gray-500">
                  Aggregated across{" "}
                  {demographicsData.creators_with_data ?? demographicsData.total_creators ?? 0}{" "}
                  creators · {(demographicsData.total_followers ?? 0).toLocaleString()} total
                  followers
                </p>
              )}
              {!showMultiCreatorUI &&
                (selectedCampaign?.creator || selectedCampaign?.contract?.creator) && (
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

            <AudienceDemographics
              audienceData={demographicsData ?? null}
              loading={demographicsLoading}
              className="flex flex-col"
            />

            {showMultiCreatorUI && hasDemographicsData && demographicsData && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100">
                <p className="text-xs text-green-800">
                  <strong>Campaign Completed:</strong> Your campaign reached{" "}
                  {(demographicsData.total_followers ?? 0).toLocaleString()} total followers across{" "}
                  {demographicsData.creators_with_data ?? 0} creators with diverse audience
                  demographics.
                </p>
              </div>
            )}
          </div>
          <hr />
          {showMultiCreatorUI && (
            <div className="flex flex-col gap-2 mt-1">
              <CustomButton
                text="Export Campaign Data"
                onClick={handleExportData}
                className="w-full btn-primary"
              />
              <CustomButton
                text="View Full Analytics"
                onClick={handleViewAnalytics}
                className="w-full btn-outline"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
