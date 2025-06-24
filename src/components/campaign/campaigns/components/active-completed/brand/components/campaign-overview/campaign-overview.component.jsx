import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import useCampaignList from "@/common/hooks/use-campaign-list.hook";
import AudienceDemographics from "@/components/audience-demographics/audience-demographics";
import { Download, TrendingUp } from "lucide-react";

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
      <div className="flex justify-between bg-gray-100 p-2 rounded-lg">
        <div className="flex flex-col justify-between">
          <h5 className="text-primary text-sm">{isCompleted ? "Total Spent" : "Budget Spent"}</h5>
          <h6 className="text-primary text-sm font-bold">$5,600</h6>
        </div>
        <div className="flex flex-col justify-between">
          <h5 className="text-green-600 text-sm">
            {isCompleted ? "Budget Saved" : "Budget Remaining"}
          </h5>
          <h6 className="text-green-600 text-sm font-bold">{isCompleted ? "$1,400" : "$15,300"}</h6>
        </div>
      </div>

      {isCompleted && (
        <>
          <hr />

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

          <div className="flex flex-col gap-3">
            <CustomInput label="Total Views (Combined of all creators)" />
            <CustomInput
              label="
Total Engagements (likes, comments, shares)"
            />
            <CustomInput label="Average Engagement Rate (%) " />
            <CustomInput label="Cost Per Engagement" />
            <CustomButton text="Submit" className="btn-primary mt-2" />
          </div>
        </>
      )}

      <hr />

      <div className="mb-1">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Audience Demographics</h3>
        <AudienceDemographics className="flex flex-col" />
      </div>

      <hr />

      {/* Action Buttons */}
      <div className="space-y-2 mt-1">
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
    </div>
  );
}
