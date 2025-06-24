import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SearchIcon from "@/common/icons/search-icon";
import SidebarLayout from "@/common/layouts/sidebar.layout";
import {
  Briefcase,
  Dumbbell,
  GraduationCap,
  Heart,
  Music,
  Search,
  Smartphone,
  Tag,
  X,
} from "lucide-react";
import { useState } from "react";

const NicheTags = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const nicheCategories = [
    {
      name: "Lifestyle",
      icon: Heart,
      color: "from-pink-500 to-rose-500",
      tags: ["Fashion", "Beauty", "Travel", "Food", "Wellness", "Home Decor"],
    },
    {
      name: "Technology",
      icon: Smartphone,
      color: "from-blue-500 to-cyan-500",
      tags: ["Tech Reviews", "Gaming", "Software", "AI", "Gadgets", "Mobile Apps"],
    },
    {
      name: "Business",
      icon: Briefcase,
      color: "from-green-500 to-emerald-500",
      tags: ["Entrepreneurship", "Marketing", "Finance", "Productivity", "Leadership", "Startups"],
    },
    {
      name: "Health & Fitness",
      icon: Dumbbell,
      color: "from-orange-500 to-red-500",
      tags: ["Fitness", "Nutrition", "Mental Health", "Yoga", "Sports", "Wellness"],
    },
    {
      name: "Education",
      icon: GraduationCap,
      color: "from-purple-500 to-indigo-500",
      tags: ["Online Learning", "Tutorials", "Languages", "Science", "History", "Skills"],
    },
    {
      name: "Entertainment",
      icon: Music,
      color: "from-violet-500 to-purple-500",
      tags: ["Music", "Movies", "TV Shows", "Comedy", "Art", "Photography"],
    },
  ];

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredCategories = nicheCategories
    .map((category) => ({
      ...category,
      tags: category.tags.filter((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
    }))
    .filter((category) => category.tags.length > 0);

  const onSubmit = () => {
    console.log("Selected tags:", selectedTags);
    alert("Profile setup completed successfully!");
  };

  return (
    <SidebarLayout>
      <div className="mx-auto min-h-screen">
        {/* Header */}
        <div className="bg-primary p-4 rounded-lg text-white mb-4">
          <h1 className="text-xl font-bold text-white">Niche Tags</h1>
          <p className="text-sm mt-1">
            Select your brand interests to find the perfect creator matches
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-sm">
              <CustomInput
                type="text"
                placeholder="Search tags..."
                value={searchTerm}
                startIcon={<SearchIcon />}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-800 mb-3">
                Selected Tags ({selectedTags.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className="px-3 py-1.5 bg-primary text-white rounded-full text-xs font-medium cursor-pointer hover:from-indigo-600 hover:to-cyan-600 transition-all duration-200 flex items-center"
                  >
                    {tag}
                    <X className="h-3 w-3 ml-1.5" />
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.name}
                  className="bg-white/60 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center mb-3">
                    <div
                      className={`p-2 rounded-md bg-gradient-to-r ${category.color} text-white mr-3`}
                    >
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-800">{category.name}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                          selectedTags.includes(tag)
                            ? `bg-gradient-to-r ${category.color} text-white shadow-md transform scale-105`
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end">
            <CustomButton text="Save" onClick={onSubmit} className="btn-primary" />
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default NicheTags;
