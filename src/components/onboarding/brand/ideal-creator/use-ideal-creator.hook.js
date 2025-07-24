import { getOnboardingEmail } from "@/common/utils/users.util";
import { setupBrandIdealCreator } from "@/provider/features/brand-profile/brand-profile.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  min_followers: Yup.string().required("Minimum followers is required"),
  gender: Yup.array().min(1, "Select at least one gender"),
  countries: Yup.array().min(1, "Select at least one country"),
  city: Yup.string(),
  age_ranges: Yup.array().min(1, "Select at least one age range"),
  platforms: Yup.array().min(1, "Select at least one platform"),
});

export default function useIdealCreator({ onNext }) {
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
      min_followers: "",
      gender: [],
      countries: [],
      city: "",
      age_ranges: [],
      platforms: [],
    },
  });

  const onSubmit = async (values) => {
    try {
      const payload = {
        min_followers: values.min_followers,
        gender: values.gender,
        countries: values.countries,
        city: values.city,
        age_ranges: values.age_ranges,
        platforms: values.platforms,
      };
      const response = await dispatch(setupBrandIdealCreator({ payload, email }));
      if (response.payload && response.payload.success) {
        onNext && onNext();
        resetForm();
        localStorage.removeItem("email");
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
