import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Niche from "@/components/niche/niche";
import React from "react";

function CampaignTypeNiche({
  campaignData,
  handleChange,
  handleCheckboxToggle,
}) {
  const campaignTypeOptions = [
    { label: "Sponsored Post", value: "Sponsored Post" },
    { label: "UGC", value: "UGC" },
    { label: "Affiliate", value: "Affiliate" },
    { label: "Giveaway", value: "Giveaway" },
    { label: "Gifting Only", value: "Gifting Only" },
    { label: "Other", value: "Other" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <CustomInput
          label="Campaign Title"
          name="campaignTitle"
          value={campaignData.campaignTitle}
          onChange={handleChange}
          placeholder="Enter campaign itle"
        />
        <SimpleSelect
          label="Campaign Type"
          placeHolder="Select an option"
          options={campaignTypeOptions}
          isSearchable={true}
          isMulti={true}
          onChange={() => handleCheckboxToggle("campaignTypes")}
        />

        {/* {campaignData.campaignTypes.label.includes("Other") && (
          <input
            type="text"
            name="otherCampaignType"
            value={campaignData.otherCampaignType}
            onChange={handleChange}
            placeholder="Specify other campaign type"
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
          />
        )} */}
      </div>

      <div className="space-y-2">
        <div className="p-2 bg-gray-50 rounded-lg border">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Select Niche(s)
          </h4>
          <div className="flex flex-wrap gap-2">
            <Niche />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampaignTypeNiche;
