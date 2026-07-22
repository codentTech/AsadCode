import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import CustomSwitch from "@/common/components/custom-switch/custom-switch.component";
import CitySelect from "@/common/components/dropdowns/city-select/city-select.component";
import CountrySelect from "@/common/components/dropdowns/country-select/country-select.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import StateSelect from "@/common/components/dropdowns/state-select/state-select.component";
import { Skeleton } from "@/common/components/loader/skeleton-loader.component";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { Gift, MapPin, Package } from "lucide-react";
import useSendProductModal from "./use-send-product-modal.hook";

export default function SendProductModal({
  show,
  creatorName,
  productOptions,
  productsLoading,
  initialProductId,
  initialVariantId,
  shippingAddress,
  shippingLines,
  isSendLoading,
  sendError,
  onSend,
  onClose,
}) {
  const {
    productId,
    variantId,
    quantity,
    setQuantity,
    giftNote,
    setGiftNote,
    editAddress,
    setEditAddress,
    addressForm,
    selectedCountry,
    selectedState,
    selectedCity,
    productSelectOptions,
    variantOptions,
    selectedProductTitle,
    selectedVariantTitle,
    quantityValue,
    canSubmit,
    handleProductChange,
    handleVariantChange,
    handleAddressFieldChange,
    handleCountrySelect,
    handleStateSelect,
    handleCitySelect,
    handleSubmit,
    handleClose,
  } = useSendProductModal({
    show,
    productOptions,
    initialProductId,
    initialVariantId,
    shippingAddress,
    isSendLoading,
    onSend,
    onClose,
  });

  const countryCode = selectedCountry?.countryCode || selectedCountry?.code || "";

  return (
    <Modal show={show} onClose={handleClose} title={`Send Product to ${creatorName}`} size="md">
      <div className="space-y-3 sm:space-y-4">
        <p className="text-[11px] leading-snug text-gray-600 sm:text-xs">
          CleerCut creates a free Shopify order for this creator. The creator never pays for
          shipping.
        </p>

        {productsLoading ? (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-8 w-full" />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-14" />
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          </div>
        ) : (
          <>
            <SimpleSelect
              label="Product"
              options={productSelectOptions}
              value={productId}
              onChange={handleProductChange}
              placeHolder="Select product"
              isRequired
              isSearchable
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:items-end">
              <SimpleSelect
                label="Variant"
                options={variantOptions}
                value={variantId}
                onChange={handleVariantChange}
                placeHolder="Select variant"
                isRequired
              />
              <CustomInput
                label="Quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min={1}
              />
            </div>
          </>
        )}

        <div className="rounded-lg border border-gray-200 bg-white p-2.5 sm:p-3">
          <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-500" />
              <h5 className="text-[10px] font-semibold text-gray-800 sm:text-xs">
                Shipping address
              </h5>
            </div>
            <CustomSwitch
              checked={editAddress}
              onChange={(e) => setEditAddress(Boolean(e.target.checked))}
              label="Edit for this order only"
              labelClassName="text-[10px] sm:text-xs"
              labelRight={false}
            />
          </div>
          {!editAddress ? (
            shippingLines?.length ? (
              <div className="rounded-md border border-gray-100 bg-gray-50 px-2.5 py-2 sm:px-3 sm:py-2.5">
                <div className="space-y-1">
                  {shippingLines.map((line) => (
                    <p
                      key={line}
                      className="text-left text-[11px] leading-snug text-gray-700 sm:text-xs"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 px-2.5 py-3 text-center">
                <p className="text-[10px] italic text-gray-500 sm:text-xs">
                  No shipping address on file. Enable edit to enter one for this order.
                </p>
              </div>
            )
          ) : (
            <div className="space-y-2 sm:space-y-3">
              <CustomInput
                label="Street"
                value={addressForm.street}
                onChange={(e) => handleAddressFieldChange("street", e.target.value)}
              />
              <CustomInput
                label="Line 2"
                value={addressForm.line2}
                onChange={(e) => handleAddressFieldChange("line2", e.target.value)}
              />
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                <CountrySelect
                  label="Country"
                  name="send_product_country"
                  value={selectedCountry}
                  onChange={handleCountrySelect}
                  isRequired
                />
                <StateSelect
                  label="State or Province"
                  name="send_product_state"
                  countryCode={countryCode}
                  countryCodes={countryCode ? [countryCode] : []}
                  value={selectedState}
                  onChange={handleStateSelect}
                />
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                <CitySelect
                  label="City"
                  name="send_product_city"
                  countryCode={countryCode}
                  countryCodes={countryCode ? [countryCode] : []}
                  stateName={selectedState?.stateName || ""}
                  stateShort={selectedState?.stateShort || ""}
                  value={selectedCity}
                  onChange={handleCitySelect}
                  isRequired
                />
                <CustomInput
                  label="ZIP"
                  value={addressForm.zipCode}
                  onChange={(e) => handleAddressFieldChange("zipCode", e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <TextArea
          label="Gift note (optional)"
          value={giftNote}
          onChange={(e) => setGiftNote(e.target.value)}
          placeholder="Add a short note for the packing slip"
          rows={3}
        />

        <div className="rounded-lg border border-indigo-100 bg-indigo-50/60 p-2.5 sm:p-3">
          <div className="mb-2 flex items-center gap-1.5">
            <Package className="h-3.5 w-3.5 shrink-0 text-indigo-600" />
            <h5 className="text-[10px] font-semibold text-indigo-900 sm:text-xs">Order summary</h5>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-start justify-between gap-3 rounded-md bg-gray-200 px-2.5 py-2">
              <span className="text-[10px] text-gray-600 sm:text-xs">Product</span>
              <span className="max-w-[65%] text-right text-[10px] font-medium text-gray-900 sm:text-xs">
                {selectedProductTitle || "—"}
              </span>
            </div>
            <div className="flex items-start justify-between gap-3 rounded-md bg-gray-200 px-2.5 py-2">
              <span className="text-[10px] text-gray-600 sm:text-xs">Variant</span>
              <span className="max-w-[65%] text-right text-[10px] font-medium text-gray-900 sm:text-xs">
                {selectedVariantTitle || "—"}
              </span>
            </div>
            <div className="flex items-start justify-between gap-3 rounded-md bg-gray-200 px-2.5 py-2">
              <span className="text-[10px] text-gray-600 sm:text-xs">Quantity</span>
              <span className="text-[10px] font-medium tabular-nums text-gray-900 sm:text-xs">
                {quantityValue}
              </span>
            </div>
          </div>
          <div className="mt-2.5 flex items-start gap-1.5 border-t border-indigo-100 pt-2">
            <Gift className="mt-0.5 h-3 w-3 shrink-0 text-indigo-500" />
            <p className="text-[10px] leading-snug text-indigo-700 sm:text-xs">
              Free gift order · Creator does not pay shipping
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <CustomButton
            text="Cancel"
            className="btn-outline"
            onClick={handleClose}
            disabled={isSendLoading}
          />
          <CustomButton
            text="Send Product"
            className="btn-primary"
            onClick={handleSubmit}
            disabled={!canSubmit}
            loading={isSendLoading}
          />
        </div>
      </div>
    </Modal>
  );
}
