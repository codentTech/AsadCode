import { avatar } from "@/common/constants/auth.constant";
import React, { useState } from "react";

const portfolioItems = [
  {
    id: 1,
    image: avatar,
    caption: "Summer Collection with @FashionBrand",
    type: "video",
  },
  {
    id: 2,
    image: avatar,
    caption: "Skincare Routine with @GlowCo",
    type: "image",
  },
  {
    id: 3,
    image: avatar,
    caption: "Travel Diary: Barcelona Edition",
    type: "video",
  },
  {
    id: 4,
    image: avatar,
    caption: "Sustainable Fashion Haul",
    type: "video",
  },
  {
    id: 5,
    image: avatar,
    caption: "Morning Routine Partnership with @WellnessBrand",
    type: "image",
  },
  {
    id: 6,
    image: avatar,
    caption: "Home Decor Tips",
    type: "image",
  },
  {
    id: 7,
    image: avatar,
    caption: "Fitness Challenge with @ActiveWear",
    type: "video",
  },
  {
    id: 8,
    image: avatar,
    caption: "Makeup Tutorial Collab",
    type: "video",
  },
  {
    id: 9,
    image: avatar,
    caption: "Healthy Recipes with @OrganicFoods",
    type: "image",
  },
  {
    id: 10,
    image: avatar,
    caption: "Weekend Getaway",
    type: "video",
  },
];

function useGallary() {
  const [activeTab, setActiveTab] = useState("all");

  // Filter portfolio items based on active tab
  const filteredPortfolio =
    activeTab === "all"
      ? portfolioItems
      : portfolioItems.filter((item) => item.type === activeTab);

  return { activeTab, setActiveTab, filteredPortfolio, portfolioItems };
}

export default useGallary;
