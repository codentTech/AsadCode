import React, { useEffect, useState } from "react";

// Mock Creator Data
const mockCreators = [
  {
    id: 1,
    name: "Emma Johnson",
    profileImage:
      "https://static.vecteezy.com/system/resources/previews/049/005/561/non_2x/profile-shot-of-a-beautiful-young-brunette-with-wind-swept-hair-against-a-white-backdrop-photo.jpg",
    location: "Los Angeles, CA",
    rating: 4.8,
    reviewCount: 42,
    followers: 1500000,
    engagementRate: 3.2,
    platforms: ["instagram", "tiktok", "youtube"],
    bio: "Lifestyle & beauty content creator with 5+ years experience working with top beauty brands. Specializing in skincare reviews and makeup tutorials.",
  },
  {
    id: 2,
    name: "Alex Rivera",
    profileImage:
      "https://static.vecteezy.com/system/resources/previews/049/005/561/non_2x/profile-shot-of-a-beautiful-young-brunette-with-wind-swept-hair-against-a-white-backdrop-photo.jpg",
    location: "New York, NY",
    rating: 4.5,
    reviewCount: 37,
    followers: 870000,
    engagementRate: 4.1,
    platforms: ["instagram", "tiktok"],
    bio: "Fashion and lifestyle creator focusing on sustainable fashion and urban lifestyle. I love creating authentic content that resonates with Gen Z and millennials.",
  },
  {
    id: 3,
    name: "Sophia Chen",
    profileImage:
      "https://static.vecteezy.com/system/resources/previews/049/005/561/non_2x/profile-shot-of-a-beautiful-young-brunette-with-wind-swept-hair-against-a-white-backdrop-photo.jpg",
    location: "San Francisco, CA",
    rating: 4.9,
    reviewCount: 56,
    followers: 2100000,
    engagementRate: 5.3,
    platforms: ["youtube", "instagram"],
    bio: "Tech and lifestyle vlogger focusing on product reviews, tech tips, and day-in-the-life content. Engineering background with a passion for explaining complex concepts simply.",
  },
  {
    id: 4,
    name: "Marcus Williams",
    profileImage:
      "https://static.vecteezy.com/system/resources/previews/049/005/561/non_2x/profile-shot-of-a-beautiful-young-brunette-with-wind-swept-hair-against-a-white-backdrop-photo.jpg",
    location: "Austin, TX",
    rating: 4.7,
    reviewCount: 29,
    followers: 950000,
    engagementRate: 6.2,
    platforms: ["tiktok", "instagram"],
    bio: "Fitness and wellness creator specialized in home workouts and nutrition advice. Former personal trainer with a mission to make fitness accessible to everyone.",
  },
  {
    id: 5,
    name: "Olivia Parker",
    profileImage:
      "https://static.vecteezy.com/system/resources/previews/049/005/561/non_2x/profile-shot-of-a-beautiful-young-brunette-with-wind-swept-hair-against-a-white-backdrop-photo.jpg",
    location: "Miami, FL",
    rating: 4.6,
    reviewCount: 31,
    followers: 1200000,
    engagementRate: 3.8,
    platforms: ["instagram", "youtube"],
    bio: "Travel and lifestyle content creator with a focus on luxury experiences and destination guides. I help brands tell their stories through immersive visual content.",
  },
  {
    id: 6,
    name: "David Kim",
    profileImage:
      "https://static.vecteezy.com/system/resources/previews/049/005/561/non_2x/profile-shot-of-a-beautiful-young-brunette-with-wind-swept-hair-against-a-white-backdrop-photo.jpg",
    location: "Chicago, IL",
    rating: 4.4,
    reviewCount: 24,
    followers: 780000,
    engagementRate: 7.1,
    platforms: ["tiktok", "instagram", "youtube"],
    bio: "Food creator focusing on restaurant reviews and home cooking tutorials. Culinary school graduate with a passion for making cooking approachable.",
  },
  {
    id: 7,
    name: "Jasmine Torres",
    profileImage:
      "https://static.vecteezy.com/system/resources/previews/049/005/561/non_2x/profile-shot-of-a-beautiful-young-brunette-with-wind-swept-hair-against-a-white-backdrop-photo.jpg",
    location: "Portland, OR",
    rating: 4.9,
    reviewCount: 47,
    followers: 1800000,
    engagementRate: 4.9,
    platforms: ["instagram", "tiktok"],
    bio: "Sustainable lifestyle and beauty content creator. I focus on eco-friendly products, zero-waste tips, and ethical fashion.",
  },
  {
    id: 8,
    name: "Ryan Thompson",
    profileImage:
      "https://static.vecteezy.com/system/resources/previews/049/005/561/non_2x/profile-shot-of-a-beautiful-young-brunette-with-wind-swept-hair-against-a-white-backdrop-photo.jpg",
    location: "Seattle, WA",
    rating: 4.7,
    reviewCount: 33,
    followers: 1050000,
    engagementRate: 5.4,
    platforms: ["youtube", "instagram"],
    bio: "Tech reviewer and photography expert. I create in-depth product reviews, camera comparisons, and photography tutorials.",
  },
  {
    id: 9,
    name: "Maya Patel",
    profileImage:
      "https://static.vecteezy.com/system/resources/previews/049/005/561/non_2x/profile-shot-of-a-beautiful-young-brunette-with-wind-swept-hair-against-a-white-backdrop-photo.jpg",
    location: "Denver, CO",
    rating: 4.8,
    reviewCount: 39,
    followers: 920000,
    engagementRate: 6.7,
    platforms: ["tiktok", "instagram"],
    bio: "Wellness and mindfulness creator focusing on mental health, yoga, and holistic living. Certified yoga instructor and wellness coach.",
  },
  {
    id: 10,
    name: "Tyler Wilson",
    profileImage:
      "https://static.vecteezy.com/system/resources/previews/049/005/561/non_2x/profile-shot-of-a-beautiful-young-brunette-with-wind-swept-hair-against-a-white-backdrop-photo.jpg",
    location: "Nashville, TN",
    rating: 4.5,
    reviewCount: 27,
    followers: 850000,
    engagementRate: 5.8,
    platforms: ["instagram", "youtube"],
    bio: "Lifestyle and music content creator. I share behind-the-scenes music industry content, lifestyle vlogs, and product reviews focused on audio gear.",
  },
  {
    id: 11,
    name: "Nicole Adams",
    profileImage:
      "https://static.vecteezy.com/system/resources/previews/049/005/561/non_2x/profile-shot-of-a-beautiful-young-brunette-with-wind-swept-hair-against-a-white-backdrop-photo.jpg",
    location: "Boston, MA",
    rating: 4.6,
    reviewCount: 34,
    followers: 1350000,
    engagementRate: 4.5,
    platforms: ["instagram", "tiktok", "youtube"],
    bio: "Beauty and skincare expert specializing in product reviews and tutorials. Licensed esthetician passionate about evidence-based skincare.",
  },
  {
    id: 12,
    name: "Jordan Miller",
    profileImage:
      "https://static.vecteezy.com/system/resources/previews/049/005/561/non_2x/profile-shot-of-a-beautiful-young-brunette-with-wind-swept-hair-against-a-white-backdrop-photo.jpg",
    location: "Atlanta, GA",
    rating: 4.7,
    reviewCount: 41,
    followers: 1600000,
    engagementRate: 3.9,
    platforms: ["tiktok", "instagram"],
    bio: "Fashion and style creator focusing on affordable fashion, styling tips, and trend forecasting. Fashion design background with a keen eye for emerging trends.",
  },
];

// Mock Niche Categories
const mockNicheCategories = [
  {
    id: 1,
    name: "Top in Skincare",
    creators: [
      mockCreators[0],
      mockCreators[2],
      mockCreators[3],
      mockCreators[5],
      mockCreators[10],
      mockCreators[6],
      mockCreators[4],
      mockCreators[8],
      mockCreators[1],
    ],
  },
  {
    id: 2,
    name: "Trending Wellness Creators",
    creators: [
      mockCreators[8],
      mockCreators[3],
      mockCreators[6],
      mockCreators[2],
      mockCreators[10],
      mockCreators[5],
    ],
  },
  {
    id: 3,
    name: "Fashion & Style Experts",
    creators: [
      mockCreators[11],
      mockCreators[1],
      mockCreators[4],
      mockCreators[7],
      mockCreators[0],
      mockCreators[9],
    ],
  },
  {
    id: 4,
    name: "Beauty & Makeup",
    creators: [
      mockCreators[10],
      mockCreators[0],
      mockCreators[6],
      mockCreators[4],
      mockCreators[1],
      mockCreators[8],
    ],
  },
  {
    id: 5,
    name: "Tech & Gadget Reviewers",
    creators: [
      mockCreators[2],
      mockCreators[7],
      mockCreators[5],
      mockCreators[9],
      mockCreators[3],
      mockCreators[10],
    ],
  },
];

// Mock Shortlists
const mockShortlists = [
  {
    id: 1,
    name: "March Moisturizer Campaign",
    creators: [mockCreators[0], mockCreators[10], mockCreators[6]],
  },
  {
    id: 2,
    name: "March Sunscreen Campaign",
    creators: [mockCreators[8], mockCreators[0], mockCreators[4]],
  },
  {
    id: 3,
    name: "March Anti-Aging Campaign",
    creators: [mockCreators[10], mockCreators[6], mockCreators[0]],
  },
  {
    id: 4,
    name: "March Gifted Collabs",
    creators: [mockCreators[1], mockCreators[11], mockCreators[3]],
  },
  {
    id: 5,
    name: "April Potentials",
    creators: [
      mockCreators[1],
      mockCreators[3],
      mockCreators[5],
      mockCreators[9],
      mockCreators[2],
      mockCreators[7],
    ],
  },
];

function useCampaign() {
  const [activeTab, setActiveTab] = useState(1);
  // State for shortlists
  const [shortlists, setShortlists] = useState(mockShortlists);
  const [selectedShortlist, setSelectedShortlist] = useState(null);
  const [isNewShortlistDialogOpen, setIsNewShortlistDialogOpen] = useState(false);
  const [newShortlistName, setNewShortlistName] = useState("");

  // State for creator preview
  const [previewCreator, setPreviewCreator] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // State for shortlist sort option
  const [sortOption, setSortOption] = useState("followers");

  // State for shortlist save modal
  const [saveToShortlistDialogOpen, setSaveToShortlistDialogOpen] = useState(false);
  const [creatorToSave, setCreatorToSave] = useState(null);

  // State for message dialog
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [creatorToMessage, setCreatorToMessage] = useState(null);
  const [messageText, setMessageText] = useState("");

  // Handle navigation tab change
  const handleNavChange = (event, newValue) => {
    setNavValue(newValue);
  };

  // Handle shortlist selection
  const handleShortlistSelect = (shortlist) => {
    setSelectedShortlist(shortlist);
  };

  // Handle new shortlist creation
  const handleCreateShortlist = () => {
    if (newShortlistName.trim()) {
      const newShortlist = {
        id: shortlists.length + 1,
        name: newShortlistName,
        creators: [],
      };
      setShortlists([...shortlists, newShortlist]);
      setNewShortlistName("");
      setIsNewShortlistDialogOpen(false);
    }
  };

  // Handle creator preview
  const handleCreatorPreview = (creator) => {
    setPreviewCreator(creator);
    setIsPreviewOpen(true);
  };

  // Handle adding creator to shortlist
  const handleSaveToShortlist = (creator) => {
    setCreatorToSave(creator);
    setSaveToShortlistDialogOpen(true);
  };

  // Confirm adding creator to selected shortlist
  const confirmSaveToShortlist = (shortlistId) => {
    const updatedShortlists = shortlists.map((shortlist) => {
      if (shortlist.id === shortlistId) {
        // Check if creator is already in shortlist
        if (!shortlist.creators.some((c) => c.id === creatorToSave.id)) {
          return {
            ...shortlist,
            creators: [...shortlist.creators, creatorToSave],
          };
        }
      }
      return shortlist;
    });

    setShortlists(updatedShortlists);
    setSaveToShortlistDialogOpen(false);
  };

  // Handle removing creator from shortlist
  const handleRemoveFromShortlist = (creatorId) => {
    if (!selectedShortlist) return;

    const updatedShortlists = shortlists.map((shortlist) => {
      if (shortlist.id === selectedShortlist.id) {
        return {
          ...shortlist,
          creators: shortlist.creators.filter((creator) => creator.id !== creatorId),
        };
      }
      return shortlist;
    });

    setShortlists(updatedShortlists);

    // Update selected shortlist reference
    const updatedSelectedShortlist = updatedShortlists.find((s) => s.id === selectedShortlist.id);
    setSelectedShortlist(updatedSelectedShortlist);
  };

  // Handle messaging a creator
  const handleMessageCreator = (creator) => {
    setCreatorToMessage(creator);
    setMessageDialogOpen(true);
  };

  // Handle sending a message
  const handleSendMessage = () => {
    // Message sending logic would go here
    setMessageText("");
    setMessageDialogOpen(false);
  };

  // Sort creators in the selected shortlist
  const getSortedCreators = () => {
    if (!selectedShortlist) return [];

    return [...selectedShortlist.creators].sort((a, b) => {
      switch (sortOption) {
        case "followers":
          return b.followers - a.followers;
        case "rating":
          return b.rating - a.rating;
        case "reviews":
          return b.reviewCount - a.reviewCount;
        case "engagement":
          return b.engagementRate - a.engagementRate;
        default:
          return b.followers - a.followers;
      }
    });
  };

  // Update the selected shortlist when shortlists change
  useEffect(() => {
    if (selectedShortlist) {
      const updatedShortlist = shortlists.find((s) => s.id === selectedShortlist.id);
      setSelectedShortlist(updatedShortlist);
    }
  }, [shortlists]);

  const mainTabs = [
    { id: 1, label: "Discover+" },
    { id: 2, label: "Active" },
    { id: 3, label: "Completed" },
    { id: 4, label: "Applications" },
    { id: 5, label: "Rejected" },
  ];

  const sortOptions = [
    { value: "followers", label: "Follower Count" },
    { value: "rating", label: "Highest Rated" },
    { value: "reviews", label: "Most Reviewed" },
    { value: "engagement", label: "Engagement Rate" },
  ];

  return {
    activeTab,
    setActiveTab,
    shortlists,
    selectedShortlist,
    setSelectedShortlist,
    isNewShortlistDialogOpen,
    setIsNewShortlistDialogOpen,
    newShortlistName,
    setNewShortlistName,
    previewCreator,
    isPreviewOpen,
    setIsPreviewOpen,
    saveToShortlistDialogOpen,
    setSaveToShortlistDialogOpen,
    messageDialogOpen,
    setMessageDialogOpen,
    creatorToMessage,
    messageText,
    setMessageText,
    handleShortlistSelect,
    handleCreateShortlist,
    handleCreatorPreview,
    handleSaveToShortlist,
    confirmSaveToShortlist,
    handleMessageCreator,
    handleSendMessage,
    getSortedCreators,
    mainTabs,
    mockNicheCategories,
    sortOptions,
    handleRemoveFromShortlist,
  };
}

export default useCampaign;
