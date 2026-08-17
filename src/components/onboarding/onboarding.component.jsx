"use client";

import UnfinishedOnboardingModal from "./components/unfinished-onboarding-modal/unfinished-onboarding-modal.component";
import useOnboarding from "./use-onboarding.hook";

export default function Onboarding() {
  const {
    stepContent,
    currentStep,
    showUnfinishedOnboardingModal,
    closeUnfinishedOnboardingModal,
  } = useOnboarding();

  return (
    <>
      {stepContent}
      <UnfinishedOnboardingModal
        show={showUnfinishedOnboardingModal}
        onClose={closeUnfinishedOnboardingModal}
        resumeStep={currentStep}
      />
    </>
  );
}
