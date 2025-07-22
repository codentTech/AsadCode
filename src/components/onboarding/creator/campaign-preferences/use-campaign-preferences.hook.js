import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { setupCreatorCampaignPreferences } from "@/provider/features/creator-profile/creator-profile.slice";
import { getOnboardingEmail } from "@/common/utils/users.util";

const validationSchema = Yup.object().shape({
  campaignTypes: Yup.array().min(1, "Select at least one campaign type"),
  languages: Yup.array().min(1, "Select at least one language"),
  inPersonOpportunities: Yup.boolean().required("Select an option"),
  shippingAddress: Yup.object().shape({
    street: Yup.string(),
    city: Yup.string(),
    state: Yup.string(),
    zipCode: Yup.string(),
    zipCode: Yup.string(),
  }),
});

export default function useCampaignPreferences({ onNext }) {
  const dispatch = useDispatch();
  const email = getOnboardingEmail();

  const { isLoading } = useSelector((state) => state.auth || {});

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
      campaignTypes: [],
      languages: [],
      inPersonOpportunities: false,
      shippingAddress: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
      },
    },
  });

  const onSubmit = async (values) => {
    try {
      const payload = {
        campaignTypes: values.campaignTypes,
        languages: values.languages,
        inPersonOpportunities: values.inPersonOpportunities,
        shippingAddress: values.shippingAddress,
      };

      const response = await dispatch(setupCreatorCampaignPreferences({ payload, email }));
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
