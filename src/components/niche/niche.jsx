"use client";

import { useState, useEffect, useMemo } from "react";
import { getUser } from "@/common/utils/users.util";

function toCategoryLabel(category) {
  if (typeof category === "string" || typeof category === "number") {
    return String(category);
  }
  if (category && typeof category === "object") {
    return (
      category.name ||
      category.label ||
      category.title ||
      category.id ||
      ""
    );
  }
  return "";
}

function Niche({ categories = [], onNicheChange, selectedNiche = null }) {
  const [localCategories, setLocalCategories] = useState([]);

  const categoriesKey = useMemo(() => {
    if (!Array.isArray(categories) || categories.length === 0) return "";
    return categories.map(toCategoryLabel).filter(Boolean).join("\0");
  }, [categories]);

  useEffect(() => {
    if (categoriesKey) {
      setLocalCategories(categoriesKey.split("\0"));
      return;
    }

    const user = getUser();
    if (user?.creator_profile?.categories) {
      const fromUser = (Array.isArray(user.creator_profile.categories)
        ? user.creator_profile.categories
        : []
      )
        .map(toCategoryLabel)
        .filter(Boolean);
      if (fromUser.length > 0) {
        setLocalCategories(fromUser);
        return;
      }
    }

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
  }, [categoriesKey]);

  const handleNicheClick = (niche) => {
    if (onNicheChange) {
      onNicheChange(niche);
    }
  };

  if (localCategories.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {localCategories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => handleNicheClick(category)}
          className={`px-2 py-1.5 rounded-lg text-xs border transition-colors ${
            selectedNiche === category
              ? "bg-primary text-white shadow-sm"
              : "bg-white border border-primary text-gray-700 hover:border-primary hover:text-primary"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default Niche;
