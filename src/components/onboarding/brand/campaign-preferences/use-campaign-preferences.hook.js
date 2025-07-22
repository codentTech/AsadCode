import { getOnboardingEmail } from "@/common/utils/users.util";
import { setupBrandCampaignPreferences } from "@/provider/features/brand-profile/brand-profile.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  filming_preference: Yup.string().required("Filming preference is required"),
  campaign_types: Yup.array().min(1, "Select at least one campaign type"),
  target_niches: Yup.array().min(1, "Select at least one niche"),
  creator_sizes: Yup.array().min(1, "Select at least one creator size"),
  geographic_focus: Yup.array().min(1, "Select at least one geographic focus"),
});

export default function useBrandCampaignPreferences({ onNext }) {
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
        resetForm();
      }
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
