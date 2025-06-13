"use client";

import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import CustomRadioGroup from "@/common/components/radio-group/radio-group.component";
import React, { useState } from "react";

function Compensation({ campaignData, handleChange }) {
  const [creatorCompOption, setCreatorCompOption] = useState("suggested");

  const campaignTypeOptions = [
    { label: "Sponsored Post", value: "Sponsored Post" },
    { label: "UGC", value: "UGC" },
    { label: "Gifted", value: "Gifted" },
    { label: "Affiliate", value: "Affiliate" },
  ];

  const paymentOptions = [
    { label: "Suggested Range", value: "suggested" },
    { label: "Set Fixed Price", value: "set-price" },
  ];

  const commissionPayment =
    (Number(campaignData.commissionPercentage) / 100) * Number(campaignData.productPrice || 0);

  const handleCampaignTypeChange = (option) => {
    handleChange({
      target: {
        name: "campaignType",
        value: option.value,
      },
    });

    // Reset related fields
    handleChange({ target: { name: "budget", value: "" } });
    handleChange({ target: { name: "compensationType", value: "" } });
    handleChange({ target: { name: "commissionPercentage", value: "" } });
    handleChange({ target: { name: "productPrice", value: "" } });
  };

  return (
    <div className="space-y-6">
      {/* Campaign Type */}
      <div className="w-full max-w-[235px]">
        <SimpleSelect
          label="Campaign Type"
          placeHolder="Select an option"
          options={campaignTypeOptions}
          value={campaignData.campaignType}
          onChange={handleCampaignTypeChange}
        />
      </div>

      {/* Conditional Inputs Based on Campaign Type */}
      {["Sponsored Post", "UGC"].includes(campaignData.campaignType) && (
        <div className="space-y-4">
          {/* How would you like to pay? */}
          <CustomRadioGroup
            label="How would you like to pay?"
            name="compensationType"
            radioOptions={[{ label: "Fixed", value: "fixed" }]}
            inlineRadioButtons
            value={campaignData.compensationType}
            onChange={(val) =>
              handleChange({
                target: { name: "compensationType", value: val },
              })
            }
          />

          {/* Fixed Budget */}
          {campaignData.compensationType === "fixed" && (
            <CustomInput
              label="Enter Total Budget Amount (Private, not publicly visible)"
              type="number"
              name="budget"
              value={campaignData.budget}
              onChange={handleChange}
              placeholder="Amount"
            />
          )}

          {/* Creator Compensation Options */}
          <CustomRadioGroup
            label="Creator Compensation"
            name="creatorComp"
            radioOptions={paymentOptions}
            inlineRadioButtons
            value={creatorCompOption}
            onChange={(val) => setCreatorCompOption(val)}
          />

          {/* Compensation Inputs */}
          {creatorCompOption === "suggested" && (
            <div className="flex gap-4">
              <CustomInput
                label="Suggested Minimum"
                type="number"
                name="suggestedMin"
                value={campaignData.suggestedMin}
                onChange={handleChange}
                placeholder="e.g., 100"
              />
              <CustomInput
                label="Suggested Maximum"
                type="number"
                name="suggestedMax"
                value={campaignData.suggestedMax}
                onChange={handleChange}
                placeholder="e.g., 300"
              />
            </div>
          )}

          {creatorCompOption === "set-price" && (
            <CustomInput
              label="Fixed Creator Payment"
              type="number"
              name="fixedPrice"
              value={campaignData.fixedPrice}
              onChange={handleChange}
              placeholder="e.g., 200"
            />
          )}
        </div>
      )}

      {/* Gifted Campaign */}
      {campaignData.campaignType === "Gifted" && (
        <div className="w-full max-w-[235px] space-y-2">
          <p className="text-sm font-medium text-gray-800">
            Creator Compensation: <span className="font-semibold text-red-600">$0</span>
          </p>
          <CustomInput
            label="Product Value"
            type="number"
            name="productValue"
            value={campaignData.productValue}
            onChange={handleChange}
            placeholder="e.g., 75"
          />
        </div>
      )}

      {/* Affiliate Campaign */}
      {campaignData.campaignType === "Affiliate" && (
        <div className="flex justify-between gap-3">
          <CustomInput
            label="% Commission per Sale"
            type="number"
            name="commissionPercentage"
            value={campaignData.commissionPercentage}
            onChange={handleChange}
            placeholder="10"
          />
          <CustomInput
            label="Product Price"
            type="number"
            name="productPrice"
            value={campaignData.productPrice}
            onChange={handleChange}
            placeholder="e.g., 49.99"
          />

          {campaignData.commissionPercentage && campaignData.productPrice && (
            <div className="p-2 mt-1 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
              Creator payout per sale: <strong>${commissionPayment.toFixed(2)}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Compensation;
