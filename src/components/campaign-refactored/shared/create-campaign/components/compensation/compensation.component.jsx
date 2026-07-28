import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import CustomSwitch from "@/common/components/custom-switch/custom-switch.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import FieldError from "@/common/components/field-error/field-error.component";
import FieldLabel from "@/common/components/field-label/field-label.component";
import { CAMPAIGN_TYPE, COMPENSATION_TYPE } from "@/common/constants/campaign.constant";
import { CAMPAIGN_TYPE_OPTIONS } from "@/common/constants/options.constant";
import { Check, ExternalLink, Gift, Percent, Store, Video } from "lucide-react";
import useCompensation from "./use-compensation.hook";

const CAMPAIGN_TYPE_META = {
  [CAMPAIGN_TYPE.SPONSORED_POST]: {
    icon: Video,
    description: "Pay creators for sponsored content posts.",
  },
  [CAMPAIGN_TYPE.UGC]: {
    icon: Video,
    description: "Pay for content, or gift product for UGC.",
  },
  [CAMPAIGN_TYPE.GIFTED]: {
    icon: Gift,
    description: "Creators receive product only — no cash fee.",
  },
  [CAMPAIGN_TYPE.AFFILIATE]: {
    icon: Percent,
    description: "Creators earn commission on tracked sales.",
  },
};

function SelectableCard({ selected, onClick, children, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full rounded-lg border px-3 py-2.5 pr-9 text-left transition-colors ${
        selected
          ? "border-primary bg-primary/5"
          : "border-gray-200 bg-gray-100 hover:border-gray-300 hover:bg-gray-50"
      } ${className}`}
    >
      {children}
      {selected ? (
        <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
          <Check className="h-3 w-3" />
        </span>
      ) : (
        <span className="absolute right-2.5 top-2.5 h-5 w-5 rounded-full border border-gray-300 bg-white" />
      )}
    </button>
  );
}

function Compensation({ campaignData, errors = {}, register, setValue }) {
  const {
    paymentType,
    paymentTypeOptions,
    creatorCompOption,
    creatorCompensationOptions,
    isGiftedCampaign,
    isAffiliateCampaign,
    showPhysicalProductToggle,
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

  const creatorPayOptions = [
    { label: "Negotiable", value: "none", detail: "Agree on fee when hiring." },
    ...creatorCompensationOptions.map((option) => ({
      ...option,
      detail:
        option.value === "suggested"
          ? "Show creators a comfortable min–max range."
          : "One fixed amount per creator.",
    })),
  ];

  const creatorFeeLabel =
    creatorCompOption === "none" || creatorFee === "Negotiable"
      ? "Negotiable"
      : typeof creatorFee === "string"
        ? creatorFee.includes("%")
          ? creatorFee
          : `$${creatorFee}`
        : `$${creatorFee || 0}`;

  return (
    <div className="flex flex-col gap-3">
      <section className="rounded-lg border border-gray-200 p-3">
        <FieldLabel label="Campaign Type" isRequired />
        <p className="mt-1 text-[10px] leading-snug text-gray-500 sm:text-xs">
          Choose how this campaign pays or rewards creators.
        </p>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
          {CAMPAIGN_TYPE_OPTIONS.map((option) => {
            const meta = CAMPAIGN_TYPE_META[option.value] || {};
            const Icon = meta.icon || Video;
            const selected = campaignData.campaign_type === option.value;
            return (
              <SelectableCard
                key={option.value}
                selected={selected}
                onClick={() => handleCampaignTypeChange(option)}
              >
                <span className="flex items-start gap-2.5">
                  <span className="rounded-md bg-white p-1.5 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold text-black sm:text-sm">
                      {option.label}
                    </span>
                    <span className="mt-0.5 block text-[10px] leading-snug text-gray-500">
                      {meta.description}
                    </span>
                  </span>
                </span>
              </SelectableCard>
            );
          })}
        </div>
        {errors?.campaign_type ? (
          <FieldError className="mt-2" error={errors.campaign_type.message} />
        ) : null}
      </section>

      <input
        type="hidden"
        {...register("compensation_type", {
          required: "Please choose a campaign type to set compensation",
        })}
        value={campaignData.compensation_type || ""}
        readOnly
      />

      {[CAMPAIGN_TYPE.SPONSORED_POST, CAMPAIGN_TYPE.UGC].includes(campaignData.campaign_type) && (
        <section className="rounded-lg border border-gray-200 p-3">
          {paymentTypeOptions.length > 1 ? (
            <div className="mb-4">
              <FieldLabel label="How would you like to compensate the creator?" />
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                {paymentTypeOptions.map((option) => (
                  <SelectableCard
                    key={option.value}
                    selected={paymentType === option.value}
                    onClick={() => handlePaymentTypeChange(option.value)}
                  >
                    <span className="text-xs font-semibold text-black sm:text-sm">
                      {option.label}
                    </span>
                  </SelectableCard>
                ))}
              </div>
            </div>
          ) : null}

          {campaignData.compensation_type !== COMPENSATION_TYPE.GIFTED_PRODUCT ? (
            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="min-w-0">
                <CustomInput
                  label="Total budget (not publicly visible)"
                  type="number"
                  name="budget"
                  placeholder="e.g., 1000"
                  errors={errors}
                  register={register}
                  isRequired={paymentType === "paid"}
                  disabled={paymentType !== "paid"}
                />
                <p className="mt-1 text-[10px] leading-snug text-gray-500 sm:text-xs">
                  Used for your internal budget tracking only.
                </p>
              </div>
            </div>
          ) : null}

          {paymentType === "paid" ? (
            <div>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <FieldLabel label="Creator payment amount" />
                  <p className="mt-1 text-[10px] leading-snug text-gray-500 sm:text-xs">
                    Optional. Choose how creators see their fee.
                  </p>
                </div>
                <p className="bg-primary text-white px-2.5 py-1.5 rounded-md text-xs font-semibold tabular-nums">
                  Creator fee - {creatorFeeLabel}
                </p>
              </div>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
                {creatorPayOptions.map((option) => (
                  <SelectableCard
                    key={option.value}
                    selected={creatorCompOption === option.value}
                    onClick={() => handleCreatorCompOptionChange(option.value)}
                  >
                    <span className="block text-xs font-semibold text-black sm:text-sm">
                      {option.label}
                    </span>
                    <span className="mt-0.5 block text-[10px] leading-snug text-gray-500">
                      {option.detail}
                    </span>
                  </SelectableCard>
                ))}
              </div>

              {creatorCompOption === "suggested" ? (
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
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
              ) : null}

              {creatorCompOption === "set-price" ? (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2">
                  <CustomInput
                    label="Fixed Creator Payment"
                    type="number"
                    name="creator_fixed_price"
                    placeholder="e.g., 200"
                    errors={errors}
                    register={register}
                  />
                </div>
              ) : null}
            </div>
          ) : null}
        </section>
      )}

      {isAffiliateCampaign ? (
        <section className="rounded-lg border border-gray-200 p-3">
          {!isShopifyConnected ? (
            <div className="rounded-lg border border-gray-200 bg-gray-100 p-3">
              <div className="mb-3 flex items-start gap-2">
                <Store className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="text-xs font-semibold text-black sm:text-sm">
                    Connect Shopify to continue
                  </p>
                  <p className="mt-1 text-[10px] leading-snug text-gray-600 sm:text-xs">
                    Affiliate campaigns need your Shopify store so CleerCut can pick products and
                    track sales.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
                <CustomInput
                  label="Store domain"
                  placeholder="mystore.myshopify.com"
                  value={shopInput}
                  onChange={handleShopInputChange}
                />
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
            <div className="space-y-3">
              <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-gray-700 sm:text-sm">
                  Connected to <span className="font-semibold text-black">{shopName}</span>
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
                <p className="text-[10px] leading-snug text-gray-700 sm:text-xs">
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

              <div className="space-y-3">
                {campaignData.commission_percentage ? (
                  <div className="flex justify-end">
                    <div className="rounded-md border border-primary/20 bg-primary/5 px-2.5 py-1.5 text-right">
                      <p className="text-[10px] font-semibold text-gray-500">Creator fee</p>
                      <p className="text-sm font-bold tabular-nums text-black">{creatorFeeLabel}</p>
                    </div>
                  </div>
                ) : null}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <CustomInput
                    label="When does sales tracking end?"
                    type="date"
                    name="tracking_end_date"
                    errors={errors}
                    register={register}
                    isRequired
                  />
                  <div className="hidden sm:block" />
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
              </div>
            </div>
          )}
        </section>
      ) : null}

      {isGiftedCampaign ? (
        <section className="rounded-lg border border-gray-200 p-3">
          {isShopifyConnected ? (
            <div className="mb-4 space-y-3">
              <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-gray-700 sm:text-sm">
                  Connected to <span className="font-semibold text-black">{shopName}</span>
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
                <p className="text-[10px] leading-snug text-gray-700 sm:text-xs">
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
          ) : null}
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div>
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
        </section>
      ) : null}

      {showPhysicalProductToggle ? (
        <section className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 sm:px-4">
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
        </section>
      ) : null}
    </div>
  );
}

export default Compensation;
