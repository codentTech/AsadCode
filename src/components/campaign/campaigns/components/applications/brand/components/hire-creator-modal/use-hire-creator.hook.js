import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { useCallback } from "react";
import { COMPENSATION_TYPE } from "@/common/constants/campaign.constant";
import { campiagnDeliverable } from "@/common/utils/campaign.utils";

const validationSchema = Yup.object().shape({
  startDate: Yup.string()
    .required("Start date is required")
    .test("is-valid-date", "Please select a valid date", function (value) {
      if (!value) return false;
      const date = new Date(value);
      return date instanceof Date && !isNaN(date);
    })
    .test("is-future-date", "Start date cannot be in the past", function (value) {
      if (!value) return false;
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    }),
  completionDeadline: Yup.string()
    .required("Completion deadline is required")
    .test("is-valid-date", "Please select a valid date", function (value) {
      if (!value) return false;
      const date = new Date(value);
      return date instanceof Date && !isNaN(date);
    })
    .test("is-after-start", "Completion deadline must be after start date", function (value) {
      const { startDate } = this.parent;
      if (!value || !startDate) return false;
      const completionDate = new Date(value);
      const startDateObj = new Date(startDate);
      return completionDate > startDateObj;
    }),
  contentFormat: Yup.string()
    .required("Content format is required")
    .min(5, "Content format must be at least 5 characters"),
  revisionsLimit: Yup.number()
    .required("Revisions limit is required")
    .min(0, "Revisions limit cannot be negative")
    .max(10, "Revisions limit cannot exceed 10"),
  compensationType: Yup.string()
    .required("Compensation type is required")
    .oneOf(
      [COMPENSATION_TYPE.PAID, COMPENSATION_TYPE.COMMISSION, COMPENSATION_TYPE.GIFTED_PRODUCT],
      "Invalid compensation type"
    ),
  totalCompensation: Yup.mixed().when("compensationType", {
    is: (val) => val === COMPENSATION_TYPE.PAID || val === COMPENSATION_TYPE.COMMISSION,
    then: (schema) =>
      schema
        .required("Compensation amount is required")
        .test("is-number", "Compensation must be a valid number", function (value) {
          if (value === "" || value === null || value === undefined) return false;
          const num = parseFloat(value);
          return !isNaN(num) && num >= 0;
        }),
    otherwise: (schema) => schema.notRequired(),
  }),
  productPrice: Yup.mixed().when("compensationType", {
    is: COMPENSATION_TYPE.COMMISSION,
    then: (schema) =>
      schema
        .required("Product price is required")
        .test("is-number", "Product price must be a valid number", function (value) {
          if (value === "" || value === null || value === undefined) return false;
          const num = parseFloat(value);
          return !isNaN(num) && num >= 0;
        }),
    otherwise: (schema) => schema.notRequired(),
  }),
  usageRights: Yup.string()
    .required("Usage rights is required")
    .oneOf(["no_usage", "3", "6", "12", "permanent"], "Invalid usage rights"),
  exclusivityClause: Yup.string()
    .required("Exclusivity clause is required")
    .oneOf(["none", "3", "6", "12"], "Invalid exclusivity clause"),
});

export default function useHireCreator({ creatorData, campaignData, onSendOffer, isLoading }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
    setValue,
    reset,
    trigger,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange", // Real-time validation
    reValidateMode: "onChange",
    defaultValues: {
      compensationType: COMPENSATION_TYPE.PAID,
      revisionsLimit: "2",
      usageRights: "no_usage",
      exclusivityClause: "none",
      startDate: "",
      completionDeadline: "",
      contentFormat: "",
      totalCompensation: "",
      productPrice: "",
    },
  });

  const watchedValues = watch();

  // Auto-populate fields when modal opens
  const initializeForm = useCallback(() => {
    if (campaignData && creatorData) {
      const creator = creatorData.creator;
      const profile = creator?.creator_profile;

      setValue(
        "contentFormat",
        campaignData.deliverables?.map((deliverable) => campiagnDeliverable(deliverable)) || ""
      );
      setValue(
        "compensationType",
        campaignData.compensation_type?.toUpperCase() || COMPENSATION_TYPE.PAID
      );
      setValue("productPrice", campaignData.product_value || "");
      setValue("hashtags", campaignData.hashtags || "");
      setValue("mentions", campaignData.do_donts || ""); // Using do_donts as mentions
      setValue("inPersonRequired", campaignData.in_person_required || false);
      setValue("eligibleCountry", campaignData.creator_country || "");
      setValue("eligibleCity", campaignData.creator_city || "");
      setValue(
        "ageRange",
        campaignData.min_age && campaignData.max_age
          ? `${campaignData.min_age} - ${campaignData.max_age}`
          : ""
      );
      setValue("gender", campaignData.creator_gender || "");
      setValue("language", campaignData.creator_language || "");
    }
  }, [campaignData, creatorData, setValue]);

  // Function to create enriched contract data for preview/submission
  const createEnrichedContractData = useCallback(
    (values) => {
      return {
        ...values,
        // Convert string numbers to actual numbers for API
        totalCompensation: values.totalCompensation
          ? parseFloat(values.totalCompensation)
          : undefined,
        productPrice: values.productPrice ? parseFloat(values.productPrice) : undefined,
        // Add campaign and creator metadata
        campaignTitle: campaignData?.campaign_title || "",
        brandName:
          `${campaignData?.created_by?.first_name || ""} ${campaignData?.created_by?.last_name || ""}`.trim() ||
          "[Brand Name]",
        creatorName:
          `${creatorData?.creator?.first_name || ""} ${creatorData?.creator?.last_name || ""}`.trim() ||
          "[Creator Name]",
        contractId: "DRAFT", // Will be replaced with backend ID after creation
        partiesInvolved:
          `${campaignData?.created_by?.first_name || ""} ${campaignData?.created_by?.last_name || ""}`.trim() ||
          "[Brand Name]",
        campaignDescription: campaignData?.short_description || campaignData?.description || "",
        contentGuidelines: campaignData?.style_guide || campaignData?.content_guidelines || "",
      };
    },
    [campaignData, creatorData]
  );

  const onSubmit = async (values) => {
    try {
      // Trigger validation for all fields to ensure errors are shown
      const isValid = await trigger();
      if (!isValid) {
        return;
      }

      // Prepare contract data for API
      const contractData = createEnrichedContractData(values);

      await onSendOffer(contractData);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const getCompensationInputLabel = useCallback(() => {
    switch (watchedValues.compensationType) {
      case COMPENSATION_TYPE.PAID:
        return "Total Compensation ($)";
      case COMPENSATION_TYPE.COMMISSION:
        return "Commission Rate (%)";
      case COMPENSATION_TYPE.GIFTED_PRODUCT:
        return "Product Value ($)";
      default:
        return "Compensation";
    }
  }, [watchedValues.compensationType]);

  const isCompensationRequired = useCallback(() => {
    return watchedValues.compensationType !== COMPENSATION_TYPE.GIFTED_PRODUCT;
  }, [watchedValues.compensationType]);

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    watch: watchedValues,
    setValue,
    reset,
    initializeForm,
    getCompensationInputLabel,
    isCompensationRequired,
    isSubmitting: isSubmitting || isLoading,
    trigger,
    isValid,
    createEnrichedContractData,
  };
}
