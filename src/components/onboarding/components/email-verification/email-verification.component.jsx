import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import { ArrowLeft, Mail } from "lucide-react";
import useEmailVerification from "./use-email-verification.hook";

const EmailVerification = ({ onNext, onBack }) => {
  const {
    email,
    emailSent,
    countdown,
    verificationCode,
    handleSendVerificationEmail,
    handleCodeChange,
    handleCodePaste,
    handleResendEmail,
    handleContinue,
    isLoading,
    isSendingEmail,
    canSubmit,
  } = useEmailVerification({ onNext });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-5 bg-primary p-4 rounded-lg">
          <h1 className="text-xl lg:text-2xl font-bold text-white mb-1">
            Verify Your Email to Continue
          </h1>
          <p className="text-sm lg:text-md text-white">
            We’ve sent you an email with a verification link.
          </p>
        </div>
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
            <button
              onClick={onBack}
              className="flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>
            <span className="text-gray-500">Step 3 of 5</span>
            <span className="text-gray-500">60% Complete</span>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full w-[60%] bg-primary transition-all rounded-full" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl px-8 py-10 space-y-6">
          {/* Icon and Info */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center">
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-primary/90">
                <Mail className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Verify Your Email to Continue</h2>
            <p className="text-gray-600">We will send a 6-digit verification code to:</p>
            <div className="text-sm bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded-lg inline-block">
              {email}
            </div>
          </div>

          {!emailSent ? (
            <CustomButton
              text="Send verification email"
              className="btn-primary w-full"
              onClick={handleSendVerificationEmail}
              disabled={isSendingEmail}
              loading={isSendingEmail}
            />
          ) : (
            <>
              <p className="text-sm text-gray-500 text-center">
                Enter the 6-digit code we sent to your email below.
              </p>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Verification code</label>
                <CustomInput
                  name="verificationCode"
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={handleCodeChange}
                  onPaste={handleCodePaste}
                  inputProps={{ maxLength: 6, inputMode: "numeric", autoComplete: "one-time-code" }}
                  className="text-center text-lg tracking-[0.4em] font-mono"
                />
              </div>

              {/* Resend Message */}
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">Didn’t get it? Check your spam folder or</p>
                {countdown > 0 ? (
                  <p className="text-sm text-gray-400">Resend available in {countdown}s</p>
                ) : (
                  <button
                    onClick={handleResendEmail}
                    className="text-indigo-600 hover:text-indigo-700 text-sm underline font-medium"
                  >
                    Resend Code
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <CustomButton
                  text="Continue to Profile Setup"
                  className="btn-primary w-full"
                  onClick={handleContinue}
                  disabled={isLoading || !canSubmit}
                  loading={isLoading}
                />
                <p className="text-sm text-center text-gray-400 hover:text-gray-600 transition">
                  Having trouble? <span className="underline cursor-pointer">Contact Support</span>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
