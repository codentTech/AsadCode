"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import {
  creatorNeedsProfilePhoto,
  creatorNeedsShowcaseImages,
} from "@/common/utils/creator-showcase.util";
import { getUser } from "@/common/utils/users.util";
import useCreatorShowcaseGate from "./use-creator-showcase-gate.hook";

const CreatorShowcaseGate = () => {
  const { goToShowcaseUpload } = useCreatorShowcaseGate();
  const user = getUser();
  const needsPhoto = creatorNeedsProfilePhoto(user);
  const needsShowcase = creatorNeedsShowcaseImages(user);

  const missingParts = [
    needsPhoto ? "a profile photo" : null,
    needsShowcase ? "3 showcase images" : null,
  ].filter(Boolean);

  const missingLabel = missingParts.join(" and ");

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gray-50 px-6 py-10 text-center">
      <div className="max-w-lg w-full space-y-6 border border-gray-200 rounded-lg p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-primary">Complete your profile to continue</h1>
        <div className="space-y-4 text-left text-text-dark-gray text-sm leading-relaxed">
          <p>
            Your profile is missing {missingLabel}. Brands on CleerCut browse creator profiles to
            find partners for their campaigns, and incomplete profiles are not featured on our
            discovery page.
          </p>
          <p>
            You need to add{" "}
            <span className="font-semibold text-primary">{missingLabel}</span> before you can
            access your dashboard. Choose images that best reflect your style and niche.
          </p>
        </div>
        <CustomButton
          type="button"
          text="Update Profile Media"
          className="btn-primary w-full max-w-md mx-auto h-12 text-base"
          onClick={goToShowcaseUpload}
        />
      </div>
    </div>
  );
};

export default CreatorShowcaseGate;
