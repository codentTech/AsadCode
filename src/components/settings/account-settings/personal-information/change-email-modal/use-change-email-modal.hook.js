"use client";

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getUser } from "@/common/utils/users.util";
import {
  requestEmailChange,
  verifyEmailChange,
  selectRequestEmailChange,
  selectVerifyEmailChange,
} from "@/provider/features/users/users.slice";

const requestSchema = yup.object().shape({
  new_email: yup.string().email("Invalid email format").required("Email is required"),
});

const verifySchema = yup.object().shape({
  code: yup
    .string()
    .required("Code is required")
    .matches(/^\d{6}$/, "Enter the 6-digit code from your email"),
});

export default function useChangeEmailModal({ open, onClose, onEmailUpdated }) {
  const dispatch = useDispatch();
  const requestState = useSelector(selectRequestEmailChange);
  const verifyState = useSelector(selectVerifyEmailChange);
  const [step, setStep] = useState("enter_email");

  const requestForm = useForm({
    resolver: yupResolver(requestSchema),
    defaultValues: { new_email: "" },
  });

  const verifyForm = useForm({
    resolver: yupResolver(verifySchema),
    defaultValues: { code: "" },
  });

  useEffect(() => {
    if (!open) return;
    setStep("enter_email");
    requestForm.reset({ new_email: "" });
    verifyForm.reset({ code: "" });
  }, [open, requestForm, verifyForm]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const goBackToEmailStep = useCallback(() => {
    setStep("enter_email");
    verifyForm.reset({ code: "" });
  }, [verifyForm]);

  const handleRequestSubmit = useCallback(
    async (values) => {
      const action = await dispatch(
        requestEmailChange(values.new_email.trim().toLowerCase()),
      );
      if (requestEmailChange.fulfilled.match(action)) {
        setStep("enter_code");
      }
    },
    [dispatch],
  );

  const handleVerifySubmit = useCallback(
    async (values) => {
      const action = await dispatch(verifyEmailChange(values.code.trim()));
      if (verifyEmailChange.fulfilled.match(action)) {
        const user = action.payload?.data;
        if (user) {
          getUser(user);
          onEmailUpdated?.(user.email);
        }
        handleClose();
      }
    },
    [dispatch, handleClose, onEmailUpdated],
  );

  const handleResend = useCallback(async () => {
    const email = requestForm.getValues("new_email")?.trim().toLowerCase();
    if (!email) return;
    await dispatch(requestEmailChange(email));
  }, [dispatch, requestForm]);

  const requestLoading = requestState?.isLoading ?? false;
  const verifyLoading = verifyState?.isLoading ?? false;

  return {
    step,
    requestForm,
    verifyForm,
    requestLoading,
    verifyLoading,
    requestError: requestState?.isError ? requestState?.message : "",
    verifyError: verifyState?.isError ? verifyState?.message : "",
    handleClose,
    goBackToEmailStep,
    handleRequestSubmit: requestForm.handleSubmit(handleRequestSubmit),
    handleVerifySubmit: verifyForm.handleSubmit(handleVerifySubmit),
    handleResend,
  };
}
