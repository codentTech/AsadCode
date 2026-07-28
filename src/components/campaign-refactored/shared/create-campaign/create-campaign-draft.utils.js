const CREATE_CAMPAIGN_DRAFT_KEY = "cleercut_create_campaign_draft";

const getSafeStorage = () => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

export const loadCreateCampaignDraft = () => {
  const storage = getSafeStorage();
  if (!storage) return null;

  try {
    const raw = storage.getItem(CREATE_CAMPAIGN_DRAFT_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;

    const currentStep = Number(parsed.currentStep);
    const formValues =
      parsed.formValues && typeof parsed.formValues === "object" ? parsed.formValues : null;

    return {
      currentStep: Number.isFinite(currentStep) ? currentStep : 0,
      formValues,
      savedAt: parsed.savedAt || null,
    };
  } catch {
    return null;
  }
};

export const saveCreateCampaignDraft = ({ currentStep, formValues }) => {
  const storage = getSafeStorage();
  if (!storage) return;

  try {
    const safeFormValues = JSON.parse(JSON.stringify(formValues ?? {}));
    storage.setItem(
      CREATE_CAMPAIGN_DRAFT_KEY,
      JSON.stringify({
        currentStep: currentStep ?? 0,
        formValues: safeFormValues,
        savedAt: Date.now(),
      })
    );
  } catch {
    // Ignore quota / serialization errors
  }
};

export const clearCreateCampaignDraft = () => {
  const storage = getSafeStorage();
  if (!storage) return;
  try {
    storage.removeItem(CREATE_CAMPAIGN_DRAFT_KEY);
  } catch {
    // Ignore storage errors
  }
};
