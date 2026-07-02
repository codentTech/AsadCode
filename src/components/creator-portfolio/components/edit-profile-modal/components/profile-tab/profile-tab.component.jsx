import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { Camera, ImageIcon, Trash2 } from "lucide-react";
import useProfileTab from "./use-profile-tab.hook";

const ProfileTab = ({ profileData, setProfileData }) => {
  const {
    fileInputRef,
    handleProfileFieldChange,
    handleProfilePicChange,
    handleMiniCardUpload,
    handleMiniCardRemove,
  } = useProfileTab({ setProfileData });

  return (
    <div className="max-w-3xl space-y-3 sm:space-y-4">
      {/* Profile Picture */}
      <div className="rounded-lg border border-gray-200 bg-white p-2.5 shadow-sm sm:p-3">
        <h3 className="text-xs font-semibold text-gray-900 mb-2">Profile Picture</h3>
        <div className="flex flex-col items-start gap-2.5 sm:flex-row sm:items-center sm:space-x-3">
          <div className="relative group">
            <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
              {profileData.profilePic ? (
                <img
                  src={profileData.profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-4 h-4 text-gray-500" />
              )}
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
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="text-xs font-semibold text-gray-900">Upload new picture</h4>
                <p className="text-xs text-gray-500">
                  {profileData.profilePicLoading ? "Uploading..." : "Choose a high-quality image"}
                </p>
              </div>
              <CustomButton
                text={profileData.profilePicLoading ? "Uploading..." : "Choose File"}
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary w-full sm:ml-3 sm:w-auto"
                disabled={profileData.profilePicLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Showcase Images */}
      <div id="creator-showcase-images" className="scroll-mt-4 rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
        <h3 className="text-xs font-semibold text-gray-900 mb-3">Showcase Images</h3>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
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
              {card && (
                <button
                  onClick={() => handleMiniCardRemove(index)}
                  className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 shadow-lg hover:scale-110 transform"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
        <h3 className="text-xs font-semibold text-gray-900 mb-3">Media Kit Link</h3>
        <CustomInput
          label="Media Kit Link"
          name="mediaKitUrl"
          type="url"
          value={profileData.mediaKitUrl}
          onChange={(e) => handleProfileFieldChange("mediaKitUrl", e.target.value)}
          placeholder="https://"
        />
        <p className="mt-2 text-xs text-gray-500">
          Paste a link to your media kit. This will be visible to brands on your profile.
        </p>
      </div>

      {/* Bio */}
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
        <h3 className="text-xs font-semibold text-gray-900 mb-3">Bio</h3>
        <TextArea
          label="Tell us about yourself"
          name="bio"
          value={profileData.bio}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 100) handleProfileFieldChange("bio", value);
          }}
          placeholder="Share your story, passion, and what makes you unique..."
          rows={4}
          maxLength={100}
        />
        <p className="text-xs text-gray-600 mt-2">{profileData.bio?.length || 0}/100 characters</p>
      </div>

      {/* Basic Information */}
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
        <h3 className="text-xs font-semibold text-gray-900 mb-3">Basic Information</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <CustomInput
              label="Full Name"
              name="name"
              value={profileData.name}
              onChange={(e) => handleProfileFieldChange("name", e.target.value)}
              placeholder="Enter your full name"
            />
            <CustomInput
              label="Handle"
              name="handle"
              value={profileData.handle}
              onChange={(e) => handleProfileFieldChange("handle", e.target.value)}
              placeholder="@yourusername"
            />
          </div>
          <CustomInput
            label="Location"
            name="location"
            value={profileData.location}
            onChange={(e) => handleProfileFieldChange("location", e.target.value)}
            placeholder="City, Country"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
