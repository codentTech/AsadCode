"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import PropTypes from "prop-types";
import useOnboardingEmailRecovery from "./use-onboarding-email-recovery.hook";

export default function OnboardingEmailRecovery({ onRecovered, onBack }) {
  const {
    email,
    error,
    isSubmitting,
    handleEmailChange,
    handleSubmit,
    handleBack,
    title,
    description,
    submitText,
    backText,
  } = useOnboardingEmailRecovery({ onRecovered, onBack });

  return (
    <div className="relative flex min-h-screen items-center justify-center px-2.5 py-6 sm:px-4 sm:py-12">
      <div className="w-full max-w-md space-y-4 rounded-2xl bg-white p-4 shadow-2xl sm:space-y-5 sm:rounded-3xl sm:p-8">
        <div className="text-left">
          <h1 className="text-sm font-semibold text-gray-900 sm:text-lg md:text-xl">{title}</h1>
          <p className="mt-1 text-[10px] leading-snug text-gray-600 sm:text-xs md:text-sm">
            {description}
          </p>
        </div>
        <CustomInput
          type="email"
          name="recovery_email"
          label="Email *"
          placeholder="you@example.com"
          value={email}
          onChange={handleEmailChange}
          errors={error ? { recovery_email: { message: error } } : null}
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          {onBack ? (
            <CustomButton
              text={backText}
              onClick={handleBack}
              className="btn-outline w-full sm:w-auto"
              disabled={isSubmitting}
            />
          ) : (
            <span />
          )}
          <CustomButton
            text={submitText}
            onClick={handleSubmit}
            className="btn-primary w-full sm:w-auto"
            disabled={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}

OnboardingEmailRecovery.propTypes = {
  onRecovered: PropTypes.func,
  onBack: PropTypes.func,
};
