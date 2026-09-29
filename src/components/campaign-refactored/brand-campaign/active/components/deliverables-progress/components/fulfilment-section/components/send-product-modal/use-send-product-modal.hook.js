import { useCallback, useEffect, useMemo, useState } from "react";
import { formatShopifySelectionLabel } from "@/common/utils/shopify-product-label.utils";

function isVariantAvailable(variant) {
  if (!variant) return false;
  if (variant.availableForSale === false) return false;
  if (variant.availableForSale === true) return true;
  if (typeof variant.inventoryQuantity === "number" && variant.inventoryQuantity <= 0) {
    return false;
  }
  return true;
}

function buildCountrySelection(address) {
  if (!address?.country && !address?.country_code) return null;
  return {
    countryName: address.country || "",
    countryCode: address.country_code || "",
    name: address.country || "",
    code: address.country_code || "",
  };
}

function buildStateSelection(address) {
  if (!address?.state && !address?.state_short) return null;
  return {
    stateName: address.state || "",
    stateShort: address.state_short || "",
  };
}

function buildCitySelection(address) {
  if (!address?.city) return null;
  return {
    cityName: address.city,
    countryCode: address.country_code || "",
    region: address.state || address.state_short || "",
  };
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
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

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
    setSelectedCountry(buildCountrySelection(shippingAddress));
    setSelectedState(buildStateSelection(shippingAddress));
    setSelectedCity(buildCitySelection(shippingAddress));
  }, [show, initialProductId, initialVariantId, shippingAddress]);

  const selectedProduct = useMemo(
    () => productOptions.find((p) => p.value === productId) || null,
    [productOptions, productId]
  );

  const variantOptions = useMemo(() => {
    const variants = selectedProduct?.variants || [];
    const productTitle = selectedProduct?.label || selectedProduct?.title || "";
    return variants.map((variant) => {
      const available = isVariantAvailable(variant);
      return {
        label: formatShopifySelectionLabel({
          productTitle,
          variantTitle: variant.title,
          sku: variant.sku,
          available,
        }),
        value: variant.id,
        disabled: !available,
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
    () => productOptions.map((p) => ({ label: p.label || p.title, value: p.value })),
    [productOptions]
  );

  const quantityValue = Math.max(1, Math.floor(Number(quantity) || 1));
  const selectedVariant = (selectedProduct?.variants || []).find((v) => v.id === variantId);
  const canSubmit =
    Boolean(productId && variantId && isVariantAvailable(selectedVariant)) && !isSendLoading;

  const selectedVariantDisplayTitle = useMemo(() => {
    if (!selectedVariant?.title) return "";
    return selectedVariant.title === "Default Title" ? "Default" : selectedVariant.title;
  }, [selectedVariant]);

  const handleProductChange = useCallback((option) => {
    const value = typeof option === "object" ? option?.value : option;
    setProductId(value || "");
    setVariantId("");
  }, []);

  const handleVariantChange = useCallback(
    (option) => {
      const value = typeof option === "object" ? option?.value : option;
      if (variantOptions.find((v) => v.value === value)?.disabled) return;
      setVariantId(value || "");
    },
    [variantOptions]
  );

  const handleAddressFieldChange = useCallback((field, value) => {
    setAddressForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleCountrySelect = useCallback((country) => {
    if (!country) {
      setSelectedCountry(null);
      setSelectedState(null);
      setSelectedCity(null);
      setAddressForm((prev) => ({
        ...prev,
        country: "",
        country_code: "",
        state: "",
        state_short: "",
        city: "",
      }));
      return;
    }

    const countryName = country.countryName || country.name || country.label || "";
    const countryCode = country.countryCode || country.code || country.value || "";
    setSelectedCountry({
      countryName,
      countryCode,
      name: countryName,
      code: countryCode,
    });
    setSelectedState(null);
    setSelectedCity(null);
    setAddressForm((prev) => ({
      ...prev,
      country: countryName,
      country_code: countryCode,
      state: "",
      state_short: "",
      city: "",
    }));
  }, []);

  const handleStateSelect = useCallback((state) => {
    if (!state) {
      setSelectedState(null);
      setSelectedCity(null);
      setAddressForm((prev) => ({
        ...prev,
        state: "",
        state_short: "",
        city: "",
      }));
      return;
    }

    const stateName = state.stateName || state.label || "";
    const stateShort = state.stateShort || "";
    setSelectedState({ stateName, stateShort });
    setSelectedCity(null);
    setAddressForm((prev) => ({
      ...prev,
      state: stateName,
      state_short: stateShort,
      city: "",
    }));
  }, []);

  const handleCitySelect = useCallback((city) => {
    if (!city) {
      setSelectedCity(null);
      setAddressForm((prev) => ({ ...prev, city: "" }));
      return;
    }

    const cityName = city.cityName || city.name || city.label || "";
    setSelectedCity({
      cityName,
      countryCode: city.countryCode || "",
      region: city.region || "",
    });
    setAddressForm((prev) => ({ ...prev, city: cityName }));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;
    onSend({
      productId,
      variantId,
      quantity: quantityValue,
      productTitle: selectedProduct?.label || undefined,
      variantTitle: selectedVariantDisplayTitle || undefined,
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
    selectedProduct?.label,
    selectedVariantDisplayTitle,
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
    selectedCountry,
    selectedState,
    selectedCity,
    productSelectOptions,
    variantOptions,
    selectedProductTitle: selectedProduct?.label || "",
    selectedVariantTitle: selectedVariantDisplayTitle,
    quantityValue,
    canSubmit,
    handleProductChange,
    handleVariantChange,
    handleAddressFieldChange,
    handleCountrySelect,
    handleStateSelect,
    handleCitySelect,
    handleSubmit,
    handleClose: onClose,
  };
}
