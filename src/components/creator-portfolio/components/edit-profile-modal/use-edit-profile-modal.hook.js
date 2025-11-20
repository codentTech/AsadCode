import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { updateCampaignDefaults } from "@/provider/features/users/users.slice";
import {
  uploadSingleFile,
  uploadMultipleFiles,
} from "@/provider/features/upload-file/upload-file.slice";
import { getUser } from "@/common/utils/users.util";
import { updateUser } from "@/provider/features/users/users.slice";

const DEFAULT_CONTENT_RATES = [
  "1 sponsored Instagram post (photos)",
  "1 Sponsored Instagram Reel",
  "1 Sponsored TikTok Post",
  "1 Sponsored YouTube Short",
  "1 Instagram story (3 Frames)",
  "1 UGC video",
  "1 feature in a longform YouTube Video",
].map((label) => ({
  contentType: label,
  price: 0,
}));

const normalizeLabel = (label = "") => label.trim().toLowerCase();

const normalizeContentRates = (rates = []) =>
  rates
    .map((rate) => {
      const label =
        rate?.contentType || rate?.type || rate?.content_type || rate?.label || rate?.name || "";

      const priceValue = typeof rate?.price === "number" ? rate.price : Number(rate?.price) || 0;

      return {
        contentType: label,
        price: priceValue,
      };
    })
    .filter((rate) => rate.contentType);

const ensureCleanGalleryData = (galleryData) => {
  const cleaned = {};
  Object.entries(galleryData).forEach(([niche, content]) => {
    if (content && typeof content === "object") {
      const cleanVideos = (content.videos || [])
        .map((item) => (typeof item === "string" ? item : item.src || item.url || item))
        .filter((url) => url && typeof url === "string");

      const cleanImages = (content.images || [])
        .map((item) => (typeof item === "string" ? item : item.src || item.url || item))
        .filter((url) => url && typeof url === "string");

      cleaned[niche] = {
        videos: cleanVideos,
        images: cleanImages,
      };
    }
  });
  return cleaned;
};

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

const INITIAL_GALLERY_STATE = {
  nicheContent: {},
  uploadingNiches: {},
};

const INITIAL_CUSTOM_RATES = [{ contentType: "", price: "" }];

const useEditProfileModal = ({ creator, onClose, onSave }) => {
  const dispatch = useDispatch();

  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [newNiche, setNewNiche] = useState("");
  const [showNicheInput, setShowNicheInput] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [profileData, setProfileData] = useState(INITIAL_PROFILE_STATE);
  const [galleries, setGalleries] = useState(INITIAL_GALLERY_STATE);
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
            if (index < 3 && pic) {
              result[index] = pic;
            }
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

    if (creator?.gallery && Array.isArray(creator.gallery)) {
      const galleryData = {};
      creator.gallery.forEach((niche) => {
        if (niche.media && Array.isArray(niche.media)) {
          const videos = niche.media
            .filter((mediaItem) => {
              const url =
                typeof mediaItem === "string" ? mediaItem : mediaItem.src || mediaItem.url;
              return (
                url &&
                (url.includes(".mp4") ||
                  url.includes(".mov") ||
                  url.includes(".avi") ||
                  url.includes(".webm"))
              );
            })
            .map((mediaItem) => {
              return typeof mediaItem === "string" ? mediaItem : mediaItem.src || mediaItem.url;
            });

          const images = niche.media
            .filter((mediaItem) => {
              const url =
                typeof mediaItem === "string" ? mediaItem : mediaItem.src || mediaItem.url;
              return (
                url &&
                (url.includes(".jpg") ||
                  url.includes(".jpeg") ||
                  url.includes(".png") ||
                  url.includes(".gif") ||
                  url.includes(".webp"))
              );
            })
            .map((mediaItem) => {
              return typeof mediaItem === "string" ? mediaItem : mediaItem.src || mediaItem.url;
            });

          galleryData[niche.niche] = {
            videos,
            images,
          };
        }
      });
      setGalleries({
        nicheContent: galleryData,
        uploadingNiches: {},
      });
    }

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

        if (apiMatch) {
          return {
            contentType: defaultRate.contentType,
            price: apiMatch.price ?? 0,
          };
        }

        return { ...defaultRate };
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

  const handleProfileFieldChange = useCallback((field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleProfilePicChange = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setProfileData((prev) => ({ ...prev, profilePicLoading: true }));

      try {
        const response = await dispatch(
          uploadSingleFile({
            file,
            folder: "creator",
          })
        ).unwrap();

        if (response?.url) {
          setProfileData((prev) => ({
            ...prev,
            profilePic: response.url,
            profilePicLoading: false,
          }));
        }
      } catch (error) {
        setProfileData((prev) => ({
          ...prev,
          profilePicLoading: false,
        }));
      }
    },
    [dispatch]
  );

  const handleMiniCardRemove = useCallback((index) => {
    setProfileData((prev) => {
      const newMiniCards = [...prev.miniCards];
      newMiniCards[index] = null;
      return { ...prev, miniCards: newMiniCards };
    });
  }, []);

  const handleMiniCardUpload = useCallback(
    async (index) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.multiple = false;

      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setProfileData((prev) => {
          const newLoading = [...prev.miniCardsLoading];
          newLoading[index] = true;
          return { ...prev, miniCardsLoading: newLoading };
        });

        const response = await dispatch(
          uploadSingleFile({
            file,
            folder: "creator",
          })
        ).unwrap();

        if (response?.url) {
          setProfileData((prev) => {
            const newMiniCards = [...prev.miniCards];
            newMiniCards[index] = response.url;
            const newLoading = [...prev.miniCardsLoading];
            newLoading[index] = false;
            return { ...prev, miniCards: newMiniCards, miniCardsLoading: newLoading };
          });
        } else {
          setProfileData((prev) => {
            const newLoading = [...prev.miniCardsLoading];
            newLoading[index] = false;
            return { ...prev, miniCardsLoading: newLoading };
          });
        }
      };

      input.click();
    },
    [dispatch]
  );

  const addNiche = useCallback(() => {
    if (newNiche.trim() && !profileData.niches.includes(newNiche.trim())) {
      const newNicheName = newNiche.trim();
      setProfileData((prev) => ({
        ...prev,
        niches: [...prev.niches, newNicheName],
      }));
      setNewNiche("");
      setShowNicheInput(false);
    }
  }, [newNiche, profileData.niches]);

  const removeNiche = useCallback((niche) => {
    setProfileData((prev) => ({
      ...prev,
      niches: prev.niches.filter((n) => n !== niche),
    }));

    setGalleries((prev) => {
      const newNicheContent = { ...prev.nicheContent };
      delete newNicheContent[niche];
      return {
        ...prev,
        nicheContent: newNicheContent,
      };
    });
  }, []);

  const addGalleryItem = useCallback(
    async (type, niche) => {
      const input = document.createElement("input");
      input.type = "file";

      if (type === "video") {
        input.accept = "video/*";
      } else if (type === "image") {
        input.accept = "image/*";
      } else if (type === "mixed") {
        input.accept = "image/*,video/*";
      }

      input.multiple = true;

      input.onchange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const MAX_FILE_SIZE = 50 * 1024 * 1024;
        const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE);
        if (oversizedFiles.length > 0) {
          return;
        }

        setGalleries((prev) => ({
          ...prev,
          uploadingNiches: {
            ...prev.uploadingNiches,
            [niche]: true,
          },
        }));

        if (files.length === 1) {
          const result = await dispatch(uploadSingleFile({ file: files[0], folder: "creator" }));
          const uploadedUrl = result?.payload?.url;

          if (uploadedUrl) {
            setGalleries((prev) => {
              const currentNicheContent = prev.nicheContent[niche] || { videos: [], images: [] };
              const fileType = files[0].type.startsWith("video/") ? "videos" : "images";

              return {
                ...prev,
                nicheContent: {
                  ...prev.nicheContent,
                  [niche]: {
                    ...currentNicheContent,
                    [fileType]: [...currentNicheContent[fileType], uploadedUrl],
                  },
                },
                uploadingNiches: {
                  ...prev.uploadingNiches,
                  [niche]: false,
                },
              };
            });
          }
        } else {
          const result = await dispatch(uploadMultipleFiles({ files, folder: "creator" })).unwrap();
          const uploadedUrls = result?.urls;

          if (uploadedUrls && Array.isArray(uploadedUrls)) {
            setGalleries((prev) => {
              const currentNicheContent = prev.nicheContent[niche] || { videos: [], images: [] };

              const videos = [];
              const images = [];

              uploadedUrls.forEach((url, index) => {
                const fileType = files[index].type.startsWith("video/") ? "video" : "image";
                if (fileType === "video") {
                  videos.push(url);
                } else {
                  images.push(url);
                }
              });

              return {
                ...prev,
                nicheContent: {
                  ...prev.nicheContent,
                  [niche]: {
                    ...currentNicheContent,
                    videos: [...currentNicheContent.videos, ...videos],
                    images: [...currentNicheContent.images, ...images],
                  },
                },
                uploadingNiches: {
                  ...prev.uploadingNiches,
                  [niche]: false,
                },
              };
            });
          }
        }
      };

      input.click();
    },
    [dispatch]
  );

  const removeGalleryItem = useCallback((type, index, niche) => {
    setGalleries((prev) => {
      const currentNicheContent = prev.nicheContent[niche];
      if (!currentNicheContent) return prev;

      return {
        ...prev,
        nicheContent: {
          ...prev.nicheContent,
          [niche]: {
            ...currentNicheContent,
            [type === "video" ? "videos" : "images"]: currentNicheContent[
              type === "video" ? "videos" : "images"
            ].filter((_, i) => i !== index),
          },
        },
      };
    });
  }, []);

  const handleRateChange = useCallback(
    (index, value) => {
      const newRates = [...contentRates];
      newRates[index] = { ...newRates[index], price: parseFloat(value) || 0 };
      setContentRates(newRates);
    },
    [contentRates]
  );

  const handleCustomRateChange = useCallback(
    (idx, field, value) => {
      const updated = [...customRates];
      updated[idx][field] = field === "price" ? parseFloat(value) || 0 : value;
      setCustomRates(updated);
    },
    [customRates]
  );

  const addCustomRateRow = useCallback(() => {
    setCustomRates((prev) => [...prev, { contentType: "", price: 0 }]);
  }, []);

  const removeCustomRate = useCallback((idx) => {
    setCustomRates((prev) => {
      const updated = prev.filter((_, i) => i !== idx);
      return updated.length ? updated : [{ contentType: "", price: 0 }];
    });
  }, []);

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);

      const cleanGalleryData = ensureCleanGalleryData(galleries.nicheContent);

      const galleryData = Object.entries(cleanGalleryData).map(([niche, content]) => {
        const allMedia = [...(content.videos || []), ...(content.images || [])];

        return {
          niche,
          media: allMedia,
        };
      });

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
        gallery: galleryData,
      };

      const user = getUser();
      if (!user || !user.email) {
        throw new Error("User not found or email missing");
      }

      if (activeTab === "profile") {
        await dispatch(updateUser(userUpdateData)).unwrap();
      }

      const creatorResult = await dispatch(updateCampaignDefaults(creatorProfileData)).unwrap();

      if (creatorResult.success) {
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

        if (currentUser.creator_profile) {
          currentUser.creator_profile.gallery = galleryData;
          currentUser.creator_profile.content_rates = allContentRates;
          currentUser.creator_profile.mini_profile_pictures = profileData.miniCards.filter(
            (card) => card !== null
          );
          currentUser.creator_profile.profile_photo_url = profileData.profilePic;
          currentUser.creator_profile.bio = profileData.bio;
          currentUser.creator_profile.categories = profileData.niches;

          currentUser.miniProfilePictures = profileData.miniCards.filter((card) => card !== null);
          currentUser.profilePic = profileData.profilePic;
          currentUser.gallery = galleryData;

          localStorage.setItem("user", JSON.stringify(currentUser));
        }

        if (onSave) {
          onSave();
        }

        onClose();
      } else {
        throw new Error(creatorResult.message || "Failed to update creator profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  }, [
    galleries.nicheContent,
    contentRates,
    customRates,
    profileData,
    creator,
    activeTab,
    dispatch,
    onClose,
    onSave,
  ]);

  return {
    fileInputRef,
    activeTab,
    setActiveTab,
    profileData,
    handleProfileFieldChange,
    handleProfilePicChange,
    handleMiniCardUpload,
    handleMiniCardRemove,
    contentRates,
    handleRateChange,
    customRates,
    handleCustomRateChange,
    addCustomRateRow,
    removeCustomRate,
    showNicheInput,
    setShowNicheInput,
    newNiche,
    setNewNiche,
    addNiche,
    removeNiche,
    galleries,
    addGalleryItem,
    removeGalleryItem,
    handleSave,
    isSaving,
  };
};

export default useEditProfileModal;
