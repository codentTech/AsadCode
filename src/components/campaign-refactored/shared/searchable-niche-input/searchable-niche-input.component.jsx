import React from "react";
import { Search, Trash2 } from "lucide-react";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import useSearchableNicheInput from "./use-searchable-input.hook";

export default function SearchableNicheInput(props) {
  const {
    selectedNiches,
    placeholder,
    handleNicheRemove,

    searchTerm,
    showSuggestions,
    filteredNiches,

    inputRef,

    handleInputChange,
    handleNicheSelect,
    handleInputFocus,
    handleKeyPress,
  } = useSearchableNicheInput(props);

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
            {filteredNiches.map((niche, index) => (
              <button
                key={index}
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

      {/* Selected Niches */}
      {selectedNiches.length > 0 && (
        <div className="space-y-1">
          <h5 className="text-xs font-semibold text-gray-600">Selected:</h5>
          <div className="flex flex-wrap gap-1">
            {selectedNiches.map((niche, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 p-2 bg-gray-100 text-gray-600 text-xs rounded-lg border border-primary"
              >
                {niche}
                {handleNicheRemove && (
                  <Trash2
                    className="h-3 w-3 shrink-0 cursor-pointer text-gray-500 hover:text-red-600"
                    onClick={() => handleNicheRemove(niche)}
                    aria-label={`Remove ${niche}`}
                  />
                )}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
