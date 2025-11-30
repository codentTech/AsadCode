import { createCampaign, resetCreateCampaign } from "@/provider/features/campaigns/campaigns.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { validationSchema } from "./validation.scheme";
import {
  transformDataForAPI,
  STEP_NAMES,
  STEP_FIELDS,
  STEP_COMPONENTS,
  getDefaultValues,
} from "@/common/utils/campaign.utils";

export default function useCreateCampaign(close) {
  const dispatch = useDispatch();
  const router = useRouter();

  // ===== STATES =====
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const { isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.campaigns?.createCampaign || {}
  );

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
  console.log(campaignData);

  // ===== LIFECYCLE METHODS =====
  useEffect(() => {
    return () => {
      dispatch(resetCreateCampaign());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(resetCreateCampaign());
      reset();
    }
  }, [isSuccess, router, dispatch, reset]);

  // ===== COMMON FUNCTIONS =====
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
      close();
      setCurrentStep(0);
    }
  };

  const handleNextStep = async () => {
    const currentStepFields = STEP_FIELDS[currentStep] || [];
    const isStepValid = await trigger(currentStepFields);

    if (isStepValid) {
      setCurrentStep(Math.min(currentStep + 1, STEP_NAMES.length - 1));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 0));
  };

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

  return {
    currentStep,
    steps: STEP_NAMES,
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
    handleSubmit: handleSubmit(handleCampaignSubmit),
    isLoading,
    isSuccess,
    isError,
    message,
  };
}
