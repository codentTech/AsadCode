import { useState } from "react";

export const useCreatorSpendAnalysis = () => {
  const [open, setOpen] = useState(false);
  const [showBrandCalendar, setShowBrandCalendar] = useState(false);
  const [showTaskManager, setShowTaskManager] = useState(false);

  const creators = [
    {
      id: 1,
      name: "Sarah Martinez",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b977?w=150&h=150&fit=crop&crop=face",
      location: "Los Angeles, CA",
      totalSpent: "12,500",
      rating: 4.9,
      reviewCount: 47,
      platforms: {
        instagram: { followers: 285000, verified: true },
        youtube: { followers: 95000, verified: true },
        twitter: { followers: 42000, verified: false },
      },
      projects: 8,
      successRate: 96,
      avgDeliveryTime: "2.3 days",
      specialty: "Fashion & Lifestyle",
      deadline: "On time",
    },
    {
      id: 2,
      name: "Marcus Thompson",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      location: "New York, NY",
      totalSpent: "9,800",
      rating: 4.7,
      reviewCount: 32,
      platforms: {
        instagram: { followers: 150000, verified: true },
        youtube: { followers: 180000, verified: true },
        twitter: { followers: 67000, verified: true },
      },
      projects: 6,
      successRate: 94,
      avgDeliveryTime: "1.8 days",
      specialty: "Tech Reviews",
      deadline: "On time",
    },
    {
      id: 3,
      name: "Emma Chen",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      location: "San Francisco, CA",
      totalSpent: "8,200",
      rating: 4.8,
      reviewCount: 28,
      platforms: {
        instagram: { followers: 92000, verified: false },
        youtube: { followers: 145000, verified: true },
        twitter: { followers: 28000, verified: false },
      },
      projects: 5,
      successRate: 98,
      avgDeliveryTime: "2.1 days",
      specialty: "Beauty & Wellness",
      deadline: "Cancelled",
    },
    {
      id: 4,
      name: "David Rodriguez",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      location: "Miami, FL",
      totalSpent: "6,500",
      rating: 4.6,
      reviewCount: 19,
      platforms: {
        instagram: { followers: 75000, verified: false },
        youtube: { followers: 52000, verified: false },
        twitter: { followers: 15000, verified: false },
      },
      projects: 4,
      successRate: 89,
      avgDeliveryTime: "3.2 days",
      specialty: "Travel & Food",
      deadline: "On time",
    },
    {
      id: 5,
      name: "Jessica Park",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      location: "Austin, TX",
      totalSpent: "4,800",
      rating: 4.9,
      reviewCount: 25,
      platforms: {
        instagram: { followers: 68000, verified: false },
        youtube: { followers: 89000, verified: true },
        twitter: { followers: 22000, verified: false },
      },
      projects: 3,
      successRate: 97,
      avgDeliveryTime: "1.9 days",
      specialty: "Fitness & Health",
      deadline: "On time",
    },
    {
      id: 6,
      name: "Alex Kim",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      location: "Seattle, WA",
      totalSpent: "3,200",
      rating: 4.5,
      reviewCount: 14,
      platforms: {
        instagram: { followers: 45000, verified: false },
        youtube: { followers: 78000, verified: false },
        twitter: { followers: 31000, verified: false },
      },
      projects: 2,
      successRate: 92,
      avgDeliveryTime: "2.8 days",
      specialty: "Gaming & Tech",
      deadline: "Delayed",
    },
  ];

  const formatFollowers = (count) => {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K`;
    return count.toString();
  };

  const getPlatformColor = (platform) => {
    const colors = {
      instagram: "text-pink-600",
      youtube: "text-red-600",
      twitter: "text-blue-600",
    };
    return colors[platform] || "text-gray-600";
  };

  const getSuccessRateColor = (rate) => {
    if (rate >= 95) return "text-green-600 bg-green-50";
    if (rate >= 90) return "text-blue-600 bg-blue-50";
    return "text-orange-600 bg-orange-50";
  };

  const handleOpenModal = () => setOpen(true);

  const handleCloseModal = () => setOpen(false);

  return {
    open,
    creators,
    formatFollowers,
    getPlatformColor,
    getSuccessRateColor,
    handleOpenModal,
    handleCloseModal,
    showBrandCalendar,
    setShowBrandCalendar,
    showTaskManager,
    setShowTaskManager,
  };
};
