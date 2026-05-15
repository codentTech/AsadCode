"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Modal from "@/common/components/modal/modal.component";
import useChangeEmailModal from "./use-change-email-modal.hook";

export default function ChangeEmailModal({ open, onClose, currentEmail, onEmailUpdated }) {
  const {
    step,
    requestForm,
    verifyForm,
    requestLoading,
    verifyLoading,
    requestError,
    verifyError,
    handleClose,
    goBackToEmailStep,
    handleRequestSubmit,
    handleVerifySubmit,
    handleResend,
  } = useChangeEmailModal({ open, onClose, onEmailUpdated });

  const {
    register: registerRequest,
    formState: { errors: errorsRequest },
  } = requestForm;
  const {
    register: registerVerify,
    formState: { errors: errorsVerify },
  } = verifyForm;

  return (
    <Modal show={open} title="Change email address" onClose={handleClose} size="md">
      {step === "enter_email" ? (
        <form onSubmit={handleRequestSubmit} className="space-y-4 px-1 pb-1 pt-0 sm:px-2">
          <p className="text-[10px] leading-snug text-gray-600 sm:text-xs">
            We will send a one-time code to your new address. Your sign-in email stays the same
            until you confirm the code.
          </p>
          <div className="flex w-full flex-col gap-[6px] text-xs font-medium not-italic leading-6 text-gray-900">
            <span>Current email</span>
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-800 sm:text-sm">
              {currentEmail || "—"}
            </div>
          </div>
          <CustomInput
            label="New email address"
            name="new_email"
            type="email"
            register={registerRequest}
            errors={errorsRequest}
            placeholder="you@example.com"
            isRequired
          />

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <CustomButton
              text="Cancel"
              type="button"
              className="btn-outline w-full sm:w-auto"
              onClick={handleClose}
            />
            <CustomButton
              text="Send verification code"
              type="submit"
              className="btn-primary w-full sm:w-auto"
              loading={requestLoading}
            />
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifySubmit} className="space-y-4 px-1 pb-1 pt-0 sm:px-2">
          <p className="text-[10px] leading-snug text-gray-600 sm:text-xs">
            Enter the verification code we sent to your new email. Codes expire in a few minutes.
          </p>
          <CustomInput
            label="Verification code"
            name="code"
            register={registerVerify}
            errors={errorsVerify}
            placeholder="6-digit code"
            isRequired
            inputMode="numeric"
            autoComplete="one-time-code"
          />

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
            <CustomButton
              text="Back"
              type="button"
              className="btn-cancel w-full sm:w-auto"
              onClick={goBackToEmailStep}
            />
            <CustomButton
              text="Resend code"
              type="button"
              className="btn-outline w-full sm:w-auto"
              onClick={handleResend}
              loading={requestLoading}
            />
            <CustomButton
              text="Verify and update"
              type="submit"
              className="btn-primary w-full sm:flex-1 sm:min-w-[140px]"
              loading={verifyLoading}
            />
          </div>
        </form>
      )}
    </Modal>
  );
}
