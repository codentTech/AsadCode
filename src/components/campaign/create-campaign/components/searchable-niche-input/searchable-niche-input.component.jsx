import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";

/**
 * Searchable Niche Input Component
 *
 * Provides a searchable input with suggestions for niche selection.
 * Shows suggestions as user types (e.g., typing 'ski' shows 'skincare').
 */
function SearchableNicheInput({
  selectedNiches = [],
  onNichesChange,
  placeholder = "Type to search niches",
  handleNicheRemove,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredNiches, setFilteredNiches] = useState([]);
  const inputRef = useRef(null);

  // Available niche options with search keywords
  const nicheOptions = [
    { value: "Beauty", keywords: ["beauty", "makeup", "cosmetics", "skincare", "skin"] },
    { value: "Skincare", keywords: ["skincare", "skin", "beauty", "face", "care"] },
    { value: "Fitness", keywords: ["fitness", "workout", "gym", "exercise", "health"] },
    { value: "Fashion", keywords: ["fashion", "style", "clothing", "outfit", "dress"] },
    { value: "Travel", keywords: ["travel", "trip", "vacation", "destination", "wanderlust"] },
    { value: "Food", keywords: ["food", "cooking", "recipe", "cuisine", "dining"] },
    { value: "Finance", keywords: ["finance", "money", "investment", "budget", "financial"] },
    { value: "Business", keywords: ["business", "entrepreneur", "startup", "corporate"] },
    { value: "Health", keywords: ["health", "wellness", "medical", "healthy", "lifestyle"] },
    { value: "Technology", keywords: ["tech", "technology", "gadgets", "digital", "innovation"] },
    { value: "Gaming", keywords: ["gaming", "games", "esports", "gamer", "play"] },
    { value: "Sports", keywords: ["sports", "athlete", "team", "competition", "athletic"] },
    { value: "Music", keywords: ["music", "musician", "song", "artist", "concert"] },
    { value: "Art", keywords: ["art", "artist", "creative", "design", "painting"] },
    {
      value: "Photography",
      keywords: ["photography", "photo", "camera", "photographer", "visual"],
    },
    { value: "Education", keywords: ["education", "learning", "school", "student", "academic"] },
    { value: "Parenting", keywords: ["parenting", "family", "kids", "children", "mom", "dad"] },
    { value: "Home", keywords: ["home", "interior", "decor", "house", "living"] },
    { value: "Automotive", keywords: ["car", "automotive", "vehicle", "driving", "auto"] },
    { value: "Pet", keywords: ["pet", "dog", "cat", "animal", "pets"] },
  ];

  // Filter niches based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredNiches([]);
      return;
    }

    const filtered = nicheOptions.filter((option) => {
      // Check if already selected
      if (selectedNiches.includes(option.value)) {
        return false;
      }

      // Check if search term matches value or keywords
      const searchLower = searchTerm.toLowerCase();
      const valueMatch = option.value.toLowerCase().includes(searchLower);
      const keywordMatch = option.keywords.some((keyword) =>
        keyword.toLowerCase().includes(searchLower)
      );

      return valueMatch || keywordMatch;
    });

    setFilteredNiches(filtered);
  }, [searchTerm, selectedNiches]);

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(value.trim() !== "");
  };

  // Handle niche selection
  const handleNicheSelect = (niche) => {
    const newNiches = [...selectedNiches, niche];
    onNichesChange(newNiches);
    setSearchTerm("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (searchTerm.trim() !== "") {
      setShowSuggestions(true);
    }
  };

  // Handle input blur (with delay to allow clicking suggestions)
  const handleInputBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 300);
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && filteredNiches.length > 0) {
      e.preventDefault();
      handleNicheSelect(filteredNiches[0].value);
    }
  };

  return (
    <div className="space-y-2">
      {/* Search Input */}
      <div className="relative">
        <CustomInput
          label="Select Niche(s) *"
          customRef={inputRef}
          name="nicheSearch"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          startIcon={<Search className="w-4 h-4 text-gray-400" />}
        />

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredNiches.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredNiches.map((niche) => (
              <button
                key={niche.value}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNicheSelect(niche.value);
                }}
                className="w-full text-left text-xs px-4 py-2 text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                {niche.value}
              </button>
            ))}
          </div>
        )}

        {/* No suggestions message */}
        {showSuggestions && filteredNiches.length === 0 && searchTerm.trim() !== "" && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
            <p className="text-sm text-gray-500 text-center">No niches found for "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchableNicheInput;
