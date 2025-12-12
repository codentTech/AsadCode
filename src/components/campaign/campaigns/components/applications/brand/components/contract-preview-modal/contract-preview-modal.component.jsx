import Modal from "@/common/components/modal/modal.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import { useState } from "react";
import { COMPENSATION_TYPE } from "@/common/constants/campaign.constant";

export default function ContractPreviewModal({
  show,
  onClose,
  contractData,
  creatorData,
  campaignData,
  onSendOffer,
  isLoading = false,
  contractId = null,
  customActions = null,
}) {
  // Generate stable timestamp when modal opens
  const [signatureTimestamp] = useState(() => new Date().toISOString());
  const [dateSigned] = useState(() => new Date().toLocaleDateString());

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return "[enter date]";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  // Helper function to get deliverables
  const getDeliverables = () => {
    if (contractData.contentFormat) return contractData.contentFormat;
    if (campaignData?.deliverables && Array.isArray(campaignData.deliverables)) {
      return campaignData.deliverables.join(", ");
    }
    return "[enter deliverables]";
  };

  // Helper function to format compensation section
  const getCompensationSection = () => {
    const compensationType = (
      contractData.compensationType || COMPENSATION_TYPE.PAID
    ).toUpperCase();

    let compensationText = "The Brand agrees to compensate the Creator as follows:\n";

    switch (compensationType) {
      case COMPENSATION_TYPE.PAID:
        compensationText += `• Compensation Type: Fixed Payment\n`;
        compensationText += `• Amount: $${contractData.totalCompensation || "[enter amount]"}\n\n`;
        break;

      case COMPENSATION_TYPE.COMMISSION:
        const productPrice = parseFloat(contractData.productPrice) || 0;
        const commissionRate = parseFloat(contractData.totalCompensation) || 0;
        const payoutPerSale =
          productPrice && commissionRate ? ((productPrice * commissionRate) / 100).toFixed(2) : "0";

        compensationText += `• Compensation Type: Commission-Based\n`;
        compensationText += `• Commission Rate: ${contractData.totalCompensation || "[enter rate]"}% per sale\n`;
        compensationText += `• Product Price: $${contractData.productPrice || "[enter price]"}\n`;
        compensationText += `• Creator Payout Per Sale: $${payoutPerSale}\n\n`;
        break;

      case COMPENSATION_TYPE.GIFTED_PRODUCT:
        compensationText += `• Compensation Type: Gifted Product\n`;
        compensationText += `• Product Value: $${campaignData?.product_value || contractData.productValue || "[enter value]"}\n`;
        compensationText += `• Note: No monetary compensation will be provided\n\n`;
        break;

      default:
        compensationText += `• Compensation Type: [enter compensation type]\n`;
        compensationText += `• Amount: [enter amount]\n\n`;
    }

    compensationText +=
      "Compensation will be disbursed via CleerCut's payment system, subject to approval of deliverables in accordance with Section 5.";

    return compensationText;
  };

  const getEligibilitySection = () => {
    const eligibilityItems = [];

    // In-person requirement
    if (campaignData?.in_person_required !== undefined) {
      eligibilityItems.push(
        `• In-person content requirement: ${campaignData.in_person_required ? "Yes" : "No"}`
      );
    }

    // Geographic requirements
    if (campaignData?.creator_city || campaignData?.creator_country) {
      eligibilityItems.push(
        `• Geographic requirements: ${campaignData.creator_city}, ${campaignData.creator_country}`
      );
    } else {
      eligibilityItems.push(`• Geographic requirements: Not Applicable`);
    }

    // Age range
    if (campaignData?.min_age && campaignData?.max_age) {
      eligibilityItems.push(`• Age range: ${campaignData.min_age} - ${campaignData.max_age}`);
    } else if (!campaignData?.age_requirement) {
      eligibilityItems.push(`• Age range: Not Applicable`);
    }

    // Gender
    if (campaignData?.creator_gender) {
      eligibilityItems.push(`• Gender: ${campaignData.creator_gender}`);
    } else {
      eligibilityItems.push(`• Gender: Not Applicable`);
    }

    // Language
    if (campaignData?.creator_language) {
      eligibilityItems.push(`• Language: ${campaignData.creator_language}`);
    } else if (!campaignData?.language_requirement) {
      eligibilityItems.push(`• Language: Not Applicable`);
    }

    return eligibilityItems.length > 0
      ? eligibilityItems.join("\n")
      : "• No specific eligibility requirements";
  };

  const generateContractText = () => {
    const brandName = contractData.brandName || campaignData?.brand_name || "[Brand Name]";
    const creatorName =
      contractData.creatorName ||
      (creatorData?.first_name && creatorData?.last_name
        ? `${creatorData.first_name} ${creatorData.last_name}`
        : "[Creator Name]");
    const campaignTitle =
      contractData.campaignTitle || campaignData?.campaign_title || "[Campaign Title]";
    const startDate = formatDate(contractData.startDate);
    const deadline = formatDate(contractData.completionDeadline);
    const revisionsLimit = contractData.revisionsLimit || "2";
    const deliverables = getDeliverables();
    const compensationSection = getCompensationSection();
    const eligibilitySection = getEligibilitySection();

    // Usage rights
    const usageRights =
      contractData.usageRights === "no_usage"
        ? "No usage rights"
        : contractData.usageRights === "permanent"
          ? "Permanent usage rights"
          : `${contractData.usageRights} months usage rights`;

    // Exclusivity
    const exclusivity =
      contractData.exclusivityClause === "none"
        ? "None"
        : `${contractData.exclusivityClause} months`;

    const contractIdText = contractId || contractData.contractId || "DRAFT";

    return `CleerCut Collaboration Agreement

This Creator Collaboration Agreement ("Agreement") is entered into as of ${startDate}, by and between ${brandName} ("Brand") and ${creatorName} ("Creator"), collectively referred to as the "Parties."

This Agreement governs the scope, terms, and compensation for the Creator's participation in the ${campaignTitle} campaign.

1. Scope of Work

The Creator agrees to produce and publish the following deliverables: ${deliverables}. All content must comply with the creative direction, tone, and brand messaging as outlined in the campaign brief.

All deliverables must be completed and posted by ${deadline}. The Creator is permitted up to ${revisionsLimit} revision(s) if requested by the Brand, provided feedback is given within a reasonable timeframe.

2. Compensation

${compensationSection}

3. Usage Rights and Exclusivity

The Creator grants the Brand the following rights to the content:
• Usage Rights: ${usageRights}
• Exclusivity: ${exclusivity}

The Creator shall not promote competing brands within the same category during the exclusivity period, if applicable.

4. Content Requirements

The Creator agrees to comply with the content requirements outlined in the campaign brief. These requirements include, but are not limited to:

• Any required hashtags outlined by the brand in the campaign brief
• Any brand mentions or tags outlined in the campaign brief
• The creative direction, tone, messaging and format guidelines as provided by the brand

Collaboration Tagging:
The Creator agrees to tag both CleerCut (@cleercut) and the Brand as collaborators on each applicable deliverable using the native platform's collaboration feature (e.g., Instagram's "Invite Collaborator" function). This ensures full visibility and attribution. Failure to do so may result in delayed payment or revision requests.

5. Payment Conditions and Approval

Payment will be released upon completion and approval of all deliverables. The Brand shall review submitted content within five (5) business days of submission. If no feedback is provided within this window, the deliverables shall be deemed approved.

In the event of non-compliance with the agreed-upon deliverables or deadlines, payment may be withheld or adjusted at CleerCut's discretion.

6. Eligibility Confirmation

By accepting this Agreement, the Creator confirms they met all campaign eligibility criteria at the time of application, including but not limited to:

${eligibilitySection}

7. Cancellation and Dispute Resolution

This Agreement may be cancelled by either party prior to the start of deliverable work. After deliverables have been submitted, cancellation may result in partial payment as determined by CleerCut's fair use policy.

Any disputes arising under this Agreement will be resolved by CleerCut's mediation team within 48 hours of receipt. Funds held in escrow will be refunded to the Brand if no deliverables are completed.

8. Agreement and Signatures

By clicking "Agree & Accept Contract," both parties acknowledge and agree to the terms herein. This action constitutes a valid e-signature under the E-SIGN Act, UETA, and applicable electronic transaction laws.

Contract ID: ${contractIdText}
Signed by Brand: ${brandName}
Signed by Creator: ${creatorName}
Date Signed: ${dateSigned}
Timestamp Recorded: ${signatureTimestamp}`;
  };

  const contractText = generateContractText();

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
                {contractText.split("\n\n").map((paragraph, index) => {
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
        {customActions ? (
          customActions
        ) : (
          <div className="flex justify-end gap-3 pt-4">
            <CustomButton text="Back to Edit" className="btn-outline px-6 py-2" onClick={onClose} />
          </div>
        )}
      </div>
    </Modal>
  );
}
