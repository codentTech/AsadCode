"use client";

import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import CustomRadioGroup from "@/common/components/radio-group/radio-group.component";
import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { CAMPAIGN_TYPE_OPTIONS } from "@/common/constants/options.constant";

/**
 * Compensation Component
 *
 * Handles campaign type selection and compensation configuration
 * including fixed payments, suggested ranges, affiliate commissions, etc.
 */
function Compensation({ campaignData, handleChange, errors = {}, register }) {
  const [creatorCompOption, setCreatorCompOption] = useState("suggested"); // Default to Suggested Range
  const [paymentType, setPaymentType] = useState("paid"); // Default to Paid Collaboration

  const paymentTypeOptions = [
    { label: "Paid Collaboration", value: "paid" },
    { label: "Gifted Product", value: "gifted" },
  ];

  const paymentOptions = [
    { label: "Suggested Range", value: "suggested" },
    { label: "Set Fixed Price", value: "set-price" },
  ];

  // Calculate commission payment for affiliate campaigns
  const commissionPayment =
    (Number(campaignData.commission_percentage) / 100) * Number(campaignData.product_price || 0);

  // Set default radio button selections when campaign type is Sponsored Post or UGC
  useEffect(() => {
    if (["SPONSORED_POST", "UGC"].includes(campaignData.campaign_type)) {
      setPaymentType("paid");
      setCreatorCompOption("suggested");
    }
  }, [campaignData.campaign_type]);

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
      "creator_fixed_price",
    ];
    fieldsToReset.forEach((field) => {
      handleChange({ target: { name: field, value: "" } });
    });

    // Reset payment type and creator compensation option
    setPaymentType("paid");
    setCreatorCompOption("suggested");

    // Set appropriate compensation type based on campaign type
    let compensationType = "";
    switch (option.value) {
      case "SPONSORED_POST":
      case "UGC":
        compensationType = "FIXED"; // Default for these types
        break;
      case "GIFTED":
        compensationType = "GIFTED"; // No payment, just product
        break;
      case "AFFILIATE":
        compensationType = "COMMISSION"; // Commission-based
        break;
      default:
        compensationType = "";
    }
    handleChange({ target: { name: "compensation_type", value: compensationType } });
  };

  return (
    <div className="space-y-6">
      {/* Campaign Type Selection */}
      <div className="space-y-2">
        <div className="w-full max-w-sm">
          <SimpleSelect
            label="Campaign Type"
            placeHolder="Select campaign type"
            options={CAMPAIGN_TYPE_OPTIONS}
            name="campaign_type"
            register={register}
            value={campaignData.campaign_type}
            onChange={handleCampaignTypeChange}
            errors={errors}
            isRequired={true}
          />
        </div>

        {/* Compensation Type Display */}
        {campaignData.compensation_type && (
          <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
            <p className="text-sm font-medium text-indigo-900 mb-1">Compensation Type</p>
            <p className="text-sm text-indigo-700">
              {campaignData.compensation_type === "FIXED" && (
                <>
                  <span className="font-semibold">Fixed Payment (Budget-based)</span>
                  <br />
                  <span className="text-xs text-indigo-600">
                    Set a budget and choose between suggested range or fixed price for creators
                  </span>
                </>
              )}
              {campaignData.compensation_type === "GIFTED" && (
                <>
                  <span className="font-semibold text-red-600">
                    Product Gifting Only ($0 (can't be changed)
                  </span>
                  <br />
                  <span className="text-xs text-indigo-600">
                    Creators receive product only - no monetary compensation
                  </span>
                </>
              )}
              {campaignData.compensation_type === "COMMISSION" && (
                <>
                  <span className="font-semibold">Commission-based (Percentage per sale)</span>
                  <br />
                  <span className="text-xs text-indigo-600">
                    Creators earn a percentage commission on each sale they generate
                  </span>
                </>
              )}
            </p>
          </div>
        )}

        {/* Hidden input for compensation_type */}
        <input
          type="hidden"
          {...register("compensation_type")}
          value={campaignData.compensation_type || ""}
        />
      </div>

      {/* Sponsored Post & UGC Campaign Configuration */}
      {["SPONSORED_POST", "UGC"].includes(campaignData.campaign_type) && (
        <div className="space-y-4">
          {/* How would you like to compensate the creator? */}
          <CustomRadioGroup
            label="How would you like to compensate the creator?"
            name="paymentType"
            radioOptions={paymentTypeOptions}
            inlineRadioButtons
            value={paymentType}
            onChange={(val) => setPaymentType(val)}
          />

          {/* Paid Collaboration Configuration */}
          {paymentType === "paid" && (
            <div className="space-y-4">
              {/* Total Budget */}
              <CustomInput
                label="Enter total budget amount (Not publicly visible, for budget management only)"
                type="number"
                name="budget"
                placeholder="e.g., 1000"
                errors={errors}
                register={register}
                isRequired={true}
              />

              {/* Creator Compensation Options */}
              <CustomRadioGroup
                label="Creator compensation: (select one)"
                name="creatorComp"
                radioOptions={paymentOptions}
                inlineRadioButtons
                value={creatorCompOption}
                onChange={(val) => setCreatorCompOption(val)}
              />

              {/* Compensation Inputs */}
              {creatorCompOption === "suggested" && (
                <div className="space-y-2">
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
                </div>
              )}

              {creatorCompOption === "set-price" && (
                <div className="space-y-2">
                  <CustomInput
                    label="Fixed Creator Payment"
                    type="number"
                    name="creator_fixed_price"
                    placeholder="e.g., 200"
                    errors={errors}
                    register={register}
                  />
                </div>
              )}
            </div>
          )}

          {/* Gifted Product Configuration */}
          {paymentType === "gifted" && (
            <div className="space-y-4">
              <div className="w-full max-w-sm">
                <CustomInput
                  label="Product Value:"
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
        </div>
      )}

      {/* Gifted Campaign Configuration */}
      {campaignData.campaign_type === "GIFTED" && (
        <div className="space-y-4">
          {/* Product Value Input */}
          <div className="w-full max-w-sm">
            <CustomInput
              label="Product Value:"
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
      {campaignData.campaign_type === "AFFILIATE" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              label="% commission per sale (input)"
              type="number"
              name="commission_percentage"
              placeholder="e.g., 10"
              errors={errors}
              register={register}
              isRequired={true}
            />
            <CustomInput
              label="Product price (input)"
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
              <p className="text-sm font-medium text-blue-800 mb-1">
                Creator payout per sale (Automatically calculates % x product price)
              </p>
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
