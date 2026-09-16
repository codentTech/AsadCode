import Modal from "@/common/components/modal/modal.component";
import useContractPreviewModal from "./use-contract-preview-modal.hook";

export default function ContractPreviewModal({
  show,
  onClose,
  contractData,
  creatorData,
  campaignData,
  contractId = null,
  customActions = null,
}) {
  const { contractText } = useContractPreviewModal({
    contractData,
    creatorData,
    campaignData,
    contractId,
  });

  return (
    <Modal title="Contract Preview" show={show} onClose={onClose} size="xl" height={true}>
      <div className="flex h-full min-h-0 flex-col gap-3 sm:gap-4">
        <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border border-gray-200 bg-gray-100 p-2.5 sm:p-6">
          <div className="rounded-md bg-white p-3 shadow-sm sm:p-6">
            <div className="contract-content">
              <h2 className="mb-4 text-center text-sm font-bold text-gray-900 sm:mb-6 sm:text-xl">
                CleerCut Collaboration Agreement
              </h2>

              <div className="space-y-3 text-xs leading-relaxed text-gray-800 sm:space-y-4 sm:text-sm">
                {contractText.split("\n\n").map((paragraph, index) => {
                  if (paragraph.trim() === "") return null;

                  if (paragraph.match(/^\d+\.\s+[A-Z]/)) {
                    return (
                      <div key={index} className="mt-4 sm:mt-6">
                        <h3 className="mb-2 text-xs font-semibold text-gray-900 sm:mb-3 sm:text-base">
                          {paragraph.trim()}
                        </h3>
                      </div>
                    );
                  }

                  if (paragraph.includes("•")) {
                    return (
                      <div key={index} className="ml-2 sm:ml-4">
                        <p className="whitespace-pre-line leading-relaxed">{paragraph.trim()}</p>
                      </div>
                    );
                  }

                  return (
                    <p key={index} className="mb-2 whitespace-pre-line leading-relaxed sm:mb-3">
                      {paragraph.trim()}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {customActions ? <div className="sticky bottom-0 z-10">{customActions}</div> : null}
      </div>
    </Modal>
  );
}
