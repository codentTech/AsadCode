"use client";

import { getUser } from "@/common/utils/users.util";
import {
  disconnectSocialAccount,
  getSocialAccounts,
  updateCampaignDefaults,
} from "@/provider/features/users/users.slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import usePhylloConnect from "@/components/social-connect/use-phyllo-connect.hook";

const platforms = ["facebook", "instagram", "tiktok"];
const categories = [
  "Fashion",
  "Fitness",
  "Food",
  "Travel",
  "Tech",
  "Beauty",
  "Lifestyle",
  "Gaming",
];

const standardContentTypes = [
  "1 sponsored Instagram post (photos)",
  "1 Sponsored Instagram Reel",
  "1 Sponsored TikTok Post",
  "1 Sponsored YouTube Short",
  "1 Instagram story (3 Frames)",
  "1 UGC video",
  "1 feature in a longform YouTube Video",
];

export default function useSavedDefaultFilter() {
  const dispatch = useDispatch();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [keywordTags, setKeywordTags] = useState([]);
  const [contentRates, setContentRates] = useState({});
  const [customRates, setCustomRates] = useState([{ contentType: "", price: "" }]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectedAccounts, setConnectedAccounts] = useState([]);

  const connectSocialMediaState = useSelector((state) => state.users?.connectSocialMedia);
  const disconnectSocialAccountState = useSelector((state) => state.users?.disconnectSocialAccount);

  const isConnecting = connectSocialMediaState?.isLoading || false;
  const isDisconnecting = disconnectSocialAccountState?.isLoading || false;
  const { openConnect: openPhylloConnect } = usePhylloConnect();

  const loadConnectedAccounts = async () => {
    try {
      const result = await dispatch(getSocialAccounts()).unwrap();
      if (result?.success) {
        setConnectedAccounts(Array.isArray(result.data) ? result.data : []);
      }
    } catch (error) {}
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = getUser();
        if (user) {
          if (user.creator_profile?.categories) {
            setSelectedCategories(user.creator_profile.categories);
          }
          if (user.creator_profile?.keyword_tags) {
            setKeywordTags(user.creator_profile.keyword_tags);
          }
          if (user.creator_profile?.content_rates) {
            const rates = {};
            user.creator_profile.content_rates.forEach((rate, index) => {
              rates[index] = rate.price;
            });
            setContentRates(rates);
          }
        }
        await loadConnectedAccounts();
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleConnectSocialMedia = async () => {
    try {
      await openPhylloConnect();
      await loadConnectedAccounts();
    } catch (error) {}
  };

  const handleDisconnectSocialMedia = async (platform) => {
    try {
      const result = await dispatch(disconnectSocialAccount(platform)).unwrap();
      if (result.success) {
        await loadConnectedAccounts();
      }
    } catch (error) {}
  };

  const isPlatformConnected = (platform) =>
    connectedAccounts.some((account) => account.platform === platform);

  const getConnectedAccountData = (platform) =>
    connectedAccounts.find((account) => account.platform === platform);

  const toggleCategory = (category) => {
    let nextCategories;
    if (selectedCategories.includes(category)) {
      nextCategories = selectedCategories.filter((c) => c !== category);
    } else if (selectedCategories.length < 5) {
      nextCategories = [...selectedCategories, category];
    } else {
      return;
    }
    setSelectedCategories(nextCategories);
  };

  const addKeywordTag = (tag) => {
    const cleanTag = String(tag || "").trim();
    if (cleanTag && !keywordTags.includes(cleanTag)) {
      setKeywordTags([...keywordTags, cleanTag]);
    }
  };

  const removeKeywordTag = (index) => {
    setKeywordTags(keywordTags.filter((_, i) => i !== index));
  };

  const handleRateChange = (index, value) => {
    setContentRates({ ...contentRates, [index]: value });
  };

  const handleCustomRateChange = (idx, field, value) => {
    const updated = [...customRates];
    updated[idx][field] = value;
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
    try {
      setIsLoading(true);
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
            price: parseFloat(contentRates[index] || 0),
          })),
          ...customRates.filter((rate) => rate.contentType && rate.price),
        ],
      };

      const result = await dispatch(updateCampaignDefaults(defaults)).unwrap();
      if (result.success) {
        getUser(result?.data);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return {
    platforms,
    categories,
    standardContentTypes,
    selectedCategories,
    keywordTags,
    contentRates,
    customRates,
    isLoading,
    connectedAccounts,
    isConnecting,
    isDisconnecting,
    loadConnectedAccounts,
    handleConnectSocialMedia,
    handleDisconnectSocialMedia,
    isPlatformConnected,
    getConnectedAccountData,
    toggleCategory,
    addKeywordTag,
    removeKeywordTag,
    handleRateChange,
    handleCustomRateChange,
    addCustomRateRow,
    removeCustomRate,
    handleSaveSettings,
  };
}
