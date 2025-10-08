import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomSwitch from "@/common/components/custom-switch/custom-switch.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Loader from "@/common/components/loader/loader.component";
import NotFound from "@/common/components/not-found/not-found.component";
import AudienceDemographics from "@/components/audience-demographics/audience-demographics";
import { useEffect, useRef, useState } from "react";
import useBrandCampaign from "../../use-brand.hook";

export default function CampaignOverview({ onCampaignSelect }) {
  const [isMultiCreator, setIsMultiCreator] = useState(true); // Default to Multi-Creator

  const {
    campaignOptions,
    selectedCampaign,
    budgetData,
    deliverables,
    performanceMetrics,
    handleCampaignSelect: internalHandleCampaignSelect,
    formatCurrency,
    formatNumber,
    isLoading,
    hasData,
  } = useBrandCampaign();

  const hasNotifiedParent = useRef(false);

  // Notify parent component when campaign is auto-selected (only once)
  useEffect(() => {
    if (selectedCampaign && onCampaignSelect && !hasNotifiedParent.current) {
      onCampaignSelect(selectedCampaign);
      hasNotifiedParent.current = true;
    }
  }, [selectedCampaign, onCampaignSelect]);

  // Enhanced campaign selection handler
  const handleCampaignSelect = (selectedOption) => {
    internalHandleCampaignSelect(selectedOption);
    if (onCampaignSelect && selectedOption) {
      onCampaignSelect(selectedOption.campaign);
    }
  };

  const handleExportData = () => {};

  const handleViewAnalytics = () => {};

  return (
    <div className="w-[23%] border-r flex flex-col h-screen overflow-y-scroll bg-white p-4 gap-4">
      {/* Campaign Type Toggle */}
      <div className="bg-gray-100 rounded-lg p-3">
        <CustomSwitch
          label="Campaign Type"
          checked={isMultiCreator}
          onChange={() => setIsMultiCreator(!isMultiCreator)}
          rightLabelText={isMultiCreator ? "Multi-Creator" : "Individual Creator"}
          parentDivClassName="justify-between"
        />
      </div>

      <SimpleSelect
        placeHolder={"Active campaigns"}
        options={campaignOptions}
        isSearchable={true}
        isMulti={false}
        onChange={handleCampaignSelect}
        isLoading={isLoading}
        value={
          selectedCampaign
            ? {
                value: selectedCampaign.id,
                label: selectedCampaign.campaign_title,
                campaign: selectedCampaign,
              }
            : null
        }
      />

      <hr />

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Loader loading={true} />
          <p className="text-sm text-gray-500 mt-3">Loading campaigns...</p>
        </div>
      )}

      {/* No Data Message */}
      {!hasData && !isLoading && campaignOptions.length === 0 && (
        <div className="py-8">
          <NotFound
            title="No Active Campaigns"
            description="You don't have any active campaigns yet. Create a campaign to get started."
          />
        </div>
      )}

      {/* Budget Summary */}
      {hasData && (
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

          {/* Performance Metrics */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h5 className="font-bold text-blue-800 mb-3">Performance Overview</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Views:</span>
                <span className="font-medium text-blue-800">
                  {formatNumber(performanceMetrics.totalViews)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Engagement:</span>
                <span className="font-medium text-blue-800">
                  {formatNumber(performanceMetrics.totalEngagement)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Engagement Rate:</span>
                <span className="font-medium text-blue-800">
                  {performanceMetrics.engagementRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cost per Engagement:</span>
                <span className="font-medium text-blue-800">
                  {formatCurrency(performanceMetrics.costPerEngagement)}
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {hasData && (
        <>
          <hr />

          <div className="mb-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Combined Audience Demographics
            </h3>
            <AudienceDemographics className="flex flex-col" />
          </div>

          <hr />

          {/* Action Buttons */}
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
        </>
      )}
    </div>
  );
}
