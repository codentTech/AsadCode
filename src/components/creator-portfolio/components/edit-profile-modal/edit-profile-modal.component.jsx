import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { avatar } from "@/common/constants/auth.constant";
import {
  Camera,
  DollarSign,
  Edit,
  ImageIcon,
  Images,
  Tag,
  User,
  X,
  RefreshCw,
  PlusCircle,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateCampaignDefaults } from "@/provider/features/users/users.slice";
import {
  uploadSingleFile,
  uploadMultipleFiles,
} from "@/provider/features/upload-file/upload-file.slice";
import { getUser } from "@/common/utils/users.util";
import { updateUser } from "@/provider/features/users/users.slice";

const ProfileEditModal = ({ isOpen, onClose, creator, onSave }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("profile");
  const [newNiche, setNewNiche] = useState("");
  const [showNicheInput, setShowNicheInput] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [profileData, setProfileData] = useState({
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
  });

  const [galleries, setGalleries] = useState({
    nicheContent: {},
    uploadingNiches: {}, // Track loading state per niche
  });

  // Content rates state
  const [contentRates, setContentRates] = useState([]);
  const [customRates, setCustomRates] = useState([]);

  // Initialize profile data when creator prop changes
  useEffect(() => {
    if (creator) {
      setProfileData({
        name: creator.name || "",
        handle: creator.handle || "",
        location: creator.location || "",
        bio: creator.bio || "",
        profilePic: creator.profilePic || null,
        miniCards: (() => {
          const miniPics = creator?.miniProfilePictures || [];
          // Ensure we always have exactly 3 slots
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

      // Initialize galleries from creator data
      if (creator?.gallery && Array.isArray(creator.gallery)) {
        const galleryData = {};
        creator.gallery.forEach((niche) => {
          if (niche.media && Array.isArray(niche.media)) {
            // Separate videos and images based on URL extensions
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
                // Ensure consistent structure - convert to URL string if it's an object
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
                // Ensure consistent structure - convert to URL string if it's an object
                return typeof mediaItem === "string" ? mediaItem : mediaItem.src || mediaItem.url;
              });

            galleryData[niche.niche] = {
              videos: videos,
              images: images,
            };
          }
        });
        setGalleries({
          nicheContent: galleryData,
          uploadingNiches: {},
        });
      }

      // Initialize content rates
      if (creator?.contentRates && creator.contentRates.length > 0) {
        // Use the existing content rates from the API
        setContentRates(creator.contentRates);
        setCustomRates([{ contentType: "", price: "" }]);
      }
    }
  }, [creator]);

  const fileInputRef = useRef(null);

  // Content rates handlers
  const handleRateChange = (index, value) => {
    const newRates = [...contentRates];
    newRates[index] = { ...newRates[index], price: parseFloat(value) || 0 };
    setContentRates(newRates);
  };

  const handleCustomRateChange = (idx, field, value) => {
    const updated = [...customRates];
    updated[idx][field] = field === "price" ? parseFloat(value) || 0 : value;
    setCustomRates(updated);
  };

  const addCustomRateRow = () => {
    setCustomRates([...customRates, { contentType: "", price: 0 }]);
  };

  const removeCustomRate = (idx) => {
    const updated = customRates.filter((_, i) => i !== idx);
    setCustomRates(updated.length ? updated : [{ contentType: "", price: 0 }]);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "pricing", label: "Pricing", icon: DollarSign },
    { id: "gallery", label: "Gallery", icon: Images },
    { id: "niches", label: "Niches", icon: Tag },
  ];

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Set loading state
      setProfileData((prev) => ({ ...prev, profilePicLoading: true }));

      const response = await dispatch(
        uploadSingleFile({
          file: file,
          folder: "creator",
        })
      ).unwrap();

      if (response?.url) {
        // Update profile picture with the uploaded URL
        setProfileData((prev) => ({
          ...prev,
          profilePic: response.url,
          profilePicLoading: false,
        }));
      }
    }
  };

  const handleMiniCardRemove = (index) => {
    setProfileData((prev) => {
      const newMiniCards = [...prev.miniCards];
      newMiniCards[index] = null;
      return { ...prev, miniCards: newMiniCards };
    });
  };

  const handleMiniCardUpload = async (index) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = false;

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Set loading state
      setProfileData((prev) => {
        const newLoading = [...prev.miniCardsLoading];
        newLoading[index] = true;
        return { ...prev, miniCardsLoading: newLoading };
      });

      // Upload file using the upload service
      const response = await dispatch(
        uploadSingleFile({
          file: file,
          folder: "creator",
        })
      ).unwrap();

      if (response?.url) {
        // Update mini card with the uploaded URL
        setProfileData((prev) => {
          const newMiniCards = [...prev.miniCards];
          newMiniCards[index] = response.url;
          return { ...prev, miniCards: newMiniCards };
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
  };

  const addNiche = () => {
    if (newNiche.trim() && !profileData.niches.includes(newNiche.trim())) {
      const newNicheName = newNiche.trim();
      setProfileData((prev) => ({
        ...prev,
        niches: [...prev.niches, newNicheName],
      }));
      setNewNiche("");
      setShowNicheInput(false);
    }
  };

  const removeNiche = (niche) => {
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
  };

  const addGalleryItem = async (type, niche) => {
    const input = document.createElement("input");
    input.type = "file";

    // Set accept based on type
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

      setGalleries((prev) => ({
        ...prev,
        uploadingNiches: {
          ...prev.uploadingNiches,
          [niche]: false,
        },
      }));
    };

    input.click();
  };

  // Utility function to ensure gallery data consistency
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

  const removeGalleryItem = (type, index, niche) => {
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
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Clean gallery data to ensure consistency
      const cleanGalleryData = ensureCleanGalleryData(galleries.nicheContent);

      const galleryData = Object.entries(cleanGalleryData).map(([niche, content]) => {
        const allMedia = [...(content.videos || []), ...(content.images || [])];

        return {
          niche,
          media: allMedia,
        };
      });

      // Prepare content rates from editable state
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
        socialPlatforms: creator.user?.creator_profile?.social_platforms || [],
        categories: profileData.niches,
        keywordTags: creator.user?.creator_profile?.keyword_tags || [],
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

      // Always update creator profile data (includes content rates, gallery, etc.)
      const creatorResult = await dispatch(updateCampaignDefaults(creatorProfileData)).unwrap();

      if (creatorResult.success) {
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (currentUser.creator_profile) {
          // Update creator profile data
          currentUser.creator_profile.gallery = galleryData;
          currentUser.creator_profile.content_rates = allContentRates;
          currentUser.creator_profile.mini_profile_pictures = profileData.miniCards.filter(
            (card) => card !== null
          );
          currentUser.creator_profile.profile_photo_url = profileData.profilePic;
          currentUser.creator_profile.bio = profileData.bio;
          currentUser.creator_profile.categories = profileData.niches;

          // Also update the root level for backward compatibility
          currentUser.miniProfilePictures = profileData.miniCards.filter((card) => card !== null);
          currentUser.profilePic = profileData.profilePic;
          currentUser.gallery = galleryData; // Add gallery at root level for immediate access

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
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-5xl h-[75vh] flex overflow-hidden shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-4 z-10 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        {/* Sidebar */}
        <div className="w-48 white border-r border-gray-200 flex flex-col">
          <div className="flex items-center gap-2 p-4 border-b border-gray-200">
            <Edit className="w-4 h-4 text-gray-600" />
            <h2 className="text-xs font-bold text-gray-900">Edit Profile</h2>
          </div>

          <div className="flex-1 p-3">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-1 px-3 py-2 rounded-lg text-left transition-all text-xs ${
                      activeTab === tab.id
                        ? "bg-primary text-white shadow-sm"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-3 border-t border-gray-200">
            <div className="bg-white rounded-lg p-1 border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center overflow-hidden shadow-sm">
                  {profileData.profilePic ? (
                    <img
                      src={profileData.profilePic || avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold text-xs">SC</span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-xs text-gray-900">{profileData.name}</h3>
                  <p className="text-xs text-gray-600">{profileData.handle}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col">
          <div className="px-4 py-3.5 border-b border-gray-200 bg-white">
            <div>
              <h1 className="text-sm font-semibold text-gray-900">
                {tabs.find((tab) => tab.id === activeTab)?.label}
              </h1>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-white">
            {activeTab === "profile" && (
              <div className="space-y-4 max-w-3xl">
                {/* Profile Picture */}
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-900 mb-2">Profile Picture</h3>
                  <div className="flex items-center space-x-3">
                    <div className="relative group">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
                        {profileData.profilePic ? (
                          <img
                            src={profileData.profilePic}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white font-bold text-xs">
                            <ImageIcon className="w-4 h-4 text-gray-500" />
                          </span>
                        )}

                        {/* Loading State */}
                        {profileData.profilePicLoading && (
                          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
                            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                        disabled={profileData.profilePicLoading}
                      >
                        <Camera className="w-3 h-3 text-white" />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePicChange}
                        className="hidden"
                        disabled={profileData.profilePicLoading}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-semibold text-gray-900">
                            Upload new picture
                          </h4>
                          <p className="text-xs text-gray-500">
                            {profileData.profilePicLoading
                              ? "Uploading..."
                              : "Choose a high-quality image"}
                          </p>
                        </div>
                        <CustomButton
                          text={profileData.profilePicLoading ? "Uploading..." : "Choose File"}
                          onClick={() => fileInputRef.current?.click()}
                          className="btn-primary px-3 py-1.5 text-xs ml-3"
                          disabled={profileData.profilePicLoading}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-900 mb-3">Bio</h3>
                  <TextArea
                    label="Tell us about yourself"
                    name="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                    placeholder="Share your story, passion, and what makes you unique..."
                    rows={4}
                  />
                </div>

                {/* Basic Information */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-900 mb-3">Basic Information</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <CustomInput
                          label="Full Name"
                          name="name"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData((prev) => ({ ...prev, name: e.target.value }))
                          }
                          placeholder="Enter your full name"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <CustomInput
                          label="Handle"
                          name="handle"
                          value={profileData.handle}
                          onChange={(e) =>
                            setProfileData((prev) => ({ ...prev, handle: e.target.value }))
                          }
                          placeholder="@yourusername"
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div>
                      <CustomInput
                        label="Location"
                        name="location"
                        value={profileData.location}
                        onChange={(e) =>
                          setProfileData((prev) => ({ ...prev, location: e.target.value }))
                        }
                        placeholder="City, Country"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Mini Profile Pictures */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-900 mb-3">Showcase Images</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {profileData.miniCards.map((card, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg border-2 border-solid border-gray-200 flex items-center justify-center overflow-hidden hover:border-primary transition-all duration-300">
                          {card ? (
                            <img
                              src={card}
                              alt={`Showcase ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center">
                              <div className="flex justify-center items-center w-6 h-6 bg-gray-300 rounded-lg mb-1 mx-auto">
                                <ImageIcon className="w-4 h-4 text-gray-500" />
                              </div>
                              <p className="text-xs text-gray-500 font-medium">Add Image</p>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleMiniCardUpload(index)}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                          <Camera className="w-4 h-4 text-white" />
                        </button>

                        {/* Remove Button */}
                        {card && (
                          <button
                            onClick={() => handleMiniCardRemove(index)}
                            className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 shadow-lg hover:scale-110 transform"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "pricing" && (
              <div className="space-y-4 max-w-3xl">
                {/* Standard Content Rates */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-900 mb-3">Content Rates</h3>
                  <div className="space-y-3">
                    {contentRates.map((rate, index) => (
                      <div
                        key={`rate-${index}-${rate.contentType}`}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2 text-gray-700">
                          <DollarSign className="w-4 h-4 text-indigo-500" />
                          <span className="text-sm font-medium">{rate.contentType}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500 text-sm">$</span>
                          <CustomInput
                            type="number"
                            placeholder="0"
                            className="!w-20 !border !h-7 !border-gray-300"
                            value={
                              rate.price !== undefined && rate.price !== null
                                ? String(rate.price)
                                : ""
                            }
                            onChange={(e) => handleRateChange(index, e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom Rates Section */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-900 mb-3">Custom Rates</h3>
                  <div className="space-y-3">
                    {customRates.map((rate, idx) => (
                      <div
                        key={`custom-rate-${idx}`}
                        className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                      >
                        <CustomInput
                          placeholder="Custom package"
                          className="flex-1 !border !border-gray-300"
                          value={rate.contentType}
                          onChange={(e) =>
                            handleCustomRateChange(idx, "contentType", e.target.value)
                          }
                        />
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500 text-sm">$</span>
                          <CustomInput
                            type="number"
                            placeholder="0"
                            className="!w-20 !border !border-gray-300"
                            value={
                              rate.price !== undefined && rate.price !== null
                                ? String(rate.price)
                                : ""
                            }
                            onChange={(e) => handleCustomRateChange(idx, "price", e.target.value)}
                          />
                        </div>
                        <button
                          type="button"
                          className="bg-red-200 p-1.5 rounded-full hover:bg-red-300 transition-colors"
                          onClick={() => removeCustomRate(idx)}
                          disabled={customRates.length === 1}
                          title="Remove custom rate"
                        >
                          <X className="text-red-600 w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
                      onClick={addCustomRateRow}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <PlusCircle className="w-4 h-4" />
                        <span className="text-sm">Add Custom Rate</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "niches" && (
              <div className="space-y-4 max-w-3xl">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-900 mb-3">Content Niches</h3>

                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {profileData.niches.map((niche, index) => (
                      <button
                        key={index}
                        className="px-2 py-1.5 rounded-lg text-xs border bg-primary text-white shadow-sm flex items-center"
                      >
                        {niche}
                        <button
                          onClick={() => removeNiche(niche)}
                          className="ml-2 text-white hover:text-red-200 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </button>
                    ))}
                  </div>

                  {showNicheInput ? (
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <CustomInput
                          name="newNiche"
                          value={newNiche}
                          onChange={(e) => setNewNiche(e.target.value)}
                          placeholder="Enter niche name"
                        />
                      </div>
                      <CustomButton text="Add" onClick={addNiche} className="btn-primary" />
                      <CustomButton
                        text="Cancel"
                        onClick={() => {
                          setShowNicheInput(false);
                          setNewNiche("");
                        }}
                        className="btn-cancel"
                      />
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <CustomButton
                        text="Add Niche"
                        onClick={() => setShowNicheInput(true)}
                        className="btn-outline"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "gallery" && (
              <div className="space-y-4 max-w-4xl">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900">Gallery by Niche</h3>
                  </div>

                  {profileData.niches.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      <div className="flex justify-center items-center w-10 h-10 bg-gray-200 rounded-lg mx-auto mb-2">
                        <Tag className="w-4 h-4 text-gray-500" />
                      </div>
                      <p className="text-xs font-medium">No niches added yet</p>
                      <p className="text-xs mt-1">Add some niches first to organize your gallery</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {profileData.niches.map((niche) => {
                        const nicheContent = galleries.nicheContent[niche] || {
                          videos: [],
                          images: [],
                        };
                        const totalContent =
                          nicheContent.videos.length + nicheContent.images.length;

                        return (
                          <div key={niche} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-xs font-semibold text-gray-900">
                                {niche} ({totalContent} items)
                              </h4>
                              <div className="flex space-x-2">
                                <CustomButton
                                  text={
                                    galleries.uploadingNiches[niche] ? "Uploading..." : "Add Video"
                                  }
                                  onClick={() => addGalleryItem("video", niche)}
                                  className="btn-outline text-xs px-3 py-1.5"
                                  startIcon={
                                    galleries.uploadingNiches[niche] ? (
                                      <RefreshCw className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <Camera className="w-3 h-3" />
                                    )
                                  }
                                  disabled={galleries.uploadingNiches[niche]}
                                />
                                <CustomButton
                                  text={
                                    galleries.uploadingNiches[niche] ? "Uploading..." : "Add Image"
                                  }
                                  onClick={() => addGalleryItem("image", niche)}
                                  className="btn-primary text-xs px-3 py-1.5"
                                  startIcon={
                                    galleries.uploadingNiches[niche] ? (
                                      <RefreshCw className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <ImageIcon className="w-3 h-3" />
                                    )
                                  }
                                  disabled={galleries.uploadingNiches[niche]}
                                />
                                <CustomButton
                                  text={
                                    galleries.uploadingNiches[niche]
                                      ? "Uploading..."
                                      : "Bulk Upload"
                                  }
                                  onClick={() => addGalleryItem("mixed", niche)}
                                  className="btn-secondary text-xs px-3 py-1.5"
                                  startIcon={
                                    galleries.uploadingNiches[niche] ? (
                                      <RefreshCw className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <Images className="w-3 h-3" />
                                    )
                                  }
                                  disabled={galleries.uploadingNiches[niche]}
                                />
                              </div>
                            </div>

                            {totalContent === 0 ? (
                              <div className="text-center py-4 text-gray-400 bg-gray-50 rounded-lg">
                                <p className="text-xs">No content uploaded for this niche yet</p>
                                <p className="text-xs mt-1 text-gray-500">
                                  Use the buttons above to add your first content
                                </p>
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {nicheContent.videos.map((videoUrl, index) => (
                                  <div key={`${niche}-video-${index}`} className="relative group">
                                    <div className="h-48 bg-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
                                      <div className="relative w-full h-full bg-gray-800">
                                        <video
                                          src={videoUrl}
                                          className="w-full h-full object-cover"
                                          controls
                                          preload="metadata"
                                          style={{
                                            pointerEvents: "auto",
                                            zIndex: 1,
                                          }}
                                        />
                                        {/* Video overlay with play button */}
                                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 pointer-events-none">
                                          <div className="w-12 h-12 bg-white bg-opacity-75 rounded-full flex items-center justify-center">
                                            <svg
                                              className="w-6 h-6 text-gray-800"
                                              fill="currentColor"
                                              viewBox="0 0 20 20"
                                            >
                                              <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                                clipRule="evenodd"
                                              />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>

                                      <button
                                        onClick={() => removeGalleryItem("video", index, niche)}
                                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600 z-[9999]"
                                        title="Remove video"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>

                                      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 via-black/60 to-transparent p-2 z-20">
                                        <p className="text-white text-xs font-medium leading-tight">
                                          Video {index + 1}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                {nicheContent.images.map((imageUrl, index) => (
                                  <div key={`${niche}-image-${index}`} className="relative group">
                                    <div className="h-48 bg-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
                                      <img
                                        src={imageUrl}
                                        alt={`Image ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                        onError={(e) => {
                                          e.target.src = avatar;
                                          e.target.alt = "Image failed to load";
                                        }}
                                      />

                                      <button
                                        onClick={() => removeGalleryItem("image", index, niche)}
                                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600 z-[9999]"
                                        title="Remove image"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>

                                      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 via-black/60 to-transparent p-2 z-20">
                                        <p className="text-white text-xs font-medium leading-tight">
                                          Image {index + 1}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-[15px] border-t border-gray-200 bg-">
            <div className="flex justify-end">
              <CustomButton
                text="Save Changes"
                className="btn-primary"
                onClick={handleSave}
                disabled={isSaving}
                loading={isSaving}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;
