import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { updateCampaignDefaults, updateUser } from "@/provider/features/users/users.slice";
import { CLEERCUT_USER_STORAGE_UPDATED } from "@/common/utils/creator-showcase.util";
import { getUser } from "@/common/utils/users.util";

const DEFAULT_CONTENT_RATES = [
  "1 sponsored Instagram post (photos)",
  "1 Sponsored Instagram Reel",
  "1 Sponsored TikTok Post",
  "1 Sponsored YouTube Short",
  "1 Instagram story (3 Frames)",
  "1 UGC video",
  "1 feature in a longform YouTube Video",
].map((label) => ({ contentType: label, price: 0 }));

const normalizeLabel = (label = "") => label.trim().toLowerCase();

const normalizeContentRates = (rates = []) =>
  rates
    .map((rate) => {
      const label =
        rate?.contentType || rate?.type || rate?.content_type || rate?.label || rate?.name || "";
      const priceValue = typeof rate?.price === "number" ? rate.price : Number(rate?.price) || 0;
      return { contentType: label, price: priceValue };
    })
    .filter((rate) => rate.contentType);

const INITIAL_PROFILE_STATE = {
  name: "",
  handle: "",
  location: "",
  bio: "",
  profilePic: null,
  profilePicLoading: false,
  miniCards: [null, null, null],
  miniCardsLoading: [false, false, false],
  niches: [],
  startingRates: {},
};

const INITIAL_CUSTOM_RATES = [{ contentType: "", price: "" }];

const useEditProfileModal = ({ creator, onClose, onSave, isOpen, focusShowcaseSection }) => {
  const dispatch = useDispatch();
  const showcaseScrollDoneRef = useRef(false);

  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState(INITIAL_PROFILE_STATE);
  const [contentRates, setContentRates] = useState(() =>
    DEFAULT_CONTENT_RATES.map((rate) => ({ ...rate }))
  );
  const [customRates, setCustomRates] = useState(INITIAL_CUSTOM_RATES);

  useEffect(() => {
    if (!creator) return;

    setProfileData({
      name: creator.name || "",
      handle: creator.handle || "",
      location: creator.location || "",
      bio: creator.bio || "",
      profilePic: creator.profilePic || null,
      profilePicLoading: false,
      miniCards: (() => {
        const miniPics = creator?.miniProfilePictures || [];
        const result = [null, null, null];
        if (Array.isArray(miniPics)) {
          miniPics.forEach((pic, index) => {
            if (index < 3 && pic) result[index] = pic;
          });
        }
        return result;
      })(),
      miniCardsLoading: [false, false, false],
      niches: creator.categories || [],
      startingRates:
        creator?.creator_profile?.content_rates?.map((rate) => ({
          type: rate.contentType,
          price: `$${rate.price || 0}`,
        })) || [],
    });

    const rawApiRates = [
      ...(Array.isArray(creator?.contentRates) ? creator.contentRates : []),
      ...(Array.isArray(creator?.creator_profile?.content_rates)
        ? creator.creator_profile.content_rates
        : []),
    ];

    const normalizedApiRates = normalizeContentRates(rawApiRates);

    if (normalizedApiRates.length > 0) {
      const mergedDefaultRates = DEFAULT_CONTENT_RATES.map((defaultRate) => {
        const apiMatch = normalizedApiRates.find(
          (apiRate) =>
            normalizeLabel(apiRate.contentType) === normalizeLabel(defaultRate.contentType)
        );
        return apiMatch
          ? { contentType: defaultRate.contentType, price: apiMatch.price ?? 0 }
          : { ...defaultRate };
      });

      const additionalApiRates = normalizedApiRates.filter(
        (apiRate) =>
          !DEFAULT_CONTENT_RATES.some(
            (defaultRate) =>
              normalizeLabel(defaultRate.contentType) === normalizeLabel(apiRate.contentType)
          )
      );

      setContentRates([...mergedDefaultRates, ...additionalApiRates]);
      setCustomRates(INITIAL_CUSTOM_RATES);
    } else {
      setContentRates(DEFAULT_CONTENT_RATES.map((rate) => ({ ...rate })));
    }
  }, [creator]);

  useEffect(() => {
    if (!isOpen) {
      showcaseScrollDoneRef.current = false;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !focusShowcaseSection || !creator || showcaseScrollDoneRef.current) return;
    setActiveTab("profile");
    const t = window.setTimeout(() => {
      document.getElementById("creator-showcase-images")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      showcaseScrollDoneRef.current = true;
    }, 200);
    return () => window.clearTimeout(t);
  }, [isOpen, focusShowcaseSection, creator]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);

    const allContentRates = [
      ...contentRates.filter((rate) => rate.contentType && rate.price > 0),
      ...customRates.filter((rate) => rate.contentType && rate.price > 0),
    ];

    const userUpdateData = {
      first_name: profileData.name.split(" ")[0] || "",
      last_name: profileData.name.split(" ").slice(1).join(" ") || "",
      city: profileData.location.split(",")[0]?.trim() || "",
      country: profileData.location.split(",")[1]?.trim() || "",
    };

    const creatorProfileData = {
      profilePhotoUrl: profileData.profilePic,
      miniProfilePictures: profileData.miniCards.filter((card) => card !== null),
      bio: profileData.bio,
      socialPlatforms: creator?.user?.creator_profile?.social_platforms || [],
      categories: profileData.niches,
      keywordTags: creator?.user?.creator_profile?.keyword_tags || [],
      contentRates: allContentRates,
    };

    const user = getUser();
    if (!user || !user.email) {
      setIsSaving(false);
      return;
    }

    if (activeTab === "profile") {
      await dispatch(updateUser(userUpdateData));
    }

    const creatorResult = await dispatch(updateCampaignDefaults(creatorProfileData));

    if (creatorResult?.payload?.success) {
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

      if (currentUser.creator_profile) {
        currentUser.creator_profile.content_rates = allContentRates;
        currentUser.creator_profile.mini_profile_pictures = profileData.miniCards.filter(
          (card) => card !== null
        );
        currentUser.creator_profile.profile_photo_url = profileData.profilePic;
        currentUser.creator_profile.bio = profileData.bio;
        currentUser.creator_profile.categories = profileData.niches;
        currentUser.miniProfilePictures = profileData.miniCards.filter((card) => card !== null);
        currentUser.profilePic = profileData.profilePic;
        localStorage.setItem("user", JSON.stringify(currentUser));
        window.dispatchEvent(new Event(CLEERCUT_USER_STORAGE_UPDATED));
      }

      if (onSave) onSave();
      onClose();
    }

    setIsSaving(false);
  }, [contentRates, customRates, profileData, creator, activeTab, dispatch, onClose, onSave]);

  return {
    activeTab,
    setActiveTab,
    profileData,
    setProfileData,
    contentRates,
    setContentRates,
    customRates,
    setCustomRates,
    handleSave,
    isSaving,
  };
};

export default useEditProfileModal;
