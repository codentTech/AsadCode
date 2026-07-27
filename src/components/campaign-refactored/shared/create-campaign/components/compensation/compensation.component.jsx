import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import CustomSwitch from "@/common/components/custom-switch/custom-switch.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import CustomRadioGroup from "@/common/components/radio-group/radio-group.component";
import { CAMPAIGN_TYPE, COMPENSATION_TYPE } from "@/common/constants/campaign.constant";
import { CAMPAIGN_TYPE_OPTIONS } from "@/common/constants/options.constant";
import { ExternalLink, RefreshCw, Store } from "lucide-react";
import useCompensation from "./use-compensation.hook";

function Compensation({ campaignData, errors = {}, register, setValue }) {
  const {
    paymentType,
    paymentTypeOptions,
    creatorCompOption,
    creatorCompensationOptions,
    isGiftedCampaign,
    isAffiliateCampaign,
    showPhysicalProductToggle,
    selectedCampaignTypeOption,
    creatorFee,
    isShopifyConnected,
    connectionLoading,
    connectLoading,
    shopInput,
    handleShopInputChange,
    handleInlineConnect,
    shopName,
    productOptions,
    selectedProductOptions,
    selectedGiftedProductOption,
    productsLoading,
    productsError,
    productsErrorMessage,
    hasLoadedProducts,
    productValueFromShopify,
    handleRefreshProducts,
    handleCampaignTypeChange,
    handlePaymentTypeChange,
    handleCreatorCompOptionChange,
    handleAffiliateProductsChange,
    handleGiftedProductChange,
    handleShipsPhysicalChange,
  } = useCompensation({ campaignData, setValue });

  const productsPlaceholder = productsLoading
    ? "Loading products…"
    : productsError
      ? "Could not load products"
      : productOptions.length === 0 && hasLoadedProducts
        ? "No products found"
        : "Select products";

  const giftedProductsPlaceholder = productsLoading
    ? "Loading products…"
    : productsError
      ? "Could not load products"
      : productOptions.length === 0 && hasLoadedProducts
        ? "No products found"
        : "Select a product";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="w-full sm:max-w-sm">
          <SimpleSelect
            label="Campaign Type"
            placeHolder="Select campaign type"
            options={CAMPAIGN_TYPE_OPTIONS}
            name="campaign_type"
            register={register}
            value={selectedCampaignTypeOption}
            onChange={handleCampaignTypeChange}
            errors={errors}
            isRequired={true}
          />
        </div>

        {campaignData.compensation_type && (
          <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <p className="mb-0 text-sm font-medium text-indigo-900">Compensation Type</p>
              {!isGiftedCampaign &&
                campaignData.compensation_type !== COMPENSATION_TYPE.COMMISSION && (
                  <p className="text-sm font-medium text-indigo-900">
                    <span className="font-bold">Creator Fee:</span>{" "}
                    {creatorCompOption === "none" ? (
                      <span>Negotiable</span>
                    ) : typeof creatorFee === "string" ? (
                      `$${creatorFee}`
                    ) : (
                      `$${creatorFee}`
                    )}
                  </p>
                )}
              {isAffiliateCampaign && campaignData.commission_percentage ? (
                <p className="text-sm font-medium text-indigo-900">
                  <span className="font-bold">Commission:</span> {creatorFee}
                </p>
              ) : null}
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
                  <span className="font-semibold text-red-600">Product Gifting Only</span>
                  <br />
                  <span className="text-xs text-indigo-600">
                    Creators receive product only - no monetary compensation
                  </span>
                </>
              ) : null}
              {campaignData.compensation_type === COMPENSATION_TYPE.COMMISSION && (
                <>
                  <span className="font-semibold">Affiliate (commission per sale)</span>
                  <br />
                  <span className="text-xs text-indigo-600">
                    Creators earn a commission on Shopify sales using their unique discount code
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

          {campaignData.compensation_type !== COMPENSATION_TYPE.GIFTED_PRODUCT && (
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
          )}

          {paymentType === "paid" && (
            <div className="space-y-4">
              <CustomRadioGroup
                label="Creator Payment Amount (optional)"
                name="creator_compensation_option"
                radioOptions={[
                  { label: "Negotiable", value: "none" },
                  ...creatorCompensationOptions,
                ]}
                inlineRadioButtons
                value={creatorCompOption}
                onChange={handleCreatorCompOptionChange}
                register={register}
                errorMessage=""
              />

              {creatorCompOption === "suggested" && (
                <div className="space-y-2">
                  <p className="mb-2 text-xs text-gray-600">
                    Enter a minimum and maximum amount that you are comfortable to pay each creator
                  </p>
                  <div className="flex flex-col gap-4 sm:flex-row">
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
                  <p className="mb-2 text-xs text-gray-600">
                    Enter a fixed payment amount per creator
                  </p>
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

      {isAffiliateCampaign && (
        <div className="space-y-4">
          {!isShopifyConnected ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 sm:p-4">
              <div className="mb-3 flex items-start gap-2">
                <Store className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                <div>
                  <p className="text-xs font-semibold text-amber-900 sm:text-sm">
                    Connect Shopify to continue
                  </p>
                  <p className="mt-1 text-[10px] leading-snug text-amber-800 sm:text-xs">
                    Affiliate campaigns need your Shopify store so CleerCut can pick products and
                    track sales. Your draft campaign stays here while you connect.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                <div className="min-w-0 flex-1">
                  <CustomInput
                    label="Store domain"
                    placeholder="mystore.myshopify.com"
                    value={shopInput}
                    onChange={handleShopInputChange}
                  />
                </div>
                <CustomButton
                  text="Connect Shopify"
                  className="btn-primary w-full sm:w-auto"
                  onClick={handleInlineConnect}
                  startIcon={<ExternalLink size={16} />}
                  loading={connectLoading || connectionLoading}
                  disabled={connectLoading || !shopInput.trim()}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-green-800 sm:text-sm">
                  Connected to <span className="font-semibold">{shopName}</span>
                </p>
                <CustomButton
                  text="Refresh products"
                  className="btn-outline w-full sm:w-auto"
                  onClick={handleRefreshProducts}
                  loading={productsLoading}
                  loadingText="Refresh products"
                />
              </div>

              {productsError ? (
                <p className="text-[10px] leading-snug text-red-600 sm:text-xs">
                  {productsErrorMessage ||
                    "Unable to load products from Shopify. Refresh or reconnect your store."}
                </p>
              ) : null}

              {!productsLoading &&
              hasLoadedProducts &&
              productOptions.length === 0 &&
              !productsError ? (
                <p className="text-[10px] leading-snug text-gray-500 sm:text-xs">
                  No products found in your Shopify store. Add products in Shopify, then refresh.
                </p>
              ) : null}

              <SimpleSelect
                label="Which products is this campaign promoting?"
                placeHolder={productsPlaceholder}
                options={productOptions}
                isMulti
                isSearchable
                value={selectedProductOptions}
                onChange={handleAffiliateProductsChange}
                name="shopify_products"
                errors={errors}
                isRequired
                isDisabled={productsLoading || (productsError && productOptions.length === 0)}
              />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                <CustomInput
                  label="When does sales tracking end?"
                  type="date"
                  name="tracking_end_date"
                  errors={errors}
                  register={register}
                  isRequired
                />
                <div>
                  <CustomInput
                    label="Discount for the shopper (%)"
                    type="number"
                    name="customer_discount_percent"
                    placeholder="e.g., 15"
                    errors={errors}
                    register={register}
                    isRequired
                  />
                  <p className="mt-1 text-[10px] leading-snug text-gray-500 sm:text-xs">
                    Same for every creator&apos;s audience.
                  </p>
                </div>
                <div>
                  <CustomInput
                    label="Commission the creator earns (%)"
                    type="number"
                    name="commission_percentage"
                    placeholder="e.g., 10"
                    errors={errors}
                    register={register}
                    isRequired
                  />
                  <p className="mt-1 text-[10px] leading-snug text-gray-500 sm:text-xs">
                    Default; adjustable per creator when hiring.
                  </p>
                </div>
              </div>
              <div>
                <CustomInput
                  label="Optional usage cap (orders)"
                  type="number"
                  name="usage_cap"
                  placeholder="Leave blank for no cap"
                  errors={errors}
                  register={register}
                />
                <p className="mt-1 text-[10px] leading-snug text-gray-500 sm:text-xs">
                  When attributed orders reach this number, live discount codes turn off
                  automatically.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {isGiftedCampaign ? (
        <div className="space-y-4">
          {isShopifyConnected && (
            <div className="space-y-2">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-green-800 sm:text-sm">
                  Connected to <span className="font-semibold">{shopName}</span>
                </p>
                {!isAffiliateCampaign ? (
                  <CustomButton
                    text="Refresh products"
                    className="btn-outline w-full sm:w-auto"
                    onClick={handleRefreshProducts}
                    loading={productsLoading}
                    loadingText="Refresh products"
                  />
                ) : null}
              </div>
              {productsError ? (
                <p className="text-[10px] leading-snug text-red-600 sm:text-xs">
                  {productsErrorMessage ||
                    "Unable to load products from Shopify. Refresh or reconnect your store."}
                </p>
              ) : null}
              <SimpleSelect
                label="Which product are you gifting?"
                placeHolder={giftedProductsPlaceholder}
                options={productOptions}
                isSearchable
                value={selectedGiftedProductOption}
                onChange={handleGiftedProductChange}
                name="gifted_shopify_product"
                isDisabled={productsLoading || (productsError && productOptions.length === 0)}
              />
            </div>
          )}
          <div className="w-full sm:max-w-sm">
            <CustomInput
              label="Your cost per unit (USD)"
              type="number"
              name="product_value"
              placeholder="e.g., 75"
              errors={errors}
              register={register}
              isRequired={true}
            />
            {productValueFromShopify ? (
              <p className="mt-1 text-[10px] leading-snug text-gray-500 sm:text-xs">
                Pulled from Shopify. You can edit if your true cost differs.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {showPhysicalProductToggle ? (
        <CustomSwitch
          label="Will you be shipping a physical product?"
          name="ships_physical_product"
          checked={Boolean(campaignData.ships_physical_product)}
          onChange={handleShipsPhysicalChange}
          register={register}
          inlineLabel
          labelRight={false}
          parentDivClassName="justify-start gap-3"
        />
      ) : null}
    </div>
  );
}

export default Compensation;
