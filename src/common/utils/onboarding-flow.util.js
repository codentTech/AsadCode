import { normalizeInviteToken } from "@/common/utils/invite-token.util";

export const readInviteTokenFromWindow = () => {
  if (typeof window === "undefined") return null;
  return normalizeInviteToken(new URLSearchParams(window.location.search).get("token"));
};

export const getInviteResumeEmail = (validateTokenState) => {
  if (validateTokenState?.isSuccess && validateTokenState?.data?.email) {
    return validateTokenState.data.email;
  }
  return null;
};

export const getServerStep = (step, inviteTokenPresent) => {
  const n = Number(step) || 1;
  return inviteTokenPresent ? Math.max(n, 2) : n;
};

export const shouldShowCreatorApplication = ({
  isCreatorMode,
  inviteToken,
  isTokenValid,
  currentStep,
  showApplicationConfirmation,
}) =>
  Boolean(
    isCreatorMode &&
      (!inviteToken || !isTokenValid) &&
      currentStep === 2 &&
      !showApplicationConfirmation,
  );

export const getInviteValidationState = (inviteToken, validateTokenState) => {
  const isValidatingToken = Boolean(inviteToken && validateTokenState?.isLoading);
  const isTokenValid = Boolean(inviteToken && validateTokenState?.isSuccess);
  const tokenError = validateTokenState?.isError ? validateTokenState?.message : null;
  const hasValidatedToken =
    !inviteToken ||
    (!validateTokenState?.isLoading &&
      (validateTokenState?.isSuccess || validateTokenState?.isError));

  return {
    isValidatingToken,
    isTokenValid,
    tokenError,
    hasValidatedToken,
  };
};
