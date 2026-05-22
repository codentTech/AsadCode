"use client";

import {
  getEmailPreferences,
  updateEmailPreferences,
} from "@/provider/features/email-preferences/email-preferences.slice";
import { isCreatorMode } from "@/common/utils/users.util";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const ALWAYS_ON_ITEMS = [
  {
    id: "contract_offer",
    label: "A client has sent you a contract offer",
  },
  {
    id: "campaign_invite",
    label: "You have been invited to apply for a campaign",
  },
];

const TOGGLE_FIELDS = [
  {
    key: "email_notify_campaign_match",
    label: "A new campaign matching your niche and location has gone live",
    tier: "highly_recommended",
  },
  {
    key: "email_notify_deadline",
    label: "Your collaboration deadline is approaching",
    tier: "recommended",
  },
  {
    key: "email_notify_deliverables_approved",
    label: "A client has approved your deliverables",
    tier: "recommended",
  },
  {
    key: "email_notify_message",
    label: "You have received a new message from a client",
    tier: "recommended",
  },
  {
    key: "email_notify_platform_updates",
    label: "New feature announcements and platform updates",
    tier: "recommended",
  },
];

export default function useEmailNotifications() {
  const dispatch = useDispatch();
  const router = useRouter();
  const saveTimerRef = useRef(null);
  const isCreator = isCreatorMode();

  const { data, isLoading } = useSelector(
    (state) => state.emailPreferences.getEmailPreferences
  );
  const { isLoading: isSaving } = useSelector(
    (state) => state.emailPreferences.updateEmailPreferences
  );

  useEffect(() => {
    if (!isCreator) return;
    dispatch(getEmailPreferences());
  }, [dispatch, isCreator]);

  const preferences = useMemo(() => data || {}, [data]);

  const handleToggle = useCallback(
    (key, value) => {
      if (!isCreator) return;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        dispatch(updateEmailPreferences({ [key]: value }));
      }, 400);
    },
    [dispatch, isCreator]
  );

  useEffect(
    () => () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    },
    []
  );

  return {
    isLoading: isCreator && isLoading,
    isSaving,
    preferences,
    alwaysOnItems: ALWAYS_ON_ITEMS,
    toggleFields: TOGGLE_FIELDS,
    handleToggle,
  };
}
