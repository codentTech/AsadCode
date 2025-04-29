"use client";

import CustomInput from "@/common/components/custom-input/custom-input.component";
import CustomRadioGroup from "@/common/components/radio-group/radio-group.component";
import React from "react";

function Compensation({ campaignData, handleChange }) {
  const platformOptions = [
    { label: "Fixed Payment", value: "fixed" },
    { label: "Gifted", value: "gifted" },
    { label: "Commission Based", value: "commission" },
  ];

  const commissionPayment =
    (Number(campaignData.commissionPercentage) / 100) *
    Number(campaignData.productPrice || 0);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <CustomRadioGroup
          label="How would you like to pay?"
          name="compensationType"
          radioOptions={platformOptions}
          inlineRadioButtons
          onChange={(val) =>
            handleChange({
              target: {
                name: "compensationType",
                value: val,
              },
            })
          }
        />

        {/* Fixed Payment Section */}
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

        {/* Commission Section */}
        {campaignData.compensationType === "commission" && (
          <div className="space-y-2">
            <CustomInput
              label="% commission per sale"
              type="number"
              name="commissionPercentage"
              value={campaignData.commissionPercentage}
              onChange={handleChange}
              placeholder="10%"
            />

            <CustomInput
              label="Product price"
              type="number"
              name="productPrice"
              value={campaignData.productPrice}
              onChange={handleChange}
              placeholder="e.g., 99.99"
              className="w-full p-2 pl-8 border border-gray-300 rounded-md"
            />

            {campaignData.commissionPercentage && campaignData.productPrice && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-100 rounded-md">
                <p className="text-sm text-blue-800">
                  You will pay ${commissionPayment.toFixed(2)} per item sold
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Compensation;
