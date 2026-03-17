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
import useEditProfileModal from "./use-edit-profile-modal.hook";

const ProfileEditModal = ({ isOpen, onClose, creator, onSave }) => {
  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "pricing", label: "Pricing", icon: DollarSign },
    { id: "gallery", label: "Gallery", icon: Images },
    { id: "niches", label: "Niches", icon: Tag },
  ];

  const {
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
  } = useEditProfileModal({ creator, onClose, onSave });

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
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 100) {
                        handleProfileFieldChange("bio", value);
                      }
                    }}
                    placeholder="Share your story, passion, and what makes you unique..."
                    rows={4}
                    maxLength={100}
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    {profileData.bio?.length || 0}/100 characters
                  </p>
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
                          onChange={(e) => handleProfileFieldChange("name", e.target.value)}
                          placeholder="Enter your full name"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <CustomInput
                          label="Handle"
                          name="handle"
                          value={profileData.handle}
                          onChange={(e) => handleProfileFieldChange("handle", e.target.value)}
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
                        onChange={(e) => handleProfileFieldChange("location", e.target.value)}
                        placeholder="City, Country"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Mini Profile Pictures */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-900 mb-3">
                    Showcase Image Covers (3)
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {profileData.miniCards.map((card, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-[3/4] bg-gray-100 rounded-lg border-2 border-solid border-gray-200 flex items-center justify-center overflow-hidden hover:border-primary transition-all duration-300">
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
                        <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                          Cover {index + 1}
                        </span>
                        <button
                          onClick={() => handleMiniCardUpload(index)}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                          <Camera className="w-4 h-4 text-white" />
                        </button>

                        {profileData.miniCardsLoading?.[index] && (
                          <div className="absolute inset-0 bg-white/75 rounded-lg flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}

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
