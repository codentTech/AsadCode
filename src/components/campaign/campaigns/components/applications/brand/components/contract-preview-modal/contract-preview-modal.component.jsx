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
    // Generate contract using the complete template from the document
    return `This Creator Collaboration Agreement ("Agreement") is entered into as of ${contractData.startDate || "[enter date]"}, by and between ${campaignData?.brandName || "[enter brand name]"} ("Brand") and ${creatorData?.name || "[enter creator name]"} ("Creator"), collectively referred to as the "Parties."

This Agreement governs the scope, terms, and compensation for the Creator's participation in the ${contractData.campaignTitle || campaignData?.title || "[enter campaign title]"} campaign.

1. Scope of Work

The Creator agrees to produce and publish the following deliverables: ${contractData.contentFormat || "[enter deliverables]"} in accordance with the creative direction, tone, and brand messaging outlined in the campaign brief.

All deliverables must be completed and published by ${contractData.completionDeadline || "[enter deadline]"} on the agreed-upon platforms. The Creator is permitted up to ${contractData.revisionsLimit || 2} reasonable revision(s), provided the Brand delivers feedback within a reasonable timeframe.

2. Compensation

The Brand agrees to compensate the Creator as follows:
• Compensation Type: ${contractData.compensationType || "Fixed"}
• Amount:
  ${
    contractData.compensationType === "fixed"
      ? `○ If Fixed: $${contractData.totalCompensation || "[enter amount]"}`
      : contractData.compensationType === "commission"
        ? `○ If Commission-Based: ${contractData.totalCompensation || "[enter rate]"}% per sale`
        : "○ If Gifted: Product only (no monetary compensation)"
  }

${
  contractData.compensationType === "commission"
    ? `For commission-based campaigns, the product price is $[ProductPrice], resulting in a per-sale payout of $[CreatorPayoutPerSale].`
    : ""
}

Payment will be processed via CleerCut's payment system within five (5) business days of final approval of all deliverables, subject to compliance with this Agreement.

3. Usage Rights and Exclusivity

The Creator grants the Brand the following rights to:
• Usage Rights: ${contractData.usageRights || "No usage"}
• Exclusivity: ${contractData.exclusivityClause === "none" ? "None" : contractData.exclusivityClause ? contractData.exclusivityClause + " months" : "None"}

During any exclusivity period, the Creator shall not promote directly competing brands in the same product or service category.

4. Content Requirements

The Creator agrees to comply with the content requirements provided in the campaign brief, including but not limited to:
• Required Hashtags: ${campaignData?.hashtags || "[enter hashtags]"}
• Required Mentions/Tags: ${campaignData?.mentions || "[enter mentions]"}
• Creative Direction, Tone, and Messaging: As outlined in the brief.

Collaboration Tagging:
The Creator agrees to tag both CleerCut (@cleercut) and the Brand as collaborators using any native platform features (e.g., Instagram "Invite Collaborator"). Failure to do so may result in delayed or withheld payment.

5. Payment Conditions and Approval

The Brand shall review and approve the submitted deliverables within five (5) business days of submission. If the Brand does not mark the campaign complete or raise a written dispute within this timeframe, funds will automatically be released to the Creator.

In cases of non-compliance with deliverables or deadlines, CleerCut reserves the right to withhold or adjust payment following review.

6. Eligibility Confirmation

By accepting this Agreement, the Creator confirms that they met all eligibility criteria at the time of application, including but not limited to:
• In-person content requirements: ${contractData.inPersonRequired || "[enter requirement]"}
• Geographic requirements: ${contractData.eligibleCountry || "[enter country]"}
• Language requirements: ${contractData.language || "[enter language]"}

The Creator warrants that all eligibility information provided is accurate and complete.

7. Cancellation and Dispute Resolution

The paying party may cancel this Agreement without penalty within five (5) business days of contract acceptance, provided that no substantive work meeting the campaign requirements has been submitted by the Creator.

For the purposes of this Agreement, "substantive work" shall mean content that, in CleerCut's sole discretion, demonstrates a good faith effort to comply with the campaign brief, including but not limited to creative direction, tone, and deliverable requirements.

Submission of incomplete, placeholder, or materially non-compliant content shall not qualify as substantive work.

Cancellation by the Brand after this period, or after receipt of substantive work, may result in partial payment to the Creator, as determined by CleerCut's fair use policy.

8. Confidentiality

Both Parties agree to maintain the confidentiality of any non-public information received in connection with this collaboration, including campaign details, compensation, and unreleased content.

9. Limitation of Liability & Indemnification

Neither Party shall be liable for any indirect, incidental, or consequential damages arising from this Agreement. The Creator agrees to indemnify and hold harmless the Brand and CleerCut from any claims arising from the Creator's content, actions, or breaches of this Agreement.

10. Governing Law

This Agreement shall be governed by and construed in accordance with the laws of California, United States, without regard to conflict of law principles.

11. Entire Agreement

This Agreement constitutes the entire understanding between the Parties and supersedes all prior agreements or understandings, whether written or oral, relating to the subject matter herein.

12. Agreement and Signatures

By clicking "Agree & Accept Contract," both Parties acknowledge and consent to the terms of this Agreement. This action constitutes a valid e-signature under the E-SIGN Act, UETA, and applicable electronic transaction laws.

Signed by Brand: ${campaignData?.brandName || "[BrandName]"}
Signed by Creator: ${creatorData?.name || "[CreatorName]"}
Date Signed: ${new Date().toLocaleDateString()}
Timestamp Recorded: ${new Date().toISOString()}`;
  };

  return (
    <Modal title="Contract Preview" show={show} onClose={onClose} size="xl" height={true}>
      <div className="space-y-4">
        {/* Contract Document Container */}
        <div className="bg-gray-100 border border-gray-200 rounded-lg p-6 max-h-[33rem] overflow-y-auto">
          <div className="bg-white p-6 rounded-md shadow-sm">
            <div className="contract-content">
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
                CleerCut Collaboration Agreement
              </h2>

              <div className="space-y-4 text-sm text-gray-800 leading-relaxed">
                {generateContractText()
                  .split("\n\n")
                  .map((paragraph, index) => {
                    if (paragraph.trim() === "") return null;

                    // Check if it's a heading (starts with number and period)
                    if (paragraph.match(/^\d+\.\s+[A-Z]/)) {
                      return (
                        <div key={index} className="mt-6">
                          <h3 className="text-base font-semibold text-gray-900 mb-3">
                            {paragraph.trim()}
                          </h3>
                        </div>
                      );
                    }

                    // Check if it's a bullet point
                    if (paragraph.includes("•")) {
                      return (
                        <div key={index} className="ml-4">
                          <p className="whitespace-pre-line leading-relaxed">{paragraph.trim()}</p>
                        </div>
                      );
                    }

                    // Regular paragraph
                    return (
                      <p key={index} className="whitespace-pre-line leading-relaxed mb-3">
                        {paragraph.trim()}
                      </p>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <CustomButton
            text="Save Draft"
            className="btn-outline px-6 py-2"
            onClick={() => console.log("Save draft")}
          />
          <CustomButton
            text="Send Offer"
            className="btn-primary px-6 py-2"
            onClick={() => console.log("Send offer")}
          />
        </div>
      </div>
    </Modal>
  );
}
