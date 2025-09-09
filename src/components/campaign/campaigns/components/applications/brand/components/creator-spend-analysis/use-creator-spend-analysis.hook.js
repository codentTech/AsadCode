import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAppliedCreators } from "@/provider/features/campaigns/campaigns.slice";

function useCreatorSpendAnalysis() {
  const dispatch = useDispatch();
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);

  // Get applied creators state from Redux
  const {
    data: appliedCreatorsData,
    isLoading: appliedCreatorsLoading,
    isSuccess: appliedCreatorsSuccess,
    isError: appliedCreatorsError,
  } = useSelector((state) => state.campaigns.getAppliedCreators || {});

  // Function to fetch applied creators for a campaign
  const fetchAppliedCreators = useCallback(
    (campaignId, filters = {}) => {
      if (campaignId) {
        dispatch(getAppliedCreators({ campaignId, filters }));
      }
    },
    [dispatch]
  );

  // Mock creators data for now (will be replaced with real API data)
  const mockCreators = [
    {
      id: 1,
      name: "Sam Waters",
      email: "sam@example.com",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 4.8,
      reviewCount: 127,
      age: "28",
      location: "Los Angeles, CA",
      appliedDate: "2 days ago",
      followers: 125000,
      platforms: {
        instagram: { followers: 85000 },
        tiktok: { followers: 40000 },
      },
      portfolioImages: [
        "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=200&h=200&fit=crop",
        "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=200&h=200&fit=crop",
        "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=200&h=200&fit=crop",
      ],
    },
    {
      id: 2,
      name: "Emma Chen",
      email: "emma@example.com",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 4.9,
      reviewCount: 89,
      age: "24",
      location: "New York, NY",
      appliedDate: "1 day ago",
      followers: 89000,
      platforms: {
        instagram: { followers: 65000 },
        youtube: { followers: 24000 },
      },
      portfolioImages: [
        "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=200&h=200&fit=crop",
        "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=200&h=200&fit=crop",
      ],
    },
    {
      id: 3,
      name: "Alex Rodriguez",
      email: "alex@example.com",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 4.7,
      reviewCount: 156,
      age: "31",
      location: "Miami, FL",
      appliedDate: "3 days ago",
      followers: 210000,
      platforms: {
        instagram: { followers: 150000 },
        tiktok: { followers: 60000 },
      },
      portfolioImages: [
        "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=200&h=200&fit=crop",
        "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=200&h=200&fit=crop",
        "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=200&h=200&fit=crop",
      ],
    },
  ];

  const formatFollowers = (followers) => {
    if (followers >= 1000000) {
      return `${(followers / 1000000).toFixed(1)}M`;
    } else if (followers >= 1000) {
      return `${(followers / 1000).toFixed(0)}K`;
    }
    return followers.toString();
  };

  const getPlatformColor = (platform) => {
    const colors = {
      instagram: "bg-gradient-to-br from-purple-500 to-pink-500",
      tiktok: "bg-black",
      youtube: "bg-red-500",
      facebook: "bg-blue-600",
      twitter: "bg-blue-400",
    };
    return colors[platform] || "bg-gray-100";
  };

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  return {
    creators: mockCreators,
    formatFollowers,
    getPlatformColor,
    messageDialogOpen,
    setMessageDialogOpen,
    open,
    handleOpenModal,
    handleCloseModal,
    appliedCreatorsData,
    appliedCreatorsLoading,
    appliedCreatorsSuccess,
    appliedCreatorsError,
    fetchAppliedCreators,
  };
}

export default useCreatorSpendAnalysis;
