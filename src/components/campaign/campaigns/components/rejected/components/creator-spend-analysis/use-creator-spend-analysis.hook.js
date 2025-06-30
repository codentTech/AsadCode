export const useCreatorSpendAnalysis = () => {
  const creators = [
    {
      id: 1,
      name: "Sarah Martinez",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      location: "Los Angeles, CA",
      totalSpent: "12,500",
      rating: 4.9,
      reviewCount: 47,
      platforms: {
        instagram: { followers: 285000, verified: true },
        youtube: { followers: 95000, verified: true },
        twitter: { followers: 42000, verified: false },
      },
      followers: "10000",
      applicationDate: "2024-05-15",
      rejectedDate: "2024-05-18",
      portfolioImages: [
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1515688594390-b649af70d282?w=400&h=300&fit=crop",
      ],
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
      applicationDate: "2024-05-15",
      followers: "10000",
      rejectedDate: "2024-05-18",
      portfolioImages: [
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1515688594390-b649af70d282?w=400&h=300&fit=crop",
      ],
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
      applicationDate: "2024-05-15",
      followers: "10000",
      rejectedDate: "2024-05-18",
      portfolioImages: [
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1515688594390-b649af70d282?w=400&h=300&fit=crop",
      ],
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
      applicationDate: "2024-05-15",
      followers: "10000",
      rejectedDate: "2024-05-18",
      portfolioImages: [
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1515688594390-b649af70d282?w=400&h=300&fit=crop",
      ],
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
      applicationDate: "2024-05-15",
      followers: "10000",
      rejectedDate: "2024-05-18",
      portfolioImages: [
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1515688594390-b649af70d282?w=400&h=300&fit=crop",
      ],
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
      applicationDate: "2024-05-15",
      followers: "10000",
      rejectedDate: "2024-05-18",
      portfolioImages: [
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1515688594390-b649af70d282?w=400&h=300&fit=crop",
      ],
    },
  ];

  const formatFollowers = (count) => {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K`;
    return count.toString();
  };

  return {
    creators,
    formatFollowers,
  };
};
