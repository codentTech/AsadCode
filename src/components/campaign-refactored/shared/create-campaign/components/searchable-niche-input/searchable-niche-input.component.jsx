import React from "react";
import { Search } from "lucide-react";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SelectedTagList from "../selected-tag-list/selected-tag-list.component";
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

  const selectedItems = selectedNiches.map((niche) => ({
    id: niche,
    label: niche,
    value: niche,
  }));

  return (
    <div className="space-y-2">
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
          startIcon={<Search className="h-4 w-4 text-gray-400" />}
        />

        {showSuggestions && filteredNiches.length > 0 && (
          <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
            {filteredNiches.map((niche, index) => (
              <button
                key={index}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNicheSelect(niche.value);
                }}
                className="w-full cursor-pointer px-4 py-2 text-left text-xs text-gray-600 transition-colors hover:bg-gray-50"
              >
                {niche.value}
              </button>
            ))}
          </div>
        )}

        {showSuggestions && filteredNiches.length === 0 && searchTerm.trim() !== "" && (
          <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
            <p className="text-center text-sm text-gray-500">No niches found for &quot;{searchTerm}&quot;</p>
          </div>
        )}
      </div>

      <SelectedTagList
        items={selectedItems}
        onRemove={(item) => handleNicheRemove?.(item.value)}
      />
    </div>
  );
}
