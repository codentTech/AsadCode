import * as Yup from "yup";

export const DEFAULT_FORM_VALUES = {
  marketing_emails: false,
  agree_terms: false,
  country: "",
  city: "",
  country_code: "",
  city_country_code: "",
  state: "",
  state_short: "",
  confirm_password: "",
  latitude: "",
  longitude: "",
  referred_by: "",
};

export const toNullableNumber = (value) =>
  value === "" || value === null ? null : Number(value);

export const normalizeCountry = (country) => ({
  name: country.countryName || country.label || country.name || "",
  code: country.countryCode || country.value || country.code || "",
  countryCode: country.countryCode || country.value || country.code || "",
  dialCode: country.phoneCode || country.phone || "",
});

export const normalizeAutoDetectedCountry = (data) => ({
  name: data.countryName,
  code: data.countryCode,
  countryCode: data.countryCode,
  dialCode: data.dialCode || "",
});

export const normalizeSelectedCity = (city, fallbackCountryCode) => ({
  name: city.cityName || city.label || city.name || "",
  cityName: city.cityName || city.label || city.name || "",
  countryCode: city.countryCode || fallbackCountryCode || "",
  region: city.region || "",
  geonameId: city.geonameId || null,
  latitude: city.latitude ?? null,
  longitude: city.longitude ?? null,
});

export const normalizeAutoDetectedCity = (data) => ({
  name: data.city,
  cityName: data.city,
  countryCode: data.cityCountryCode || data.countryCode || "",
  latitude: typeof data.latitude === "number" ? data.latitude : null,
  longitude: typeof data.longitude === "number" ? data.longitude : null,
});

export const createRegisterValidationSchema = (isCreatorMode) => {
  const baseSchema = {
    first_name: Yup.string().required("First Name is required"),
    last_name: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required")
      .matches(/[0-9]/, "Password requires a number")
      .matches(/[a-z]/, "Password requires a lowercase letter")
      .matches(/[A-Z]/, "Password requires an uppercase letter")
      .matches(/[^A-Za-z0-9]/, "Use Special Character like @ # etc"),
    confirm_password: Yup.string()
      .required("Please confirm your password")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
    date_of_birth: Yup.date()
      .transform((value, originalValue) => {
        if (originalValue === "" || originalValue == null) {
          return undefined;
        }
        return value;
      })
      .required("Date of birth is required")
      .max(new Date(), "Date of birth cannot be in the future"),
    city: Yup.string().required("City is required"),
    country: Yup.string().required("Country is required"),
    country_code: Yup.string().required("Country is required"),
    city_country_code: Yup.string().required("City is required"),
    state: Yup.string().optional(),
    state_short: Yup.string().optional(),
    agree_terms: Yup.boolean().oneOf([true], "You must accept the terms and conditions"),
    marketing_emails: Yup.boolean().default(false),
    latitude: Yup.number()
      .nullable()
      .transform((value, originalValue) => (originalValue === "" ? null : value)),
    longitude: Yup.number()
      .nullable()
      .transform((value, originalValue) => (originalValue === "" ? null : value)),
    referred_by: Yup.string().optional(),
  };

  if (!isCreatorMode) {
    baseSchema.account_type = Yup.string().required("Please select an account type");
  }

  return Yup.object().shape(baseSchema);
};
