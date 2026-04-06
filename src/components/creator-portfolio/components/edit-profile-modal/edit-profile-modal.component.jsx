import CustomButton from "@/common/components/custom-button/custom-button.component";
import { avatar } from "@/common/constants/auth.constant";
import { DollarSign, Edit, Images, Tag, User, X } from "lucide-react";
import GalleryTab from "./components/gallery-tab/gallery-tab.component";
import NichesTab from "./components/niches-tab/niches-tab.component";
import PricingTab from "./components/pricing-tab/pricing-tab.component";
import ProfileTab from "./components/profile-tab/profile-tab.component";
import useEditProfileModal from "./use-edit-profile-modal.hook";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "pricing", label: "Pricing", icon: DollarSign },
  { id: "gallery", label: "Gallery", icon: Images },
  { id: "niches", label: "Niches", icon: Tag },
];

const ProfileEditModal = ({ isOpen, onClose, creator, onSave }) => {
  const {
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
            <h1 className="text-sm font-semibold text-gray-900">
              {tabs.find((tab) => tab.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-white">
            {activeTab === "profile" && (
              <ProfileTab profileData={profileData} setProfileData={setProfileData} />
            )}
            {activeTab === "pricing" && (
              <PricingTab
                contentRates={contentRates}
                setContentRates={setContentRates}
                customRates={customRates}
                setCustomRates={setCustomRates}
              />
            )}
            {activeTab === "niches" && (
              <NichesTab profileData={profileData} setProfileData={setProfileData} />
            )}
            {activeTab === "gallery" && (
              <GalleryTab activeTab={activeTab} creatorCategories={profileData.niches || []} />
            )}
          </div>

          <div className="px-6 py-[15px] border-t border-gray-200">
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
