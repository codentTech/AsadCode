import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useCampaignTabBarMobileSlot } from "@/components/campaign-refactored/campaign-tab-bar-mobile-slot.context";
import CreatorSpendAnalysis from "./components/creator-spend-analysis/creator-spend-analysis.component";
import DeliverablesProgress from "./components/deliverables-progress/deliverables-progress.component.jsx";
import RightPaneSkeleton from "../right-pane-skeleton/right-pane-skeleton.component";
import NotFound from "@/common/components/not-found/not-found.component";
import Modal from "@/common/components/modal/modal.component";
import Loading from "@/common/components/loader/loading.component";
import { useSelector } from "react-redux";
import useRejected from "./use-rejected.hook";

function Rejected({ onSwitchToApplications }) {
  const [showShortlistModalForDetails, setShowShortlistModalForDetails] = useState(false);

  const {
    selectedCampaign,
    selectedCreator,
    sortBy,
    mobilePane,
    rejectedCreatorsLoading,
    reinstateLoading,
    rejectedCreatorsData,
    rightPaneState,
    handleCampaignSelect,
    handleCreatorSelectWithPane,
    handleClearCreator,
    handleSortChange,
    handleReinstateCreator,
    handleSaveToShortlist,
    backToRejectedList,
  } = useRejected();

  const tabBarMobileSlot = useCampaignTabBarMobileSlot();
  const registerMobileSlot = tabBarMobileSlot?.registerMobileSlot;
  const clearMobileSlot = tabBarMobileSlot?.clearMobileSlot;

  useEffect(() => {
    if (!registerMobileSlot || !clearMobileSlot) return;
    if (mobilePane !== "detail") {
      clearMobileSlot();
      return;
    }
    registerMobileSlot(
      <button
        type="button"
        onClick={backToRejectedList}
        className="inline-flex min-h-[30px] w-10 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 sm:min-h-8 md:min-h-9"
        aria-label="Back to rejected list"
      >
        <ChevronLeft className="h-4 w-4 text-primary" strokeWidth={2.25} aria-hidden />
      </button>
    );
    return () => {
      clearMobileSlot();
    };
  }, [mobilePane, registerMobileSlot, clearMobileSlot, backToRejectedList]);

  const { data: shortlistsData, isLoading: shortlistsLoading } = useSelector(
    (state) => state.shortlist.getAllShortlists
  );

  const shortlists = Array.isArray(shortlistsData) ? shortlistsData : [];

  const rightColumn = (
    <>
      {rightPaneState.type === "loading" ? (
        <RightPaneSkeleton layout="fluid" />
      ) : rightPaneState.type === "notFound" ? (
        <div className="flex h-full min-h-0 w-full flex-1 flex-col items-center justify-center border-l border-gray-100 bg-gradient-to-b from-gray-50/80 to-white px-4 py-10 md:max-w-md md:flex-[0_1_27%] lg:flex-[0_1_27%]">
          <NotFound title={rightPaneState.title} description={rightPaneState.description} />
        </div>
      ) : (
        <DeliverablesProgress
          selectedCampaign={selectedCampaign}
          selectedCreator={selectedCreator}
          isIndividualCreator={rightPaneState.isIndividualCreator}
          onReinstateCreator={handleReinstateCreator}
          onSaveToShortlistClick={() => setShowShortlistModalForDetails(true)}
          reinstateConfirmLoading={reinstateLoading}
        />
      )}
    </>
  );

  return (
    <>
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50/40 md:flex-row md:items-stretch md:bg-transparent">
        <div
          className={`flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden transition-[opacity,transform] duration-200 ease-out md:h-full md:max-w-none md:flex-[0_1_73%] lg:max-w-none ${
            mobilePane === "detail" ? "hidden md:flex" : "flex"
          }`}
        >
          <CreatorSpendAnalysis
            onCampaignSelect={handleCampaignSelect}
            selectedCampaign={selectedCampaign}
            appliedCreatorsData={rejectedCreatorsData}
            appliedCreatorsLoading={rejectedCreatorsLoading}
            onCreatorSelect={handleCreatorSelectWithPane}
            onClearCreator={handleClearCreator}
            onReinstateCreator={handleReinstateCreator}
            reinstateLoading={reinstateLoading}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            onSaveToShortlist={handleSaveToShortlist}
            onSwitchToApplications={onSwitchToApplications}
          />
        </div>

        <div
          className={`flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-l border-gray-200/80 bg-white shadow-[0_0_24px_-8px_rgba(79,70,229,0.12)] md:h-full md:shadow-none ${
            mobilePane === "list" ? "hidden md:flex md:max-w-md md:flex-[0_1_27%] lg:max-w-lg lg:flex-[0_1_27%]" : "flex"
          }`}
        >
          {rightColumn}
        </div>
      </div>

      <Modal
        title="Save to Shortlist"
        show={showShortlistModalForDetails}
        onClose={() => setShowShortlistModalForDetails(false)}
      >
        <div className="space-y-4">
          {shortlistsLoading ? (
            <div className="text-center py-8">
              <Loading />
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
