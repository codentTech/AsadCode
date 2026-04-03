"use client";

import { CAMPAIGN_TYPE } from "@/common/constants/campaign.constant";
import {
  getAllowedPlatformsForCreatorType,
  getCreatorTagMeta,
} from "@/common/constants/creator-tag.constant";
import { getUser } from "@/common/utils/users.util";
import usePhylloConnect from "@/components/social-connect/use-phyllo-connect.hook";
import { getSocialAccounts, updateCampaignDefaults } from "@/provider/features/users/users.slice";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

export const standardContentTypes = [
  "1 sponsored Instagram post (photos)",
  "1 Sponsored Instagram Reel",
  "1 Sponsored TikTok Post",
  "1 Sponsored YouTube Short",
  "1 Instagram story (3 Frames)",
  "1 UGC video",
  "1 feature in a longform YouTube Video",
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function hydrateRatesFromProfile(contentRatesFromApi) {
  const list = Array.isArray(contentRatesFromApi) ? contentRatesFromApi : [];
  const rates = {};
  standardContentTypes.forEach((type, index) => {
    const row = list.find((r) => String(r?.contentType || "").trim() === type);
    if (row != null && row.price !== undefined && row.price !== null && row.price !== "") {
      rates[index] = String(row.price);
    }
  });
  const standardSet = new Set(standardContentTypes);
  const customRows = list.filter((r) => {
    const ct = String(r?.contentType || "").trim();
    return ct && !standardSet.has(ct);
  });
  const customRatesNormalized = customRows.map((r) => ({
    contentType: String(r.contentType || ""),
    price: r.price !== undefined && r.price !== null ? String(r.price) : "",
  }));
  return {
    rates,
    customRates: customRatesNormalized.length
      ? customRatesNormalized
      : [{ contentType: "", price: "" }],
  };
}

function normalizeSubNiches(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.map((row) => ({
    niche: String(row?.niche || ""),
    tags: Array.isArray(row?.tags) ? row.tags.map((t) => String(t)) : [],
  }));
}

export default function useSavedDefaultFilter() {
  const dispatch = useDispatch();
  const [userSnapshot, setUserSnapshot] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [subNichesForm, setSubNichesForm] = useState([]);
  const [contentCharacteristics, setContentCharacteristics] = useState({});
  const [keywordTags, setKeywordTags] = useState([]);
  const [contentRates, setContentRates] = useState({});
  const [customRates, setCustomRates] = useState([{ contentType: "", price: "" }]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [socialConnectLoadingMap, setSocialConnectLoadingMap] = useState({});

  const { openConnect: openPhylloConnect } = usePhylloConnect();

  const refreshUserSnapshot = useCallback(() => {
    setUserSnapshot(getUser());
  }, []);

  const creatorType = useMemo(() => {
    const t = userSnapshot?.creator_profile?.creator_type;
    return t === CAMPAIGN_TYPE.INFLUENCER || t === CAMPAIGN_TYPE.HYBRID || t === CAMPAIGN_TYPE.UGC
      ? t
      : CAMPAIGN_TYPE.UGC;
  }, [userSnapshot]);

  const creatorTagMeta = useMemo(() => getCreatorTagMeta(creatorType), [creatorType]);

  const platforms = useMemo(() => getAllowedPlatformsForCreatorType(creatorType), [creatorType]);

  const loadConnectedAccounts = async () => {
    const result = await dispatch(getSocialAccounts());
    if (getSocialAccounts.rejected.match(result)) {
      setConnectedAccounts([]);
      return [];
    }
    const payload = result.payload;
    if (!payload?.success) {
      setConnectedAccounts([]);
      return [];
    }
    const accountsRaw = Array.isArray(payload.data) ? payload.data : [];
    const normalizedAccounts = accountsRaw
      .filter((acc) => acc?.platform)
      .map((acc) => ({
        ...acc,
        platform: String(acc.platform).toUpperCase(),
      }));
    const activeAccounts = normalizedAccounts.filter((acc) => acc?.is_active !== false);
    setConnectedAccounts(activeAccounts);
    return activeAccounts;
  };

  const pollUntilPlatformConnected = async (targetPlatform, attempts = 18, intervalMs = 5000) => {
    for (let i = 0; i < attempts; i++) {
      const accounts = await loadConnectedAccounts();
      const connected = accounts.some((a) => a.platform === targetPlatform);
      if (connected) return true;
      await wait(intervalMs);
    }
    return false;
  };

  const waitForFocusAndCheckPlatform = (targetPlatform, timeoutMs = 20000) =>
    new Promise((resolve) => {
      let settled = false;

      const finalize = (value) => {
        if (settled) return;
        settled = true;
        window.removeEventListener("focus", onFocus);
        clearTimeout(timeoutId);
        resolve(value);
      };

      const onFocus = async () => {
        const accounts = await loadConnectedAccounts();
        const connected = accounts.some((a) => a.platform === targetPlatform);
        finalize(connected);
      };

      const timeoutId = setTimeout(() => finalize(false), timeoutMs);
      window.addEventListener("focus", onFocus);
    });

  const handleConnectSocialAccounts = async (platform) => {
    if (socialConnectLoadingMap?.[platform]) return;
    setSocialConnectLoadingMap((prev) => ({ ...prev, [platform]: true }));
    try {
      await openPhylloConnect();
      await Promise.race([
        pollUntilPlatformConnected(platform),
        waitForFocusAndCheckPlatform(platform),
      ]);
    } finally {
      setSocialConnectLoadingMap((prev) => ({ ...prev, [platform]: false }));
    }
  };

  const isPlatformConnected = (platform) =>
    connectedAccounts.some((account) => account.platform === platform);

  const getConnectedAccountData = (platform) =>
    connectedAccounts.find((account) => account.platform === platform);

  useEffect(() => {
    const loadUserData = async () => {
      refreshUserSnapshot();
      const user = getUser();
      if (user?.creator_profile) {
        const cp = user.creator_profile;
        const cats = Array.isArray(cp.categories) ? cp.categories : [];
        setSelectedCategories(cats);
        const normalizedSubs = normalizeSubNiches(cp.sub_niches ?? cp.subNiches);
        setSubNichesForm(
          cats.map((niche) => {
            const found = normalizedSubs.find((x) => x.niche === niche);
            return found || { niche, tags: [] };
          })
        );
        const chars = cp.content_characteristics ?? cp.contentCharacteristics;
        if (chars && typeof chars === "object") {
          setContentCharacteristics({ ...chars });
        }
        if (cp.keyword_tags) {
          setKeywordTags(cp.keyword_tags);
        }
        const ratesSource = cp.content_rates ?? cp.contentRates;
        const { rates, customRates: customFromApi } = hydrateRatesFromProfile(ratesSource);
        setContentRates(rates);
        setCustomRates(customFromApi);
      }
      await loadConnectedAccounts();
      setIsLoading(false);
    };

    loadUserData();

    const onWindowFocus = () => {
      loadConnectedAccounts();
    };

    window.addEventListener("focus", onWindowFocus);

    return () => {
      window.removeEventListener("focus", onWindowFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCategoryChange = (niches) => {
    const limited = Array.isArray(niches) ? niches.slice(0, 5) : [];
    setSelectedCategories(limited);
    setSubNichesForm((prev) => {
      const next = limited.map((niche) => {
        const found = prev.find((x) => x.niche === niche);
        return found || { niche, tags: [] };
      });
      return next;
    });
  };

  const handleCategoryRemove = (nicheToRemove) => {
    setSelectedCategories((prev) => prev.filter((n) => n !== nicheToRemove));
    setSubNichesForm((prev) => prev.filter((x) => x.niche !== nicheToRemove));
  };

  const addSubNicheTag = (niche, tag) => {
    const cleaned = String(tag || "").trim();
    if (!cleaned || cleaned.length < 2 || cleaned.length > 30) return;
    setSubNichesForm((prev) =>
      prev.map((row) => {
        if (row.niche !== niche) return row;
        if (row.tags.length >= 20) return row;
        if (row.tags.some((t) => String(t).toLowerCase() === cleaned.toLowerCase())) return row;
        return { ...row, tags: [...row.tags, cleaned] };
      })
    );
  };

  const removeSubNicheTag = (niche, tagIndex) => {
    setSubNichesForm((prev) =>
      prev.map((row) => {
        if (row.niche !== niche) return row;
        return { ...row, tags: row.tags.filter((_, i) => i !== tagIndex) };
      })
    );
  };

  const handleContentCharacteristicChange = (key, value) => {
    setContentCharacteristics((prev) => {
      const next = { ...prev };
      if (prev[key] === value) {
        delete next[key];
      } else {
        next[key] = value;
      }
      return next;
    });
  };

  const addKeywordTag = (tag) => {
    const cleaned = String(tag || "").trim();
    if (!cleaned || cleaned.length < 2 || cleaned.length > 30) return;
    if (keywordTags.length >= 15) return;
    const normalized = cleaned.toLowerCase();
    if (keywordTags.some((t) => String(t).trim().toLowerCase() === normalized)) return;
    setKeywordTags([...keywordTags, cleaned]);
  };

  const removeKeywordTag = (index) => {
    setKeywordTags(keywordTags.filter((_, i) => i !== index));
  };

  const handleRateChange = (index, value) => {
    setContentRates({ ...contentRates, [index]: value });
  };

  const handleCustomRateChange = (idx, field, value) => {
    const updated = [...customRates];
    updated[idx] = { ...updated[idx], [field]: value };
    setCustomRates(updated);
  };

  const addCustomRateRow = () => {
    setCustomRates([...customRates, { contentType: "", price: "" }]);
  };

  const removeCustomRate = (idx) => {
    const updated = customRates.filter((_, i) => i !== idx);
    setCustomRates(updated.length ? updated : [{ contentType: "", price: "" }]);
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    const hasChars = Object.values(contentCharacteristics || {}).some(
      (v) => v != null && String(v).length > 0
    );
    const subNichesPayload = subNichesForm.filter(
      (row) => row?.niche && Array.isArray(row.tags) && row.tags.length > 0
    );

    const defaults = {
      socialPlatforms: connectedAccounts
        .filter((account) => account?.platform)
        .map((account) => ({
          platform: account.platform,
          username:
            account?.profile_data?.username ||
            account?.profile_data?.handle ||
            account?.profile_data?.name ||
            "",
        })),
      categories: selectedCategories,
      keywordTags,
      contentRates: [
        ...standardContentTypes.map((type, index) => ({
          contentType: type,
          price: parseFloat(contentRates[index] || 0) || 0,
        })),
        ...customRates
          .filter((rate) => rate.contentType && rate.price !== "" && rate.price != null)
          .map((rate) => ({
            contentType: rate.contentType,
            price: parseFloat(rate.price) || 0,
          })),
      ],
      subNiches: subNichesPayload.length ? subNichesPayload : undefined,
      contentCharacteristics: hasChars ? contentCharacteristics : undefined,
    };

    const result = await dispatch(updateCampaignDefaults(defaults));
    if (updateCampaignDefaults.fulfilled.match(result) && result.payload?.success) {
      getUser(result.payload?.data);
      refreshUserSnapshot();
    }
    setIsLoading(false);
  };

  const creatorCardPreviewData = useMemo(() => {
    const u = userSnapshot || getUser();
    const cp = u?.creator_profile || {};
    return {
      id: "saved-defaults-preview",
      name: (u?.name || "").trim() || "Your name",
      rating: 0,
      reviewCount: 0,
      age: "Creator",
      location: "Profile preview",
      profileImage: cp.profile_photo_url || null,
      portfolioImages: Array.isArray(cp.mini_profile_pictures)
        ? cp.mini_profile_pictures.filter(Boolean)
        : [],
      niches: selectedCategories?.length ? selectedCategories : cp.categories || [],
      bio: (cp.bio || "").trim() || "Your tagline",
      longBio: (cp.long_bio || "").trim() || "",
      followers: Number(cp.total_followers) || 0,
      platforms: [],
      platformStats: {},
    };
  }, [userSnapshot, selectedCategories]);

  return {
    standardContentTypes,
    selectedCategories,
    subNichesForm,
    contentCharacteristics,
    keywordTags,
    contentRates,
    customRates,
    isLoading,
    connectedAccounts,
    loadConnectedAccounts,
    handleConnectSocialAccounts,
    isPlatformConnected,
    getConnectedAccountData,
    handleCategoryChange,
    handleCategoryRemove,
    addSubNicheTag,
    removeSubNicheTag,
    handleContentCharacteristicChange,
    addKeywordTag,
    removeKeywordTag,
    handleRateChange,
    handleCustomRateChange,
    addCustomRateRow,
    removeCustomRate,
    handleSaveSettings,
    platforms,
    creatorType,
    creatorTagMeta,
    creatorCardPreviewData,
    socialConnectLoadingMap,
  };
}
