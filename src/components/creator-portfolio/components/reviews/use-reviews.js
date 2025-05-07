import { avatar } from "@/common/constants/auth.constant";
import { useState } from "react";

const reviews = [
  {
    id: 1,
    brand: "FashionBrand",
    logo: avatar,
    rating: 5,
    text: "Sophia was amazing to work with! Her content exceeded expectations and drove significant engagement for our campaign.",
    date: "Apr 12, 2025",
  },
  {
    id: 2,
    brand: "GlowCo",
    logo: avatar,
    rating: 5,
    text: "Professional, creative and delivered on time. The UGC Sophia created converted extremely well for our skincare line.",
    date: "Mar 29, 2025",
  },
  {
    id: 3,
    brand: "WellnessBrand",
    logo: avatar,
    rating: 4,
    text: "Great to work with and very responsive. Would definitely collaborate again on future campaigns.",
    date: "Feb 15, 2025",
  },
  {
    id: 4,
    brand: "KaiBrand",
    logo: avatar,
    rating: 5,
    text: "Great to work with and very responsive. Would definitely collaborate again on future campaigns.",
    date: "Dec 15, 2025",
  },
  {
    id: 5,
    brand: "Gavasaki",
    logo: avatar,
    rating: 2,
    text: "Great to work with and very responsive. Would definitely collaborate again on future campaigns.",
    date: "Feb 1, 2025",
  },
];

function useReviews() {
  const [reviewSort, setReviewSort] = useState("newest");

  const options = [
    { label: "Newest First", value: "newest" },
    { label: "Highest Rating", value: "highest" },
    { label: "Lowest Rating", value: "lowest" },
  ];

  // Sort reviews based on selected option
  const sortedReviews = [...reviews].sort((a, b) => {
    if (reviewSort === "newest") {
      return new Date(b.date) - new Date(a.date);
    } else if (reviewSort === "highest") {
      return b.rating - a.rating;
    } else {
      return a.rating - b.rating;
    }
  });

  return {
    setReviewSort,
    options,
    sortedReviews,
  };
}

export default useReviews;
