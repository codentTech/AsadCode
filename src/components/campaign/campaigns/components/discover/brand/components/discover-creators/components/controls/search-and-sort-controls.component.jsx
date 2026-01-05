import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import SearchIcon from "@/common/icons/search-icon";
import { SORT_BY_OPTIONS } from "@/common/constants/options.constant";
import { Filter } from "lucide-react";

const SearchAndSortControls = ({
  searchKeyword,
  onSearchChange,
  selectedSort,
  onSortChange,
  onFilterClick,
  onNewCampaignClick,
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-full min-w-[230px] bg-white">
        <CustomInput
          placeholder="Search creators"
          value={searchKeyword}
          startIcon={<SearchIcon />}
          onChange={onSearchChange}
        />
      </div>

      <div className="w-full min-w-[230px]">
        <SimpleSelect
          placeHolder="Sort by"
          options={SORT_BY_OPTIONS}
          onChange={(opt) => onSortChange(opt?.value || "")}
        />
      </div>

      <div className="relative">
        <CustomButton
          text="Filters"
          onClick={onFilterClick}
          startIcon={<Filter size={18} />}
          className="btn-outline !h-10"
        />
      </div>

      <div className="w-full max-w-[200px]">
        <CustomButton
          text="Start a new campaign"
          onClick={onNewCampaignClick}
          className="btn-primary !h-10"
        />
      </div>
    </div>
  );
};

export default SearchAndSortControls;

