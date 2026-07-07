import useLegalLinks from "@/common/hooks/use-legal-links.hook";
import { LEGAL_AUDIENCE } from "@/common/utils/legal.utils";
import { addUserToWaitlist } from "@/provider/features/users/users.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Email is required"),
});

function useJoinCleercut() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { termsHref, privacyHref } = useLegalLinks(LEGAL_AUDIENCE.CLIENT);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    setLoading(true);
    const response = await dispatch(addUserToWaitlist(values));
    response && setLoading(false);
    if (response.payload?.success) {
      setIsSubmitted(true);
    }
  };

  return {
    loading,
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitted,
    termsHref,
    privacyHref,
  };
}

export default useJoinCleercut;
