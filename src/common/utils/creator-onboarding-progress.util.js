import ONBOARDING_STEPS from "@/common/constants/onboarding-steps.constant";

/** Creator invite wizard UI steps (excludes account-type). */
export const CREATOR_INVITE_PROGRESS = Object.freeze({
  [ONBOARDING_STEPS.REGISTRATION]: { step: 1, total: 5, percent: 20, barClass: "w-1/5" },
  [ONBOARDING_STEPS.EMAIL_VERIFICATION]: { step: 2, total: 5, percent: 40, barClass: "w-2/5" },
  [ONBOARDING_STEPS.PROFILE_SETUP]: { step: 3, total: 5, percent: 60, barClass: "w-3/5" },
  [ONBOARDING_STEPS.CONNECT_SOCIAL]: { step: 4, total: 5, percent: 80, barClass: "w-4/5" },
  [ONBOARDING_STEPS.CAMPAIGN_PREFERENCES]: { step: 5, total: 5, percent: 100, barClass: "w-full" },
});

export const getCreatorInviteProgress = (onboardingStep) => {
  return (
    CREATOR_INVITE_PROGRESS[onboardingStep] || {
      step: 1,
      total: 5,
      percent: 20,
      barClass: "w-1/5",
    }
  );
};
