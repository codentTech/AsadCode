import Modal from "@/common/components/modal/modal.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import { useState } from "react";
import { COMPENSATION_TYPE } from "@/common/constants/campaign.constant";
import { formatDate } from "@/common/utils/date.utils";
import { getBrandDisplayNameForBrandUser } from "@/common/utils/brand-display.util";

export default function ContractPreviewModal({
  show,
  onClose,
  contractData,
  creatorData,
  campaignData,
  contractId = null,
  customActions = null,
}) {
  // Generate stable timestamp when modal opens
  const [signatureTimestamp] = useState(() => new Date().toISOString());
  const [dateSigned] = useState(() => new Date().toLocaleDateString());

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

    let compensationText = "The Client agrees to compensate the Creator as follows:\n";

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
        compensationText += `• Product Value: $${contractData.totalCompensation || campaignData?.product_value || "[enter value]"}\n`;
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
    const brandName = contractData.brand
      ? getBrandDisplayNameForBrandUser(contractData.brand)
      : contractData.brandName || campaignData?.brand_name || "[Client Name]";
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

This Creator Collaboration Agreement ("Agreement") is entered into as of ${startDate}, by and between ${brandName} ("Client") and ${creatorName} ("Creator"), collectively referred to as the "Parties."

This Agreement governs the scope, terms, and compensation for the Creator's participation in the ${campaignTitle} campaign.

1. Scope of Work

The Creator agrees to produce and publish the following deliverables: ${deliverables}. All content must comply with the creative direction, tone, and client messaging as outlined in the campaign brief.

All deliverables must be completed and posted by ${deadline}. The Creator is permitted up to ${revisionsLimit} revision(s) if requested by the Client, provided feedback is given within a reasonable timeframe.

2. Compensation

${compensationSection}

3. Usage Rights and Exclusivity

The Creator grants the Client the following rights to the content:
• Usage Rights: ${usageRights}
• Exclusivity: ${exclusivity}

The Creator shall not promote competing clients within the same category during the exclusivity period, if applicable.

4. Content Requirements

The Creator agrees to comply with the content requirements outlined in the campaign brief. These requirements include, but are not limited to:

• Any required hashtags outlined by the client in the campaign brief
• Any client mentions or tags outlined in the campaign brief
• The creative direction, tone, messaging and format guidelines as provided by the client

Collaboration Tagging:
The Creator agrees to tag both CleerCut (@cleercut) and the Client as collaborators on each applicable deliverable using the native platform's collaboration feature (e.g., Instagram's "Invite Collaborator" function). This ensures full visibility and attribution. Failure to do so may result in delayed payment or revision requests.

5. Payment Conditions and Approval

Payment will be released upon completion and approval of all deliverables. The Client shall review submitted content within five (5) business days of submission. If no feedback is provided within this window, the deliverables shall be deemed approved.

In the event of non-compliance with the agreed-upon deliverables or deadlines, payment may be withheld or adjusted at CleerCut's discretion.

6. Eligibility Confirmation

By accepting this Agreement, the Creator confirms they met all campaign eligibility criteria at the time of application, including but not limited to:

${eligibilitySection}

7. Cancellation and Dispute Resolution

This Agreement may be cancelled by either party prior to the start of deliverable work. After deliverables have been submitted, cancellation may result in partial payment as determined by CleerCut's fair use policy.

Any disputes arising under this Agreement will be resolved by CleerCut's mediation team within 48 hours of receipt. Funds held in escrow will be refunded to the Client if no deliverables are completed.

${contractData.additionalClauseTitle && contractData.additionalClauseBody ? `8. ${contractData.additionalClauseTitle}\n` : ""}
  ${contractData.additionalClauseTitle && contractData.additionalClauseBody ? `${contractData.additionalClauseBody}\n\n` : ""}

${contractData.additionalClauseTitle && contractData.additionalClauseBody ? `9. Agreement and Signatures\n` : `8. Agreement and Signatures\n`}

By clicking "Agree & Accept Contract," both parties acknowledge and agree to the terms herein. This action constitutes a valid e-signature under the E-SIGN Act, UETA, and applicable electronic transaction laws.

Contract ID: ${contractIdText}
Signed by Client: ${brandName}
Signed by Creator: ${creatorName}
Date Signed: ${dateSigned}
Timestamp Recorded: ${signatureTimestamp}`;
  };

  const contractText = generateContractText();

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

                  // Check if it's a heading (starts with number and period)
                  if (paragraph.match(/^\d+\.\s+[A-Z]/)) {
                    return (
                      <div key={index} className="mt-4 sm:mt-6">
                        <h3 className="mb-2 text-xs font-semibold text-gray-900 sm:mb-3 sm:text-base">
                          {paragraph.trim()}
                        </h3>
                      </div>
                    );
                  }

                  // Check if it's a bullet point
                  if (paragraph.includes("•")) {
                    return (
                      <div key={index} className="ml-2 sm:ml-4">
                        <p className="whitespace-pre-line leading-relaxed">{paragraph.trim()}</p>
                      </div>
                    );
                  }

                  // Regular paragraph
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

        {customActions ? (
          <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white pt-2 sm:pt-3">
            {customActions}
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
