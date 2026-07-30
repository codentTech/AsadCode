import { createCampaign, resetCreateCampaign } from "@/provider/features/campaigns/campaigns.slice";
import { selectShopifyConnectionState } from "@/provider/features/shopify/shopify.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { CAMPAIGN_TYPE } from "@/common/constants/campaign.constant";
import {
  SHOPIFY_SOFT_CONFIRM_COMMISSION_PERCENT,
  SHOPIFY_SOFT_CONFIRM_DISCOUNT_PERCENT,
} from "@/common/constants/shopify.constant";
import {
  transformDataForAPI,
  getDefaultValues,
  buildCampaignReturnPath,
} from "@/common/utils/campaign.utils";
import {
  clearCreateCampaignDraft,
  loadCreateCampaignDraft,
  saveCreateCampaignDraft,
} from "./create-campaign-draft.utils";
import { validationSchema } from "./validation.scheme";
import { STEP_NAMES, STEP_FIELDS, STEP_COMPONENTS, STEP_META } from "./wizard-config";

export default function useCreateCampaign() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const returnTab = searchParams.get("returnTab") || "1";
  const returnView = searchParams.get("returnView");

  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showSoftConfirm, setShowSoftConfirm] = useState(false);
  const [isDraftHydrated, setIsDraftHydrated] = useState(false);
  const skipNextDraftSaveRef = useRef(true);

  const { isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.campaigns?.createCampaign || {}
  );
  const { data: shopifyConnection } = useSelector(selectShopifyConnectionState);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: getDefaultValues(),
    mode: "onChange",
  });

  const campaignData = watch();

  useEffect(() => {
    const draft = loadCreateCampaignDraft();
    if (draft?.formValues) {
      const defaults = getDefaultValues();
      const formValues = { ...draft.formValues };
      if (!formValues.campaign_type) {
        formValues.campaign_type = defaults.campaign_type;
      }
      if (!formValues.compensation_type) {
        formValues.compensation_type = defaults.compensation_type;
      }
      reset({ ...defaults, ...formValues });
    }
    if (typeof draft?.currentStep === "number") {
      const maxStep = STEP_NAMES.length - 1;
      setCurrentStep(Math.min(Math.max(0, draft.currentStep), maxStep));
    }
    skipNextDraftSaveRef.current = true;
    setIsDraftHydrated(true);
  }, [reset]);

  useEffect(() => {
    if (!isDraftHydrated) return;
    if (skipNextDraftSaveRef.current) {
      skipNextDraftSaveRef.current = false;
      return;
    }

    const timeoutId = window.setTimeout(() => {
      saveCreateCampaignDraft({
        currentStep,
        formValues: campaignData,
      });
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [isDraftHydrated, currentStep, campaignData]);

  const isAffiliateWithoutShopify =
    currentStep === 2 &&
    campaignData.campaign_type === CAMPAIGN_TYPE.AFFILIATE &&
    !shopifyConnection?.connected;

  const currentStepMeta = useMemo(
    () => STEP_META[currentStep] || STEP_META[0],
    [currentStep]
  );

  const progressPercent = useMemo(
    () => Math.round(((currentStep + 1) / STEP_NAMES.length) * 100),
    [currentStep]
  );

  const navigateBack = useCallback(() => {
    router.push(
      buildCampaignReturnPath({
        returnTab,
        returnView: returnView || undefined,
      })
    );
  }, [router, returnTab, returnView]);

  useEffect(() => {
    return () => {
      dispatch(resetCreateCampaign());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
      clearCreateCampaignDraft();
      dispatch(resetCreateCampaign());
      reset(getDefaultValues());
      setCurrentStep(0);
    }
  }, [isSuccess, dispatch, reset]);

  const getWatchedValue = useCallback((fieldName) => watch(fieldName), [watch]);

  const handleChange = useCallback(
    (event) => {
      if (!event?.target?.name) return;
      const { name, value, type, checked } = event.target;

      if (type === "checkbox") {
        setValue(name, Boolean(checked), { shouldDirty: true, shouldValidate: true });
        return;
      }

      setValue(name, value, { shouldDirty: true, shouldValidate: true });
    },
    [setValue]
  );

  const handleCheckboxToggle = useCallback(
    (fieldName, value) => {
      const currentValues = [...(campaignData[fieldName] || [])];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];
      setValue(fieldName, newValues);
    },
    [campaignData, setValue]
  );

  const handleRequirementToggle = useCallback(
    (field, value) => {
      const requirementField = `${field}Requirement`;
      const newValue = campaignData[requirementField] === value ? "none" : value;
      setValue(requirementField, newValue);
    },
    [campaignData, setValue]
  );

  const addDeliverable = useCallback(
    (deliverable) => {
      const currentDeliverables = [...(campaignData.deliverables || [])];
      setValue("deliverables", [...currentDeliverables, deliverable]);
    },
    [campaignData.deliverables, setValue]
  );

  const removeDeliverable = useCallback(
    (index) => {
      const currentDeliverables = campaignData.deliverables.filter((_, i) => i !== index);
      setValue("deliverables", currentDeliverables);
    },
    [campaignData.deliverables, setValue]
  );

  const handleCampaignSubmit = async (data) => {
    const apiData = transformDataForAPI(data);
    const result = await dispatch(createCampaign(apiData));

    if (createCampaign.fulfilled.match(result)) {
      clearCreateCampaignDraft();
      setCurrentStep(0);
      navigateBack();
    }
  };

  const advanceStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, STEP_NAMES.length - 1));
  }, []);

  const needsSoftConfirm = useCallback(() => {
    if (currentStep !== 2 || campaignData.campaign_type !== CAMPAIGN_TYPE.AFFILIATE) {
      return false;
    }
    const discount = Number(campaignData.customer_discount_percent);
    const commission = Number(campaignData.commission_percentage);
    return (
      discount >= SHOPIFY_SOFT_CONFIRM_DISCOUNT_PERCENT ||
      commission >= SHOPIFY_SOFT_CONFIRM_COMMISSION_PERCENT
    );
  }, [
    currentStep,
    campaignData.campaign_type,
    campaignData.customer_discount_percent,
    campaignData.commission_percentage,
  ]);

  const handleNextStep = async () => {
    if (isAffiliateWithoutShopify) {
      return;
    }

    const currentStepFields = STEP_FIELDS[currentStep] || [];
    const isStepValid = await trigger(currentStepFields);

    if (!isStepValid) {
      return;
    }

    if (needsSoftConfirm()) {
      setShowSoftConfirm(true);
      return;
    }

    advanceStep();
  };

  const handleConfirmSoftRates = useCallback(() => {
    setShowSoftConfirm(false);
    advanceStep();
  }, [advanceStep]);

  const handleCloseSoftConfirm = useCallback(() => {
    setShowSoftConfirm(false);
  }, []);

  const handlePrevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleStepSelect = useCallback((index) => {
    setCurrentStep((prev) => (index <= prev ? index : prev));
  }, []);

  const renderStep = () => {
    const stepConfig = STEP_COMPONENTS[currentStep];
    if (!stepConfig) return <div>Step not found</div>;

    const commonProps = {
      campaignData,
      handleChange,
      handleCheckboxToggle,
      errors,
      register,
      watch,
      setValue,
      getWatchedValue,
      control,
    };

    const extraProps = {
      addDeliverable,
      removeDeliverable,
      handleRequirementToggle,
      getWatchedValue,
      handleSubmit: handleSubmit(handleCampaignSubmit),
      isLoading,
      isError,
      message,
    };

    const Component = stepConfig.component;
    const props = stepConfig.getProps(commonProps, extraProps);

    return <Component {...props} />;
  };

  const canProceed =
    !isAffiliateWithoutShopify &&
    (currentStep < STEP_NAMES.length - 1 || campaignData.termsAgreed);

  return {
    currentStep,
    steps: STEP_NAMES,
    currentStepMeta,
    stepMeta: STEP_META,
    progressPercent,
    setCurrentStep,
    showPreview,
    setShowPreview,
    renderStep,
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    errors,
    campaignData,
    getWatchedValue,
    handleChange,
    handleCheckboxToggle,
    handleRequirementToggle,
    addDeliverable,
    removeDeliverable,
    handleNextStep,
    handlePrevStep,
    handleStepSelect,
    handleSubmit: handleSubmit(handleCampaignSubmit),
    navigateBack,
    isLoading,
    isSuccess,
    isError,
    message,
    isAffiliateWithoutShopify,
    canProceed,
    showSoftConfirm,
    handleConfirmSoftRates,
    handleCloseSoftConfirm,
  };
}
