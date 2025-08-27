"use client";

import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import CustomRadioGroup from "@/common/components/radio-group/radio-group.component";
import React, { useState } from "react";
import { AlertCircle } from "lucide-react";

/**
 * Compensation Component
 *
 * Handles campaign type selection and compensation configuration
 * including fixed payments, suggested ranges, affiliate commissions, etc.
 */
function Compensation({ campaignData, handleChange, errors = {}, register }) {
  const [creatorCompOption, setCreatorCompOption] = useState("suggested");

  // Campaign type options
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

  // Calculate commission payment for affiliate campaigns
  const commissionPayment =
    (Number(campaignData.commission_percentage) / 100) * Number(campaignData.product_price || 0);

  // Handle campaign type change and reset related fields
  const handleCampaignTypeChange = (option) => {
    handleChange({ target: { name: "campaign_type", value: option.value } });

    // Reset compensation-related fields when campaign type changes
    const fieldsToReset = [
      "budget",
      "commission_percentage",
      "product_price",
      "product_value",
      "suggested_min",
      "suggested_max",
      "fixed_price",
    ];
    fieldsToReset.forEach((field) => {
      handleChange({ target: { name: field, value: "" } });
    });

    // Set appropriate compensation type based on campaign type
    let compensationType = "";
    switch (option.value) {
      case "Sponsored Post":
      case "UGC":
        compensationType = "fixed"; // Default for these types
        break;
      case "Gifted":
        compensationType = "gifted"; // No payment, just product
        break;
      case "Affiliate":
        compensationType = "commission"; // Commission-based
        break;
      default:
        compensationType = "";
    }
    handleChange({ target: { name: "compensationType", value: compensationType } });
  };

  return (
    <div className="space-y-6">
      {/* Campaign Type Selection */}
      <div className="space-y-2">
        <div className="w-full max-w-sm">
          <SimpleSelect
            label="Campaign Type"
            placeHolder="Select campaign type"
            options={campaignTypeOptions}
            name="campaign_type"
            register={register}
            value={campaignData.campaign_type}
            onChange={handleCampaignTypeChange}
            errors={errors}
            isRequired={true}
          />
        </div>
      </div>

      {/* Sponsored Post & UGC Campaign Configuration */}
      {["Sponsored Post", "UGC"].includes(campaignData.campaign_type) && (
        <div className="space-y-4">
          {/* Payment Type - Fixed for these campaign types */}
          <div className="p-3 bg-gray-50 rounded-lg border">
            <p className="text-sm font-medium text-gray-700 mb-1">Payment Type</p>
            <p className="text-sm text-gray-600">Fixed Payment (Budget-based compensation)</p>
          </div>

          {/* Total Budget */}
          <CustomInput
            label="Enter Total Budget Amount (Private, not publicly visible)"
            type="number"
            name="budget"
            placeholder="e.g., 1000"
            errors={errors}
            register={register}
            isRequired={true}
          />

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
                name="suggested_min"
                placeholder="e.g., 100"
                errors={errors}
                register={register}
              />
              <CustomInput
                label="Suggested Maximum"
                type="number"
                name="suggested_max"
                placeholder="e.g., 300"
                errors={errors}
                register={register}
              />
            </div>
          )}

          {creatorCompOption === "set-price" && (
            <CustomInput
              label="Fixed Creator Payment"
              type="number"
              name="fixed_price"
              placeholder="e.g., 200"
              errors={errors}
              register={register}
            />
          )}
        </div>
      )}

      {/* Gifted Campaign Configuration */}
      {campaignData.campaign_type === "Gifted" && (
        <div className="space-y-4">
          {/* Payment Type - No Payment */}
          <div className="p-3 bg-gray-50 rounded-lg border">
            <p className="text-sm font-medium text-gray-700 mb-1">Payment Type</p>
            <p className="text-sm text-gray-600">Product Gifting Only</p>
            <p className="text-sm font-medium text-gray-800 mt-2">
              Creator Compensation:{" "}
              <span className="font-semibold text-red-600">$0 (Product Only)</span>
            </p>
          </div>

          <div className="w-full max-w-sm">
            <CustomInput
              label="Product Value"
              type="number"
              name="product_value"
              placeholder="e.g., 75"
              errors={errors}
              register={register}
              isRequired={true}
            />
          </div>
        </div>
      )}

      {/* Affiliate Campaign Configuration */}
      {campaignData.campaign_type === "Affiliate" && (
        <div className="space-y-4">
          {/* Payment Type - Commission */}
          <div className="p-3 bg-gray-50 rounded-lg border">
            <p className="text-sm font-medium text-gray-700 mb-1">Payment Type</p>
            <p className="text-sm text-gray-600">Commission-based (Percentage per sale)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              label="Commission Percentage per Sale"
              type="number"
              name="commission_percentage"
              placeholder="e.g., 10"
              errors={errors}
              register={register}
              isRequired={true}
            />
            <CustomInput
              label="Product Price"
              type="number"
              name="product_price"
              placeholder="e.g., 49.99"
              errors={errors}
              register={register}
              isRequired={true}
            />
          </div>

          {/* Commission Calculator */}
          {campaignData.commission_percentage && campaignData.product_price && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-800 mb-1">Commission Calculation</p>
              <p className="text-sm text-blue-700">
                Creator earns <strong>${commissionPayment.toFixed(2)}</strong> per $
                {campaignData.product_price} sale
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Compensation;
