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
    <div
      className={`flex w-full flex-col gap-2.5 sm:gap-3 lg:flex-row lg:items-center lg:justify-between ${className}`}
    >
      <div className="w-full min-w-0 bg-white lg:max-w-[340px] xl:max-w-[420px]">
        <CustomInput
          placeholder="Search creators"
          value={searchKeyword}
          startIcon={<SearchIcon />}
          onChange={onSearchChange}
        />
      </div>

      <div className="flex w-full flex-wrap items-center gap-2 sm:gap-3 lg:ml-3 lg:w-auto lg:flex-nowrap lg:justify-end">
        <div className="min-w-0 flex-1 basis-full sm:basis-auto sm:min-w-[170px] lg:w-[180px] lg:flex-none">
          <SimpleSelect
            placeHolder="Sort by"
            options={SORT_BY_OPTIONS}
            value={selectedSort}
            onChange={(opt) => onSortChange(opt?.value || "")}
          />
        </div>

        <div className="relative flex-1 sm:flex-none lg:flex-none">
          <CustomButton
            text="Filters"
            onClick={onFilterClick}
            startIcon={<Filter className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />}
            className="btn-outline w-full sm:w-auto sm:min-w-[106px]"
          />
        </div>

        <CustomButton text="Start a new campaign" onClick={onNewCampaignClick} />
      </div>
    </div>
  );
};

export default SearchAndSortControls;
