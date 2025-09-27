import { useState, useEffect, useMemo } from "react";
import { getUser } from "@/common/utils/users.util";

function Niche({ categories = [], onNicheChange, selectedNiche = "all" }) {
  const [localCategories, setLocalCategories] = useState([]);

  // Memoize categories to prevent unnecessary re-renders
  const memoizedCategories = useMemo(() => categories, [JSON.stringify(categories)]);

  useEffect(() => {
    // If categories are passed as props, use them; otherwise fetch from user data
    if (memoizedCategories && memoizedCategories.length > 0) {
      setLocalCategories(memoizedCategories);
    } else {
      const user = getUser();
      if (user && user.creator_profile && user.creator_profile.categories) {
        setLocalCategories(user.creator_profile.categories);
      } else {
        // Fallback to default categories if no data is available
        setLocalCategories([
          "Beauty",
          "Skincare",
          "Fitness",
          "Fashion",
          "Travel",
          "Food",
          "Finance",
          "Business",
          "Health",
        ]);
      }
    }
  }, [memoizedCategories]);

  const handleNicheClick = (niche) => {
    if (onNicheChange) {
      onNicheChange(niche);
    }
  };

  // Add "All" option at the beginning
  const displayCategories = ["all", ...localCategories];

  // Don't render if no categories available
  if (localCategories.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {displayCategories.map((category) => (
        <button
          key={category}
          onClick={() => handleNicheClick(category)}
          className={`px-2 py-1.5 rounded-lg text-xs border transition-colors ${
            selectedNiche === category
              ? "bg-primary text-white shadow-sm"
              : "bg-white text-gray-700 border border-gray-200 hover:border-primary hover:text-primary"
          }`}
        >
          {category === "all" ? "All Niches" : category}
        </button>
      ))}
    </div>
  );
}

export default Niche;
