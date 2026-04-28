import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import SearchIcon from "@/common/icons/search-icon";
import { SORT_BY_OPTIONS } from "@/common/constants/options.constant";
import { Filter } from "lucide-react";

const SearchAndSortControls = ({
  searchKeyword,
  onSearchChange,
  onSortChange,
  onFilterClick,
  onNewCampaignClick,
  className = "",
}) => {
  return (
    <div
      className={`flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch lg:max-w-[720px] ${className}`}
    >
      <div className="w-full min-w-0 sm:flex-1 sm:min-w-[180px] bg-white">
        <CustomInput
          placeholder="Search creators"
          value={searchKeyword}
          startIcon={<SearchIcon />}
          onChange={onSearchChange}
        />
      </div>

      <div className="w-full min-w-0 sm:flex-1 sm:min-w-[160px]">
        <SimpleSelect
          placeHolder="Sort by"
          options={SORT_BY_OPTIONS}
          onChange={(opt) => onSortChange(opt?.value || "")}
        />
      </div>

      <div className="relative w-full sm:w-auto shrink-0">
        <CustomButton
          text="Filters"
          onClick={onFilterClick}
          startIcon={<Filter className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />}
          className="btn-outline !h-9 sm:!h-10 w-full sm:w-auto !text-xs sm:!text-sm"
        />
      </div>

      <div className="w-full sm:flex-1 sm:min-w-[200px] sm:max-w-xs">
        <CustomButton
          text="Start a new campaign"
          onClick={onNewCampaignClick}
          className="btn-primary !h-9 sm:!h-10 w-full !text-xs sm:!text-sm"
        />
      </div>
    </div>
  );
};

export default SearchAndSortControls;
