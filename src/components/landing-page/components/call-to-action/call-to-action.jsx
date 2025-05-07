import CustomButton from "@/common/components/custom-button/custom-button.component";
import { JoinFullOutlined } from "@mui/icons-material";
import React from "react";

function CallToAction() {
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-2xl p-8 md:p-12 shadow-xl">
          <div className="w-full">
            <h2 className="text-3xl font-bold mb-1 text-gray-900">
              Ready to elevate your brand? Start your journey with CleerCut
              today.
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of brands already growing with CleerCut's platform.
            </p>
          </div>
          <div className="mt-3 w-auto">
            <CustomButton text="Join" startIcon={<JoinFullOutlined />} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default CallToAction;
