import { Mail, CheckCircle, ArrowLeft } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import useEmailVerification from "./use-email-verification.hook";

const EmailVerification = ({ onNext, onBack }) => {
  const { email, emailSent, countdown, handleResendEmail, handleContinue } = useEmailVerification({
    onNext,
  });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
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
            <div className="h-full w-[60%] bg-gradient-to-r from-indigo-500 to-purple-600 transition-all rounded-full" />
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
            <p className="text-gray-600">We’ve sent a verification link to:</p>
            <div className="text-sm bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded-lg inline-block">
              {email}
            </div>
            <p className="text-sm text-gray-500">
              Click the link to confirm your account and begin setting up your profile.
            </p>
          </div>

          {/* Resend Message */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">Didn’t get it? Check your spam folder or</p>
            {countdown > 0 ? (
              <p className="text-sm text-gray-400">Resend available in {countdown}s</p>
            ) : !emailSent ? (
              <button
                onClick={handleResendEmail}
                className="text-indigo-600 hover:text-indigo-700 text-sm underline font-medium"
              >
                Resend Email
              </button>
            ) : (
              <div className="inline-flex items-center justify-center bg-green-50 text-green-700 text-sm font-medium px-4 py-2 rounded-lg">
                <CheckCircle className="h-4 w-4 mr-2" />
                Email sent! Please check your inbox.
              </div>
            )}
          </div>

          {/* Continue Button */}
          <div className="pt-4 space-y-3">
            <CustomButton
              text="Continue to Profile Setup"
              className="btn-primary w-full"
              onClick={handleContinue}
            />
            <p className="text-sm text-center text-gray-400 hover:text-gray-600 transition">
              Having trouble? <span className="underline cursor-pointer">Contact Support</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
