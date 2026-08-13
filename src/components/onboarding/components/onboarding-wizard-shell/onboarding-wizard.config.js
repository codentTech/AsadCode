import ONBOARDING_STEPS from "@/common/constants/onboarding-steps.constant";

export const CREATOR_WIZARD_STEPS = [
  {
    id: ONBOARDING_STEPS.REGISTRATION,
    name: "Create account",
    description: "Add your name, email, and password to get started.",
    tip: "Use the email you check most — brands will reach you there.",
    guide: [
      "Enter your legal first and last name.",
      "Choose a password you can remember.",
      "Accept the terms to create your account.",
    ],
    next: {
      name: "Verify email",
      description: "We’ll send a 6-digit code so you can confirm this inbox.",
    },
  },
  {
    id: ONBOARDING_STEPS.EMAIL_VERIFICATION,
    name: "Verify email",
    description: "Confirm your email so you can finish setup.",
    tip: "Check spam if the code does not arrive within a minute.",
    guide: [
      "Send the 6-digit code to your inbox.",
      "Enter the code exactly as it appears.",
      "You can resend if the timer runs out.",
    ],
    next: {
      name: "Public profile",
      description: "Add your photo, niches, and rates so brands can find you.",
    },
  },
  {
    id: ONBOARDING_STEPS.PROFILE_SETUP,
    name: "Public profile",
    description: "Showcase your content style and set your rates.",
    tip: "A clear photo, niches, and rates help brands shortlist you faster.",
    guide: [
      "Choose how you work: influencer, UGC, or hybrid.",
      "Add a photo, bio, and the niches you cover.",
      "Set rates so brands know what to expect.",
    ],
    next: {
      name: "Connect socials",
      description: "Link an account or add a media kit so brands can verify reach.",
    },
  },
  {
    id: ONBOARDING_STEPS.CONNECT_SOCIAL,
    name: "Connect socials",
    description: "Link accounts so brands can verify your reach — or add a media kit.",
    tip: "One connected account or a media kit link is enough to continue.",
    guide: [
      "Connect Instagram, TikTok, or YouTube when you can.",
      "Or paste a media kit link if you cannot log in now.",
      "Skip only if you want to connect later from your portfolio.",
    ],
    next: {
      name: "Campaign preferences",
      description: "Tell brands which campaigns you are open to.",
    },
  },
  {
    id: ONBOARDING_STEPS.CAMPAIGN_PREFERENCES,
    name: "Campaign preferences",
    description: "Tell brands which campaigns you are open to.",
    tip: "The more specific you are, the better the matches.",
    guide: [
      "Select the campaign types you will take.",
      "Add location and language so brands can filter you.",
      "Save to start receiving opportunities.",
    ],
    next: {
      name: "You're all set",
      description: "Finish this step to complete onboarding and start receiving campaigns.",
    },
  },
];

export const BRAND_WIZARD_STEPS = [
  {
    id: ONBOARDING_STEPS.REGISTRATION,
    name: "Create account",
    description: "Add the account owner details to get started.",
    tip: "This person will manage campaigns and creator conversations.",
    guide: [
      "Enter the account owner’s name and email.",
      "Choose a password you can remember.",
      "Accept the terms to create your account.",
    ],
    next: {
      name: "Verify email",
      description: "We’ll send a 6-digit code so you can confirm this inbox.",
    },
  },
  {
    id: ONBOARDING_STEPS.EMAIL_VERIFICATION,
    name: "Verify email",
    description: "Confirm your email so you can finish setup.",
    tip: "Check spam if the code does not arrive within a minute.",
    guide: [
      "Send the 6-digit code to your inbox.",
      "Enter the code exactly as it appears.",
      "You can resend if the timer runs out.",
    ],
    next: {
      name: "Client profile",
      description: "Add your name, logo, and a short description creators will see.",
    },
  },
  {
    id: ONBOARDING_STEPS.PROFILE_SETUP,
    name: "Client profile",
    description: "Set up the public profile creators will see.",
    tip: "A logo, name, and short description make your campaigns feel legitimate.",
    guide: [
      "Add your client name and logo.",
      "Write a short description of what you do.",
      "Include location so creators know where you operate.",
    ],
    next: {
      name: "Campaign preferences",
      description: "Set filming needs, niches, and the creator sizes you want.",
    },
  },
  {
    id: ONBOARDING_STEPS.CONNECT_SOCIAL,
    name: "Campaign preferences",
    description: "Set your campaign needs and find the right creators.",
    tip: "You can refine these later when you publish a campaign.",
    guide: [
      "Choose how creators should film.",
      "Pick campaign types and niches you care about.",
      "Set creator size and geographic focus.",
    ],
    next: {
      name: "Ideal creator",
      description: "Set follower, location, and platform filters for applicants.",
    },
  },
  {
    id: ONBOARDING_STEPS.IDEAL_CREATOR_SETUP,
    name: "Ideal creator",
    description: "Help us find the right creators for your campaigns.",
    tip: "Keep filters realistic so you still see a strong pool of applicants.",
    guide: [
      "Set a follower floor that matches your budget.",
      "Add countries, age, and platforms that matter.",
      "Complete setup to start posting campaigns.",
    ],
    next: {
      name: "You're all set",
      description: "Finish this step to complete onboarding and start posting campaigns.",
    },
  },
];

export const getOnboardingWizardSteps = (isCreator) =>
  isCreator ? CREATOR_WIZARD_STEPS : BRAND_WIZARD_STEPS;

export const getOnboardingWizardIndex = (currentStep, isCreator) => {
  const steps = getOnboardingWizardSteps(isCreator);
  const mappedStep =
    !isCreator && currentStep === ONBOARDING_STEPS.CAMPAIGN_PREFERENCES
      ? ONBOARDING_STEPS.CONNECT_SOCIAL
      : currentStep;
  const index = steps.findIndex((step) => step.id === mappedStep);
  return index >= 0 ? index : 0;
};

export const isOnboardingWizardStep = (currentStep) => {
  const n = Number(currentStep);
  return (
    n >= ONBOARDING_STEPS.REGISTRATION && n <= ONBOARDING_STEPS.IDEAL_CREATOR_SETUP
  );
};
