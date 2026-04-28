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
        </div>
      )}

      <hr className="border-gray-200" />

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

      {showMultiCreatorUI && hasData && (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
          <div className="grid min-w-0 grid-cols-2 divide-x divide-gray-200">
            <div className="min-w-0 px-2 py-2 text-center sm:px-3 sm:py-2.5 sm:text-left">
              <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500 sm:text-[11px]">
                Spent
              </p>
              <p className="mt-0.5 break-words text-sm font-semibold tabular-nums leading-tight text-gray-900 sm:text-base">
                {formatCurrency(budgetData?.spent ?? 0)}
              </p>
            </div>
            <div className="min-w-0 px-2 py-2 text-center sm:px-3 sm:py-2.5 sm:text-left">
              <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500 sm:text-[11px]">
                Remaining
              </p>
              <p className="mt-0.5 break-words text-sm font-semibold tabular-nums leading-tight text-gray-900 sm:text-base">
                {formatCurrency(budgetData?.remaining ?? 0)}
              </p>
            </div>
          </div>
        </div>
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
              <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50/90 p-3">
                <p className="text-xs leading-relaxed text-blue-800">
                  <strong>Tip:</strong> Use this data to identify gaps in your campaign&apos;s reach.
                  Consider adding creators from underrepresented demographics.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
