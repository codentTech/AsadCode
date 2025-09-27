import { getOnboardingEmail } from "@/common/utils/users.util";
import { setupBrandProfile } from "@/provider/features/brand-profile/brand-profile.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  brandName: Yup.string().required("Brand name is required"),
  websiteUrl: Yup.string().url("Enter a valid URL").required("Website URL is required"),
  brandLogoUrl: Yup.string().url("Enter a valid logo URL").nullable(),
  city: Yup.string().required("City is required"),
  country: Yup.string().required("Country is required"),
  companyDescription: Yup.string().required("Description is required").max(300),
});

export default function useBrandProfileSetup({ onNext }) {
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
      brandName: "",
      websiteUrl: "",
      brandLogoUrl: "",
      city: "",
      country: "",
      companyDescription: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const payload = {
        brandName: values.brandName,
        websiteUrl: values.websiteUrl,
        brandLogoUrl: values.brandLogoUrl,
        city: values.city,
        country: values.country,
        companyDescription: values.companyDescription,
      };
      const response = await dispatch(setupBrandProfile({ payload, email }));
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
