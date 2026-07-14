import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import DeleteConfirmationModal from "@/common/components/delete-confirmation-modal/delete-confirmation-modal.component";
import Modal from "@/common/components/modal/modal.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import TextArea from "@/common/components/text-area/text-area.component";
import { MESSAGE_TEMPLATE_CATEGORY_CONFIG } from "@/common/constants/message-template.constant";
import { getCategoryLabel } from "@/common/utils/message-template.util";
import MessageTemplatesCategoryList from "./components/message-templates-category-list/message-templates-category-list.component";
import useMessageTemplatesModal from "./use-message-templates-modal.hook";

const MessageTemplatesModal = ({ isOpen, onClose, onSelectTemplate, creatorName }) => {
  const {
    templatesByCategory,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    showForm,
    editingTemplate,
    formData,
    setFormData,
    handleCreateInCategory,
    handleEdit,
    handleDeleteClick,
    handleCancelDelete,
    handleConfirmDelete,
    handleSubmit,
    handleCancel,
    handleSelectTemplate,
    deleteTemplateId,
  } = useMessageTemplatesModal(isOpen, onSelectTemplate, creatorName);

  const handleClose = () => {
    if (!isCreating && !isUpdating && !isDeleting) {
      handleCancel();
      onClose();
    }
  };

  const isSubmitting = isCreating || isUpdating;

  const categorySelectOptions = MESSAGE_TEMPLATE_CATEGORY_CONFIG.map((category) => ({
    label: category.label,
    value: category.value,
  }));

  return (
    <>
      <Modal
        show={isOpen}
        title="Message templates"
        onClose={handleClose}
        size="md"
        zIndex={2100}
      >
        {showForm ? (
          <div className="space-y-4">
            <p className="text-[10px] leading-snug text-gray-600 sm:text-xs">
              {editingTemplate ? "Edit template" : "Create template"} in{" "}
              <span className="font-semibold text-gray-900">
                {getCategoryLabel(formData.category)}
              </span>
              . The greeting &quot;Hey {creatorName || "{{creator_name}}"},&quot; is added
              automatically when you send.
            </p>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <SimpleSelect
                options={categorySelectOptions}
                value={formData.category}
                onChange={(value) => setFormData({ ...formData, category: value })}
                isDisabled={isSubmitting}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Template Name <span className="text-red-500">*</span>
              </label>
              <CustomInput
                type="text"
                name="name"
                placeholder="e.g., Initial Outreach – Paid"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Message Body <span className="text-red-500">*</span>
              </label>
              <TextArea
                name="body"
                placeholder="Enter your message here"
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                disabled={isSubmitting}
                minRows={6}
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <CustomButton
                text="Cancel"
                className="btn-secondary"
                onClick={handleCancel}
                disabled={isSubmitting}
              />
              <CustomButton
                text={editingTemplate ? "Update" : "Create"}
                className="btn-primary"
                onClick={handleSubmit}
                disabled={!formData.name.trim() || !formData.body.trim() || isSubmitting}
                loading={isSubmitting}
                loadingText={editingTemplate ? "Updating" : "Creating"}
              />
            </div>
          </div>
        ) : (
          <MessageTemplatesCategoryList
            isOpen={isOpen}
            templatesByCategory={templatesByCategory}
            isLoading={isLoading}
            onSelectTemplate={handleSelectTemplate}
            onCreateInCategory={handleCreateInCategory}
            onEditTemplate={handleEdit}
            onDeleteTemplate={handleDeleteClick}
          />
        )}
      </Modal>

      <DeleteConfirmationModal
        openConfirmationPopup={Boolean(deleteTemplateId)}
        setOpenConfirmationPopup={(open) => {
          if (!open) {
            handleCancelDelete();
          }
        }}
        mainText="Delete template?"
        subText="This template will be removed from your library. Past messages are not affected."
        confirmText="Delete"
        closeText="Cancel"
        confirmLoading={isDeleting}
        confirmLoadingText="Deleting"
        action={handleConfirmDelete}
        zIndex={2200}
      />
    </>
  );
};

export default MessageTemplatesModal;
