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
    budgetStatsLoading,
    hasData,
    handleCampaignSelect,
    handleToggleChange,
    campaignSimpleSelectValue,
    demographicsData,
    demographicsLoading,
    hasDemographicsData,
  } = useCampaignOverview(onCampaignSelect, onToggleChange);

  const showNoDataNotFound =
    !hasData &&
    !isLoading &&
    !budgetStatsLoading &&
    (isMultiCreator
      ? filteredCampaignOptions.length === 0 || (isSelectedCampaignValid && !!selectedCampaign)
      : true);

  return (
    <div className="flex min-h-0 w-full flex-col gap-3 overflow-y-auto bg-white p-3 sm:gap-4 sm:p-4 md:h-full md:max-h-none">
      <div className="bg-gray-100 rounded-lg p-3">
        <CustomSwitch
          label="Campaign Type"
          checked={isMultiCreator}
          onChange={(event) => handleToggleChange(event.target.checked)}
          rightLabelText={isMultiCreator ? "Multi-Creator" : "Individual Creator"}
          parentDivClassName="justify-between"
        />
      </div>

      {isMultiCreator && (
        <div className="min-w-0">
          <SimpleSelect
            placeHolder="Active campaigns"
            options={filteredCampaignOptions}
            isSearchable={true}
            isMulti={false}
            onChange={handleCampaignSelect}
            isLoading={isLoading}
            value={campaignSimpleSelectValue}
          />
        </div>
      )}

      {isLoading && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-xl bg-gray-100 p-3 sm:flex-row sm:justify-between">
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
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        </div>
      )}

      {showNoDataNotFound && (
        <div className="flex min-h-[50vh] w-full items-center justify-center px-4 text-center">
          <NotFound title="No Data Available" description="Please select a campaign and creator." />
        </div>
      )}

      {showMultiCreatorUI && (budgetStatsLoading || hasData) && (
        <>
          <hr className="border-gray-200" />

          <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
            <div className="grid min-w-0 grid-cols-2 divide-x divide-gray-200">
              <div className="min-w-0 px-2 py-2 text-center sm:px-3 sm:py-2.5 sm:text-left">
                <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500 sm:text-[11px]">
                  Spent
                </p>
                {budgetStatsLoading ? (
                  <Skeleton className="mt-1 h-5 w-16 sm:h-6 sm:w-20" />
                ) : (
                  <p className="mt-0.5 break-words text-sm font-semibold tabular-nums leading-tight text-gray-900 sm:text-base">
                    {formatCurrency(budgetData?.spent ?? 0)}
                  </p>
                )}
              </div>
              <div className="min-w-0 px-2 py-2 text-center sm:px-3 sm:py-2.5 sm:text-left">
                <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500 sm:text-[11px]">
                  Remaining
                </p>
                {budgetStatsLoading ? (
                  <Skeleton className="mt-1 h-5 w-16 sm:h-6 sm:w-20" />
                ) : (
                  <p className="mt-0.5 break-words text-sm font-semibold tabular-nums leading-tight text-gray-900 sm:text-base">
                    {formatCurrency(budgetData?.remaining ?? 0)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {hasData && selectedCampaign && (
        <>
          <hr className="border-gray-200" />

          <div className="mb-1 min-w-0">
            <div className="mb-3 sm:mb-4">
              <h3 className="mb-1 text-sm font-semibold text-gray-800 sm:text-lg">
                {showMultiCreatorUI ? "Combined Audience Demographics" : "Audience Demographics"}
              </h3>
              {showMultiCreatorUI &&
                hasDemographicsData &&
                demographicsData &&
                demographicsData.has_data && (
                  <p className="text-xs leading-relaxed text-gray-500">
                    Aggregated across{" "}
                    {demographicsData.creators_with_data ?? demographicsData.total_creators ?? 0}{" "}
                    creators · {(demographicsData.total_followers ?? 0).toLocaleString()} total
                    followers
                  </p>
                )}
            </div>

            <AudienceDemographics
              audienceData={demographicsData ?? null}
              loading={demographicsLoading}
              className="flex flex-col"
            />

            {showMultiCreatorUI && hasDemographicsData && demographicsData && (
              <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50/90 p-3">
                <p className="text-xs leading-relaxed text-blue-800">
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
