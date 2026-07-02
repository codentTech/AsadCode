"use client";

import { getUser } from "@/common/utils/users.util";
import { updateCreatorPreferences } from "@/provider/features/users/users.slice";
import { DollarSign, Gift, Percent } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

const ETHNICITY_OPTIONS = [
  "Asian",
  "Black or African descent",
  "Hispanic or Latino",
  "Middle Eastern or North African",
  "Native American or Indigenous",
  "Pacific Islander",
  "White",
  "Mixed",
  "Other",
  "Prefer not to say",
];

const emptyShippingAddress = () => ({
  street: "",
  line2: "",
  line3: "",
  city: "",
  city_country_code: "",
  state: "",
  zipCode: "",
  country: "",
  country_code: "",
});

export default function usePreferredCollaborationType() {
  const dispatch = useDispatch();
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedEthnicity, setSelectedEthnicity] = useState("");
  const [inPersonOpportunities, setInPersonOpportunities] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(emptyShippingAddress);
  const [isLoading, setIsLoading] = useState(true);
  const [countrySelection, setCountrySelection] = useState(null);
  const [citySelection, setCitySelection] = useState(null);

  const campaignTypes = useMemo(
    () => [
      {
        id: "sponsored",
        label: "Sponsored Post",
        desc: "Get paid to post on your own platform",
        icon: DollarSign,
      },
      {
        id: "ugc",
        label: "UGC",
        desc: "Create content for brands to post on their platforms or in ads",
        icon: Gift,
      },
      {
        id: "gifted",
        label: "Gifted",
        desc: "Receive free products in exchange for content",
        icon: Gift,
      },
      {
        id: "affiliate",
        label: "Affiliate",
        desc: "Earn commission for driving sales",
        icon: Percent,
      },
    ],
    []
  );

  const countryCode = countrySelection?.countryCode || shippingAddress?.country_code || "";

  useEffect(() => {
    const user = getUser();
    if (user?.creator_profile) {
      const cp = user.creator_profile;
      if (Array.isArray(cp.campaign_types)) {
        setSelectedTypes(cp.campaign_types);
      }
      if (Array.isArray(cp.languages)) {
        setSelectedLanguages(cp.languages);
      }
      if (typeof cp.ethnicity === "string" && cp.ethnicity) {
        setSelectedEthnicity(cp.ethnicity);
      }
      if (cp.in_person_opportunities !== undefined && cp.in_person_opportunities !== null) {
        setInPersonOpportunities(cp.in_person_opportunities);
      }
      if (cp.shipping_address && typeof cp.shipping_address === "object") {
        setShippingAddress({ ...emptyShippingAddress(), ...cp.shipping_address });
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (shippingAddress?.country && shippingAddress?.country_code) {
      setCountrySelection((prev) =>
        prev?.countryCode === shippingAddress.country_code
          ? prev
          : {
              name: shippingAddress.country,
              countryCode: shippingAddress.country_code,
              code: shippingAddress.country_code,
            }
      );
    } else if (!shippingAddress?.country) {
      setCountrySelection(null);
    }
  }, [shippingAddress?.country, shippingAddress?.country_code]);

  useEffect(() => {
    if (shippingAddress?.city) {
      setCitySelection((prev) =>
        prev?.name === shippingAddress.city
          ? prev
          : {
              name: shippingAddress.city,
              cityName: shippingAddress.city,
              countryCode:
                shippingAddress?.city_country_code || shippingAddress?.country_code || "",
            }
      );
    } else {
      setCitySelection(null);
    }
  }, [shippingAddress?.city, shippingAddress?.city_country_code, shippingAddress?.country_code]);

  const toggleCampaignType = useCallback((typeId) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId) ? prev.filter((id) => id !== typeId) : [...prev, typeId]
    );
  }, []);

  const handleLanguagesChange = useCallback((languages) => {
    setSelectedLanguages(Array.isArray(languages) ? languages : []);
  }, []);

  const handleEthnicityChange = useCallback((ethnicity) => {
    setSelectedEthnicity((prev) => (prev === ethnicity ? "" : ethnicity));
  }, []);

  const handleInPersonChange = useCallback((value) => {
    setInPersonOpportunities(value === "yes");
  }, []);

  const handleShippingChange = useCallback((field, value) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleCountrySelect = useCallback((country) => {
    if (!country) {
      setCountrySelection(null);
      setShippingAddress((prev) => ({
        ...prev,
        country: "",
        country_code: "",
        city: "",
        city_country_code: "",
      }));
      setCitySelection(null);
      return;
    }

    const normalized = {
      name: country.countryName || country.label || country.name || "",
      countryCode: country.countryCode || country.value || country.code || "",
    };

    setCountrySelection(normalized);
    setShippingAddress((prev) => ({
      ...prev,
      country: normalized.name,
      country_code: normalized.countryCode,
      city: "",
      city_country_code: normalized.countryCode,
    }));
    setCitySelection(null);
  }, []);

  const handleCitySelect = useCallback(
    (city) => {
      if (!city) {
        setCitySelection(null);
        setShippingAddress((prev) => ({
          ...prev,
          city: "",
          city_country_code: "",
        }));
        return;
      }

      const normalized = {
        name: city.cityName || city.label || city.name || "",
        countryCode: city.countryCode || city.country || countryCode || "",
        cityName: city.cityName || city.label || city.name || "",
      };

      setCitySelection(normalized);
      setShippingAddress((prev) => ({
        ...prev,
        city: normalized.name,
        city_country_code: normalized.countryCode,
      }));
    },
    [countryCode]
  );

  const handleSavePreferences = useCallback(() => {
    setIsLoading(true);
    const preferences = {
      campaignTypes: selectedTypes,
      languages: selectedLanguages,
      inPersonOpportunities: inPersonOpportunities ?? false,
      shippingAddress,
    };
    if (selectedEthnicity != null && String(selectedEthnicity).trim() !== "") {
      preferences.ethnicity = selectedEthnicity;
    }
    dispatch(updateCreatorPreferences(preferences)).then((action) => {
      if (updateCreatorPreferences.fulfilled.match(action) && action.payload?.success) {
        getUser(action.payload?.data);
      }
      setIsLoading(false);
    });
  }, [
    dispatch,
    selectedTypes,
    selectedLanguages,
    selectedEthnicity,
    inPersonOpportunities,
    shippingAddress,
  ]);

  return {
    campaignTypes,
    ethnicityOptions: ETHNICITY_OPTIONS,
    selectedTypes,
    selectedLanguages,
    selectedEthnicity,
    inPersonOpportunities,
    shippingAddress,
    countrySelection,
    citySelection,
    countryCode,
    isLoading,
    toggleCampaignType,
    handleLanguagesChange,
    handleEthnicityChange,
    handleInPersonChange,
    handleShippingChange,
    handleCountrySelect,
    handleCitySelect,
    handleSavePreferences,
  };
}
