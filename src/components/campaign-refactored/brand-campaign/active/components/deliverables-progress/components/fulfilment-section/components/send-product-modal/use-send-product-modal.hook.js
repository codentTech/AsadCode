import { useCallback, useEffect, useMemo, useState } from "react";

function isVariantAvailable(variant) {
  if (!variant) return false;
  if (variant.availableForSale === false) return false;
  if (typeof variant.inventoryQuantity === "number" && variant.inventoryQuantity <= 0) {
    return false;
  }
  return true;
}

export default function useSendProductModal({
  show,
  productOptions,
  initialProductId,
  initialVariantId,
  shippingAddress,
  isSendLoading,
  onSend,
  onClose,
}) {
  const [productId, setProductId] = useState("");
  const [variantId, setVariantId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [giftNote, setGiftNote] = useState("");
  const [editAddress, setEditAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    street: "",
    line2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    country_code: "",
    state_short: "",
  });

  useEffect(() => {
    if (!show) return;
    setProductId(initialProductId || "");
    setVariantId(initialVariantId || "");
    setQuantity("1");
    setGiftNote("");
    setEditAddress(false);
    setAddressForm({
      street: shippingAddress?.street || "",
      line2: shippingAddress?.line2 || "",
      city: shippingAddress?.city || "",
      state: shippingAddress?.state || "",
      zipCode: shippingAddress?.zipCode || "",
      country: shippingAddress?.country || "",
      country_code: shippingAddress?.country_code || "",
      state_short: shippingAddress?.state_short || "",
    });
  }, [show, initialProductId, initialVariantId, shippingAddress]);

  const selectedProduct = useMemo(
    () => productOptions.find((p) => p.value === productId) || null,
    [productOptions, productId]
  );

  const variantOptions = useMemo(() => {
    const variants = selectedProduct?.variants || [];
    return variants.map((variant) => {
      const available = isVariantAvailable(variant);
      return {
        label: available ? variant.title : `${variant.title} (Out of stock)`,
        value: variant.id,
        disabled: !available,
        className: available ? "" : "text-gray-400",
      };
    });
  }, [selectedProduct]);

  useEffect(() => {
    if (!show || !productId) return;
    const stillValid = variantOptions.some((v) => v.value === variantId && !v.disabled);
    if (stillValid) return;
    const firstAvailable = variantOptions.find((v) => !v.disabled);
    setVariantId(firstAvailable?.value || "");
  }, [show, productId, variantOptions, variantId]);

  const productSelectOptions = useMemo(
    () => productOptions.map((p) => ({ label: p.label, value: p.value })),
    [productOptions]
  );

  const quantityValue = Math.max(1, Math.floor(Number(quantity) || 1));
  const selectedVariant = (selectedProduct?.variants || []).find((v) => v.id === variantId);
  const canSubmit =
    Boolean(productId && variantId && isVariantAvailable(selectedVariant)) && !isSendLoading;

  const handleProductChange = useCallback((option) => {
    const value = typeof option === "object" ? option?.value : option;
    setProductId(value || "");
    setVariantId("");
  }, []);

  const handleVariantChange = useCallback((option) => {
    const value = typeof option === "object" ? option?.value : option;
    if (variantOptions.find((v) => v.value === value)?.disabled) return;
    setVariantId(value || "");
  }, [variantOptions]);

  const handleAddressFieldChange = useCallback((field, value) => {
    setAddressForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;
    onSend({
      productId,
      variantId,
      quantity: quantityValue,
      giftNote: giftNote.trim() || undefined,
      shippingAddressOverride: editAddress
        ? {
            street: addressForm.street,
            line2: addressForm.line2 || undefined,
            city: addressForm.city,
            state: addressForm.state || undefined,
            state_short: addressForm.state_short || undefined,
            zipCode: addressForm.zipCode,
            country: addressForm.country,
            country_code: addressForm.country_code || undefined,
          }
        : undefined,
    });
  }, [
    canSubmit,
    onSend,
    productId,
    variantId,
    quantityValue,
    giftNote,
    editAddress,
    addressForm,
  ]);

  return {
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
    selectedProductTitle: selectedProduct?.label || "",
    selectedVariantTitle: selectedVariant?.title || "",
    quantityValue,
    canSubmit,
    handleProductChange,
    handleVariantChange,
    handleAddressFieldChange,
    handleSubmit,
    handleClose: onClose,
  };
}
