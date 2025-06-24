import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import SidebarLayout from "@/common/layouts/sidebar.layout";
import { Eye, Info, MessageSquare, Save, Send } from "lucide-react";
import { useState } from "react";

const AutoReplyTemplate = () => {
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: "Welcome Message",
      subject: "Thank you for your interest!",
      message:
        "Hi there!\n\nThank you for your interest in collaborating with me. I'll review your proposal and get back to you within 24-48 hours.\n\nBest regards,\n[Your Name]",
      isActive: true,
    },
  ]);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    subject: "",
    message: "",
  });
  const [showPreview, setShowPreview] = useState(null);

  const handleInputChange = (field, value) => {
    setNewTemplate((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveTemplate = () => {
    if (newTemplate.name && newTemplate.message) {
      setTemplates((prev) => [
        ...prev,
        {
          ...newTemplate,
          id: Date.now(),
          isActive: false,
        },
      ]);
      setNewTemplate({ name: "", subject: "", message: "" });
    }
  };

  const toggleActive = (templateId) => {
    setTemplates((prev) =>
      prev.map((template) => ({
        ...template,
        isActive: template.id === templateId ? !template.isActive : false,
      }))
    );
  };

  return (
    <SidebarLayout>
      <div className="min-h-screen mx-auto">
        {/* Header */}
        <div className="bg-primary p-4 rounded-lg text-white mb-4">
          <h1 className="text-xl font-bold text-white">Auto-Reply Templates</h1>
          <p className="text-sm mt-1">
            Create automatic response messages for campaign applications
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg flex-shrink-0">
              <Info className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Auto-Reply Settings</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                Set up automatic responses that will be sent to influencers when they apply to your
                campaigns.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Create New Template */}
          <div className="bg-white rounded-lg shadow-sm p-5 border">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <MessageSquare className="h-4 w-4 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Create Template</h3>
            </div>

            <div className="space-y-4">
              <CustomInput
                label="Template Name"
                name="templateName"
                type="text"
                placeholder="e.g., Welcome Message"
                value={newTemplate.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />

              <CustomInput
                label="Email Subject (Optional)"
                name="emailSubject"
                type="text"
                placeholder="Thank you for your interest!"
                value={newTemplate.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
              />

              <div>
                <TextArea
                  label="Message Template"
                  placeholder="Hi [Influencer Name]&#10;&#10;Thank you for your interest in our campaign..."
                  value={newTemplate.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use [Influencer Name], [Campaign Name] as placeholders
                </p>
              </div>

              <CustomButton
                text="Save Template"
                className="btn-primary w-full"
                icon={Save}
                onClick={saveTemplate}
                disabled={!newTemplate.name || !newTemplate.message}
              />
            </div>
          </div>

          {/* Saved Templates */}
          <div className="bg-white rounded-lg shadow-sm p-5 border">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <Send className="h-4 w-4 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Saved Templates</h3>
            </div>

            <div className="space-y-3">
              {templates.map((template) => (
                <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-gray-900">{template.name}</h4>
                        {template.isActive && (
                          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      {template.subject && (
                        <p className="text-sm text-gray-600 mb-1">Subject: {template.subject}</p>
                      )}
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {template.message.substring(0, 100)}...
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-3">
                    <button
                      onClick={() => setShowPreview(template.id)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </button>
                    <button
                      onClick={() => toggleActive(template.id)}
                      className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md ${
                        template.isActive
                          ? "text-red-700 bg-red-100 hover:bg-red-200"
                          : "text-green-700 bg-green-100 hover:bg-green-200"
                      }`}
                    >
                      {template.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Modal show={showPreview} title="Template Preview" onClose={() => setShowPreview(null)}>
          <div className="">
            {templates.find((t) => t.id === showPreview) && (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Subject:</label>
                  <p className="text-sm text-gray-900">
                    {templates.find((t) => t.id === showPreview).subject || "No subject"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Message:</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded border text-sm text-gray-900 whitespace-pre-wrap">
                    {templates.find((t) => t.id === showPreview).message}
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end space-x-2 mt-4">
              <CustomButton
                text="Close"
                onClick={() => setShowPreview(null)}
                className="btn-cancel"
              />
            </div>
          </div>
        </Modal>
      </div>
    </SidebarLayout>
  );
};

export default AutoReplyTemplate;
