"use client";

import {
  dismissEmailPreferencesPopup,
  updateEmailPreferences,
} from "@/provider/features/email-preferences/email-preferences.slice";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const POPUP_TOGGLE_KEYS = [
  {
    key: "email_notify_campaign_match",
    label: "A new campaign we think may interest you has gone live",
  },
  {
    key: "email_notify_deadline",
    label: "Your collaboration deadline is approaching",
  },
  {
    key: "email_notify_deliverables_approved",
    label: "A client has approved your deliverables",
  },
  {
    key: "email_notify_message",
    label: "You have received a new message from a client",
  },
];

const DEFAULT_POPUP_PREFS = {
  email_notify_campaign_match: true,
  email_notify_deadline: true,
  email_notify_deliverables_approved: true,
  email_notify_message: true,
};

export default function useReEngagementEmailModal({ show, onComplete }) {
  const dispatch = useDispatch();
  const [prefs, setPrefs] = useState(DEFAULT_POPUP_PREFS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (show) {
      setPrefs(DEFAULT_POPUP_PREFS);
    }
  }, [show]);

  const handleToggle = useCallback((key, checked) => {
    setPrefs((prev) => ({ ...prev, [key]: checked }));
  }, []);

  const handleSave = useCallback(async () => {
    setIsSubmitting(true);
    await dispatch(updateEmailPreferences(prefs));
    setIsSubmitting(false);
    onComplete();
  }, [dispatch, onComplete, prefs]);

  const handleNoThanks = useCallback(async () => {
    setIsSubmitting(true);
    await dispatch(dismissEmailPreferencesPopup());
    setIsSubmitting(false);
    onComplete();
  }, [dispatch, onComplete]);

  return {
    popupToggleKeys: POPUP_TOGGLE_KEYS,
    prefs,
    isSubmitting,
    handleToggle,
    handleSave,
    handleNoThanks,
  };
}
