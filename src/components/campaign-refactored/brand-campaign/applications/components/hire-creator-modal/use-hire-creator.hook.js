import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { enqueueSnackbar } from "notistack";
import {
  COMPENSATION_TYPE,
  COLLABORATION_TYPE,
  CAMPAIGN_TYPE,
  CONTRACT_USAGE_RIGHTS_VALUES,
  CONTRACT_EXCLUSIVITY_VALUES,
} from "@/common/constants/campaign.constant";
import { getBrandDisplayNameForContract } from "@/common/utils/brand-display.util";
import { deliverablesToContentFormatString } from "@/common/utils/deliverables-to-content-format.util";
import { getTodayHtmlDateInputValue, toHtmlDateInputValue, isValidHtmlDateInputValue, isHtmlDateInputOnOrAfterToday, isHtmlDateInputAfter } from "@/common/utils/date.utils";
import { resolveCampaignFeeForOffer } from "@/common/utils/campaign.utils";
import { checkHasPaymentMethod } from "@/provider/features/collaboration-payment/collaboration-payment.slice";

const createValidationSchema = (isIndividual) => {
  const baseSchema = {
    startDate: Yup.string()
      .required("Start date is required")
      .test("is-valid-date", "Please select a valid date", function (value) {
        return isValidHtmlDateInputValue(value);
      })
      .test("is-future-date", "Start date cannot be in the past", function (value) {
        return isHtmlDateInputOnOrAfterToday(value);
      }),
    completionDeadline: Yup.string()
      .required("Completion deadline is required")
      .test("is-valid-date", "Please select a valid date", function (value) {
        return isValidHtmlDateInputValue(value);
      })
      .test("is-after-start", "Completion deadline must be after start date", function (value) {
        const { startDate } = this.parent;
        if (!value || !startDate) return false;
        return isHtmlDateInputAfter(value, startDate);
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
      is: (val) =>
        val === COMPENSATION_TYPE.PAID ||
        val === COMPENSATION_TYPE.COMMISSION ||
        val === COMPENSATION_TYPE.GIFTED_PRODUCT,
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
      .oneOf([...CONTRACT_USAGE_RIGHTS_VALUES], "Invalid usage rights"),
    exclusivityClause: Yup.string()
      .required("Exclusivity clause is required")
      .oneOf([...CONTRACT_EXCLUSIVITY_VALUES], "Invalid exclusivity clause"),
    additionalClauseTitle: Yup.string()
      .optional()
      .max(100, "Clause title must be less than 100 characters"),
    additionalClauseBody: Yup.string()
      .optional()
      .max(2000, "Clause body must be less than 2000 characters"),
  };

  if (isIndividual) {
    baseSchema.campaignType = Yup.string()
      .required("Campaign type is required")
      .oneOf(
        [
          CAMPAIGN_TYPE.SPONSORED_POST,
          CAMPAIGN_TYPE.UGC,
          CAMPAIGN_TYPE.GIFTED,
          CAMPAIGN_TYPE.AFFILIATE,
        ],
        "Invalid campaign type"
      );
    baseSchema.contentGuidelines = Yup.string()
      .required("Content guidelines/brief is required")
      .min(10, "Content guidelines must be at least 10 characters");
  }

  return Yup.object()
    .shape(baseSchema)
    .test("additional-clause-pair", "Clause title and body are both required", function (values) {
      const title = values?.additionalClauseTitle?.trim();
      const body = values?.additionalClauseBody?.trim();

      if ((title && !body) || (!title && body)) {
        return this.createError({
          path: !title ? "additionalClauseTitle" : "additionalClauseBody",
          message: !title ? "Clause title is required" : "Clause body is required",
        });
      }

      return true;
    });
};

export default function useHireCreator({
  creatorData,
  campaignData,
  onSendOffer,
  isLoading,
  showModal: show = false,
}) {
  const dispatch = useDispatch();
  const [showPreview, setShowPreview] = useState(false);

  // Get current payment method status from Redux
  const { data: hasPaymentMethodData, isLoading: isCheckingPaymentMethod } = useSelector(
    (state) => state.collaborationPayment.hasPaymentMethod || {}
  );

  const hasPaymentMethod = hasPaymentMethodData?.hasPaymentMethod || false;
  const canFundCollaborations = hasPaymentMethodData?.canFundCollaborations ?? false;

  const refreshPaymentStatus = useCallback(() => {
    dispatch(checkHasPaymentMethod());
  }, [dispatch]);

  useEffect(() => {
    if (show) {
      refreshPaymentStatus();
    }
  }, [show, refreshPaymentStatus]);

  const isIndividual = campaignData?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;
  const validationSchema = createValidationSchema(isIndividual);

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
      additionalClauseTitle: "",
      additionalClauseBody: "",
      ...(isIndividual ? { campaignType: "", contentGuidelines: "" } : {}),
    },
  });

  const watchedValues = watch();

  const applySharedOfferDefaults = useCallback(() => {
    const validateOpts = { shouldValidate: true };
    setValue("startDate", getTodayHtmlDateInputValue(), validateOpts);
    setValue("firstDraftDeadline", "", validateOpts);
    setValue(
      "completionDeadline",
      toHtmlDateInputValue(campaignData?.application_deadline),
      validateOpts
    );
    setValue("totalCompensation", resolveCampaignFeeForOffer(campaignData), validateOpts);

    const usageRights = campaignData?.usage_rights;
    if (usageRights && CONTRACT_USAGE_RIGHTS_VALUES.includes(usageRights)) {
      setValue("usageRights", usageRights, validateOpts);
    }

    const exclusivity = campaignData?.exclusivity_clause;
    if (exclusivity && CONTRACT_EXCLUSIVITY_VALUES.includes(exclusivity)) {
      setValue("exclusivityClause", exclusivity, validateOpts);
    }
  }, [campaignData, setValue]);

  const initializeForm = useCallback(() => {
    if (!campaignData || !creatorData) return;

    applySharedOfferDefaults();

    if (isIndividual) {
      setValue("contentFormat", "");
      setValue("compensationType", COMPENSATION_TYPE.PAID);
      setValue("campaignType", "");
      setValue("contentGuidelines", "");
    } else {
      setValue("contentFormat", deliverablesToContentFormatString(campaignData.deliverables));
      setValue(
        "compensationType",
        campaignData.compensation_type?.toUpperCase() || COMPENSATION_TYPE.PAID
      );
      setValue("productPrice", campaignData.product_value || campaignData.product_price || "");
      setValue("hashtags", campaignData.hashtags || "");
      setValue("mentions", campaignData.do_donts || "");
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
      setValue("additionalClauseTitle", campaignData.additional_clause_title || "");
      setValue("additionalClauseBody", campaignData.additional_clause_body || "");
    }
  }, [campaignData, creatorData, setValue, isIndividual, applySharedOfferDefaults]);

  // Initialize form when modal opens
  useEffect(() => {
    if (show && campaignData && creatorData) {
      initializeForm();
    }
  }, [show, campaignData, creatorData, initializeForm]);

  // Reset form and preview when modal closes
  useEffect(() => {
    if (!show) {
      reset();
      setShowPreview(false);
    }
  }, [show, reset]);

  // Function to create enriched contract data for preview/submission
  const createEnrichedContractData = useCallback(
    (values) => {
      return {
        ...values,
        contentFormat: deliverablesToContentFormatString(values.contentFormat),
        // Convert string numbers to actual numbers for API
        totalCompensation: values.totalCompensation
          ? parseFloat(values.totalCompensation)
          : undefined,
        productPrice: values.productPrice ? parseFloat(values.productPrice) : undefined,
        // Add campaign and creator metadata
        campaignTitle: isIndividual
          ? "Individual Collaboration"
          : campaignData?.campaign_title || "",
        brandName: getBrandDisplayNameForContract(campaignData),
        creatorName:
          `${creatorData?.creator?.first_name || ""} ${creatorData?.creator?.last_name || ""}`.trim() ||
          "[Creator Name]",
        contractId: "DRAFT", // Will be replaced with backend ID after creation
        partiesInvolved: getBrandDisplayNameForContract(campaignData),
        campaignDescription: isIndividual
          ? values.contentGuidelines || ""
          : campaignData?.short_description || campaignData?.description || "",
        contentGuidelines: isIndividual
          ? values.contentGuidelines || ""
          : campaignData?.style_guide || campaignData?.content_guidelines || "",
        campaignType: isIndividual ? values.campaignType || "" : campaignData?.campaign_type || "",
      };
    },
    [campaignData, creatorData, isIndividual]
  );

  const onSubmit = async (values) => {
    // Trigger validation for all fields to ensure errors are shown
    const isValid = await trigger();
    if (!isValid) {
      return;
    }

    // CRITICAL: Validate payment method exists before submission (only for paid offers)
    if (isPaymentRequired() && !canFundCollaborations) {
      const errorMessage = !hasPaymentMethod
        ? "Payment method is required to send offers. Please add a card in Settings → Payments → Payment Methods."
        : "Complete Stripe business connection in Settings → Payments → Payment Methods before sending paid offers.";
      enqueueSnackbar(errorMessage, { variant: "error" });
      return;
    }

    // Prepare contract data for API
    const contractData = createEnrichedContractData(values);
    await onSendOffer(contractData);
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
    return true;
  }, []);

  const handlePreviewContract = useCallback(() => {
    setShowPreview(true);
  }, []);

  const handleFormSubmit = useCallback(
    async (data) => {
      await trigger();
      await onSubmit(data);
    },
    [trigger, onSubmit]
  );

  const revisionsLimitValue = watchedValues?.revisionsLimit?.toString?.() || "";
  const usageRightsValue = watchedValues?.usageRights || "no_usage";
  const exclusivityValue = watchedValues?.exclusivityClause || "none";
  const campaignTypeValue = watchedValues?.campaignType || "";

  // Payment not required for gifted/affiliate (campaign type) or gifted product/commission (compensation type)
  const isPaymentRequired = useCallback(() => {
    const compType = (watchedValues?.compensationType || "").toUpperCase();
    const campType = (
      isIndividual ? watchedValues?.campaignType : campaignData?.campaign_type
    )?.toUpperCase?.();
    if (
      compType === COMPENSATION_TYPE.GIFTED_PRODUCT ||
      compType === COMPENSATION_TYPE.COMMISSION
    ) {
      return false;
    }
    if (campType === CAMPAIGN_TYPE.GIFTED || campType === CAMPAIGN_TYPE.AFFILIATE) {
      return false;
    }
    return true;
  }, [
    watchedValues?.compensationType,
    watchedValues?.campaignType,
    isIndividual,
    campaignData?.campaign_type,
  ]);

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
    hasPaymentMethod,
    canFundCollaborations,
    isCheckingPaymentMethod,
    showPreview,
    setShowPreview,
    handlePreviewContract,
    handleFormSubmit,
    revisionsLimitValue,
    usageRightsValue,
    exclusivityValue,
    campaignTypeValue,
    isIndividualCollaboration: isIndividual,
    isPaymentRequired,
    refreshPaymentStatus,
  };
}
