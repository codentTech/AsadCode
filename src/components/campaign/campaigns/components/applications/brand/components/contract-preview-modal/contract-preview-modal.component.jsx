import Modal from "@/common/components/modal/modal.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";

export default function ContractPreviewModal({
  show,
  onClose,
  contractData,
  creatorData,
  campaignData,
}) {
  const generateContractText = () => {
    // This will be replaced with actual template engine
    return `
CleerCut Collaboration Agreement

This Creator Collaboration Agreement ("Agreement") is entered into as of ${contractData.startDate}, by and between ${campaignData.brandName} ("Brand") and ${creatorData.name} ("Creator"), collectively referred to as the "Parties."

This Agreement governs the scope, terms, and compensation for the Creator's participation in the ${contractData.campaignTitle} campaign.

1. Scope of Work
The Creator agrees to produce and publish the following deliverables: ${contractData.contentFormat}. All content must comply with the creative direction, tone, and brand messaging as outlined in the campaign brief.

All deliverables must be completed and posted by ${contractData.completionDeadline}. The Creator is permitted up to ${contractData.revisionsLimit} revision(s) if requested by the Brand.

2. Compensation
The Brand agrees to compensate the Creator as follows:
- Compensation Type: ${contractData.compensationType}
- Amount: ${contractData.compensationType === "fixed" ? "$" + contractData.totalCompensation : contractData.compensationType === "commission" ? contractData.totalCompensation + "% per sale" : "Product only (no monetary compensation)"}

3. Usage Rights and Exclusivity
- Usage Rights: ${contractData.usageRights}
- Exclusivity: ${contractData.exclusivityClause === "none" ? "None" : contractData.exclusivityClause + " months"}

4. Content Requirements
The Creator agrees to comply with the content requirements outlined in the campaign brief, including:
- Required hashtags: ${campaignData.hashtags || "TBD"}
- Required brand mentions: ${campaignData.mentions || "TBD"}

5. Agreement and Signatures
By clicking "Agree & Accept Contract," both parties acknowledge and agree to the terms herein.

Contract ID: ${contractData.contractId}
Date: ${new Date().toLocaleDateString()}
    `;
  };

  return (
    <Modal title="Contract Preview" show={show} onClose={onClose} size="lg">
      <div className="space-y-4">
        <div className="max-h-96 overflow-y-auto">
          <pre className="whitespace-pre-wrap text-sm">{generateContractText()}</pre>
        </div>

        <div className="flex justify-end gap-3">
          <CustomButton
            text="Save Draft"
            className="btn-outline"
            onClick={() => console.log("Save draft")}
          />
          <CustomButton
            text="Send Offer"
            className="btn-primary"
            onClick={() => console.log("Send offer")}
          />
        </div>
      </div>
    </Modal>
  );
}
