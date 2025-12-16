import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomSwitch from "@/common/components/custom-switch/custom-switch.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Loader from "@/common/components/loader/loader.component";
import NotFound from "@/common/components/not-found/not-found.component";
import AudienceDemographics from "@/components/audience-demographics/audience-demographics";
import useCampaignOverview from "./use-campaign-overview.hook";
import Loading from "@/common/components/loadar/loading.component";

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
  } = useCampaignOverview(onCampaignSelect, onToggleChange);

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

      {isLoading && <Loading />}

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

      {hasData && (
        <>
          <hr />

          <div className="mb-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {showMultiCreatorUI ? "Combined Audience Demographics" : "Audience Demographics"}
            </h3>
            <AudienceDemographics className="flex flex-col" />
          </div>
        </>
      )}
    </div>
  );
}
