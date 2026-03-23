import { useEffect, useMemo, useRef, useState } from "react";

export default function useSearchableNicheInput({
  selectedNiches = [],
  onNichesChange,
  placeholder = "Type to search niches",
  handleNicheRemove,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredNiches, setFilteredNiches] = useState([]);
  const inputRef = useRef(null);

  const nicheOptions = useMemo(
    () => [
      // Beauty
      { value: "Beauty", keywords: ["beauty", "makeup", "cosmetics"] },
      { value: "Makeup", keywords: ["makeup", "cosmetics", "beauty", "makeup artistry"] },
      {
        value: "Skincare",
        keywords: ["skincare", "skin", "beauty", "face", "care", "dermatology"],
      },
      { value: "Haircare", keywords: ["haircare", "hair", "beauty", "hair care"] },
      { value: "Fragrance", keywords: ["fragrance", "perfume", "cologne", "scent"] },
      {
        value: "Professional esthetics",
        keywords: ["professional", "esthetics", "aesthetics", "beauty professional"],
      },
      {
        value: "Dermatology content",
        keywords: ["dermatology", "skin", "medical", "dermatologist"],
      },
      { value: "Beauty tutorials", keywords: ["beauty", "tutorials", "makeup", "how to"] },
      {
        value: "Makeup artistry",
        keywords: ["makeup", "artistry", "professional", "makeup artist"],
      },
      { value: "Cosmetic procedures", keywords: ["cosmetic", "procedures", "beauty", "medical"] },
      { value: "Nails", keywords: ["nails", "nail art", "manicure", "pedicure"] },
      { value: "Luxury beauty", keywords: ["luxury", "beauty", "high end", "premium"] },
      { value: "Drugstore beauty", keywords: ["drugstore", "beauty", "affordable", "budget"] },
      { value: "Clean beauty", keywords: ["clean", "beauty", "natural", "organic"] },
      { value: "Anti aging", keywords: ["anti aging", "anti-aging", "aging", "skincare"] },
      { value: "Beauty reviews", keywords: ["beauty", "reviews", "product", "review"] },
      { value: "Beauty hacks", keywords: ["beauty", "hacks", "tips", "tricks"] },
    ],
    []
  );

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredNiches([]);
      return;
    }

    const searchLower = searchTerm.toLowerCase();

    const filtered = nicheOptions.filter((option) => {
      if (selectedNiches.includes(option.value)) return false;

      const valueMatch = option.value.toLowerCase().includes(searchLower);
      const keywordMatch = option.keywords.some((keyword) =>
        keyword.toLowerCase().includes(searchLower)
      );

      return valueMatch || keywordMatch;
    });

    setFilteredNiches(filtered);
  }, [searchTerm, selectedNiches, nicheOptions]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(value.trim() !== "");
  };

  const handleNicheSelect = (niche) => {
    const newNiches = [...selectedNiches, niche];
    onNichesChange(newNiches);
    setSearchTerm("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    if (searchTerm.trim() !== "") setShowSuggestions(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && filteredNiches.length > 0) {
      e.preventDefault();
      handleNicheSelect(filteredNiches[0].value);
    }
  };

  return {
    // props passthrough (view needs these)
    selectedNiches,
    placeholder,
    handleNicheRemove,

    // state
    searchTerm,
    showSuggestions,
    filteredNiches,

    // refs
    inputRef,

    // handlers
    handleInputChange,
    handleNicheSelect,
    handleInputFocus,
    handleKeyPress,
  };
}
