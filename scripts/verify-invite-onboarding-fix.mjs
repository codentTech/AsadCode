/**
 * Edge-case verification for creator invite onboarding helpers.
 * Run: node scripts/verify-invite-onboarding-fix.mjs
 */

const ONBOARDING_STEPS = Object.freeze({
  ACCOUNT_TYPE_SELECTION: 1,
  REGISTRATION: 2,
  EMAIL_VERIFICATION: 3,
  PROFILE_SETUP: 4,
  COMPLETED: 8,
});

const resolveOnboardingEmail = ({
  inviteTokenPresent,
  inviteResumeEmail,
  loggedInUserEmail,
  storedEmail,
} = {}) => {
  if (inviteTokenPresent) return inviteResumeEmail || null;
  return loggedInUserEmail || storedEmail || null;
};

const emailsMatch = (a, b) => {
  const left = String(a || "").trim().toLowerCase();
  const right = String(b || "").trim().toLowerCase();
  return Boolean(left && right && left === right);
};

const hasCreatedAccount = (onboardingStatus) =>
  Boolean(onboardingStatus?.user?.email);

const shouldStripInviteTokenAfterAccount = ({
  inviteToken,
  inviteEmail,
  onboardingStatus,
} = {}) => {
  if (!inviteToken || !inviteEmail) return false;
  if (!hasCreatedAccount(onboardingStatus)) return false;
  return emailsMatch(onboardingStatus?.user?.email, inviteEmail);
};

const getStatusResumeStep = (onboardingStatus, inviteTokenPresent) => {
  const step = Number(onboardingStatus?.onboardingStep);
  if (!Number.isFinite(step) || step <= 0) return null;
  if (inviteTokenPresent && !hasCreatedAccount(onboardingStatus)) {
    return ONBOARDING_STEPS.REGISTRATION;
  }
  return step;
};

const shouldShowCreatorApplication = ({
  isCreatorMode,
  inviteToken,
  isResumeInvite,
  currentStep,
  showApplicationConfirmation,
}) =>
  Boolean(
    isCreatorMode &&
      !inviteToken &&
      !isResumeInvite &&
      currentStep === ONBOARDING_STEPS.REGISTRATION &&
      !showApplicationConfirmation,
  );

const shouldBlockOnInvalidInvite = ({
  inviteToken,
  isTokenValid,
  isResumeInvite,
  hasValidatedToken,
  onboardingStatus,
  currentStep,
}) => {
  if (!inviteToken || !hasValidatedToken || isTokenValid || isResumeInvite) return false;
  if (hasCreatedAccount(onboardingStatus)) return false;
  if (Number(currentStep) > ONBOARDING_STEPS.EMAIL_VERIFICATION && Number(currentStep) >= ONBOARDING_STEPS.PROFILE_SETUP) {
    return false;
  }
  return Number(currentStep) <= ONBOARDING_STEPS.EMAIL_VERIFICATION;
};

let passed = 0;
let failed = 0;

function assert(name, condition) {
  if (condition) {
    passed += 1;
    console.log(`PASS  ${name}`);
  } else {
    failed += 1;
    console.error(`FAIL  ${name}`);
  }
}

// --- resolveOnboardingEmail ---
assert(
  "invite present + stale local emails → ignore until invite email known",
  resolveOnboardingEmail({
    inviteTokenPresent: true,
    inviteResumeEmail: null,
    loggedInUserEmail: "stale@local.com",
    storedEmail: "old@local.com",
  }) === null,
);

assert(
  "invite present + validated invite email wins over localStorage",
  resolveOnboardingEmail({
    inviteTokenPresent: true,
    inviteResumeEmail: "invited@cleercut.com",
    loggedInUserEmail: "stale@local.com",
    storedEmail: "old@local.com",
  }) === "invited@cleercut.com",
);

assert(
  "no invite → logged-in email wins",
  resolveOnboardingEmail({
    inviteTokenPresent: false,
    inviteResumeEmail: null,
    loggedInUserEmail: "user@cleercut.com",
    storedEmail: "old@local.com",
  }) === "user@cleercut.com",
);

// --- shouldShowCreatorApplication ---
assert(
  "never show Apply when invite token present (even if invalid)",
  shouldShowCreatorApplication({
    isCreatorMode: true,
    inviteToken: "abc",
    isResumeInvite: false,
    currentStep: 2,
    showApplicationConfirmation: false,
  }) === false,
);

assert(
  "show Apply for normal creator path without invite",
  shouldShowCreatorApplication({
    isCreatorMode: true,
    inviteToken: null,
    isResumeInvite: false,
    currentStep: 2,
    showApplicationConfirmation: false,
  }) === true,
);

assert(
  "never show Apply on resumeOnly",
  shouldShowCreatorApplication({
    isCreatorMode: true,
    inviteToken: null,
    isResumeInvite: true,
    currentStep: 2,
    showApplicationConfirmation: false,
  }) === false,
);

// --- getStatusResumeStep ---
assert(
  "fresh invite + no account → Create account (not Verify)",
  getStatusResumeStep({ onboardingStep: 1, user: null }, true) ===
    ONBOARDING_STEPS.REGISTRATION,
);

assert(
  "fresh invite ignores stale verify step number from empty status",
  getStatusResumeStep({ onboardingStep: 3, user: null }, true) ===
    ONBOARDING_STEPS.REGISTRATION,
);

assert(
  "resumeOnly with account → keep verify step",
  getStatusResumeStep(
    {
      onboardingStep: 3,
      user: { email: "invited@cleercut.com" },
    },
    true,
  ) === ONBOARDING_STEPS.EMAIL_VERIFICATION,
);

assert(
  "no invite resumes stored step",
  getStatusResumeStep(
    {
      onboardingStep: 3,
      user: { email: "user@cleercut.com" },
    },
    false,
  ) === ONBOARDING_STEPS.EMAIL_VERIFICATION,
);

// --- shouldStripInviteTokenAfterAccount ---
assert(
  "do not strip when stale unrelated account exists",
  shouldStripInviteTokenAfterAccount({
    inviteToken: "tok",
    inviteEmail: "invited@cleercut.com",
    onboardingStatus: { user: { email: "other@brand.com" } },
  }) === false,
);

assert(
  "do not strip before account exists",
  shouldStripInviteTokenAfterAccount({
    inviteToken: "tok",
    inviteEmail: "invited@cleercut.com",
    onboardingStatus: { user: null },
  }) === false,
);

assert(
  "strip only when invite email account exists",
  shouldStripInviteTokenAfterAccount({
    inviteToken: "tok",
    inviteEmail: "invited@cleercut.com",
    onboardingStatus: { user: { email: "Invited@CleerCut.com" } },
  }) === true,
);

// --- invalid invite block ---
assert(
  "invalid invite blocked on registration step",
  shouldBlockOnInvalidInvite({
    inviteToken: "bad",
    isTokenValid: false,
    isResumeInvite: false,
    hasValidatedToken: true,
    onboardingStatus: { user: null },
    currentStep: 2,
  }) === true,
);

assert(
  "valid invite not blocked",
  shouldBlockOnInvalidInvite({
    inviteToken: "good",
    isTokenValid: true,
    isResumeInvite: false,
    hasValidatedToken: true,
    onboardingStatus: { user: null },
    currentStep: 2,
  }) === false,
);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
