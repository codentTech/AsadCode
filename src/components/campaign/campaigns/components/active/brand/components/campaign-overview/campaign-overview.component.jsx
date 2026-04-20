import CustomSwitch from "@/common/components/custom-switch/custom-switch.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import { Skeleton } from "@/common/components/loader/skeleton-loader.component";
import NotFound from "@/common/components/not-found/not-found.component";
import AudienceDemographics from "@/components/audience-demographics/audience-demographics.component";
import useCampaignOverview from "./use-campaign-overview.hook";

export default function CampaignOverview({ onCampaignSelect, onToggleChange }) {
  const {
    isMultiCreator,
    filteredCampaignOptions,
    isSelectedCampaignValid,
    showMultiCreatorUI,
    selectedCampaign,
    budgetData,
    formatCurrency,
    isLoading,
    hasData,
    handleCampaignSelect,
    handleToggleChange,
    demographicsData,
    demographicsLoading,
    hasDemographicsData,
  } = useCampaignOverview(onCampaignSelect, onToggleChange);

  return (
    <div className="w-[23%] border-r flex flex-col h-screen overflow-y-scroll bg-white p-4 gap-4">
      {/* Campaign Type Toggle */}
      <div className="bg-gray-100 rounded-lg p-3">
        <CustomSwitch
          label="Campaign Type"
          checked={isMultiCreator}
          onChange={handleToggleChange}
          rightLabelText={isMultiCreator ? "Multi-Creator" : "Individual Creator"}
          parentDivClassName="justify-between"
        />
      </div>

      {/* Campaign Selector - Only for Multi-Creator */}
      {isMultiCreator && (
        <SimpleSelect
          placeHolder="Active campaigns"
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

      {/* Loading State */}
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

      {/* Empty State */}
      {!hasData && !isLoading && (isMultiCreator ? filteredCampaignOptions.length === 0 : true) && (
        <NotFound
          title={isMultiCreator ? "No Active Campaigns" : "No Individual Collaborations"}
          description={
            isMultiCreator
              ? "You don't have any active campaigns yet. Create a campaign to get started."
              : "You don't have any active individual collaborations yet."
          }
        />
      )}

      {/* Budget Display - Only for Multi-Creator */}
      {showMultiCreatorUI && hasData && (
        <div className="flex justify-between bg-gray-100 p-2 rounded-lg">
          <div className="flex flex-col justify-between">
            <h5 className="text-primary text-sm">Budget Spent</h5>
            <h6 className="text-primary text-sm font-bold">
              {formatCurrency(budgetData?.spent ?? 0)}
            </h6>
          </div>
          <div className="flex flex-col justify-between">
            <h5 className="text-green-600 text-sm">Budget Remaining</h5>
            <h6 className="text-green-600 text-sm font-bold">
              {formatCurrency(budgetData?.remaining ?? 0)}
            </h6>
          </div>
        </div>
      )}

      {/* Audience Demographics Section */}
      {hasData && selectedCampaign && (
        <>
          <hr />

          <div className="mb-1">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {showMultiCreatorUI ? "Combined Audience Demographics" : "Audience Demographics"}
              </h3>
              {showMultiCreatorUI &&
                hasDemographicsData &&
                demographicsData &&
                demographicsData.has_data && (
                  <p className="text-xs text-gray-500">
                    Aggregated across{" "}
                    {demographicsData.creators_with_data ?? demographicsData.total_creators ?? 0}{" "}
                    creators · {(demographicsData.total_followers ?? 0).toLocaleString()} total
                    followers
                  </p>
                )}
              {!showMultiCreatorUI &&
                selectedCampaign?.creator &&
                !(demographicsData?.no_connection && !demographicsData?.has_data) && (
                  <p className="text-xs text-gray-500">
                    From{" "}
                    {[selectedCampaign.creator.first_name, selectedCampaign.creator.last_name]
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
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-800">
                  <strong>Tip:</strong> Use this data to identify gaps in your campaign&apos;s
                  reach. Consider adding creators from underrepresented demographics.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
