import CustomButton from "@/common/components/custom-button/custom-button.component";
import { Check, Clock, Inbox, Mail, ShieldCheck } from "lucide-react";
import OnboardingStepLayout from "../onboarding-step-layout/onboarding-step-layout.component";
import useEmailVerification from "./use-email-verification.hook";

const VERIFY_STEPS = [
  {
    id: 1,
    label: "Send a code",
    detail: "We email a 6-digit code to the address you just used.",
  },
  {
    id: 2,
    label: "Enter the code",
    detail: "Type or paste it here. Codes expire in a few minutes.",
  },
  {
    id: 3,
    label: "Continue setup",
    detail: "Once it matches, you can finish your profile.",
  },
];

const INBOX_TIPS = [
  { icon: Inbox, text: "Check your inbox and spam or promotions folder." },
  { icon: Clock, text: "The code expires shortly — resend if it runs out." },
  { icon: ShieldCheck, text: "Never share this code. CleerCut will not ask for it elsewhere." },
];

const EmailVerification = ({ onNext }) => {
  const {
    email,
    emailSent,
    countdown,
    codeDigits,
    codeLength,
    setDigitRef,
    handleDigitChange,
    handleDigitKeyDown,
    handleDigitFocus,
    handleSendVerificationEmail,
    handleCodePaste,
    handleResendEmail,
    handleContinue,
    isLoading,
    isSendingEmail,
    canSubmit,
  } = useEmailVerification({ onNext });

  const activeVerifyStep = emailSent ? (canSubmit ? 3 : 2) : 1;

  return (
    <OnboardingStepLayout
      footer={
        !emailSent ? (
          <CustomButton
            text="Send verification email"
            className="btn-primary w-full sm:ml-auto sm:w-auto"
            onClick={handleSendVerificationEmail}
            disabled={isSendingEmail}
            loading={isSendingEmail}
          />
        ) : (
          <CustomButton
            text="Continue to Profile Setup"
            className="btn-primary w-full sm:ml-auto sm:w-auto"
            onClick={handleContinue}
            disabled={isLoading || !canSubmit}
            loading={isLoading}
          />
        )
      }
    >
      <div className="flex flex-col gap-3">
        <section className="flex items-center gap-3 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white">
            {emailSent ? <ShieldCheck className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-gray-900">
              {emailSent ? "We sent a verification code" : "Confirm this email belongs to you"}
            </h3>
            <p className="mt-0.5 truncate text-xs text-gray-600">
              {email || "Add an email on the previous step if this is empty."}
            </p>
          </div>
        </section>

        <div className="grid gap-3 lg:grid-cols-2">
          <section className="rounded-lg border border-gray-200 bg-white p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
              How it works
            </p>
            <ol className="mt-2 space-y-1.5">
              {VERIFY_STEPS.map((step) => {
                const isDone = activeVerifyStep > step.id;
                const isCurrent = activeVerifyStep === step.id;
                return (
                  <li
                    key={step.id}
                    className={`flex items-start gap-2 rounded-md border px-2 py-1.5 ${
                      isCurrent
                        ? "border-primary bg-indigo-50"
                        : isDone
                          ? "border-indigo-100 bg-indigo-50/50"
                          : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                        isDone
                          ? "bg-primary text-white"
                          : isCurrent
                            ? "border-2 border-primary bg-white text-primary"
                            : "border border-gray-300 bg-white text-gray-400"
                      }`}
                    >
                      {isDone ? <Check className="h-3 w-3" /> : step.id}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-900">{step.label}</p>
                      <p className="mt-0.5 text-[11px] leading-snug text-gray-600">{step.detail}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
              {emailSent ? "Enter your code" : "Ready to send"}
            </p>
            <p className="mt-1 text-xs leading-snug text-gray-600">
              {emailSent
                ? "Paste the full code, or type one digit at a time."
                : "We will send a 6-digit code to this address. Use the button below to send it."}
            </p>

            <div className="mt-3 rounded-md border border-gray-200 bg-gray-200 px-2.5 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                Sending to
              </p>
              <p className="mt-0.5 break-all text-xs font-semibold text-gray-900 sm:text-sm">
                {email || "—"}
              </p>
            </div>

            {emailSent ? (
              <div className="mt-3" onPaste={handleCodePaste}>
                <div className="grid w-full grid-cols-6 gap-1.5 sm:gap-2">
                  {codeDigits.map((digit, index) => (
                    <input
                      key={`code-${index}`}
                      ref={setDigitRef(index)}
                      type="text"
                      inputMode="numeric"
                      autoComplete={index === 0 ? "one-time-code" : "off"}
                      maxLength={index === 0 ? codeLength : 1}
                      value={digit}
                      onChange={(e) => handleDigitChange(index, e)}
                      onKeyDown={(e) => handleDigitKeyDown(index, e)}
                      onFocus={handleDigitFocus}
                      aria-label={`Digit ${index + 1} of ${codeLength}`}
                      className={`h-10 w-full rounded-md border text-center text-sm font-semibold tabular-nums text-gray-900 outline-none transition sm:h-11 ${
                        digit
                          ? "border-primary bg-indigo-50"
                          : "border-gray-300 bg-white hover:border-gray-400"
                      } focus:border-primary focus:ring-1 focus:ring-primary`}
                    />
                  ))}
                </div>
                <div className="mt-2 flex justify-end gap-2 text-xs text-gray-600">
                  <Clock className="h-4 w-4 shrink-0 text-gray-900" />
                  {countdown > 0 ? (
                    <span>
                      Resend available in <b>{countdown}</b> seconds
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendEmail}
                      className="font-medium text-indigo-600 underline hover:text-indigo-700"
                    >
                      Resend code
                    </button>
                  )}
                </div>
              </div>
            ) : null}

            <ul className="mt-3 space-y-1.5">
              {INBOX_TIPS.map((tip) => {
                const Icon = tip.icon;
                return (
                  <li
                    key={tip.text}
                    className="flex items-start gap-2 text-xs leading-snug text-gray-600"
                  >
                    <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    <span>{tip.text}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </OnboardingStepLayout>
  );
};

export default EmailVerification;
