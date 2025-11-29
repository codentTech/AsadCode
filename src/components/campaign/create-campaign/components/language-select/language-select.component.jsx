import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import { LANGUAGE_OPTIONS } from "@/common/constants/options.constant";
import CustomButton from "@/common/components/custom-button/custom-button.component";

/**
 * Language Select Component
 *
 * Provides a searchable input with suggestions for single language selection.
 * Similar to SearchableNicheInput but for languages.
 */
function LanguageSelect({
  selectedLanguage = null,
  onLanguageChange,
  placeholder = "Type to search languages...",
  handleLanguageRemove,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredLanguages, setFilteredLanguages] = useState([]);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Filter languages based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredLanguages(LANGUAGE_OPTIONS.slice(0, 10));
      return;
    }

    const normalized = searchTerm.toLowerCase();
    const filtered = LANGUAGE_OPTIONS.filter(
      (option) =>
        option.label.toLowerCase().includes(normalized) ||
        option.value.toLowerCase().includes(normalized)
    );
    setFilteredLanguages(filtered.slice(0, 10));
  }, [searchTerm]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleLanguageSelect = (language) => {
    if (onLanguageChange) {
      onLanguageChange(language.value);
    }
    setSearchTerm("");
    setShowSuggestions(false);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (handleLanguageRemove && selectedLanguage) {
      handleLanguageRemove(selectedLanguage);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative" ref={inputRef}>
        <CustomInput
          name="language_search"
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          startIcon={<Search className="w-4 h-4 text-gray-400" />}
        />

        {showSuggestions && filteredLanguages.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg"
          >
            {filteredLanguages.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleLanguageSelect(option)}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Language Display */}
      {selectedLanguage && (
        <div className="space-y-1">
          <h5 className="text-xs font-semibold text-gray-600">Selected:</h5>
          <div className="flex flex-wrap gap-1">
            <span className="inline-flex items-center gap-1 px-2 bg-gray-100 text-gray-600 text-xs rounded-lg border border-primary">
              {LANGUAGE_OPTIONS.find((opt) => opt.value === selectedLanguage)?.label ||
                selectedLanguage}
              {handleLanguageRemove && (
                <CustomButton
                  text=""
                  onClick={() => {
                    const updatedLanguages = filters.languages.filter((l) => l !== language);
                    onFiltersChange({ ...filters, languages: updatedLanguages });
                  }}
                  className="hover:bg-white hover:bg-opacity-20 rounded-lg p-0.5 transition-colors bg-transparent shadow-none min-w-0"
                  startIcon={<X className="text-black w-3 h-3 ml-4" />}
                />
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default LanguageSelect;
