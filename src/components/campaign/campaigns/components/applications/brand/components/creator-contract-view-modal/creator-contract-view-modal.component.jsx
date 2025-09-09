import Modal from "@/common/components/modal/modal.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";

export default function CreatorContractViewModal({
  show,
  onClose,
  contractData,
  creatorData,
  campaignData,
  onAcceptContract,
}) {
  const generateContractText = () => {
    // Calculate creator payout per sale for commission-based campaigns
    const creatorPayoutPerSale =
      contractData.compensationType === "commission" &&
      contractData.productPrice &&
      contractData.totalCompensation
        ? (
            (parseFloat(contractData.productPrice) * parseFloat(contractData.totalCompensation)) /
            100
          ).toFixed(2)
        : "0";

    return (
      "CleerCut Collaboration Agreement\n\n" +
      'This Creator Collaboration Agreement ("Agreement") is entered into as of {{StartDate}}, by and between {{BrandName}} ("Brand") and {{CreatorName}} ("Creator"), collectively referred to as the "Parties."\n\n' +
      "This Agreement governs the scope, terms, and compensation for the Creator's participation in the {{CampaignTitle}} campaign.\n\n" +
      "1. Scope of Work\n\n" +
      "The Creator agrees to produce and publish the following deliverables: {{Deliverables}}. All content must comply with the creative direction, tone, and brand messaging as outlined in the campaign brief.\n\n" +
      "All deliverables must be completed and posted by {{Deadline}}. The Creator is permitted up to {{RevisionsAllowed}} revision(s) if requested by the Brand, provided feedback is given within a reasonable timeframe.\n\n" +
      "2. Compensation\n\n" +
      "The Brand agrees to compensate the Creator as follows:\n" +
      "• Compensation Type: {{CompensationType}}\n" +
      "• Amount:\n" +
      "  - If Fixed: ${{FixedAmount}}\n" +
      "  - If Commission-Based: {{CommissionRate}}% per sale\n" +
      "  - If Gifted: Product only (no monetary compensation)\n\n" +
      "For affiliate campaigns, the product price is ${{ProductPrice}}, resulting in a per-sale payout of ${{CreatorPayoutPerSale}}.\n\n" +
      "Compensation will be disbursed via CleerCut's payment system, subject to approval of deliverables in accordance with Section 5.\n\n" +
      "3. Usage Rights and Exclusivity\n\n" +
      "The Creator grants the Brand the following rights to the content:\n" +
      "• Usage Rights: {{UsageRights}}\n" +
      "• Exclusivity: {{Exclusivity}}\n\n" +
      "The Creator shall not promote competing brands within the same category during the exclusivity period, if applicable.\n\n" +
      "4. Content Requirements\n\n" +
      "The Creator agrees to comply with the content requirements outlined in the campaign brief, which is incorporated into this Agreement by reference. These requirements include, but are not limited to:\n" +
      "• Required hashtags: {{Hashtags}}\n" +
      "• Required brand mentions or tags: {{Mentions}}\n" +
      "• Creative direction, tone, messaging, and formatting guidelines as provided by the Brand\n\n" +
      "Collaboration Tagging:\n" +
      "The Creator agrees to tag both CleerCut (@cleercut) and the Brand as collaborators on each applicable deliverable using the native platform's collaboration feature (e.g., Instagram's \"Invite Collaborator\" function). This ensures full visibility and attribution. Failure to do so may result in delayed payment or revision requests.\n\n" +
      "5. Payment Conditions and Approval\n\n" +
      "Payment will be released upon completion and approval of all deliverables. The Brand shall review submitted content within five (5) business days of submission. If no feedback is provided within this window, the deliverables shall be deemed approved.\n\n" +
      "In the event of non-compliance with the agreed-upon deliverables or deadlines, payment may be withheld or adjusted at CleerCut's discretion.\n\n" +
      "6. Eligibility Confirmation\n\n" +
      "By accepting this Agreement, the Creator confirms they met all campaign eligibility criteria at the time of application, including but not limited to:\n" +
      "• In-person content requirement: {{InPersonRequired}}\n" +
      "• Geographic requirements: {{EligibleCountry}}, {{EligibleCity}}\n" +
      "• Age range: {{AgeRange}}\n" +
      "• Gender: {{Gender}}\n" +
      "• Language: {{Language}}\n\n" +
      "7. Cancellation and Dispute Resolution\n\n" +
      "This Agreement may be cancelled by either party prior to the start of deliverable work. After deliverables have been submitted, cancellation may result in partial payment as determined by CleerCut's fair use policy.\n\n" +
      "Any disputes arising under this Agreement will be resolved by CleerCut's mediation team within 48 hours of receipt. Funds held in escrow will be refunded to the Brand if no deliverables are completed.\n\n" +
      "8. Agreement and Signatures\n\n" +
      'By clicking "Agree & Accept Contract," both parties acknowledge and agree to the terms herein. This action constitutes a valid e-signature under the E-SIGN Act, UETA, and applicable electronic transaction laws.\n\n' +
      "Signed by Brand: {{BrandName}}\n" +
      "Signed by Creator: {{CreatorName}}\n" +
      "Date Signed: {{DateSigned}}\n" +
      "Timestamp Recorded: {{SignatureTimestamp}}"
    );
  };

  // Replace template variables with actual data
  const replaceTemplateVariables = (template) => {
    return template
      .replace(/{{StartDate}}/g, contractData.startDate || "[enter date]")
      .replace(/{{BrandName}}/g, contractData.brandName || "[enter brand name]")
      .replace(/{{CreatorName}}/g, contractData.creatorName || "[enter creator name]")
      .replace(/{{CampaignTitle}}/g, contractData.campaignTitle || "[enter campaign title]")
      .replace(/{{Deliverables}}/g, contractData.contentFormat || "[enter deliverables]")
      .replace(/{{Deadline}}/g, contractData.completionDeadline || "[enter deadline]")
      .replace(/{{RevisionsAllowed}}/g, contractData.revisionsLimit || 2)
      .replace(/{{CompensationType}}/g, contractData.compensationType || "Fixed")
      .replace(
        /{{FixedAmount}}/g,
        contractData.compensationType === "fixed"
          ? contractData.totalCompensation || "[enter amount]"
          : "[enter amount]"
      )
      .replace(
        /{{CommissionRate}}/g,
        contractData.compensationType === "commission"
          ? contractData.totalCompensation || "[enter rate]"
          : "[enter rate]"
      )
      .replace(/{{ProductPrice}}/g, contractData.productPrice || "[ProductPrice]")
      .replace(
        /{{CreatorPayoutPerSale}}/g,
        contractData.compensationType === "commission" &&
          contractData.productPrice &&
          contractData.totalCompensation
          ? (
              (parseFloat(contractData.productPrice) * parseFloat(contractData.totalCompensation)) /
              100
            ).toFixed(2)
          : "0"
      )
      .replace(
        /{{UsageRights}}/g,
        contractData.usageRights === "no_usage"
          ? "No usage rights"
          : contractData.usageRights === "permanent"
            ? "Permanent usage rights"
            : `${contractData.usageRights} months usage rights`
      )
      .replace(
        /{{Exclusivity}}/g,
        contractData.exclusivityClause === "none"
          ? "None"
          : `${contractData.exclusivityClause} months`
      )
      .replace(/{{Hashtags}}/g, contractData.hashtags || "[enter hashtags]")
      .replace(/{{Mentions}}/g, contractData.mentions || "[enter mentions]")
      .replace(/{{InPersonRequired}}/g, contractData.inPersonRequired ? "Yes" : "No")
      .replace(/{{EligibleCountry}}/g, contractData.eligibleCountry || "[enter country]")
      .replace(/{{EligibleCity}}/g, contractData.eligibleCity || "[enter city]")
      .replace(/{{AgeRange}}/g, contractData.ageRange || "[enter age range]")
      .replace(/{{Gender}}/g, contractData.gender || "[enter gender]")
      .replace(/{{Language}}/g, contractData.language || "[enter language]")
      .replace(/{{DateSigned}}/g, new Date().toLocaleDateString())
      .replace(/{{SignatureTimestamp}}/g, new Date().toISOString());
  };

  const contractText = replaceTemplateVariables(generateContractText());

  const handleAcceptContract = () => {
    const signatureData = {
      contractId: contractData.contractId,
      creatorId: creatorData?.id,
      brandId: campaignData?.created_by?.id,
      signedAt: new Date().toISOString(),
      signatureTimestamp: new Date().toISOString(),
      contractData: contractData,
    };

    onAcceptContract(signatureData);
  };

  return (
    <Modal title="Contract Review" show={show} onClose={onClose} size="xl" height={true}>
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

        {/* E-Signature Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">E-Signature Confirmation</h3>
          <p className="text-sm text-blue-700 mb-4">
            By clicking "Agree & Accept Contract" below, you acknowledge that you have read,
            understood, and agree to all terms and conditions outlined in this agreement. This
            action constitutes a valid e-signature under the E-SIGN Act and applicable electronic
            transaction laws.
          </p>

          <div className="flex items-center gap-3 mb-4">
            <input
              type="checkbox"
              id="agree-terms"
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              required
            />
            <label htmlFor="agree-terms" className="text-sm text-blue-900">
              I have read and agree to all terms and conditions of this agreement
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <CustomButton text="Decline" className="btn-outline px-6 py-2" onClick={onClose} />
          <CustomButton
            text="Agree & Accept Contract"
            className="btn-primary px-6 py-2"
            onClick={handleAcceptContract}
          />
        </div>
      </div>
    </Modal>
  );
}
