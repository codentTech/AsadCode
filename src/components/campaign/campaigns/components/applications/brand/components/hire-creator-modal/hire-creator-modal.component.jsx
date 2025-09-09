import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Modal from "@/common/components/modal/modal.component";
import { useState, useEffect } from "react";
import ContractPreviewModal from "../contract-preview-modal/contract-preview-modal.component";

export default function HireCreatorModal({
  show,
  onClose,
  creatorData,
  campaignData,
  onSendOffer,
}) {
  const [contractData, setContractData] = useState({
    // General Information (auto-filled)
    campaignTitle: "",
    partiesInvolved: "",
    contractId: `CC-${Date.now()}`, // Auto-generated
    startDate: "",

    // Deliverables (auto-filled from campaign)
    contentFormat: "",
    firstDraftDeadline: "",
    completionDeadline: "",
    revisionsLimit: 2,

    // Payment Terms
    compensationType: "fixed",
    totalCompensation: "",
    productPrice: "", // For commission-based campaigns

    // Legal & Compliance
    exclusivityClause: "none",
    exclusivityMonths: 0,
    usageRights: "no_usage",
    usageMonths: 0,

    // Campaign-level data (non-editable)
    brandName: "",
    hashtags: "",
    mentions: "",
    campaignDescription: "",
    contentGuidelines: "",

    // Creator-specific data
    creatorName: "",
    inPersonRequired: false,
    eligibleCountry: "",
    eligibleCity: "",
    ageRange: "",
    gender: "",
    language: "",
  });

  const [showPreview, setShowPreview] = useState(false);

  // Initialize contract data when modal opens
  useEffect(() => {
    if (show && campaignData && creatorData) {
      const creator = creatorData.creator;
      const profile = creator?.creator_profile;

      setContractData({
        // General Information
        campaignTitle: campaignData.campaign_title || "",
        partiesInvolved: `${campaignData.created_by?.first_name || ""} ${campaignData.created_by?.last_name || ""}`,
        contractId: `CC-${Date.now()}`,
        startDate: "",

        // Deliverables
        contentFormat: campaignData.deliverables?.join(", ") || "",
        firstDraftDeadline: "",
        completionDeadline: "",
        revisionsLimit: 2,

        // Payment Terms
        compensationType: campaignData.compensation_type?.toLowerCase() || "fixed",
        totalCompensation: "",
        productPrice: campaignData.product_value || "",

        // Legal & Compliance
        exclusivityClause: "none",
        exclusivityMonths: 0,
        usageRights: "no_usage",
        usageMonths: 0,

        // Campaign-level data
        brandName: `${campaignData.created_by?.first_name || ""} ${campaignData.created_by?.last_name || ""}`,
        hashtags: campaignData.hashtags || "",
        mentions: campaignData.mentions || "",
        campaignDescription: campaignData.short_description || "",
        contentGuidelines: campaignData.style_guide || "",

        // Creator-specific data
        creatorName: `${creator?.first_name || ""} ${creator?.last_name || ""}`,
        inPersonRequired: campaignData.in_person_required || false,
        eligibleCountry: campaignData.creator_country || "",
        eligibleCity: campaignData.creator_city || "",
        ageRange: `${campaignData.min_age || ""} - ${campaignData.max_age || ""}`,
        gender: campaignData.creator_gender || "",
        language: campaignData.creator_language || "",
      });
    }
  }, [show, campaignData, creatorData]);

  const compensationOptions = [
    { value: "fixed", label: "Fixed Payment" },
    { value: "gifted", label: "Gifted Product" },
    { value: "commission", label: "Commission" },
  ];

  const exclusivityOptions = [
    { value: "none", label: "None" },
    { value: "3", label: "3 Months" },
    { value: "6", label: "6 Months" },
    { value: "12", label: "12 Months" },
  ];

  const usageRightsOptions = [
    { value: "no_usage", label: "No Usage Rights" },
    { value: "3", label: "3 Months Usage" },
    { value: "6", label: "6 Months Usage" },
    { value: "12", label: "12 Months Usage" },
    { value: "permanent", label: "Permanent Usage" },
  ];

  const revisionOptions = [
    { value: 0, label: "0 Revisions" },
    { value: 1, label: "1 Revision" },
    { value: 2, label: "2 Revisions" },
    { value: 3, label: "3 Revisions" },
    { value: 4, label: "4 Revisions" },
    { value: 5, label: "5 Revisions" },
  ];

  const handleInputChange = (field, value) => {
    setContractData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePreviewContract = () => {
    setShowPreview(true);
  };

  const handleSendOffer = () => {
    // Validate required fields
    const requiredFields = ["startDate", "completionDeadline"];
    const missingFields = requiredFields.filter((field) => !contractData[field]);

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }

    // Validate compensation based on type
    if (contractData.compensationType === "fixed" && !contractData.totalCompensation) {
      alert("Please enter the total compensation amount");
      return;
    }

    if (contractData.compensationType === "commission" && !contractData.totalCompensation) {
      alert("Please enter the commission percentage");
      return;
    }

    // Validate dates
    const startDate = new Date(contractData.startDate);
    const completionDate = new Date(contractData.completionDeadline);
    const today = new Date();

    if (startDate < today) {
      alert("Start date cannot be in the past");
      return;
    }

    if (completionDate <= startDate) {
      alert("Completion deadline must be after start date");
      return;
    }

    // Prepare contract data for sending
    const finalContractData = {
      ...contractData,
      // Add metadata
      sentAt: new Date().toISOString(),
      status: "pending_creator_approval",
      // Ensure all required fields are present
      startDate: contractData.startDate,
      completionDeadline: contractData.completionDeadline,
      totalCompensation: contractData.totalCompensation || "0",
      productPrice: contractData.productPrice || "0",
    };

    onSendOffer(finalContractData);
    onClose();
  };

  const getCompensationInputLabel = () => {
    switch (contractData.compensationType) {
      case "fixed":
        return "Total Compensation ($)";
      case "commission":
        return "Commission Rate (%)";
      case "gifted":
        return "Product Value ($)";
      default:
        return "Compensation";
    }
  };

  const isCompensationRequired = () => {
    return contractData.compensationType !== "gifted";
  };

  return (
    <Modal title="Review & Send Offer" show={show} onClose={onClose} size="lg">
      <div className="space-y-4">
        {/* General Information */}
        <div>
          <h3 className="font-bold mb-2">General Information</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <CustomInput label="Campaign Title" value={contractData.campaignTitle} disabled />
            <CustomInput label="Contract ID" value={contractData.contractId} disabled />
            <CustomInput
              label="Start Date"
              type="date"
              value={contractData.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
            />
          </div>
        </div>

        {/* Deliverables */}
        <div>
          <h3 className="font-bold mb-2">Deliverables</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <CustomInput
              label="Content Format(s)"
              value={contractData.contentFormat}
              onChange={(e) => handleInputChange("contentFormat", e.target.value)}
              placeholder="e.g., 1 TikTok, 3 Instagram Stories"
            />
            <CustomInput
              label="1st Draft Deadline (Optional)"
              type="date"
              value={contractData.firstDraftDeadline}
              onChange={(e) => handleInputChange("firstDraftDeadline", e.target.value)}
            />
            <CustomInput
              label="Completion Deadline"
              type="date"
              value={contractData.completionDeadline}
              onChange={(e) => handleInputChange("completionDeadline", e.target.value)}
            />
            <div>
              <SimpleSelect
                label="Revisions Limit"
                value={contractData.revisionsLimit}
                options={revisionOptions}
                onChange={(value) => handleInputChange("revisionsLimit", value)}
              />
            </div>
          </div>
        </div>

        {/* Payment Terms */}
        <div>
          <h3 className="font-bold mb-2">Payment Terms</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <SimpleSelect
                label="Compensation Type"
                value={contractData.compensationType}
                options={compensationOptions}
                onChange={(value) => handleInputChange("compensationType", value)}
              />
            </div>
            {isCompensationRequired() && (
              <CustomInput
                label={getCompensationInputLabel()}
                type="number"
                value={contractData.totalCompensation}
                onChange={(e) => handleInputChange("totalCompensation", e.target.value)}
                placeholder="0"
              />
            )}
            {contractData.compensationType === "commission" && (
              <CustomInput
                label="Product Price ($)"
                type="number"
                value={contractData.productPrice}
                onChange={(e) => handleInputChange("productPrice", e.target.value)}
                placeholder="0"
              />
            )}
          </div>
        </div>

        {/* Legal & Compliance */}
        <div>
          <h3 className="font-bold mb-2">Legal & Compliance</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <SimpleSelect
                label="Exclusivity Clause"
                value={contractData.exclusivityClause}
                options={exclusivityOptions}
                onChange={(value) => handleInputChange("exclusivityClause", value)}
              />
            </div>
            <div>
              <SimpleSelect
                label="Usage Rights"
                value={contractData.usageRights}
                options={usageRightsOptions}
                onChange={(value) => handleInputChange("usageRights", value)}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <CustomButton
            text="Save Draft"
            className="btn-outline"
            onClick={() => console.log("Save draft")}
          />
          <CustomButton
            text="Preview Contract"
            className="btn-secondary"
            onClick={handlePreviewContract}
          />
          <CustomButton text="Send Offer" className="btn-primary" onClick={handleSendOffer} />
        </div>

        {/* Contract Summary */}
        {contractData.startDate && contractData.completionDeadline && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-blue-900 mb-2">Contract Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-800">Campaign:</span>{" "}
                {contractData.campaignTitle}
              </div>
              <div>
                <span className="font-medium text-blue-800">Creator:</span>{" "}
                {contractData.creatorName}
              </div>
              <div>
                <span className="font-medium text-blue-800">Start Date:</span>{" "}
                {new Date(contractData.startDate).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium text-blue-800">Deadline:</span>{" "}
                {new Date(contractData.completionDeadline).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium text-blue-800">Compensation:</span>{" "}
                {contractData.compensationType === "fixed"
                  ? `$${contractData.totalCompensation}`
                  : contractData.compensationType === "commission"
                    ? `${contractData.totalCompensation}% commission`
                    : "Gifted product"}
              </div>
              <div>
                <span className="font-medium text-blue-800">Revisions:</span>{" "}
                {contractData.revisionsLimit}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contract Preview Modal */}
      {showPreview && (
        <ContractPreviewModal
          show={showPreview}
          onClose={() => setShowPreview(false)}
          contractData={contractData}
          creatorData={creatorData}
          campaignData={campaignData}
        />
      )}
    </Modal>
  );
}
