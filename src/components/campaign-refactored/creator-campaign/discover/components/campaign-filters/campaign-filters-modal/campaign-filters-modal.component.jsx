import CustomButton from "@/common/components/custom-button/custom-button.component";
import Modal from "@/common/components/modal/modal.component";
import CampaignFiltersForm from "../campaign-filters-form/campaign-filters-form.component";
import useCampaignFiltersModal from "./use-campaign-filters-modal.hook";

function CampaignFiltersModal({
  show,
  onClose,
  filters,
  setFilters,
  expandedFilters,
  toggleFilter,
  resetFilters,
  onDone,
  isLoading,
}) {
  const { draftFilters, setDraftFilters, handleDone, handleCancel, handleClearAll } =
    useCampaignFiltersModal({
      show,
      filters,
      setFilters,
      resetFilters,
      onDone,
      onClose,
    });

  return (
    <Modal title="Campaign Filters" show={show} onClose={handleCancel} size="lg">
      <div className="max-h-[min(70vh,36rem)] overflow-y-auto">
        <CampaignFiltersForm
          filters={draftFilters}
          setFilters={setDraftFilters}
          expandedFilters={expandedFilters}
          toggleFilter={toggleFilter}
        />
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
        <CustomButton
          onClick={handleClearAll}
          text="Clear All"
          className="btn-cancel w-full sm:w-auto"
          disabled={isLoading}
        />
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-3">
          <CustomButton onClick={handleCancel} text="Cancel" className="btn-cancel" />
          <CustomButton
            onClick={handleDone}
            text="Done"
            className="btn-primary"
            loading={isLoading}
            disabled={isLoading}
          />
        </div>
      </div>
    </Modal>
  );
}

export default CampaignFiltersModal;
