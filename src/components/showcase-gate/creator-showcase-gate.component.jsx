"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import useCreatorShowcaseGate from "./use-creator-showcase-gate.hook";

const CreatorShowcaseGate = () => {
  const { goToShowcaseUpload } = useCreatorShowcaseGate();

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gray-50 px-6 py-10 text-center">
      <div className="max-w-lg w-full space-y-6 border border-gray-200 rounded-lg p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-primary">Complete your profile to continue</h1>
        <div className="space-y-4 text-left text-text-dark-gray text-sm leading-relaxed">
          <p>
            Your profile is missing showcase images. Brands on CleerCut browse creator profiles to
            find partners for their campaigns, and profiles without showcase images are not featured
            on our discovery page.
          </p>
          <p>
            You need to upload <span className="font-semibold text-primary">3 showcase images</span>{" "}
            before you can access your dashboard. These images represent you and your content to
            potential brand partners, so choose images that best reflect your style and niche.
          </p>
        </div>
        <CustomButton
          type="button"
          text="Upload Showcase Images"
          className="btn-primary w-full max-w-md mx-auto h-12 text-base"
          onClick={goToShowcaseUpload}
        />
      </div>
    </div>
  );
};

export default CreatorShowcaseGate;
