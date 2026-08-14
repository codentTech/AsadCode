import { getOnboardingEmail } from "@/common/utils/users.util";
import { getOnboardingResumeStepFromReject } from "@/common/utils/onboarding-flow.util";
import { setupBrandCampaignPreferences } from "@/provider/features/brand-profile/brand-profile.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import useOnboardingSetupProgress from "../../components/onboarding-wizard-shell/use-onboarding-setup-progress.hook";

const validationSchema = Yup.object().shape({
  filming_preference: Yup.string().required("Filming preference is required"),
  campaign_types: Yup.array().min(1, "Select at least one campaign type"),
  target_niches: Yup.array().min(1, "Select at least one niche"),
  creator_sizes: Yup.array().min(1, "Select at least one creator size"),
  geographic_focus: Yup.array().min(1, "Select at least one geographic focus"),
});

export default function useBrandCampaignPreferences({ onNext, onResumeStep, isActive = true }) {
  const dispatch = useDispatch();
  const email = getOnboardingEmail();

  const { isLoading } = useSelector((state) => state.brandProfile || {});

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
    watch,
    reset: resetForm,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      filming_preference: "",
      campaign_types: [],
      target_niches: [],
      creator_sizes: [],
      geographic_focus: [],
    },
  });

  const filmingPreference = watch("filming_preference");
  const selectedCampaignTypes = watch("campaign_types");
  const selectedNiches = watch("target_niches");
  const selectedCreatorSizes = watch("creator_sizes");
  const selectedGeographicFocus = watch("geographic_focus");

  const setupProgressSteps = useMemo(
    () => [
      {
        label: "Filming Requirements",
        status: filmingPreference ? "complete" : "pending",
      },
      {
        label: "Campaign Types",
        status: selectedCampaignTypes?.length > 0 ? "count" : "pending",
        count: selectedCampaignTypes?.length,
      },
      {
        label: "Target Niches",
        status: selectedNiches?.length > 0 ? "count" : "pending",
        count: selectedNiches?.length,
      },
      {
        label: "Creator Sizes",
        status: selectedCreatorSizes?.length > 0 ? "count" : "pending",
        count: selectedCreatorSizes?.length,
      },
      {
        label: "Geographic Focus",
        status: selectedGeographicFocus?.length > 0 ? "count" : "pending",
        count: selectedGeographicFocus?.length,
      },
    ],
    [
      filmingPreference,
      selectedCampaignTypes,
      selectedNiches,
      selectedCreatorSizes,
      selectedGeographicFocus,
    ],
  );
  const setupProgressPercent = useMemo(() => {
    if (!setupProgressSteps.length) return 0;
    const completed = setupProgressSteps.filter(
      (step) => step.status === "complete" || step.status === "count"
    ).length;
    return Math.round((completed / setupProgressSteps.length) * 100);
  }, [setupProgressSteps]);
  useOnboardingSetupProgress(setupProgressPercent, setupProgressSteps, isActive);

  const onSubmit = async (values) => {
    try {
      const payload = {
        filming_preference: values.filming_preference,
        campaign_types: values.campaign_types,
        target_niches: values.target_niches,
        creator_sizes: values.creator_sizes,
        geographic_focus: values.geographic_focus,
      };
      const response = await dispatch(setupBrandCampaignPreferences({ payload, email }));
      if (response.payload && response.payload.success) {
        onNext && onNext();
        return;
      }
      const resumeStep = getOnboardingResumeStepFromReject(response.payload);
      if (resumeStep) onResumeStep?.(resumeStep);
    } catch (error) {
      console.error("Form submission error:", error.message);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    setValue,
    getValues,
    watch,
    isLoading: isLoading || isSubmitting,
    resetForm,
  };
}
