"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import { CheckCircle, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

const CreatorApplicationConfirmation = () => {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gray-50 px-6 py-10 text-center">
      <div className="max-w-lg w-full space-y-6 border border-gray-200 rounded-lg p-6 shadow-lg">
        <div className="mb-6">
          <h1 className="bg-primary text-white px-4 py-2 rounded-lg text-2xl font-bold mb-3">
            Thanks for applying to CleerCut.
          </h1>

          <div className="space-y-4 mb-6">
            <p className="text-base lg:text-lg text-primary font-semibold leading-relaxed">
              Application Submitted
            </p>
            <p className="text-xs lg:text-sm text-gray-700 leading-relaxed">
              Our team reviews each creator to ensure every member meets our quality standards. You
              will receive an approval or denial email within a few days.
            </p>
            <div className="flex items-center justify-center space-x-2 text-gray-600 mt-6">
              <Mail className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-primary">
                Check your email for updates on your application status
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CustomButton
              text="Back to Home"
              className="btn-primary"
              onClick={() => router.push("/")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorApplicationConfirmation;
