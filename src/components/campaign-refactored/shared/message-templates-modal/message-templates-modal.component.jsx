import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import DeleteConfirmationModal from "@/common/components/delete-confirmation-modal/delete-confirmation-modal.component";
import Modal from "@/common/components/modal/modal.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import TextArea from "@/common/components/text-area/text-area.component";
import { MESSAGE_TEMPLATE_CATEGORY_CONFIG } from "@/common/constants/message-template.constant";
import { getCategoryLabel } from "@/common/utils/message-template.util";
import { Lock } from "lucide-react";
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
    lockedGreeting,
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

  const lockedGreetingChip = (
    <span
      className="inline-flex items-center gap-1 rounded-lg bg-indigo-100 px-2 py-1 text-[11px] font-medium normal-case text-indigo-700 sm:text-xs"
      aria-label="Locked greeting"
    >
      <Lock className="h-3 w-3 shrink-0 text-indigo-500" aria-hidden />
      {lockedGreeting}
    </span>
  );

  return (
    <>
      <Modal show={isOpen} title="Message templates" onClose={handleClose} size="md" zIndex={2100}>
        {showForm ? (
          <div className="space-y-4">
            <p className="text-[10px] leading-snug text-gray-600 sm:text-xs">
              {editingTemplate ? "Edit template" : "Create template"} in{" "}
              <span className="font-semibold text-gray-900">
                {getCategoryLabel(formData.category)}
              </span>
              . The locked greeting stays in the message body—type after it. {"{{Name}}"} becomes
              the recipient&apos;s name when you send.
            </p>

            <div>
              <SimpleSelect
                label="Category"
                isRequired
                options={categorySelectOptions}
                value={formData.category}
                onChange={(value) => setFormData({ ...formData, category: value })}
                isDisabled={isSubmitting}
              />
            </div>

            <div>
              <CustomInput
                type="text"
                name="name"
                label="Template Name"
                isRequired
                placeholder="e.g., Initial Outreach – Paid"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <TextArea
                name="body"
                label="Message Body"
                isRequired
                placeholder="start typing here"
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                disabled={isSubmitting}
                minRows={6}
                leadingContent={lockedGreetingChip}
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
