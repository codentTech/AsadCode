"use client";

import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import CustomRadioGroup from "@/common/components/radio-group/radio-group.component";
import { CAMPAIGN_TYPE_OPTIONS } from "@/common/constants/options.constant";
import { CAMPAIGN_TYPE, COMPENSATION_TYPE } from "@/common/constants/campaign.constant";
import useCompensation from "./use-compensation.hook";

function Compensation({ campaignData, errors = {}, register, setValue }) {
  const {
    paymentType,
    paymentTypeOptions,
    creatorCompOption,
    creatorCompensationOptions,
    commissionPayment,
    handleCampaignTypeChange,
    handlePaymentTypeChange,
    handleCreatorCompOptionChange,
  } = useCompensation({ campaignData, setValue });

  const creatorFee =
    campaignData.campaign_type === CAMPAIGN_TYPE.SPONSORED_POST ||
    campaignData.campaign_type === CAMPAIGN_TYPE.UGC
      ? creatorCompOption === "set-price"
        ? campaignData.creator_fixed_price || 0
        : `${campaignData.suggested_min || 0} - ${campaignData.suggested_max || 0} (Range)` || 0
      : campaignData.campaign_type === CAMPAIGN_TYPE.GIFTED || paymentType === "gifted"
        ? campaignData.product_value || 0
        : campaignData.campaign_type === CAMPAIGN_TYPE.AFFILIATE
          ? commissionPayment || 0
          : 0;

  const requireCreatorCompensation =
    [CAMPAIGN_TYPE.SPONSORED_POST, CAMPAIGN_TYPE.UGC].includes(campaignData.campaign_type) &&
    paymentType === "paid";

  return (
    <div className="space-y-6">
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

        {campaignData.compensation_type && (
          <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
            <div className="flex justify-between">
              <p className="text-sm font-medium text-indigo-900 mb-1">Compensation Type</p>
              <p className="text-sm font-medium text-indigo-900 mb-1">
                <span className="font-bold">Creator Fee:</span> ${creatorFee}
              </p>
            </div>
            <p className="text-sm text-indigo-700">
              {campaignData.compensation_type === COMPENSATION_TYPE.PAID &&
              paymentType === "paid" ? (
                <>
                  <span className="font-semibold">Fixed Payment (Budget-based)</span>
                  <br />
                  <span className="text-xs text-indigo-600">
                    Set a budget and choose between suggested range or fixed price for creators
                  </span>
                </>
              ) : null}
              {campaignData.compensation_type === COMPENSATION_TYPE.GIFTED_PRODUCT ||
              paymentType === "gifted" ? (
                <>
                  <span className="font-semibold text-red-600">
                    Product Gifting Only (${campaignData.product_value || 0} (can't be changed)
                  </span>
                  <br />
                  <span className="text-xs text-indigo-600">
                    Creators receive product only - no monetary compensation
                  </span>
                </>
              ) : null}
              {campaignData.compensation_type === COMPENSATION_TYPE.COMMISSION && (
                <>
                  <span className="font-semibold">Commission-based (Percentage per sale)</span>
                  <br />
                  <span className="text-xs text-indigo-600">
                    Creator payout per sale (Automatically calculates % x product price)
                  </span>
                </>
              )}
            </p>
          </div>
        )}

        <input
          type="hidden"
          {...register("compensation_type", {
            required: "Please choose a campaign type to set compensation",
          })}
          value={campaignData.compensation_type || ""}
          readOnly
        />
      </div>

      {[CAMPAIGN_TYPE.SPONSORED_POST, CAMPAIGN_TYPE.UGC].includes(campaignData.campaign_type) && (
        <div className="space-y-4">
          {paymentTypeOptions.length > 0 && (
            <CustomRadioGroup
              label="How would you like to compensate the creator?"
              name="paymentType"
              radioOptions={paymentTypeOptions}
              inlineRadioButtons
              value={paymentType}
              onChange={handlePaymentTypeChange}
              errorMessage=""
            />
          )}

          <CustomInput
            label="Enter total budget amount (Not publicly visible, for budget management only)"
            type="number"
            name="budget"
            placeholder="e.g., 1000"
            errors={errors}
            register={register}
            isRequired={paymentType === "paid"}
            disabled={paymentType !== "paid"}
          />

          {paymentType === "paid" && (
            <div className="space-y-4">
              <CustomRadioGroup
                label="Creator compensation (optional)"
                name="creator_compensation_option"
                radioOptions={creatorCompensationOptions}
                inlineRadioButtons
                value={creatorCompOption}
                onChange={handleCreatorCompOptionChange}
                errorMessage=""
              />

              {creatorCompOption === "suggested" && (
                <div className="space-y-2">
                  <div className="flex gap-4">
                    <CustomInput
                      label="Suggested Minimum (optional)"
                      type="number"
                      name="suggested_min"
                      placeholder="e.g., 100"
                      errors={errors}
                      register={register}
                      isRequired={false}
                    />
                    <CustomInput
                      label="Suggested Maximum (optional)"
                      type="number"
                      name="suggested_max"
                      placeholder="e.g., 300"
                      errors={errors}
                      register={register}
                      isRequired={false}
                    />
                  </div>
                </div>
              )}

              {creatorCompOption === "set-price" && (
                <div className="space-y-2">
                  <CustomInput
                    label="Fixed Creator Payment (optional)"
                    type="number"
                    name="creator_fixed_price"
                    placeholder="e.g., 200"
                    errors={errors}
                    register={register}
                    isRequired={false}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {campaignData.campaign_type === CAMPAIGN_TYPE.GIFTED || paymentType === "gifted" ? (
        <div className="space-y-4">
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
      ) : null}

      {campaignData.campaign_type === CAMPAIGN_TYPE.AFFILIATE && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              label="Product price"
              type="number"
              name="product_price"
              placeholder="e.g., 49.99"
              errors={errors}
              register={register}
              isRequired={true}
            />
            <CustomInput
              label="% commission per sale"
              type="number"
              name="commission_percentage"
              placeholder="e.g., 10"
              errors={errors}
              register={register}
              isRequired={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Compensation;
