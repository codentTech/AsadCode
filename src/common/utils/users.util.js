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

export const clearOnboardingClientStorage = () => {
  if (typeof window !== "object") return;
  try {
    window.localStorage?.removeItem("email");
    window.sessionStorage?.removeItem("onboarding_email");
    const storage = window.sessionStorage;
    if (!storage) return;
    const keysToRemove = [];
    for (let i = 0; i < storage.length; i += 1) {
      const key = storage.key(i);
      if (key && key.startsWith("cleercut:onboarding:")) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => storage.removeItem(key));
  } catch {
    // ignore quota / private mode
  }
};

export const persistOnboardingEmail = (email) => {
  if (typeof window !== "object") return;
  const normalized = String(email || "").trim();
  if (!normalized || normalized === "undefined") return;
  if (window.localStorage) {
    window.localStorage.setItem("email", normalized);
  }
  try {
    window.sessionStorage?.setItem("onboarding_email", normalized);
  } catch {
    // ignore quota / private mode
  }
};

export const getOnboardingEmail = () => {
  if (typeof window !== "object") {
    return undefined;
  }
  const stored = window.localStorage?.getItem("email");
  if (stored && stored !== "undefined") {
    return stored;
  }
  try {
    const sessionEmail = window.sessionStorage?.getItem("onboarding_email");
    if (sessionEmail && sessionEmail !== "undefined") {
      persistOnboardingEmail(sessionEmail);
      return sessionEmail;
    }
  } catch {
    // ignore
  }
  const userEmail = getUser()?.email;
  if (userEmail) {
    persistOnboardingEmail(userEmail);
    return userEmail;
  }
  return undefined;
};

export const requireOnboardingEmailQuery = (email) => {
  const normalized = String(email || "").trim();
  if (!normalized || normalized === "undefined") {
    throw new Error("Onboarding email is missing");
  }
  return encodeURIComponent(normalized);
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

export const getResumeOnboardingStep = (user = getUser()) => {
  const step = Number(user?.onboarding_step);
  if (!Number.isFinite(step)) return null;
  if (step < ONBOARDING_STEPS.EMAIL_VERIFICATION) return null;
  if (step >= ONBOARDING_STEPS.COMPLETED) return null;
  return step;
};

export const getOnboardingStepTitle = (step) => {
  const s = Number(step);
  const titles = {
    [ONBOARDING_STEPS.ACCOUNT_TYPE_SELECTION]: "Account type",
    [ONBOARDING_STEPS.REGISTRATION]: "Registration",
    [ONBOARDING_STEPS.EMAIL_VERIFICATION]: "Email verification",
    [ONBOARDING_STEPS.PROFILE_SETUP]: "Profile setup",
    [ONBOARDING_STEPS.CONNECT_SOCIAL]: "Connect social",
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

export const getAdminApplicationStatusLabel = (status) => {
  switch (String(status || "").toUpperCase()) {
    case "PENDING":
      return "Pending review";
    case "APPROVED":
      return "Invited — awaiting account";
    case "ONBOARDING_STARTED":
      return "Account created — profile incomplete";
    case "ONBOARDED":
      return "Account created — setup complete";
    case "DENIED":
      return "Denied";
    default:
      return status || "Pending";
  }
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
  clearOnboardingClientStorage();
};

/**
 * Drop auth session but keep onboarding email/name so phase-one can hand off to login.
 */
export const clearAuthSessionForOnboardingLogin = () => {
  if (typeof window !== "object" || !window.localStorage) return;
  let email = localStorage.getItem("email");
  if (!email || email === "undefined") {
    try {
      email = sessionStorage.getItem("onboarding_email");
    } catch {
      email = null;
    }
  }
  const name = localStorage.getItem("name");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_user");
  if (email && email !== "undefined") {
    persistOnboardingEmail(email);
  }
  if (name && name !== "undefined") {
    localStorage.setItem("name", name);
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
  if (typeof window === "object" && window.localStorage) {
    localStorage.clear();
  }
  clearOnboardingClientStorage();
};
