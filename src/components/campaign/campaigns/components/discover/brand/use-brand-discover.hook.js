import React, { useEffect, useState } from "react";

// Mock Creator Data with portfolio images and additional fields
const mockCreators = [
  {
    id: 1,
    name: "Emma Johnson",
    profileImage:
      "https://static.vecteezy.com/system/resources/previews/049/005/561/non_2x/profile-shot-of-a-beautiful-young-brunette-with-wind-swept-hair-against-a-white-backdrop-photo.jpg",
    location: "Los Angeles, CA",
    age: 28,
    rating: 4.8,
    reviewCount: 42,
    followers: 1500000,
    engagementRate: 3.2,
    platforms: ["instagram", "tiktok", "youtube"],
    niches: ["beauty", "lifestyle", "skincare"],
    portfolioImages: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1515688594390-b649af70d282?w=400&h=300&fit=crop",
    ],
    platformStats: {
      instagram: { followers: 800000, engagement: 3.5 },
      tiktok: { followers: 500000, engagement: 4.2 },
      youtube: { followers: 200000, engagement: 2.8 },
    },
    bio: "Lifestyle & beauty content creator with 5+ years experience working with top beauty brands. Specializing in skincare reviews and makeup tutorials.",
  },
  {
    id: 2,
    name: "Alex Rivera",
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    location: "New York, NY",
    age: 25,
    rating: 4.5,
    reviewCount: 37,
    followers: 870000,
    engagementRate: 4.1,
    platforms: ["instagram", "tiktok"],
    niches: ["fashion", "lifestyle", "sustainability"],
    portfolioImages: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop",
    ],
    platformStats: {
      instagram: { followers: 520000, engagement: 4.3 },
      tiktok: { followers: 350000, engagement: 3.9 },
    },
    bio: "Fashion and lifestyle creator focusing on sustainable fashion and urban lifestyle. I love creating authentic content that resonates with Gen Z and millennials.",
  },
  {
    id: 3,
    name: "Sophia Chen",
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    location: "San Francisco, CA",
    age: 30,
    rating: 4.9,
    reviewCount: 56,
    followers: 2100000,
    engagementRate: 5.3,
    platforms: ["youtube", "instagram"],
    niches: ["tech", "lifestyle", "reviews"],
    portfolioImages: [
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
    ],
    platformStats: {
      youtube: { followers: 1200000, engagement: 5.8 },
      instagram: { followers: 900000, engagement: 4.8 },
    },
    bio: "Tech and lifestyle vlogger focusing on product reviews, tech tips, and day-in-the-life content. Engineering background with a passion for explaining complex concepts simply.",
  },
  {
    id: 4,
    name: "Marcus Williams",
    profileImage:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    location: "Austin, TX",
    age: 32,
    rating: 4.7,
    reviewCount: 29,
    followers: 950000,
    engagementRate: 6.2,
    platforms: ["tiktok", "instagram"],
    niches: ["fitness", "wellness", "nutrition"],
    portfolioImages: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    ],
    platformStats: {
      tiktok: { followers: 600000, engagement: 6.8 },
      instagram: { followers: 350000, engagement: 5.6 },
    },
    bio: "Fitness and wellness creator specialized in home workouts and nutrition advice. Former personal trainer with a mission to make fitness accessible to everyone.",
  },
  {
    id: 5,
    name: "Olivia Parker",
    profileImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    location: "Miami, FL",
    age: 27,
    rating: 4.6,
    reviewCount: 31,
    followers: 1200000,
    engagementRate: 3.8,
    platforms: ["instagram", "youtube"],
    niches: ["travel", "lifestyle", "luxury"],
    portfolioImages: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    ],
    platformStats: {
      instagram: { followers: 800000, engagement: 4.1 },
      youtube: { followers: 400000, engagement: 3.5 },
    },
    bio: "Travel and lifestyle content creator with a focus on luxury experiences and destination guides. I help brands tell their stories through immersive visual content.",
  },
  {
    id: 6,
    name: "David Kim",
    profileImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    location: "Chicago, IL",
    age: 29,
    rating: 4.4,
    reviewCount: 24,
    followers: 780000,
    engagementRate: 7.1,
    platforms: ["tiktok", "instagram", "youtube"],
    niches: ["food", "cooking", "reviews"],
    portfolioImages: [
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
    ],
    platformStats: {
      tiktok: { followers: 400000, engagement: 8.2 },
      instagram: { followers: 280000, engagement: 6.5 },
      youtube: { followers: 100000, engagement: 6.8 },
    },
    bio: "Food creator focusing on restaurant reviews and home cooking tutorials. Culinary school graduate with a passion for making cooking approachable.",
  },
  {
    id: 7,
    name: "Jasmine Torres",
    profileImage:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop",
    location: "Portland, OR",
    age: 26,
    rating: 4.9,
    reviewCount: 47,
    followers: 1800000,
    engagementRate: 4.9,
    platforms: ["instagram", "tiktok"],
    niches: ["sustainability", "beauty", "lifestyle"],
    portfolioImages: [
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
    ],
    platformStats: {
      instagram: { followers: 1100000, engagement: 5.2 },
      tiktok: { followers: 700000, engagement: 4.6 },
    },
    bio: "Sustainable lifestyle and beauty content creator. I focus on eco-friendly products, zero-waste tips, and ethical fashion.",
  },
  {
    id: 8,
    name: "Ryan Thompson",
    profileImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    location: "Seattle, WA",
    age: 31,
    rating: 4.7,
    reviewCount: 33,
    followers: 1050000,
    engagementRate: 5.4,
    platforms: ["youtube", "instagram"],
    niches: ["tech", "photography", "reviews"],
    portfolioImages: [
      "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
    ],
    platformStats: {
      youtube: { followers: 650000, engagement: 6.1 },
      instagram: { followers: 400000, engagement: 4.7 },
    },
    bio: "Tech reviewer and photography expert. I create in-depth product reviews, camera comparisons, and photography tutorials.",
  },
  {
    id: 9,
    name: "Maya Patel",
    profileImage:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    location: "Denver, CO",
    age: 24,
    rating: 4.8,
    reviewCount: 39,
    followers: 920000,
    engagementRate: 6.7,
    platforms: ["tiktok", "instagram"],
    niches: ["wellness", "mindfulness", "yoga"],
    portfolioImages: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    ],
    platformStats: {
      tiktok: { followers: 550000, engagement: 7.2 },
      instagram: { followers: 370000, engagement: 6.2 },
    },
    bio: "Wellness and mindfulness creator focusing on mental health, yoga, and holistic living. Certified yoga instructor and wellness coach.",
  },
  {
    id: 10,
    name: "Tyler Wilson",
    profileImage:
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop",
    location: "Nashville, TN",
    age: 28,
    rating: 4.5,
    reviewCount: 27,
    followers: 850000,
    engagementRate: 5.8,
    platforms: ["instagram", "youtube"],
    niches: ["music", "lifestyle", "entertainment"],
    portfolioImages: [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    ],
    platformStats: {
      instagram: { followers: 500000, engagement: 6.1 },
      youtube: { followers: 350000, engagement: 5.5 },
    },
    bio: "Lifestyle and music content creator. I share behind-the-scenes music industry content, lifestyle vlogs, and product reviews focused on audio gear.",
  },
  {
    id: 11,
    name: "Nicole Adams",
    profileImage:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop",
    location: "Boston, MA",
    age: 30,
    rating: 4.6,
    reviewCount: 34,
    followers: 1350000,
    engagementRate: 4.5,
    platforms: ["instagram", "tiktok", "youtube"],
    niches: ["beauty", "skincare", "wellness"],
    portfolioImages: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    ],
    platformStats: {
      instagram: { followers: 700000, engagement: 4.8 },
      tiktok: { followers: 450000, engagement: 4.5 },
      youtube: { followers: 200000, engagement: 4.2 },
    },
    bio: "Beauty and skincare expert specializing in product reviews and tutorials. Licensed esthetician passionate about evidence-based skincare.",
  },
  {
    id: 12,
    name: "Jordan Miller",
    profileImage:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop",
    location: "Atlanta, GA",
    age: 25,
    rating: 4.7,
    reviewCount: 41,
    followers: 1600000,
    engagementRate: 3.9,
    platforms: ["tiktok", "instagram"],
    niches: ["fashion", "style", "trends"],
    portfolioImages: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop",
    ],
    platformStats: {
      tiktok: { followers: 900000, engagement: 4.2 },
      instagram: { followers: 700000, engagement: 3.6 },
    },
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

function useDiscover() {
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

  // Update the selected shortlist when shortlists change
  useEffect(() => {
    if (selectedShortlist) {
      const updatedShortlist = shortlists.find((s) => s.id === selectedShortlist.id);
      setSelectedShortlist(updatedShortlist);
    }
  }, [shortlists]);

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

  // Handle inviting creator to apply
  const handleInviteToApply = (creator, campaign) => {
    // Invite logic would go here
    console.log(`Inviting ${creator.name} to apply for ${campaign.name}`);
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

  const sortOptions = [
    { value: "followers", label: "Follower Count" },
    { value: "rating", label: "Highest Rated" },
    { value: "reviews", label: "Most Reviewed" },
    { value: "engagement", label: "Engagement Rate" },
  ];

  return {
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
    getSortedCreators,
    mockNicheCategories,
    sortOptions,
    handleRemoveFromShortlist,
    handleSendMessage,
    handleInviteToApply,
  };
}

export default useDiscover;
