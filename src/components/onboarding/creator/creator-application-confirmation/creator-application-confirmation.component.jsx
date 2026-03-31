"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import { CheckCircle, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

const CreatorApplicationConfirmation = () => {
  const router = useRouter();

  return (
    <div className="py-8 px-4 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto w-full">
        <div className="bg-white rounded-lg shadow-2xl p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-indigo-600" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
              Application Submitted!
            </h1>
          </div>

          <div className="space-y-4 mb-8">
            <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
              Thanks for applying to CleerCut.
            </p>
            <p className="text-xs lg:text-sm text-gray-700 leading-relaxed">
              Our team reviews each creator to ensure every member meets our quality standards. You
              will receive an approval or denial email within a few days.
            </p>
            <div className="flex items-center justify-center space-x-2 text-gray-600 mt-6">
              <Mail className="h-5 w-5" />
              <span className="text-sm font-semibold">
                Check your email for updates on your application status
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CustomButton
              text="Back to Home"
              className="btn-secondary"
              onClick={() => router.push("/")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorApplicationConfirmation;
