import CustomButton from "@/common/components/custom-button/custom-button.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import useCampaignList from "@/common/hooks/use-campaign-list.hook";
import AudienceDemographics from "@/components/audience-demographics/audience-demographics";
import { CheckCircle, Download, TrendingUp } from "lucide-react";

export default function CampaignOverview({ isCompleted = false }) {
  const { options, handleChange } = useCampaignList();

  const handleExportData = () => {
    // console.log("Exporting completed campaigns data...");
  };

  const handleViewAnalytics = () => {
    // console.log("Opening analytics dashboard...");
  };

  return (
    <div className="w-1/5 border-r flex flex-col h-screen overflow-y-scroll bg-white p-4 gap-4 pb-20">
      <SimpleSelect
        placeHolder={isCompleted ? "Filter completed campaigns" : "Select a campaign"}
        options={options}
        isSearchable={true}
        isMulti={false}
        onChange={handleChange}
      />

      <hr />

      {/* Budget Summary */}
      <div className="flex justify-between">
        <div className="flex flex-col justify-between">
          <h5 className="font-bold text-primary text-lg">
            {isCompleted ? "Total Spent" : "Budget Spent"}
          </h5>
          <h6 className="text-gray-600 text-lg">$5,600</h6>
        </div>
        <div className="flex flex-col justify-between">
          <h5 className="font-bold text-green-600 text-lg">
            {isCompleted ? "Budget Saved" : "Budget Remaining"}
          </h5>
          <h6 className="text-green-600 text-lg">{isCompleted ? "$1,400" : "15,300"}</h6>
        </div>
      </div>

      {isCompleted && (
        <>
          <hr />

          {/* Completion Stats */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-bold text-green-800">Campaign Status</h5>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Campaigns Completed:</span>
                <span className="font-medium text-green-800">8/8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Success Rate:</span>
                <span className="font-medium text-green-800">95%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg. Delivery Time:</span>
                <span className="font-medium text-green-800">3.2 days</span>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h5 className="font-bold text-blue-800 mb-3">Performance Overview</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Reach:</span>
                <span className="font-medium text-blue-800">2.4M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Engagement Rate:</span>
                <span className="font-medium text-blue-800">4.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cost per Engagement:</span>
                <span className="font-medium text-blue-800">$0.056</span>
              </div>
            </div>
          </div>

          {/* ROI Summary */}
          <div className="bg-purple-50 rounded-lg p-4">
            <h5 className="font-bold text-purple-800 mb-3">ROI Analysis</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Conversions:</span>
                <span className="font-medium text-purple-800">156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Revenue Generated:</span>
                <span className="font-medium text-purple-800">$8,900</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ROI:</span>
                <span className="font-medium text-purple-800">+59%</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <CustomButton
              text="Export Campaign Data"
              startIcon={<Download className="w-4 h-4" />}
              onClick={handleExportData}
              className="w-full btn-secondary"
            />
            <CustomButton
              text="View Full Analytics"
              startIcon={<TrendingUp className="w-4 h-4" />}
              onClick={handleViewAnalytics}
              className="w-full btn-secondary"
            />
          </div>
        </>
      )}

      <hr />

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Audience Demographics</h3>
        <div className="px-10">
          <AudienceDemographics className="flex flex-col" />
        </div>
      </div>
    </div>
  );
}
