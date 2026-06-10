import { CAMPAIGN_TYPE, COMPENSATION_TYPE } from "@/common/constants/campaign.constant";
import * as Yup from "yup";

const emptyToUndefined = (value, originalValue) => {
  return originalValue === "" ? undefined : value;
};

const emptyToNull = (value, originalValue) => {
  if (originalValue === "" || originalValue === null || originalValue === undefined) {
    return null;
  }
  return value;
};

export const validationSchema = Yup.object().shape({
  campaign_title: Yup.string().required("Campaign title is required"),
  niches: Yup.array().min(1, "At least one niche is required"),

  min_combined_followers: Yup.number()
    .transform(emptyToUndefined)
    .typeError("Minimum combined followers must be a valid number")
    .positive("Minimum combined followers must be a positive number")
    .required("Minimum combined followers is required"),
  required_platforms: Yup.array().min(1, "At least one platform is required"),

  campaign_type: Yup.string().required("Campaign type is required"),
  compensation_type: Yup.string()
    .oneOf(
      [COMPENSATION_TYPE.PAID, COMPENSATION_TYPE.GIFTED_PRODUCT, COMPENSATION_TYPE.COMMISSION, ""],
      "Compensation type must be PAID, GIFTED_PRODUCT, COMMISSION or empty"
    )
    .required("Compensation type is required"),
  budget: Yup.number()
    .transform(emptyToUndefined)
    .when(["campaign_type", "compensation_type"], {
      is: (campaignType, compensationType) =>
        [CAMPAIGN_TYPE.SPONSORED_POST, CAMPAIGN_TYPE.UGC].includes(campaignType) &&
        compensationType === COMPENSATION_TYPE.PAID,
      then: (schema) =>
        schema
          .typeError("Budget must be a valid number")
          .positive("Budget must be a positive number")
          .required(
            "Enter your planned campaign budget. This amount is not charged or publicly visible to creators. It is only used to track your planned budget and remaining spend."
          ),
      otherwise: (schema) => schema.nullable(),
    }),
  suggested_min: Yup.number()
    .transform(emptyToUndefined)
    .when(["campaign_type", "compensation_type"], {
      is: (campaignType, compensationType) =>
        [CAMPAIGN_TYPE.SPONSORED_POST, CAMPAIGN_TYPE.UGC].includes(campaignType) &&
        compensationType === COMPENSATION_TYPE.PAID,
      then: (schema) =>
        schema
          .nullable()
          .typeError("Suggested minimum must be a valid number")
          .positive("Suggested minimum must be a positive number"),
      otherwise: (schema) => schema.nullable(),
    }),
  suggested_max: Yup.number()
    .transform(emptyToUndefined)
    .when(["campaign_type", "compensation_type", "suggested_min"], {
      is: (campaignType, compensationType) =>
        [CAMPAIGN_TYPE.SPONSORED_POST, CAMPAIGN_TYPE.UGC].includes(campaignType) &&
        compensationType === COMPENSATION_TYPE.PAID,
      then: (schema) =>
        schema
          .nullable()
          .typeError("Suggested maximum must be a valid number")
          .positive("Suggested maximum must be a positive number")
          .when("suggested_min", {
            is: (suggestedMin) => suggestedMin !== null && suggestedMin !== undefined,
            then: (schema) =>
              schema.min(Yup.ref("suggested_min"), "Maximum must be greater than minimum"),
            otherwise: (schema) => schema,
          }),
      otherwise: (schema) => schema.nullable(),
    }),
  creator_fixed_price: Yup.number()
    .transform(emptyToUndefined)
    .when(["campaign_type", "compensation_type"], {
      is: (campaignType, compensationType) =>
        [CAMPAIGN_TYPE.SPONSORED_POST, CAMPAIGN_TYPE.UGC].includes(campaignType) &&
        compensationType === COMPENSATION_TYPE.PAID,
      then: (schema) =>
        schema
          .nullable()
          .typeError("Fixed creator payment must be a valid number")
          .positive("Fixed creator payment must be a positive number"),
      otherwise: (schema) => schema.nullable(),
    }),
  product_value: Yup.number()
    .transform(emptyToUndefined)
    .when("campaign_type", {
      is: (campaignType) => campaignType === CAMPAIGN_TYPE.GIFTED,
      then: (schema) =>
        schema
          .typeError("Product value must be a valid number")
          .positive("Product value must be a positive number")
          .required("Product value is required for gifted campaigns"),
      otherwise: (schema) => schema.nullable(),
    }),
  commission_percentage: Yup.number()
    .transform(emptyToUndefined)
    .when("campaign_type", {
      is: (campaignType) => campaignType === CAMPAIGN_TYPE.AFFILIATE,
      then: (schema) =>
        schema
          .typeError("Commission percentage must be a valid number")
          .positive("Commission percentage must be a positive number")
          .max(100, "Commission percentage cannot exceed 100%")
          .required("Commission percentage is required for affiliate campaigns"),
      otherwise: (schema) => schema.nullable(),
    }),
  product_price: Yup.number()
    .transform(emptyToUndefined)
    .when("campaign_type", {
      is: (campaignType) => campaignType === CAMPAIGN_TYPE.AFFILIATE,
      then: (schema) =>
        schema
          .typeError("Product price must be a valid number")
          .positive("Product price must be a positive number")
          .required("Product price is required for affiliate campaigns"),
      otherwise: (schema) => schema.nullable(),
    }),

  creator_countries: Yup.array()
    .of(
      Yup.object().shape({
        country: Yup.string().required(),
        countryCode: Yup.string().required(),
        phoneCode: Yup.string().nullable(),
        requirement: Yup.string().oneOf(["preferred", "mandatory"]).required(),
      })
    )
    .nullable(),
  creator_city: Yup.string().when("cityRequirement", {
    is: "mandatory",
    then: (schema) => schema.required("City is required when set to mandatory"),
    otherwise: (schema) => schema.nullable(),
  }),
  min_age: Yup.number()
    .transform(emptyToUndefined)
    .when("ageRequirement", {
      is: "mandatory",
      then: (schema) =>
        schema
          .typeError("Minimum age must be a valid number")
          .min(13, "Minimum age must be at least 13")
          .max(100, "Minimum age cannot exceed 100")
          .required("Minimum age is required when age range is mandatory"),
      otherwise: (schema) => schema.nullable(),
    }),
  max_age: Yup.number()
    .transform(emptyToUndefined)
    .when(["ageRequirement", "min_age"], {
      is: (ageRequirement, minAge) => ageRequirement === "mandatory",
      then: (schema) =>
        schema
          .typeError("Maximum age must be a valid number")
          .min(Yup.ref("min_age"), "Maximum age must be greater than minimum age")
          .max(100, "Maximum age cannot exceed 100")
          .required("Maximum age is required when age range is mandatory"),
      otherwise: (schema) => schema.nullable(),
    }),
  creator_gender: Yup.string().when("genderRequirement", {
    is: "mandatory",
    then: (schema) => schema.required("Gender is required when set to mandatory"),
    otherwise: (schema) => schema.nullable(),
  }),
  creator_language: Yup.string().when("languageRequirement", {
    is: "mandatory",
    then: (schema) => schema.required("Language is required when set to mandatory"),
    otherwise: (schema) => schema.nullable(),
  }),
  application_deadline: Yup.date()
    .required("Application deadline is required")
    .min(new Date(new Date().setHours(0, 0, 0, 0)), "Deadline cannot be a previous date.")
    .transform(emptyToUndefined),

  short_description: Yup.string()
    .max(250, "Short description cannot exceed 250")
    .required("Short description is required"),

  long_description: Yup.string().optional().max(2000, "Long description cannot exceed 2000"),
  campaignImage: Yup.string()
    .nullable()
    .transform(emptyToNull)
    .required("Campaign image is required"),

  termsAgreed: Yup.boolean().oneOf([true], "You must agree to the Terms of Service"),
});
