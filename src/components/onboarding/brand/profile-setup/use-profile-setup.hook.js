import { getOnboardingEmail } from "@/common/utils/users.util";
import { setupBrandProfile } from "@/provider/features/brand-profile/brand-profile.slice";
import { uploadSingleFile } from "@/provider/features/upload-file/upload-file.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  brandName: Yup.string().required("Brand name is required"),
  websiteUrl: Yup.string().url("Enter a valid URL").required("Website URL is required"),
  brandLogoUrl: Yup.string().nullable(),
  city: Yup.string().required("City is required"),
  country: Yup.string().required("Country is required"),
  companyDescription: Yup.string().required("Description is required").max(300),
});

export default function useBrandProfileSetup({ onNext }) {
  const dispatch = useDispatch();
  const email = getOnboardingEmail();

  const { isLoading } = useSelector((state) => state.brandProfile || {});
  const { uploadSingleFile: uploadState } = useSelector((state) => state.uploadFile);

  const [brandLogoFile, setBrandLogoFile] = useState(null);
  const [brandLogoPreview, setBrandLogoPreview] = useState(null);

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

  const handleFileUpload = (file) => {
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      if (file.size <= 5 * 1024 * 1024) {
        // 5MB limit
        setBrandLogoFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setBrandLogoPreview(reader.result);
        };
        reader.readAsDataURL(file);

        setValue("brandLogoUrl", reader.result);
      } else {
        console.error("File size too large. Maximum 5MB allowed.");
      }
    } else {
      console.error("Invalid file type. Only JPG and PNG are allowed.");
    }
  };

  const uploadBrandLogo = async (file) => {
    const response = await dispatch(
      uploadSingleFile({
        file,
        folder: "brand",
      })
    );

    if (response.payload?.url) {
      return response.payload.url;
    }
    return null;
  };

  const onSubmit = async (values) => {
    let brandLogoUrl = null;

    if (brandLogoFile) {
      brandLogoUrl = await uploadBrandLogo(brandLogoFile);
    }

    const payload = {
      brandName: values.brandName,
      websiteUrl: values.websiteUrl,
      brandLogoUrl: brandLogoUrl || values.brandLogoUrl,
      city: values.city,
      country: values.country,
      companyDescription: values.companyDescription,
    };

    const response = await dispatch(setupBrandProfile({ payload, email }));
    if (response.payload && response.payload.success) {
      onNext && onNext();
      resetForm();
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
    isLoading: isLoading || isSubmitting || uploadState.isLoading,
    isError: uploadState.isError,
    errorMessage: uploadState.message,
    resetForm,
    // File upload methods
    handleFileUpload,
    brandLogoFile,
    brandLogoPreview,
  };
}
