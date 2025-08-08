import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { avatar } from "@/common/constants/auth.constant";
import { Camera, DollarSign, Edit, ImageIcon, Images, Tag, User, X } from "lucide-react";
import { useRef, useState } from "react";

const ProfileEditModal = ({ isOpen, onClose, creator }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [newNiche, setNewNiche] = useState("");
  const [showNicheInput, setShowNicheInput] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "Sophia Chen",
    handle: "@sophia.creates",
    location: "Los Angeles, CA",
    bio: "Creative content creator passionate about lifestyle, fashion, and travel.",
    profilePic: null,
    miniCards: [null, null, null],
    niches: ["Fashion", "Lifestyle", "Travel"],
    startingRates: {
      instagramPost: 250,
      instagramStory: 150,
      youtubeVideo: 800,
      tiktokVideo: 200,
    },
  });

  const [galleries, setGalleries] = useState({
    videos: [],
    images: [],
  });

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
      setProfileData((prev) => ({
        ...prev,
        niches: [...prev.niches, newNiche.trim()],
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
  };

  const addGalleryItem = (type) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = type === "video" ? "video/*" : "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setGalleries((prev) => ({
            ...prev,
            [type === "video" ? "videos" : "images"]: [
              ...prev[type === "video" ? "videos" : "images"],
              { id: Date.now(), src: e.target.result, title: file.name },
            ],
          }));
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const removeGalleryItem = (type, id) => {
    setGalleries((prev) => ({
      ...prev,
      [type === "video" ? "videos" : "images"]: prev[type === "video" ? "videos" : "images"].filter(
        (item) => item.id !== id
      ),
    }));
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { key: "instagramPost", label: "Instagram Post", desc: "Single feed post" },
                      { key: "instagramStory", label: "Instagram Story", desc: "24-hour story" },
                      { key: "youtubeVideo", label: "YouTube Video", desc: "Full video content" },
                      { key: "tiktokVideo", label: "TikTok Video", desc: "Short-form content" },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="p-3 bg-gray-100 rounded-lg border border-gray-200 hover:shadow-sm transition-all"
                      >
                        <div className="relative">
                          <CustomInput
                            label={item.label + " (" + item.desc + ")"}
                            type="number"
                            value={profileData.startingRates[item.key]}
                            onChange={(e) =>
                              setProfileData((prev) => ({
                                ...prev,
                                startingRates: {
                                  ...prev.startingRates,
                                  [item.key]: parseInt(e.target.value) || 0,
                                },
                              }))
                            }
                            placeholder="0"
                            help
                          />
                        </div>
                      </div>
                    ))}
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
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Upload Your Content
                    </h3>

                    <div className="flex space-x-2 mb-3">
                      <CustomButton
                        text="Add Video"
                        onClick={() => addGalleryItem("video")}
                        className="btn-outline"
                      />
                      <CustomButton
                        text="Add Image"
                        onClick={() => addGalleryItem("image")}
                        className="btn-primary"
                      />
                    </div>
                  </div>

                  {galleries.videos.length > 0 && (
                    <div className="mb-3">
                      <h4 className="font-semibold text-gray-900 mb-2 text-xs">
                        Videos ({galleries.videos.length})
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {galleries.videos.map((video) => (
                          <div key={video.id} className="relative group">
                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
                              <video src={video.src} className="w-full h-full object-cover" />
                            </div>
                            <button
                              onClick={() => removeGalleryItem("video", video.id)}
                              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {galleries.images.length > 0 ? (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-xs">
                        Images ({galleries.images.length})
                      </h4>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        {galleries.images.map((image) => (
                          <div key={image.id} className="relative group">
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
                              <img
                                src={image.src}
                                alt={image.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              onClick={() => removeGalleryItem("image", image.id)}
                              className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    galleries.videos.length === 0 && (
                      <div className="text-center py-6 text-gray-500">
                        <div className="flex justify-center items-center w-10 h-10 bg-gray-200 rounded-lg mx-auto mb-2">
                          <ImageIcon className="w-4 h-4 text-gray-500" />
                        </div>
                        <p className="text-xs font-medium">No media added yet</p>
                        <p className="text-xs mt-1">Upload some content to showcase your work</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Save Changes Button - Bottom */}
          <div className="px-6 py-[15px] border-t border-gray-200 bg-">
            <div className="flex justify-end">
              <CustomButton text="Save Changes" className="btn-primary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;
