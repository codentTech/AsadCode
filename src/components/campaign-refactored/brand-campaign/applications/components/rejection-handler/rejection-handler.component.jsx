import DeleteConfirmationModal from "@/common/components/delete-confirmation-modal/delete-confirmation-modal.component";
import useRejectionHandler from "./use-rejection-handler.hook";

export default function RejectionHandler({
  selectedCreator,
  selectedCampaign,
  showRejectConfirmation,
  setShowRejectConfirmation,
  onRejectSuccess,
}) {
  const { handleConfirmReject, isRejecting } = useRejectionHandler({
    selectedCreator,
    selectedCampaign,
    onRejectSuccess,
  });

  if (!selectedCreator) return null;

  return (
    <DeleteConfirmationModal
      show={showRejectConfirmation}
      onClose={() => setShowRejectConfirmation(false)}
      onConfirm={handleConfirmReject}
      title="Reject Application"
      description={`Are you sure you want to reject ${selectedCreator?.creator ? `${selectedCreator.creator.first_name || ""} ${selectedCreator.creator.last_name || ""}`.trim() : "this creator"}'s application?`}
      confirmText="Reject"
      isLoading={isRejecting}
    />
  );
}
