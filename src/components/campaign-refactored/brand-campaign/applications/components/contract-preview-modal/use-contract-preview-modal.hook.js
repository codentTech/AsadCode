import { useMemo, useState } from "react";
import { formatDate } from "@/common/utils/date.utils";
import { COMPENSATION_TYPE } from "@/common/constants/campaign.constant";
import { getBrandDisplayNameForBrandUser } from "@/common/utils/brand-display.util";
import {
  formatExclusivityForDisplay,
  formatUsageRightsForDisplay,
} from "@/common/utils/contract-terms.util";

export default function useContractPreviewModal({
  contractData = {},
  creatorData,
  campaignData,
  contractId,
}) {
  const [signatureTimestamp] = useState(() => new Date().toISOString());
  const [dateSigned] = useState(() => new Date().toLocaleDateString());

  const getDeliverables = () => {
    if (contractData.contentFormat) return contractData.contentFormat;
    if (campaignData?.deliverables && Array.isArray(campaignData.deliverables)) {
      return campaignData.deliverables.join(", ");
    }
    return "[enter deliverables]";
  };

  const getShopperDiscount = () => {
    const candidates = [
      contractData.customerDiscountPercent,
      contractData.customer_discount_percent,
      campaignData?.customer_discount_percent,
      campaignData?.customerDiscountPercent,
    ];

    for (const candidate of candidates) {
      if (candidate !== undefined && candidate !== null && candidate !== "") {
        return candidate;
      }
    }
    return null;
  };

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

      case COMPENSATION_TYPE.COMMISSION: {
        const shopperDiscount = getShopperDiscount();
        compensationText += `• Compensation Type: Affiliate\n`;
        compensationText += `• Commission rate: ${contractData.totalCompensation || "[enter rate]"}% per sale\n`;
        compensationText += `• Discount for the shopper: ${
          shopperDiscount != null ? `${shopperDiscount}%` : "[enter discount]"
        }\n`;
        compensationText +=
          `• Note: Commission is calculated on the shopper's discounted order total for campaign products (shipping and tax excluded).\n\n`;
        break;
      }

      case COMPENSATION_TYPE.GIFTED_PRODUCT:
        compensationText += `• Compensation Type: Gifted Product\n`;
        compensationText += `• Your cost per unit: $${contractData.totalCompensation || campaignData?.product_value || "[enter value]"}\n`;
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

    if (campaignData?.in_person_required !== undefined) {
      eligibilityItems.push(
        `• In-person content requirement: ${campaignData.in_person_required ? "Yes" : "No"}`
      );
    }

    if (campaignData?.creator_city || campaignData?.creator_country) {
      eligibilityItems.push(
        `• Geographic requirements: ${campaignData.creator_city}, ${campaignData.creator_country}`
      );
    } else {
      eligibilityItems.push(`• Geographic requirements: Not Applicable`);
    }

    if (campaignData?.min_age && campaignData?.max_age) {
      eligibilityItems.push(`• Age range: ${campaignData.min_age} - ${campaignData.max_age}`);
    } else if (!campaignData?.age_requirement) {
      eligibilityItems.push(`• Age range: Not Applicable`);
    }

    if (campaignData?.creator_gender) {
      eligibilityItems.push(`• Gender: ${campaignData.creator_gender}`);
    } else {
      eligibilityItems.push(`• Gender: Not Applicable`);
    }

    if (campaignData?.creator_language) {
      eligibilityItems.push(`• Language: ${campaignData.creator_language}`);
    } else if (!campaignData?.language_requirement) {
      eligibilityItems.push(`• Language: Not Applicable`);
    }

    return eligibilityItems.length > 0
      ? eligibilityItems.join("\n")
      : "• No specific eligibility requirements";
  };

  const contractText = useMemo(() => {
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

    const usageRights = formatUsageRightsForDisplay(contractData.usageRights);
    const exclusivity = formatExclusivityForDisplay(contractData.exclusivityClause);

    const contractIdText = contractId || contractData.contractId || "DRAFT";
    const hasAdditionalClause =
      Boolean(contractData.additionalClauseTitle) && Boolean(contractData.additionalClauseBody);

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

${hasAdditionalClause ? `8. ${contractData.additionalClauseTitle}\n` : ""}
${hasAdditionalClause ? `${contractData.additionalClauseBody}\n\n` : ""}
${hasAdditionalClause ? `9. Agreement and Signatures\n` : `8. Agreement and Signatures\n`}

By clicking "Agree & Accept Contract," both parties acknowledge and agree to the terms herein. This action constitutes a valid e-signature under the E-SIGN Act, UETA, and applicable electronic transaction laws.

Contract ID: ${contractIdText}
Signed by Client: ${brandName}
Signed by Creator: ${creatorName}
Date Signed: ${dateSigned}
Timestamp Recorded: ${signatureTimestamp}`;
  }, [
    contractData,
    creatorData,
    campaignData,
    contractId,
    dateSigned,
    signatureTimestamp,
  ]);

  return {
    signatureTimestamp,
    dateSigned,
    contractText,
  };
}
