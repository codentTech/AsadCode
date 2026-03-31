"use client";

import { useRouter } from "next/navigation";
import { Lock, Home, ArrowLeft } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";

/**
 * Access Denied Component
 *
 * A reusable, eye-catching component for displaying access denied messages.
 *
 * @param {string} title - The title to display (default: "Access Denied")
 * @param {string} message - The error message to display
 * @param {string} buttonText - Text for the primary action button (default: "Back to Home")
 * @param {function} onButtonClick - Callback function when button is clicked (default: navigates to home)
 * @param {string} buttonRoute - Route to navigate to on button click (default: "/")
 * @param {boolean} showBackButton - Whether to show a back button (default: false)
 * @param {function} onBackClick - Callback function when back button is clicked
 * @param {string} className - Additional CSS classes for the container
 */
export default function AccessDenied({
  title = "Access Denied",
  message = "Sorry, but you don't have permission to access this page.",
  buttonText = "Back to Home",
  onButtonClick,
  buttonRoute = "/",
  showBackButton = false,
  onBackClick,
  className = "",
}) {
  const router = useRouter();

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      router.push(buttonRoute);
    }
  };

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-white py-12 px-4 ${className}`}
    >
      <div className="max-w-2xl w-full mx-auto text-center">
        {/* 403 Number */}
        <div className="mb-4">
          <h1 className="text-8xl md:text-9xl font-black text-indigo-600 leading-none">403</h1>
        </div>

        {/* Access Denied Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-indigo-600 mb-6">{title}</h2>

        {/* Message */}
        <p className="text-lg text-indigo-400 mb-12 max-w-md mx-auto">{message}</p>

        {/* Illustration Section */}
        <div className="flex justify-center my-12">
          <div className="relative">
            {/* Lock Icon Container */}
            <div className="bg-indigo-100 rounded-full p-8 md:p-12 relative">
              <Lock className="h-16 w-16 md:h-20 md:w-20 text-indigo-600" strokeWidth={2} />

              {/* Decorative Chain Elements */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-indigo-300 rounded-full"></div>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-indigo-300 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {showBackButton && (
            <CustomButton
              onClick={handleBackClick}
              text="Go Back"
              startIcon={<ArrowLeft className="h-4 w-4" />}
              className="px-6 py-2.5 border border-indigo-300 text-indigo-600 hover:bg-indigo-50 transition-colors"
            />
          )}
          <CustomButton
            onClick={handleButtonClick}
            text={buttonText}
            startIcon={<Home className="h-4 w-4" />}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          />
        </div>

        {/* Additional Help Text */}
        <p className="mt-8 text-sm text-gray-500">
          You can go back to{" "}
          <button
            onClick={handleBackClick}
            className="text-indigo-600 hover:text-indigo-700 font-medium underline"
          >
            previous page
          </button>
        </p>
      </div>
    </div>
  );
}
