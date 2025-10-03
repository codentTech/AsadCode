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

export const isCreatorMode = () => {
  const user = getUser();
  return user?.role === ROLES.CREATOR;
};

export const isOnboardingCompleted = (user) => {
  return user?.onboarding_step == ONBOARDING_STEPS.COMPLETED;
};

/**
 * Remove the user from local storage
 */
export const removeUser = () => {
  if (typeof window === "object" && window.localStorage) {
    localStorage.clear();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
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
    return user.role === ROLES.SUPER_ADMIN.toString();
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
};
