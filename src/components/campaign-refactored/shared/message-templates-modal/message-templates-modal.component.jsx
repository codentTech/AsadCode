import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import DeleteConfirmationModal from "@/common/components/delete-confirmation-modal/delete-confirmation-modal.component";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { Edit, FileText, Trash2 } from "lucide-react";
import MessageTemplatesListSkeleton from "./components/message-templates-list-skeleton.component";
import useMessageTemplatesModal from "./use-message-templates-modal.hook";

const MessageTemplatesModal = ({ isOpen, onClose, onSelectTemplate, creatorName }) => {
  const {
    templates,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    showForm,
    editingTemplate,
    formData,
    setFormData,
    handleCreate,
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

  return (
    <>
      <Modal show={isOpen} title="Message Templates" onClose={handleClose} size="md" zIndex={2100}>
        <div className="space-y-4">
          {!showForm ? (
            <div className="flex items-center justify-between gap-5">
              <p className="min-w-0 flex-1 text-[10px] leading-snug text-gray-600 sm:text-xs">
                Save reusable messages to speed up creator outreach. Each template starts with a
                personal greeting automatically.
              </p>
              <CustomButton onClick={handleCreate} text="Create template" className="btn-primary" />
            </div>
          ) : null}

          {showForm ? (
            <div className="space-y-4">
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
                  <span className="ml-2 text-xs text-gray-500">
                    (The greeting &quot;Hey {creatorName || "{{creator_name}}"},&quot; will be added
                    automatically)
                  </span>
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

              <div className="flex items-center justify-end space-x-3">
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
          ) : null}

          {!showForm ? (
            <div className="max-h-96 space-y-2 overflow-y-auto overflow-x-visible">
              {isLoading ? (
                <MessageTemplatesListSkeleton />
              ) : templates.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  <FileText className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                  <p className="text-sm">No templates yet. Create your first template!</p>
                </div>
              ) : (
                templates.map((template) => (
                  <div
                    key={template.id}
                    className="group relative cursor-pointer overflow-visible rounded-md border border-gray-200 bg-white p-3 transition-all hover:border-primary hover:shadow-sm"
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <FileText className="h-4 w-4 shrink-0 text-primary" />
                          <h3 className="truncate text-sm font-medium text-gray-900">
                            {template.name}
                          </h3>
                        </div>
                        <p className="line-clamp-2 text-xs text-gray-600">{template.body}</p>
                      </div>

                      <div className="ml-1 flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(template);
                          }}
                          className="rounded-md p-1.5 text-gray-500 transition-colors bg-gray-200 hover:bg-gray-100 hover:text-primary"
                          title="Edit template"
                        >
                          <Edit className="h-4 w-4 text-primary" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(template.id);
                          }}
                          className="rounded-md p-1.5 text-gray-500 transition-colors bg-red-100 hover:bg-red-50 hover:text-red-600"
                          title="Delete template"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : null}
        </div>
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
