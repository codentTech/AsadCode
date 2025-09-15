import CustomButton from "@/common/components/custom-button/custom-button.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Loader from "@/common/components/loader/loader.component";
import AudienceDemographics from "@/components/audience-demographics/audience-demographics";
import { AlertCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import useActiveCompletedCampaign from "../../hooks/use-active-completed-campaign.hook";

export default function CampaignOverview({ isCompleted = false, onCampaignSelect }) {
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
  } = useActiveCompletedCampaign(isCompleted);

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

  const handleExportData = () => {
    console.log("Exporting campaign data...", selectedCampaign);
  };

  const handleViewAnalytics = () => {
    console.log("Opening analytics dashboard...", selectedCampaign);
  };

  return (
    <div className="w-[23%] border-r flex flex-col h-screen overflow-y-scroll bg-white p-4 gap-4">
      <SimpleSelect
        placeHolder={isCompleted ? "Filter completed campaigns" : "Select a campaign"}
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
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isCompleted ? "No Completed Campaigns" : "No Active Campaigns"}
          </h3>
          <p className="text-sm text-gray-500 max-w-xs">
            {isCompleted
              ? "You don't have any completed campaigns yet. Complete some active campaigns to see them here."
              : "You don't have any active campaigns yet. Create a campaign to get started."}
          </p>
        </div>
      )}

      {/* Budget Summary */}
      {hasData && (
        <div className="flex justify-between bg-gray-100 p-2 rounded-lg">
          <div className="flex flex-col justify-between">
            <h5 className="text-primary text-sm">{isCompleted ? "Total Spent" : "Budget Spent"}</h5>
            <h6 className="text-primary text-sm font-bold">{formatCurrency(budgetData.spent)}</h6>
          </div>
          <div className="flex flex-col justify-between">
            <h5 className="text-green-600 text-sm">
              {isCompleted ? "Budget Saved" : "Budget Remaining"}
            </h5>
            <h6 className="text-green-600 text-sm font-bold">
              {formatCurrency(isCompleted ? budgetData.saved : budgetData.remaining)}
            </h6>
          </div>
        </div>
      )}

      {isCompleted && hasData && (
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
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Audience Demographics</h3>
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
