import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import Niche from "@/components/niche/niche";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  DollarSign,
  Eye,
  Filter,
  Gift,
  Percent,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import CampaignFeed from "./components/campaign-feed/campaign-feed.component";

const CampaignDashboard = () => {
  const [filters, setFilters] = useState({
    campaignType: "",
    platforms: [],
    compensationType: "",
    location: "Remote",
    minPayment: 0,
    recentlyPosted: false,
  });

  const [selectedNiche, setSelectedNiche] = useState("All");
  const [showFullBrief, setShowFullBrief] = useState(false);
  const [showApplication, setShowApplication] = useState(false);
  const [showPitchPopup, setShowPitchPopup] = useState(false);
  const [showNewPitchForm, setShowNewPitchForm] = useState(false);
  const [applicationPitch, setApplicationPitch] = useState("");
  const [newPitchTitle, setNewPitchTitle] = useState("");
  const [newPitchContent, setNewPitchContent] = useState("");
  const [expandedFilters, setExpandedFilters] = useState({
    type: true,
    platform: true,
    compensation: true,
    location: true,
  });

  const [pitchTemplates, setPitchTemplates] = useState([
    {
      id: 1,
      name: "Airbnb Pitch",
      content:
        "Hi! I'd love to showcase your property to my travel-focused audience. My content consistently drives bookings and engagement...",
    },
    {
      id: 2,
      name: "Restaurant Pitch",
      content:
        "I specialize in food content and would love to feature your restaurant. My audience loves discovering new dining experiences...",
    },
    {
      id: 3,
      name: "Hotels Pitch",
      content:
        "As a travel creator, I'd be excited to create content for your hotel. My previous hotel collaborations have generated significant bookings...",
    },
    {
      id: 4,
      name: "Airline Pitch",
      content:
        "I create travel content and would love to partner with your airline. My audience values travel experiences and flight recommendations...",
    },
    {
      id: 5,
      name: "Tourism Board Pitch",
      content:
        "I'm passionate about destination marketing and would love to showcase your location to my engaged travel audience...",
    },
  ]);

  const campaigns = [
    {
      id: 1,
      brandLogo: "🏨",
      brandName: "Luxury Hotels Co.",
      title: "Summer Staycation Campaign",
      type: "Sponsored Post",
      compensation: "Paid",
      deliverables: ["2 TikTok videos", "1 Instagram post", "1 Instagram Story"],
      niche: "Travel",
      location: "Remote",
      productImage: "🏖️",
      brief:
        "Create engaging content showcasing our luxury hotel experience during summer season. Focus on amenities, views, and unique experiences.",
    },
    {
      id: 2,
      brandLogo: "🍕",
      brandName: "Taste Buds Restaurant",
      title: "New Menu Launch",
      type: "UGC",
      compensation: "Gifted",
      deliverables: ["3 TikTok videos", "2 Instagram posts"],
      niche: "Food",
      location: "New York, NY",
      productImage: "🍽️",
      brief:
        "Showcase our new seasonal menu items with authentic reactions and honest reviews. Focus on taste, presentation, and dining experience.",
    },
    {
      id: 3,
      brandLogo: "✈️",
      brandName: "Sky Airlines",
      title: "Business Class Experience",
      type: "Affiliate",
      compensation: "Commission",
      deliverables: ["1 YouTube video", "2 Instagram posts", "3 Instagram Stories"],
      niche: "Travel",
      location: "Remote",
      productImage: "🛫",
      brief:
        "Create content highlighting our premium business class experience. Include booking process, onboard amenities, and overall journey.",
    },
  ];

  const niches = ["All", "Travel", "Food", "Fashion", "Tech", "Fitness", "Beauty"];

  const toggleFilter = (section) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePlatformChange = (platform) => {
    setFilters((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const resetFilters = () => {
    setFilters({
      campaignType: "",
      platforms: [],
      compensationType: "",
      location: "Remote",
      minPayment: 0,
      recentlyPosted: false,
    });
  };

  const copyPitchTemplate = (content) => {
    navigator.clipboard.writeText(content);
    setApplicationPitch(content);
  };

  const createNewPitch = () => {
    if (newPitchTitle && newPitchContent) {
      const newPitch = {
        id: pitchTemplates.length + 1,
        name: newPitchTitle,
        content: newPitchContent,
      };
      setPitchTemplates([...pitchTemplates, newPitch]);
      setNewPitchTitle("");
      setNewPitchContent("");
      setShowNewPitchForm(false);
    }
  };

  const deletePitch = (id) => {
    setPitchTemplates(pitchTemplates.filter((pitch) => pitch.id !== id));
    setShowPitchPopup(false);
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    if (selectedNiche !== "All" && campaign.niche !== selectedNiche) return false;
    if (filters.campaignType && campaign.type !== filters.campaignType) return false;
    if (filters.compensationType && campaign.compensation !== filters.compensationType)
      return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Campaign Filters */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Campaign Filters</h2>
              </div>

              {/* Campaign Type Filter */}
              <div className="mb-4">
                <button
                  onClick={() => toggleFilter("type")}
                  className="flex items-center justify-between w-full py-2 text-sm font-medium text-gray-900"
                >
                  Campaign Type
                  {expandedFilters.type ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {expandedFilters.type && (
                  <div className="mt-2">
                    <select
                      value={filters.campaignType}
                      onChange={(e) => setFilters({ ...filters, campaignType: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Types</option>
                      <option value="Sponsored Post">Sponsored Post</option>
                      <option value="UGC">UGC</option>
                      <option value="Affiliate">Affiliate</option>
                      <option value="Giveaway">Giveaway</option>
                      <option value="Gifting Only">Gifting Only</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Platform Filter */}
              <div className="mb-4">
                <button
                  onClick={() => toggleFilter("platform")}
                  className="flex items-center justify-between w-full py-2 text-sm font-medium text-gray-900"
                >
                  Platform
                  {expandedFilters.platform ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {expandedFilters.platform && (
                  <div className="mt-2 space-y-2">
                    {["TikTok", "Instagram", "YouTube"].map((platform) => (
                      <label key={platform} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.platforms.includes(platform)}
                          onChange={() => handlePlatformChange(platform)}
                          className="mr-2 text-blue-600"
                        />
                        <span className="text-sm text-gray-600">{platform}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Compensation Type Filter */}
              <div className="mb-4">
                <button
                  onClick={() => toggleFilter("compensation")}
                  className="flex items-center justify-between w-full py-2 text-sm font-medium text-gray-900"
                >
                  Compensation Type
                  {expandedFilters.compensation ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {expandedFilters.compensation && (
                  <div className="mt-2">
                    <select
                      value={filters.compensationType}
                      onChange={(e) => setFilters({ ...filters, compensationType: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Types</option>
                      <option value="Paid">Paid</option>
                      <option value="Gifted">Gifted</option>
                      <option value="Commission">Commission</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Location Filter */}
              <div className="mb-4">
                <button
                  onClick={() => toggleFilter("location")}
                  className="flex items-center justify-between w-full py-2 text-sm font-medium text-gray-900"
                >
                  Location
                  {expandedFilters.location ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {expandedFilters.location && (
                  <div className="mt-2">
                    <select
                      value={filters.location}
                      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Remote">Remote</option>
                      <option value="New York, NY">New York, NY</option>
                      <option value="Los Angeles, CA">Los Angeles, CA</option>
                      <option value="Chicago, IL">Chicago, IL</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Minimum Payment */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Minimum Payment ($)
                </label>
                <input
                  type="number"
                  value={filters.minPayment}
                  onChange={(e) =>
                    setFilters({ ...filters, minPayment: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              {/* Recently Posted Toggle */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.recentlyPosted}
                    onChange={(e) => setFilters({ ...filters, recentlyPosted: e.target.checked })}
                    className="mr-2 text-blue-600"
                  />
                  <span className="text-sm text-gray-600">Recently Posted</span>
                </label>
              </div>

              <CustomButton
                text="Reset Filters"
                className="w-full"
                variant="secondary"
                onClick={resetFilters}
              />
            </div>
          </div>

          {/* Center Column - Campaign Feed */}
          <CampaignFeed filteredCampaigns={filteredCampaigns} />

          {/* Right Column - My Pitch Templates */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">My Pitches</h2>

              <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                {pitchTemplates.map((pitch) => (
                  <div
                    key={pitch.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <button
                      onClick={() => setShowPitchPopup(pitch)}
                      className="flex-1 text-left text-sm font-medium text-gray-900 hover:text-blue-600"
                    >
                      {pitch.name}
                    </button>
                    <button
                      onClick={() => copyPitchTemplate(pitch.content)}
                      className="p-1 text-gray-600 hover:text-blue-600"
                      title="Copy pitch"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <CustomButton
                text="Create New Pitch"
                className="w-full btn-primary"
                onClick={() => setShowNewPitchForm(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <Modal
        show={showApplication}
        title="Apply to Campaign"
        onClose={() => setShowApplication(false)}
      >
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-gray-900">
            {showApplication.brandName} - {showApplication.title}
          </h4>
          <div>
            <TextArea
              label="Your Pitch (Optional)"
              placeholder="Write your pitch here or use a saved template..."
            />
          </div>
          <div className="flex gap-3">
            <CustomButton
              text="Cancel"
              className="w-full btn-cancel"
              onClick={() => {
                setShowApplication(false);
                setApplicationPitch("");
              }}
            />
            <CustomButton
              text="Submit Application"
              className="w-full btn-primary"
              onClick={() => {
                setShowApplication(false);
                setApplicationPitch("");
              }}
            />
          </div>
        </div>
      </Modal>

      {/* Pitch Template Modal */}
      {showPitchPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{showPitchPopup.name}</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyPitchTemplate(showPitchPopup.content)}
                    className="p-2 text-gray-600 hover:text-blue-600"
                    title="Copy pitch"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deletePitch(showPitchPopup.id)}
                    className="p-2 text-gray-600 hover:text-red-600"
                    title="Delete pitch"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowPitchPopup(false)}
                    className="p-2 text-gray-600 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Pitch Content
                  </label>
                  <textarea
                    value={showPitchPopup.content}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 h-32 resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <CustomButton
                    text="Copy & Use"
                    onClick={() => {
                      copyPitchTemplate(showPitchPopup.content);
                      setShowPitchPopup(false);
                    }}
                  />
                  <CustomButton
                    text="Close"
                    variant="secondary"
                    onClick={() => setShowPitchPopup(false)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        show={showNewPitchForm}
        title="Create New Pitch"
        onClose={() => setShowNewPitchForm(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Pitch Name</label>
            <CustomInput
              type="text"
              value={newPitchTitle}
              onChange={(e) => setNewPitchTitle(e.target.value)}
              placeholder="e.g., Skincare Brand Pitch"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Pitch Content</label>
            <TextArea
              value={newPitchContent}
              onChange={(e) => setNewPitchContent(e.target.value)}
              placeholder="Write your pitch template here..."
            />
          </div>

          <div className="flex gap-3">
            <CustomButton
              text="Cancel"
              className="btn-cancel w-full"
              onClick={() => {
                setShowNewPitchForm(false);
                setNewPitchTitle("");
                setNewPitchContent("");
              }}
            />
            <CustomButton
              text="Save Pitch"
              className="btn-primary w-full"
              onClick={createNewPitch}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CampaignDashboard;
