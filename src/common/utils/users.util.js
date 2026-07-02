"use client";

import ONBOARDING_STEPS from "@/common/constants/onboarding-steps.constant";
import ROLES from "../constants/role.constant";

/**
 * Retrive access token from local storage
 * @returns string | undefined
 */

export const getUser = (user) => {
  user && localStorage.setItem("user", JSON.stringify(user));
  if (typeof window === "object" && window?.localStorage?.getItem("user")) {
    return JSON.parse(localStorage.getItem("user"));
  }
  return undefined;
};

export const getOnboardingEmail = () => {
  if (typeof window === "object" && window?.localStorage?.getItem("email")) {
    return localStorage.getItem("email");
  }
  return undefined;
};

export const getOnboardingName = () => {
  if (typeof window === "object" && window?.localStorage?.getItem("name")) {
    return localStorage.getItem("name");
  }
  return undefined;
};

export const isCreatorMode = () => {
  const user = getUser();
  return user?.role === ROLES.CREATOR;
};

export const isOnboardingCompleted = (user) => {
  return user?.onboarding_step == ONBOARDING_STEPS.COMPLETED;
};

export const getOnboardingStepTitle = (step) => {
  const s = Number(step);
  const titles = {
    [ONBOARDING_STEPS.ACCOUNT_TYPE_SELECTION]: "Account type",
    [ONBOARDING_STEPS.REGISTRATION]: "Registration",
    [ONBOARDING_STEPS.EMAIL_VERIFICATION]: "Email verification",
    [ONBOARDING_STEPS.PROFILE_SETUP]: "Profile setup",
    [ONBOARDING_STEPS.CAMPAIGN_PREFERENCES]: "Campaign preferences",
    [ONBOARDING_STEPS.IDEAL_CREATOR_SETUP]: "Ideal creator",
    [ONBOARDING_STEPS.COMPLETED]: "Completed",
  };
  return titles[s] ?? "—";
};

export const getAdminUserOnboardingSummaryText = (row) => {
  if (!row) {
    return "—";
  }
  if (isOnboardingCompleted(row)) {
    return "Completed";
  }
  const title = getOnboardingStepTitle(row.onboarding_step);
  return `In progress — ${title}`;
};

export const getImpersonationLandingPath = (user) => {
  if (!user) {
    return "/onboarding";
  }
  return isOnboardingCompleted(user) ? "/campaign" : "/onboarding";
};

export const onboardingSteps = Object.fromEntries(
  Object.entries(ONBOARDING_STEPS).map(([k, v]) => [v, k])
);

/**
 * Remove the user from local storage
 */
export const removeUser = () => {
  if (typeof window === "object" && window.localStorage) {
    localStorage.clear();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("admin_user");
    localStorage.removeItem("admin_token");
  }
};

/**
 * Retrive isPhoneVerified from local storage
 * @returns bool
 */

export const isPhoneVerified = (data) => {
  if ((typeof window === "object" && window?.localStorage?.getItem("user")) || data) {
    const user = data ?? getUser();
    return user.isPhoneVerified;
  }
  return false;
};

/**
 * Retrive isEmailVerified from local storage
 * @returns bool
 */

export const isEmailVerified = (data) => {
  if ((typeof window === "object" && window?.localStorage?.getItem("user")) || data) {
    const user = data ?? getUser();
    return user.isEmailVerified;
  }
  return false;
};

export const isProfileCreated = (data) => {
  if ((typeof window === "object" && window?.localStorage?.getItem("user")) || data) {
    const user = data ?? getUser();
    return user.currentBusinessId;
  }
  return false;
};

export const is2FAEnabled = (data) => {
  if ((typeof window === "object" && window?.localStorage?.getItem("user")) || data) {
    const user = data ?? getUser();
    return user.isTwoFactorAuth;
  }
  return false;
};

export const isSuperAdmin = (data) => {
  if ((typeof window === "object" && window?.localStorage?.getItem("user")) || data) {
    const user = data ?? getUser();
    return user?.role === ROLES.ADMIN;
  }
  return false;
};

export const isImpersonating = () => {
  if (typeof window === "object" && window?.localStorage) {
    return Boolean(localStorage.getItem("admin_token"));
  }
  return false;
};

export const getEmailForURL = (email) => {
  // comment condition for production
  if (email?.includes("+")) return email.replace("+", "%2B");
  return email;
};

export const logout = () => {
  localStorage.clear();
  localStorage.removeItem("admin_user");
  localStorage.removeItem("admin_token");
};
