import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { Eye, FileText, Info, Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";

const BriefTemplate = () => {
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: "Instagram Post Campaign",
      category: "Social Media",
      description: "Create an engaging Instagram post showcasing our product",
      requirements: [
        "High-quality images (minimum 1080x1080)",
        "Include product in lifestyle setting",
        "Use brand hashtags #YourBrand #Campaign2024",
      ],
      deliverables: ["1 Instagram post", "Instagram story (24 hours)", "Usage rights for 6 months"],
      timeline: "7 days",
      notes: "Please tag our official account and include discount code",
    },
  ]);

  const [newTemplate, setNewTemplate] = useState({
    name: "",
    category: "",
    description: "",
    requirements: [""],
    deliverables: [""],
    timeline: "",
    notes: "",
  });

  const [editingTemplate, setEditingTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(null);

  const handleInputChange = (field, value) => {
    setNewTemplate((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayInputChange = (field, index, value) => {
    setNewTemplate((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field) => {
    setNewTemplate((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (field, index) => {
    setNewTemplate((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const saveTemplate = () => {
    if (newTemplate.name && newTemplate.description) {
      const templateData = {
        ...newTemplate,
        id: Date.now(),
        requirements: newTemplate.requirements.filter((req) => req.trim()),
        deliverables: newTemplate.deliverables.filter((del) => del.trim()),
      };

      setTemplates((prev) => [...prev, templateData]);
      setNewTemplate({
        name: "",
        category: "",
        description: "",
        requirements: [""],
        deliverables: [""],
        timeline: "",
        notes: "",
      });
    }
  };

  const deleteTemplate = (templateId) => {
    setTemplates((prev) => prev.filter((template) => template.id !== templateId));
  };

  const categories = [
    "Social Media",
    "Blog Post",
    "Video Content",
    "Product Review",
    "Event Coverage",
    "Brand Awareness",
  ];

  return (
    <>
      {/* Header */}
      <div className="mb-3 rounded-lg bg-primary p-3 text-white sm:mb-4 sm:p-4">
        <h1 className="text-sm font-semibold text-white sm:text-lg md:text-xl">Content Brief Templates</h1>
        <p className="mt-1 text-[10px] leading-snug sm:text-xs md:text-sm">
          Create reusable content briefs to speed up campaign creation
        </p>
      </div>

      {/* Info Banner */}
      <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 sm:mb-6 sm:p-4">
        <div className="flex items-start space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg flex-shrink-0">
            <Info className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h3 className="mb-1 text-xs font-medium text-blue-900 sm:text-sm">Brief Templates</h3>
            <p className="text-xs leading-relaxed text-blue-800 sm:text-sm">
              Save time by creating reusable content brief templates for your campaigns.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Create New Template */}
        <div className="rounded-lg border bg-white p-3 shadow-sm sm:p-5">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <FileText className="h-4 w-4 text-green-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 sm:text-lg">Create Brief Template</h3>
          </div>

          <div className="space-y-4">
            <CustomInput
              label="Template Name"
              name="templateName"
              type="text"
              placeholder="e.g., Instagram Post Campaign"
              value={newTemplate.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />

            <div>
              <label className="mb-2 block text-xs font-medium text-gray-700 sm:text-sm">Category</label>
              <select
                className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:p-3 sm:text-sm"
                value={newTemplate.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <TextArea
                label="Campaign Description"
                placeholder="Describe the campaign objectives and goals..."
                value={newTemplate.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
              {newTemplate.requirements.map((req, index) => (
                <div key={index} className="mb-2 flex items-center space-x-2">
                  <CustomInput
                    placeholder="Add requirement"
                    value={req}
                    onChange={(e) => handleArrayInputChange("requirements", index, e.target.value)}
                  />
                  {newTemplate.requirements.length > 1 && (
                    <button
                      onClick={() => removeArrayItem("requirements", index)}
                      className="rounded p-2 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addArrayItem("requirements")}
                className="inline-flex items-center rounded px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-50 sm:px-3 sm:text-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Requirement
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deliverables</label>
              {newTemplate.deliverables.map((del, index) => (
                <div key={index} className="mb-2 flex items-center space-x-2">
                  <CustomInput
                    placeholder="Add deliverable"
                    value={del}
                    onChange={(e) => handleArrayInputChange("deliverables", index, e.target.value)}
                  />
                  {newTemplate.deliverables.length > 1 && (
                    <button
                      onClick={() => removeArrayItem("deliverables", index)}
                      className="rounded p-2 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addArrayItem("deliverables")}
                className="inline-flex items-center rounded px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-50 sm:px-3 sm:text-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Deliverable
              </button>
            </div>

            <CustomInput
              label="Timeline"
              name="timeline"
              type="text"
              placeholder="e.g., 7 days"
              value={newTemplate.timeline}
              onChange={(e) => handleInputChange("timeline", e.target.value)}
            />

            <div>
              <TextArea
                label="Additional Notes"
                placeholder="Any additional information or special instructions..."
                value={newTemplate.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
              />
            </div>

            <CustomButton
              text="Save Template"
              className="btn-primary w-full"
              icon={Save}
              onClick={saveTemplate}
              disabled={!newTemplate.name || !newTemplate.description}
            />
          </div>
        </div>

        {/* Saved Templates */}
        <div className="rounded-lg border bg-white p-3 shadow-sm sm:p-5">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <FileText className="h-4 w-4 text-purple-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 sm:text-lg">Saved Templates</h3>
          </div>

          <div className="space-y-3">
            {templates.map((template) => (
              <div key={template.id} className="rounded-lg border border-gray-200 p-3 sm:p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full mt-1">
                      {template.category}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowPreview(template.id)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Preview
                  </button>
                  <button
                    onClick={() => deleteTemplate(template.id)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        show={showPreview}
        title="Template Preview"
        onClose={() => setShowPreview(null)}
        size="lg"
      >
        <div>
          {templates.find((t) => t.id === showPreview) && (
            <div className="space-y-4">
              {(() => {
                const template = templates.find((t) => t.id === showPreview);
                return (
                  <>
                    <div>
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full mt-1">
                        {template.category}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Description:</label>
                      <p className="text-sm text-gray-900 mt-1">{template.description}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Requirements:</label>
                      <ul className="text-sm text-gray-900 mt-1 list-disc list-inside">
                        {template.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Deliverables:</label>
                      <ul className="text-sm text-gray-900 mt-1 list-disc list-inside">
                        {template.deliverables.map((del, index) => (
                          <li key={index}>{del}</li>
                        ))}
                      </ul>
                    </div>
                    {template.timeline && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Timeline:</label>
                        <p className="text-sm text-gray-900 mt-1">{template.timeline}</p>
                      </div>
                    )}
                    {template.notes && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Notes:</label>
                        <p className="text-sm text-gray-900 mt-1">{template.notes}</p>
                      </div>
                    )}
                  </>
                );
              })()}
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
    </>
  );
};

export default BriefTemplate;
