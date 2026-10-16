"use client";

import PropTypes from "prop-types";
import { X } from "lucide-react";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import {
  CONTENT_LIBRARY_MEDIA_TYPE_OPTIONS,
  CONTENT_LIBRARY_RIGHTS_OPTIONS,
  CONTENT_LIBRARY_STATE_OPTIONS,
} from "@/common/constants/content-library.constant";

export default function FilterPanel({
  draftFilters,
  filterOptions,
  onChange,
  onClear,
  onApply,
  onClose,
}) {
  const creatorOptions = [
    { label: "All creators", value: "" },
    ...((filterOptions?.creators || []).map((item) => ({
      label: item.name,
      value: item.id,
    })) || []),
  ];

  const campaignOptions = [
    { label: "All campaigns", value: "" },
    ...((filterOptions?.campaigns || []).map((item) => ({
      label: item.name,
      value: item.id,
    })) || []),
  ];

  const productOptions = [
    { label: "All products", value: "" },
    ...((filterOptions?.products || []).map((name) => ({
      label: name,
      value: name,
    })) || []),
  ];

  return (
    <aside className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-white">
      <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-900">Filter content</h3>
        <button
          type="button"
          aria-label="Close filters"
          onClick={onClose}
          className="grid h-8 w-8 place-items-center rounded-lg text-gray-500 hover:bg-gray-50"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4">
        <SimpleSelect
          label="Creator"
          placeHolder="All creators"
          options={creatorOptions}
          value={draftFilters.creatorId || ""}
          onChange={(opt) => onChange("creatorId", opt)}
        />
        <SimpleSelect
          label="Campaign"
          placeHolder="All campaigns"
          options={campaignOptions}
          value={draftFilters.campaignId || ""}
          onChange={(opt) => onChange("campaignId", opt)}
        />
        <SimpleSelect
          label="Product"
          placeHolder="All products"
          options={productOptions}
          value={draftFilters.productName || ""}
          onChange={(opt) => onChange("productName", opt)}
        />
        <SimpleSelect
          label="Media type"
          placeHolder="All media types"
          options={CONTENT_LIBRARY_MEDIA_TYPE_OPTIONS}
          value={draftFilters.contentType || ""}
          onChange={(opt) => onChange("contentType", opt)}
        />
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">
            Approval date from
          </label>
          <CustomInput
            type="date"
            value={draftFilters.approvedFrom || ""}
            onChange={(event) => onChange("approvedFrom", event.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">
            Approval date to
          </label>
          <CustomInput
            type="date"
            value={draftFilters.approvedTo || ""}
            onChange={(event) => onChange("approvedTo", event.target.value)}
          />
        </div>
        <SimpleSelect
          label="Usage rights"
          placeHolder="Any status"
          options={CONTENT_LIBRARY_RIGHTS_OPTIONS}
          value={draftFilters.rightsStatus || ""}
          onChange={(opt) => onChange("rightsStatus", opt)}
        />
        <SimpleSelect
          label="Library state"
          placeHolder="Active"
          options={CONTENT_LIBRARY_STATE_OPTIONS}
          value={draftFilters.libraryStatus || "active"}
          onChange={(opt) => onChange("libraryStatus", opt)}
        />
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-2 border-t border-gray-100 px-4 py-3">
        <CustomButton text="Clear all" className="btn-outline w-full" onClick={onClear} />
        <CustomButton text="Apply filters" className="btn-primary w-full" onClick={onApply} />
      </div>
    </aside>
  );
}

FilterPanel.propTypes = {
  draftFilters: PropTypes.object.isRequired,
  filterOptions: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

FilterPanel.defaultProps = {
  filterOptions: null,
};
