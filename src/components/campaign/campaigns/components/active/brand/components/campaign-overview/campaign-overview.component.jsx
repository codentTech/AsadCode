import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomSwitch from "@/common/components/custom-switch/custom-switch.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import NotFound from "@/common/components/not-found/not-found.component";
import AudienceDemographics from "@/components/audience-demographics/audience-demographics";
import useCampaignOverview from "./use-campaign-overview.hook";
import Loading from "@/common/components/loadar/loading.component";
import {
  fetchCampaignCombinedDemographics,
  fetchCreatorAudience,
  resetCampaignDemographics,
  resetAudience,
  selectCampaignCombinedDemographics,
  selectCreatorAudience,
} from "@/provider/features/phyllo/phyllo.slice";

export default function CampaignOverview({ onCampaignSelect, onToggleChange }) {
  const dispatch = useDispatch();

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
  } = useCampaignOverview(onCampaignSelect, onToggleChange);

  // Get demographics data from Redux using selectors (selectors provide safe defaults)
  const campaignDemographics = useSelector(selectCampaignCombinedDemographics);
  const individualDemographics = useSelector(selectCreatorAudience);

  // Fetch demographics when campaign changes
  useEffect(() => {
    if (!selectedCampaign?.id) {
      // Clear demographics when no campaign selected
      dispatch(resetCampaignDemographics());
      dispatch(resetAudience());
      return;
    }

    if (isMultiCreator) {
      // Fetch combined demographics for multi-creator campaigns
      dispatch(fetchCampaignCombinedDemographics(selectedCampaign.id));
      dispatch(resetAudience()); // Clear individual demographics
    } else {
      // Fetch individual creator demographics for individual collaborations
      const creatorId = selectedCampaign.creator?.id || selectedCampaign.creator_id;
      if (creatorId) {
        dispatch(fetchCreatorAudience(creatorId));
        dispatch(resetCampaignDemographics()); // Clear campaign demographics
      }
    }
  }, [selectedCampaign?.id, isMultiCreator, dispatch]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      dispatch(resetCampaignDemographics());
      dispatch(resetAudience());
    };
  }, [dispatch]);

  // Determine which demographics data to use with safe access
  const demographicsData = isMultiCreator
    ? campaignDemographics?.data
    : individualDemographics?.data;

  const demographicsLoading = isMultiCreator
    ? campaignDemographics?.isLoading || false
    : individualDemographics?.isLoading || false;

  const hasDemographicsData = isMultiCreator
    ? campaignDemographics?.isSuccess && demographicsData?.has_data
    : individualDemographics?.isSuccess && demographicsData?.has_data;

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
      {isLoading && <Loading />}

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
            <h6 className="text-primary text-sm font-bold">{formatCurrency(budgetData.spent)}</h6>
          </div>
          <div className="flex flex-col justify-between">
            <h5 className="text-green-600 text-sm">Budget Remaining</h5>
            <h6 className="text-green-600 text-sm font-bold">
              {formatCurrency(budgetData.remaining)}
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
              {showMultiCreatorUI && hasDemographicsData && demographicsData && (
                <p className="text-xs text-gray-500">
                  Aggregated across{" "}
                  {demographicsData.creators_with_data || demographicsData.total_creators || 0}{" "}
                  creators · {(demographicsData.total_followers || 0).toLocaleString()} total
                  followers
                </p>
              )}
            </div>

            {/* Demographics Charts */}
            <AudienceDemographics
              audienceData={demographicsData}
              loading={demographicsLoading}
              className="flex flex-col"
            />

            {/* Helper Text for Multi-Creator */}
            {showMultiCreatorUI && hasDemographicsData && demographicsData && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-800">
                  <strong>Tip:</strong> Use this data to identify gaps in your campaign's reach.
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
