import { useState } from "react";

function Niche() {
  const [activeCategory, setActiveCategory] = useState("Skincare");
  const categories = [
    "Beauty",
    "Skincare",
    "Fitness",
    "Fashion",
    "Travel",
    "Food",
    "Finance",
    "Business",
    "Health",
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={`px-2 py-1.5 rounded-lg text-xs border ${
            activeCategory === category
              ? "bg-primary text-white shadow-sm"
              : "bg-white text-gray-700 border border-gray-200 hover:border-primary hover:text-primary"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default Niche;
