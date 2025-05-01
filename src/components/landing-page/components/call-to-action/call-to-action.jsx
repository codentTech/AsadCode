import CustomButton from "@/common/components/custom-button/custom-button.component";
import React from "react";

function CallToAction() {
  return (
    <section className="py-16 bg-indigo-600">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-2xl p-8 md:p-12 shadow-xl">
          <div className="md:w-2/3 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Ready to elevate your brand? Start your journey with CleerCut
              today.
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of brands already growing with CleerCut's platform.
            </p>
          </div>
          <div className="md:w-1/3 flex flex-col sm:flex-row md:flex-col space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-0 md:space-y-4">
            <CustomButton text="Get Started Free" />
            <CustomButton text="Join Waitlist" className="w-full btn-outline" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default CallToAction;
