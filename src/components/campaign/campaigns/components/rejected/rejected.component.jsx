import CreatorSpendAnalysis from "./components/creator-spend-analysis/creator-spend-analysis.component";
import DeliverablesProgress from "./components/deliverables-progress/deliverables-progress.component.jsx";
import Loader from "@/common/components/loader/loader.component";
import NotFound from "@/common/components/not-found/not-found.component";
import Modal from "@/common/components/modal/modal.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import { useState } from "react";
import { useSelector } from "react-redux";
import useRejected from "./use-rejected.hook";

function Rejected() {
  const [showShortlistModalForDetails, setShowShortlistModalForDetails] = useState(false);

  const {
    selectedCampaign,
    selectedCreator,
    filters,
    sortBy,
    creators,
    rejectedCreatorsLoading,
    reinstateLoading,
    rejectedCreatorsData,
    handleCampaignSelect,
    handleCreatorSelect,
    handleFilterChange,
    handleClearFilters,
    handleSortChange,
    handleReinstateCreator,
    handleSaveToShortlist,
  } = useRejected();

  const { data: shortlistsData, isLoading: shortlistsLoading } = useSelector(
    (state) => state.shortlist.getAllShortlists
  );

  const shortlists = Array.isArray(shortlistsData) ? shortlistsData : [];

  const renderRightPane = () => {
    if (rejectedCreatorsLoading) {
      return (
        <div className="w-[27%] bg-white flex flex-col border-l h-screen items-center justify-center">
          <Loader loading={true} />
          <p className="text-xs text-gray-500 mt-2">Loading creators...</p>
        </div>
      );
    }

    if (!selectedCampaign) {
      return (
        <div className="w-[27%] bg-transparent flex flex-col border-l h-screen items-center justify-center">
          <NotFound title="No Campaign Selected" description="Select a campaign to view details." />
        </div>
      );
    }

    if (selectedCampaign && creators.length === 0) {
      return (
        <div className="w-[27%] bg-transparent flex flex-col border-l h-screen items-center justify-center">
          <NotFound
            title="No Rejected Creators"
            description="No rejected creators found for this campaign."
          />
        </div>
      );
    }

    return (
      <DeliverablesProgress
        selectedCampaign={selectedCampaign}
        selectedCreator={selectedCreator}
        onReinstateClick={() =>
          handleReinstateCreator(selectedCampaign.id, selectedCreator.creator.id)
        }
        onViewNotesClick={() => {}}
        onSaveToShortlistClick={() => setShowShortlistModalForDetails(true)}
      />
    );
  };

  return (
    <>
      <div className="relative flex">
        <CreatorSpendAnalysis
          onCampaignSelect={handleCampaignSelect}
          selectedCampaign={selectedCampaign}
          selectedCreator={selectedCreator}
          appliedCreatorsData={rejectedCreatorsData}
          appliedCreatorsLoading={rejectedCreatorsLoading}
          onCreatorSelect={handleCreatorSelect}
          onReinstateCreator={handleReinstateCreator}
          reinstateLoading={reinstateLoading}
          filters={filters}
          sortBy={sortBy}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onSortChange={handleSortChange}
          onSaveToShortlist={handleSaveToShortlist}
        />

        {renderRightPane()}
      </div>

      {/* Shortlist Modal for Details Panel */}
      <Modal
        title="Save to Shortlist"
        show={showShortlistModalForDetails}
        onClose={() => setShowShortlistModalForDetails(false)}
      >
        <div className="space-y-4">
          {shortlistsLoading ? (
            <div className="text-center py-8">
              <Loader loading={true} />
              <p className="text-sm text-gray-500 mt-2">Loading shortlists...</p>
            </div>
          ) : shortlists.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-2">No shortlists available</p>
              <p className="text-sm text-gray-500">Create a shortlist first to save creators</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600">
                Select a shortlist to save {selectedCreator?.creator?.first_name || "this creator"}:
              </p>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {shortlists.map((shortlist) => (
                  <button
                    key={shortlist.id}
                    onClick={() => {
                      handleSaveToShortlist(selectedCreator.creator, shortlist.id);
                      setShowShortlistModalForDetails(false);
                    }}
                    className="w-full p-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-indigo-50 transition-all text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{shortlist.name}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {shortlist.user_count || 0} creator
                        {(shortlist.user_count || 0) !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}

export default Rejected;
