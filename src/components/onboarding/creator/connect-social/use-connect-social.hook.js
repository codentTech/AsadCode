"use client";

import { getAllowedPlatformsForCreatorType } from "@/common/constants/creator-tag.constant";
import {
  readCreatorTypeDraft,
  readMediaKitDraft,
  resolveCreatorTypeFromSources,
  writeMediaKitDraft,
} from "@/common/utils/onboarding-flow.util";
import { parseHttpUrlInput } from "@/common/utils/url.util";
import { getOnboardingEmail } from "@/common/utils/users.util";
import usePhylloConnect from "@/components/social-connect/use-phyllo-connect.hook";
import { completeCreatorConnectSocial } from "@/provider/features/creator-profile/creator-profile.slice";
import { getOnboardingStatus } from "@/provider/features/onboarding/onboarding.slice";
import { getSocialAccounts } from "@/provider/features/users/users.slice";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function useConnectSocial({ onNext, creatorTypeHint }) {
  const dispatch = useDispatch();
  const email = getOnboardingEmail();
  const onboardingStatus = useSelector((state) => state.onboarding?.onboardingStatus);
  const setupProfileState = useSelector((state) => state.creatorProfile?.setupCreatorProfile);

  const creatorType = useMemo(() => {
    return resolveCreatorTypeFromSources({
      draftType: creatorTypeHint || readCreatorTypeDraft(email),
      onboardingStatus,
      setupProfilePayload: setupProfileState?.data,
    });
  }, [creatorTypeHint, email, onboardingStatus, setupProfileState?.data]);

  const [mediaKitUrl, setMediaKitUrl] = useState(
    () =>
      readMediaKitDraft(email) ||
      onboardingStatus?.creatorProfile?.media_kit_url ||
      ""
  );
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [socialConnectLoadingMap, setSocialConnectLoadingMap] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepError, setStepError] = useState("");
  const [mediaKitError, setMediaKitError] = useState("");

  const { openConnect: openPhylloConnect } = usePhylloConnect();

  const platforms = useMemo(
    () => getAllowedPlatformsForCreatorType(creatorType),
    [creatorType]
  );

  useEffect(() => {
    const url = onboardingStatus?.creatorProfile?.media_kit_url;
    if (url && !readMediaKitDraft(email)) setMediaKitUrl(url);
  }, [email, onboardingStatus?.creatorProfile?.media_kit_url]);

  useEffect(() => {
    writeMediaKitDraft(email, mediaKitUrl);
  }, [email, mediaKitUrl]);

  const loadConnectedAccounts = useCallback(async () => {
    const result = await dispatch(getSocialAccounts());
    if (getSocialAccounts.rejected.match(result) || !result.payload?.success) {
      setConnectedAccounts([]);
      return [];
    }
    const accountsRaw = Array.isArray(result.payload.data) ? result.payload.data : [];
    setConnectedAccounts(accountsRaw);
    return accountsRaw;
  }, [dispatch]);

  useEffect(() => {
    loadConnectedAccounts();
    const onWindowFocus = () => loadConnectedAccounts();
    window.addEventListener("focus", onWindowFocus);
    return () => window.removeEventListener("focus", onWindowFocus);
  }, [loadConnectedAccounts]);

  const isPlatformConnected = useCallback(
    (platform) => connectedAccounts.some((a) => a.platform === platform),
    [connectedAccounts]
  );

  const getConnectedAccountData = useCallback(
    (platform) => connectedAccounts.find((a) => a.platform === platform),
    [connectedAccounts]
  );

  const handleConnectSocialAccounts = useCallback(
    async (platform) => {
      if (socialConnectLoadingMap?.[platform]) return;
      setSocialConnectLoadingMap((prev) => ({ ...prev, [platform]: true }));
      await openPhylloConnect();
      await loadConnectedAccounts();
      setStepError("");
      setSocialConnectLoadingMap((prev) => ({ ...prev, [platform]: false }));
    },
    [loadConnectedAccounts, openPhylloConnect, socialConnectLoadingMap]
  );

  const handleMediaKitUrlChange = useCallback((e) => {
    setMediaKitUrl(e.target.value);
    setStepError("");
    setMediaKitError("");
  }, []);

  const submitStep = useCallback(
    async (skipped) => {
      if (!email || isSubmitting) return;
      setIsSubmitting(true);
      const parsedMediaKit = parseHttpUrlInput(mediaKitUrl);
      const payload = {
        skipped: Boolean(skipped),
        ...(parsedMediaKit.ok ? { mediaKitUrl: parsedMediaKit.href } : {}),
      };
      const response = await dispatch(completeCreatorConnectSocial({ payload, email }));
      setIsSubmitting(false);
      if (response.payload?.success) {
        dispatch(getOnboardingStatus(email));
        onNext?.();
      }
    },
    [dispatch, email, isSubmitting, mediaKitUrl, onNext]
  );

  const handleContinue = useCallback(async () => {
    if (!email || isSubmitting) return;
    setStepError("");
    setMediaKitError("");

    const accounts = await loadConnectedAccounts();
    const hasConnectedAccount = Array.isArray(accounts) && accounts.length > 0;
    const trimmedMediaKit = mediaKitUrl.trim();

    if (trimmedMediaKit) {
      const parsedMediaKit = parseHttpUrlInput(trimmedMediaKit);
      if (!parsedMediaKit.ok) {
        setMediaKitError(parsedMediaKit.error || "Enter a valid media kit URL");
        return;
      }
    }

    if (!hasConnectedAccount && !trimmedMediaKit) {
      setStepError("Connect a social account or add a media kit link to continue.");
      return;
    }

    await submitStep(false);
  }, [email, isSubmitting, loadConnectedAccounts, mediaKitUrl, submitStep]);

  const handleSkip = useCallback(() => {
    setStepError("");
    setMediaKitError("");
    submitStep(true);
  }, [submitStep]);

  const mediaKitErrors = useMemo(
    () => (mediaKitError ? { mediaKitUrl: { message: mediaKitError } } : null),
    [mediaKitError]
  );

  return {
    platforms,
    creatorType,
    mediaKitUrl,
    handleMediaKitUrlChange,
    mediaKitErrors,
    stepError,
    isPlatformConnected,
    getConnectedAccountData,
    handleConnectSocialAccounts,
    loadConnectedAccounts,
    socialConnectLoadingMap,
    handleContinue,
    handleSkip,
    isLoading: isSubmitting,
  };
}
