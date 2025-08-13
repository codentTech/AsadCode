import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { avatar } from "@/common/constants/auth.constant";
import { Camera, DollarSign, Edit, ImageIcon, Images, Tag, User, X } from "lucide-react";
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
    miniCards: [null, null, null],
    niches: [],
    startingRates: {},
  });

  const [galleries, setGalleries] = useState({
    nicheContent: {},
  });

  // Initialize profile data when creator prop changes
  useEffect(() => {
    if (creator) {
      // Debug: Log the content rates to see what we're working with
      console.log("Creator content rates:", creator.contentRates);

      // Ensure contentRates is an array and has content
      const hasContentRates =
        creator.contentRates &&
        Array.isArray(creator.contentRates) &&
        creator.contentRates.length > 0;
      console.log("Has content rates:", hasContentRates);

      setProfileData({
        name: creator.name || "",
        handle: creator.handle || "",
        location: creator.location || "",
        bio: creator.bio || "",
        profilePic: creator.profilePic || null,
        miniCards: [null, null, null], // Not in API yet
        niches: creator.categories || [],

        startingRates:
          creator?.creator_profile?.content_rates?.map((rate) => ({
            type: rate.contentType,
            price: `$${rate.price || 0}`,
          })) || [],
      });

      // Initialize galleries from creator data
      if (creator.creator_profile?.gallery && Array.isArray(creator.creator_profile.gallery)) {
        const galleryData = {};
        creator.creator_profile.gallery.forEach((niche) => {
          if (niche.media && Array.isArray(niche.media)) {
            // Separate videos and images based on URL extensions
            const videos = niche.media.filter(
              (url) =>
                url.includes(".mp4") ||
                url.includes(".mov") ||
                url.includes(".avi") ||
                url.includes(".webm")
            );
            const images = niche.media.filter(
              (url) =>
                url.includes(".jpg") ||
                url.includes(".jpeg") ||
                url.includes(".png") ||
                url.includes(".gif") ||
                url.includes(".webp")
            );

            galleryData[niche.niche] = {
              videos: videos.map((url, index) => ({
                id: `${niche.niche}-video-${index}`,
                src: url,
                title: `Video ${index + 1}`,
                niche: niche.niche,
                type: "video",
                fileSize: 0, // We don't have this info from the API
                uploadDate: new Date().toISOString(),
              })),
              images: images.map((url, index) => ({
                id: `${niche.niche}-image-${index}`,
                src: url,
                title: `Image ${index + 1}`,
                niche: niche.niche,
                type: "image",
                fileSize: 0, // We don't have this info from the API
                uploadDate: new Date().toISOString(),
              })),
            };
          }
        });
        setGalleries({ nicheContent: galleryData });
        console.log("Initialized galleries from creator data:", galleryData);
      }
    }
  }, [creator]);

  const fileInputRef = useRef(null);
  const miniCardRefs = [useRef(null), useRef(null), useRef(null)];

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "pricing", label: "Pricing", icon: DollarSign },
    { id: "gallery", label: "Gallery", icon: Images },
    { id: "niches", label: "Niches", icon: Tag },
  ];

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData((prev) => ({ ...prev, profilePic: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMiniCardChange = (index, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData((prev) => {
          const newMiniCards = [...prev.miniCards];
          newMiniCards[index] = e.target.result;
          return { ...prev, miniCards: newMiniCards };
        });
      };
      reader.readAsDataURL(file);
    }
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

    input.multiple = true; // Allow multiple file selection

    input.onchange = async (e) => {
      const files = Array.from(e.target.files);

      if (files.length === 0) return;

      // Validate file sizes (50MB limit)
      const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
      const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE);

      if (oversizedFiles.length > 0) {
        const fileNames = oversizedFiles.map((f) => f.name).join(", ");
        console.warn(`Files too large (max 50MB): ${fileNames}`);
        return;
      }

      try {
        // Show loading state
        setGalleries((prev) => ({
          ...prev,
          isUploading: true,
        }));

        if (files.length === 1) {
          // Single file upload
          const result = await dispatch(
            uploadSingleFile({ file: files[0], folder: "creator" })
          ).unwrap();

          if (result && result.url) {
            const fileType = files[0].type.startsWith("video/") ? "video" : "image";
            const newItem = {
              id: Date.now(),
              src: result.url,
              title: files[0].name,
              niche,
              type: fileType,
              fileSize: files[0].size,
              uploadDate: new Date().toISOString(),
            };

            setGalleries((prev) => {
              const currentNicheContent = prev.nicheContent[niche] || { videos: [], images: [] };
              return {
                ...prev,
                nicheContent: {
                  ...prev.nicheContent,
                  [niche]: {
                    ...currentNicheContent,
                    [fileType === "video" ? "videos" : "images"]: [
                      ...currentNicheContent[fileType === "video" ? "videos" : "images"],
                      newItem,
                    ],
                  },
                },
                isUploading: false,
              };
            });
          }
        } else {
          // Multiple files upload
          const result = await dispatch(uploadMultipleFiles({ files, folder: "creator" })).unwrap();

          if (result && result.urls && Array.isArray(result.urls)) {
            const newItems = result.urls.map((url, index) => {
              const fileType = files[index].type.startsWith("video/") ? "video" : "image";
              return {
                id: Date.now() + index,
                src: url,
                title: files[index].name,
                niche,
                type: fileType,
                fileSize: files[index].size,
                uploadDate: new Date().toISOString(),
              };
            });

            // Separate videos and images
            const videos = newItems.filter((item) => item.type === "video");
            const images = newItems.filter((item) => item.type === "image");

            setGalleries((prev) => {
              const currentNicheContent = prev.nicheContent[niche] || { videos: [], images: [] };
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
                isUploading: false,
              };
            });
          }
        }
      } catch (error) {
        console.error("Error uploading files:", error);
        // Reset loading state
        setGalleries((prev) => ({
          ...prev,
          isUploading: false,
        }));
      }
    };

    input.click();
  };

  const removeGalleryItem = (type, id, niche) => {
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
            ].filter((item) => item.id !== id),
          },
        },
      };
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Prepare gallery data for API - ensure all uploaded media is included
      const galleryData = Object.entries(galleries.nicheContent).map(([niche, content]) => {
        // Collect all media URLs from both videos and images
        const allMedia = [
          ...(content.videos || []).map((video) => video.src),
          ...(content.images || []).map((image) => image.src),
        ];

        return {
          niche,
          media: allMedia,
        };
      });

      // Prepare content rates for API - use existing content rates from creator
      const contentRates = creator.contentRates || [
        {
          contentType: "Instagram Post",
          price: 0,
        },
        {
          contentType: "Instagram Story",
          price: 0,
        },
        {
          contentType: "YouTube Video",
          price: 0,
        },
        {
          contentType: "TikTok Video",
          price: 0,
        },
      ];

      // Step 1: Update user fields (first_name, last_name, email, etc.)
      const userUpdateData = {
        first_name: profileData.name.split(" ")[0] || "",
        last_name: profileData.name.split(" ").slice(1).join(" ") || "",
        city: profileData.location.split(",")[0]?.trim() || "",
        country: profileData.location.split(",")[1]?.trim() || "",
      };

      // Step 2: Update creator profile fields
      const creatorProfileData = {
        profilePhotoUrl: profileData.profilePic,
        bio: profileData.bio,
        socialPlatforms: creator.user?.creator_profile?.social_platforms || [],
        categories: profileData.niches,
        keywordTags: creator.user?.creator_profile?.keyword_tags || [],
        contentRates: contentRates,
        gallery: galleryData,
      };

      console.log("Saving gallery data:", galleryData);

      // Update user first
      const user = getUser();
      if (!user || !user.email) {
        throw new Error("User not found or email missing");
      }

      // Call user update API
      const userResult = await dispatch(updateUser(userUpdateData)).unwrap();
      console.log("User update result:", userResult);

      // Then call creator profile update API
      const creatorResult = await dispatch(updateCampaignDefaults(creatorProfileData)).unwrap();
      console.log("Creator profile update result:", creatorResult);

      if (creatorResult.success) {
        // Update local user data with new gallery information
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (currentUser.creator_profile) {
          currentUser.creator_profile.gallery = galleryData;
          localStorage.setItem("user", JSON.stringify(currentUser));
        }

        // Refresh the creator data to ensure gallery is updated
        const refreshedUser = getUser();
        if (refreshedUser && refreshedUser.creator_profile) {
          refreshedUser.creator_profile.gallery = galleryData;
          localStorage.setItem("user", JSON.stringify(refreshedUser));
        }

        // Call onSave callback if provided (for refreshing parent components)
        if (onSave) {
          onSave();
        }

        // Close the modal
        onClose();
      } else {
        throw new Error(creatorResult.message || "Failed to update creator profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      // Ensure error message is serializable
      const errorMessage = error?.message || error?.toString() || "An unknown error occurred";
      console.error("Serializable error message:", errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const getNicheContentCount = (niche) => {
    const content = galleries.nicheContent[niche];
    if (!content) return { videos: 0, images: 0 };
    return {
      videos: content.videos?.length || 0,
      images: content.images?.length || 0,
    };
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl h-[75vh] flex overflow-hidden shadow-2xl relative">
        {/* Close Button - Top Right */}
        <button
          onClick={onClose}
          className="absolute top-2 right-4 z-10 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        {/* Sidebar */}
        <div className="w-48 white border-r border-gray-200 flex flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center gap-2 p-4 border-b border-gray-200">
            <Edit className="w-4 h-4 text-gray-600" />
            <h2 className="text-xs font-bold text-gray-900">Edit Profile</h2>
          </div>

          {/* Navigation */}
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

          {/* Profile Preview */}
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
          {/* Header */}
          <div className="px-4 py-3.5 border-b border-gray-200 bg-white">
            <div>
              <h1 className="text-sm font-semibold text-gray-900">
                {tabs.find((tab) => tab.id === activeTab)?.label}
              </h1>
            </div>
          </div>

          {/* Content */}
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
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                      >
                        <Camera className="w-3 h-3 text-white" />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePicChange}
                        className="hidden"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-semibold text-gray-900">
                            Upload new picture
                          </h4>
                          <p className="text-xs text-gray-500">Choose a high-quality image</p>
                        </div>
                        <CustomButton
                          text="Choose File"
                          onClick={() => fileInputRef.current?.click()}
                          className="btn-primary px-3 py-1.5 text-xs ml-3"
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

                {/* Mini Cards */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-900 mb-3">Showcase Images</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {profileData.miniCards.map((card, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg border-2 border-soild border-gray-200 flex items-center justify-center overflow-hidden hover:border-primary transition-all duration-300">
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
                          onClick={() => miniCardRefs[index].current?.click()}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                          <Camera className="w-4 h-4 text-white" />
                        </button>
                        <input
                          ref={miniCardRefs[index]}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleMiniCardChange(index, e.target.files[0])}
                          className="hidden"
                        />
                      </div>
                    ))}
                  </div>
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
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Bio</label>
                      <TextArea
                        value={profileData.bio}
                        onChange={(e) =>
                          setProfileData((prev) => ({ ...prev, bio: e.target.value }))
                        }
                        placeholder="Tell us about yoursel"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "pricing" && (
              <div className="space-y-4 max-w-3xl">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-900 mb-3">Starting Rates</h3>
                  <div className="space-y-4">
                    {creator?.contentRates?.map((rate, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 transition"
                      >
                        <div className="flex items-center gap-2 text-gray-700">
                          <DollarSign className="w-4 h-4 text-indigo-500" />
                          <span className="text-sm font-medium">{rate.contentType}</span>
                        </div>
                        <span className="font-semibold">${rate.price || 0}</span>
                      </div>
                    )) || []}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "niches" && (
              <div className="space-y-4 max-w-3xl">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-900 mb-3">Content Niches</h3>

                  {/* Niche Tags - Matching niche.jsx design */}
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

                  {/* Add Niche Section */}
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
                                  text={galleries.isUploading ? "Uploading..." : "Add Video"}
                                  onClick={() => addGalleryItem("video", niche)}
                                  className="btn-outline text-xs px-3 py-1.5"
                                  startIcon={<Camera className="w-3 h-3" />}
                                  disabled={galleries.isUploading}
                                />
                                <CustomButton
                                  text={galleries.isUploading ? "Uploading..." : "Add Image"}
                                  onClick={() => addGalleryItem("image", niche)}
                                  className="btn-primary text-xs px-3 py-1.5"
                                  startIcon={<ImageIcon className="w-3 h-3" />}
                                  disabled={galleries.isUploading}
                                />
                                <CustomButton
                                  text={galleries.isUploading ? "Uploading..." : "Bulk Upload"}
                                  onClick={() => addGalleryItem("mixed", niche)}
                                  className="btn-secondary text-xs px-3 py-1.5"
                                  startIcon={<Images className="w-3 h-3" />}
                                  disabled={galleries.isUploading}
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
                                {nicheContent.videos.map((video) => (
                                  <div key={video.id} className="relative group">
                                    <div className="h-48 bg-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
                                      <div className="relative w-full h-full bg-gray-800">
                                        <video
                                          src={video.src}
                                          className="w-full h-full object-cover"
                                          controls
                                          preload="metadata"
                                          style={{
                                            pointerEvents: "auto",
                                            zIndex: 1,
                                          }}
                                        />
                                      </div>

                                      <button
                                        onClick={() => removeGalleryItem("video", video.id, niche)}
                                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600 z-30"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>

                                      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 via-black/60 to-transparent p-2 z-20">
                                        <p className="text-white text-xs font-medium leading-tight">
                                          {video.title.length > 20
                                            ? video.title.substring(0, 20) + "..."
                                            : video.title}
                                        </p>
                                        <p className="text-white/90 text-xs mt-0.5">
                                          <span className="inline-flex items-center">
                                            <Camera className="w-3 h-3 mr-1" />
                                            {formatFileSize(video.fileSize)}
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                {nicheContent.images.map((image) => (
                                  <div key={image.id} className="relative group">
                                    <div className="h-48 bg-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
                                      <img
                                        src={image.src}
                                        alt={image.title}
                                        className="w-full h-full object-cover"
                                      />

                                      <button
                                        onClick={() => removeGalleryItem("image", image.id, niche)}
                                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600 z-10"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>

                                      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 via-black/60 to-transparent p-2 z-20">
                                        <p className="text-white text-xs font-medium leading-tight">
                                          {image.title.length > 20
                                            ? image.title.substring(0, 20) + "..."
                                            : image.title}
                                        </p>
                                        <p className="text-white/90 text-xs mt-0.5">
                                          <span className="inline-flex items-center">
                                            <ImageIcon className="w-3 h-3 mr-1" />
                                            {formatFileSize(image.fileSize)}
                                          </span>
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
