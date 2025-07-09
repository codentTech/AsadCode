import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Modal from "@/common/components/modal/modal.component";
import { useState } from "react";
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
    campaignTitle: campaignData?.title || "",
    partiesInvolved: campaignData?.brandName || "",
    contractId: `CC-${Date.now()}`, // Auto-generated
    startDate: "",

    // Deliverables (auto-filled from campaign)
    contentFormat: campaignData?.deliverables || "",
    firstDraftDeadline: "",
    completionDeadline: "",
    revisionsLimit: 2,

    // Payment Terms
    compensationType: "fixed",
    totalCompensation: "",

    // Legal & Compliance
    exclusivityClause: "none",
    usageRights: "no_usage",
    usageMonths: 0,
  });

  const [showPreview, setShowPreview] = useState(false);

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
    onSendOffer(contractData);
    onClose();
  };

  return (
    <Modal title="Review & Send Offer" show={show} onClose={onClose} size="lg">
      <div className="space-y-4">
        {/* General Information */}
        <div>
          <h3 className="font-bold mb-2">General Information</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <CustomInput label="Campaign Title" value={contractData.campaignTitle} />
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
                options={[
                  { value: 0, label: "0" },
                  { value: 1, label: "1" },
                  { value: 2, label: "2" },
                  { value: 3, label: "3" },
                  { value: 4, label: "4" },
                  { value: 5, label: "5" },
                ]}
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
            {contractData.compensationType === "fixed" && (
              <CustomInput
                label="Total Compensation ($)"
                type="number"
                value={contractData.totalCompensation}
                onChange={(e) => handleInputChange("totalCompensation", e.target.value)}
                placeholder="0"
              />
            )}
            {contractData.compensationType === "commission" && (
              <CustomInput
                label="Commission Rate (%)"
                type="number"
                value={contractData.totalCompensation}
                onChange={(e) => handleInputChange("totalCompensation", e.target.value)}
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
            <CustomInput
              label="Usage Rights"
              value={contractData.usageRights}
              onChange={(e) => handleInputChange("usageRights", e.target.value)}
              placeholder="No usage or X months"
            />
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
