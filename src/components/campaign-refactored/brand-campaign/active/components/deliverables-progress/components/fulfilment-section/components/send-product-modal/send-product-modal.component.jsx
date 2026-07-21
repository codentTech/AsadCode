import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import CustomSwitch from "@/common/components/custom-switch/custom-switch.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
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
    productSelectOptions,
    variantOptions,
    selectedProductTitle,
    selectedVariantTitle,
    quantityValue,
    canSubmit,
    handleProductChange,
    handleVariantChange,
    handleAddressFieldChange,
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

  return (
    <Modal
      show={show}
      onClose={handleClose}
      title={`Send Product to ${creatorName}`}
      size="md"
    >
      <div className="space-y-3 p-3 sm:space-y-4 sm:p-4">
        <p className="text-[11px] leading-snug text-gray-600 sm:text-xs">
          CleerCut creates a free Shopify order for this creator. The creator never pays for
          shipping.
        </p>

        {productsLoading ? (
          <p className="text-xs text-gray-500">Loading products…</p>
        ) : (
          <>
            <SimpleSelect
              label="Product"
              options={productSelectOptions}
              value={productId}
              onChange={handleProductChange}
              placeHolder="Select product"
              isRequired
            />
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
          </>
        )}

        <div className="rounded border border-gray-200 bg-gray-50 p-2.5 sm:p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h5 className="text-[10px] font-semibold text-gray-700 sm:text-xs">
              Shipping address
            </h5>
            <CustomSwitch
              checked={editAddress}
              onChange={(e) => setEditAddress(Boolean(e.target.checked))}
              label="Edit for this order only"
              labelClassName="text-[10px] sm:text-xs"
            />
          </div>
          {!editAddress ? (
            shippingLines?.length ? (
              <div className="space-y-1">
                {shippingLines.map((line) => (
                  <p key={line} className="text-[10px] text-gray-700 sm:text-xs">
                    {line}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-[10px] italic text-gray-500 sm:text-xs">
                No shipping address on file. Enable edit to enter one for this order.
              </p>
            )
          ) : (
            <div className="space-y-2">
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
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <CustomInput
                  label="City"
                  value={addressForm.city}
                  onChange={(e) => handleAddressFieldChange("city", e.target.value)}
                />
                <CustomInput
                  label="State"
                  value={addressForm.state}
                  onChange={(e) => handleAddressFieldChange("state", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <CustomInput
                  label="ZIP"
                  value={addressForm.zipCode}
                  onChange={(e) => handleAddressFieldChange("zipCode", e.target.value)}
                />
                <CustomInput
                  label="Country"
                  value={addressForm.country}
                  onChange={(e) => handleAddressFieldChange("country", e.target.value)}
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

        <div className="rounded border border-gray-200 bg-white p-2.5 sm:p-3">
          <h5 className="mb-1 text-[10px] font-semibold text-gray-700 sm:text-xs">Summary</h5>
          <p className="text-[10px] text-gray-700 sm:text-xs">
            {selectedProductTitle || "Product"}
            {selectedVariantTitle ? ` · ${selectedVariantTitle}` : ""}
            {` · Qty ${quantityValue}`}
          </p>
          <p className="mt-1 text-[10px] text-gray-500 sm:text-xs">
            Free gift order · Creator does not pay shipping
          </p>
        </div>

        {sendError ? (
          <p className="text-[10px] text-red-600 sm:text-xs">{sendError}</p>
        ) : null}

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <CustomButton
            text="Cancel"
            className="btn-outline w-full sm:w-auto"
            onClick={handleClose}
            disabled={isSendLoading}
          />
          <CustomButton
            text={isSendLoading ? "Sending…" : "Send Product"}
            className="btn-primary w-full sm:w-auto"
            onClick={handleSubmit}
            disabled={!canSubmit}
          />
        </div>
      </div>
    </Modal>
  );
}
