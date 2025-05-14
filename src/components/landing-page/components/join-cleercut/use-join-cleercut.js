import { addUserToWaitlist } from "@/provider/features/user/user.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

function useJoinCleercut() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    const response = await dispatch(
      addUserToWaitlist({
        payload: { ...values },
        setLoading,
      })
    );
    response && setLoading(false);
    if (response.payload?.success) {
      setIsSubmitted(true);
      console.log(response);
    }
  };

  return { loading, register, handleSubmit, onSubmit, errors, isSubmitted };
}

export default useJoinCleercut;
