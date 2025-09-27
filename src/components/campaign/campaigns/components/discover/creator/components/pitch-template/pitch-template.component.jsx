"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import DeleteConfirmationModal from "@/common/components/delete-confirmation-modal/delete-confirmation-modal.component";
import FieldLabel from "@/common/components/field-label/field-label.component";
import Modal from "@/common/components/modal/modal.component";
import TiptapEditor from "@/common/components/tiptap-editor/tiptap-editor.component";
import { AddCircle } from "@mui/icons-material";
import { Copy, Edit3, Trash2 } from "lucide-react";
import usePitchTemplate from "./use-pitch-template.hook";

function PitchTemplate() {
  const {
    pitchTemplates,
    copyPitchTemplate,
    showPitchPopup,
    setShowPitchPopup,
    showNewPitchForm,
    isEditing,
    isLoading,
    pitchForm,
    handleSubmitForm,
    handleEditPitch,
    handleOpenNewPitchForm,
    handleCancelEdit,
    handleCloseNewPitchForm,
    handleDeletePitch,
    deleteConfirmationModal,
    confirmDeletePitch,
    closeDeleteConfirmationModal,
  } = usePitchTemplate();

  return (
    <div className="w-1/4 bg-white col-span-3 border-x p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">My Pitches</h2>
        <button className="bg-gray-200 p-2 rounded-full" onClick={handleOpenNewPitchForm}>
          <AddCircle className="text-primary" />
        </button>
      </div>

      <div className="space-y-3 mb-6 h-[calc(100vh-30vh)] overflow-y-auto">
        {pitchTemplates.length > 0 ? (
          pitchTemplates.map((pitch) => (
            <div
              key={pitch.id}
              className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
            >
              <button
                onClick={() => setShowPitchPopup(pitch)}
                className="flex-1 text-left text-xs font-medium text-gray-900 hover:text-blue-600"
              >
                {pitch.name}
              </button>
              <button
                onClick={async () => {
                  try {
                    await copyPitchTemplate(pitch.content);
                  } catch (error) {
                    console.error("Failed to copy pitch:", error);
                  }
                }}
                className="p-1 text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Copy pitch"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <AddCircle className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No pitch templates yet</p>
            <p className="text-gray-400 text-xs">Create your first pitch template to get started</p>
          </div>
        )}
      </div>

      {/* Pitch View Modal */}
      <Modal
        show={showPitchPopup}
        title={isEditing ? "Edit Pitch" : showPitchPopup?.name || ""}
        onClose={() => {
          setShowPitchPopup(false);
          handleCancelEdit();
        }}
        size="lg"
      >
        <div className="flex h-full pb-1">
          <div className="flex-1">
            {!isEditing ? (
              // View Mode
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center">
                    <FieldLabel label="Pitch Content" />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleEditPitch}
                        className="p-2 text-gray-600 hover:text-blue-600"
                        title="Edit pitch"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            await copyPitchTemplate(showPitchPopup?.content || "");
                          } catch (error) {
                            console.error("Failed to copy pitch:", error);
                          }
                        }}
                        className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Copy pitch"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeletePitch(showPitchPopup?.id)}
                        className="p-2 text-gray-600 hover:text-red-600"
                        title="Delete pitch"
                      >
                        <Trash2 color="#f20707" className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div
                    className="border border-text-ultra-light-gray rounded-lg p-4 bg-gray-50 h-full min-h-[480px] overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: showPitchPopup?.content || "" }}
                  />
                </div>
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={pitchForm.handleSubmit(handleSubmitForm)}>
                <div className="space-y-4">
                  <div className="mb-4">
                    <CustomInput
                      label="Pitch Name"
                      name="name"
                      register={pitchForm.register}
                      errors={pitchForm.formState.errors}
                      placeholder="e.g., Skincare Brand Pitch"
                    />
                  </div>

                  <div className="mb-4">
                    <FieldLabel label="Pitch Content" />
                    <TiptapEditor
                      content={pitchForm.watch("content")}
                      onChange={(content) => pitchForm.setValue("content", content)}
                      placeholder="Write your pitch template here..."
                      minHeight="360px"
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <CustomButton text="Cancel" className="btn-cancel" onClick={handleCancelEdit} />
                    <CustomButton
                      text="Save Changes"
                      className="btn-primary"
                      type="submit"
                      loading={isLoading}
                    />
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </Modal>

      {/* New Pitch Modal */}
      <Modal
        show={showNewPitchForm}
        title="Create New Pitch"
        onClose={handleCloseNewPitchForm}
        size="lg"
      >
        <form onSubmit={pitchForm.handleSubmit(handleSubmitForm)}>
          <div className="flex h-full pb-1">
            <div className="flex-1">
              <div className="mb-4">
                <CustomInput
                  label="Pitch Name"
                  name="name"
                  register={pitchForm.register}
                  errors={pitchForm.formState.errors}
                  placeholder="e.g., Skincare Brand Pitch"
                />
              </div>

              <div className="mb-4">
                <FieldLabel label="Pitch Content" />
                <TiptapEditor
                  content={pitchForm.watch("content")}
                  onChange={(content) => pitchForm.setValue("content", content)}
                  placeholder="Write your pitch template here..."
                  minHeight="350px"
                />
              </div>

              <div className="flex justify-end gap-3">
                <CustomButton
                  text="Cancel"
                  className="btn-cancel"
                  onClick={handleCloseNewPitchForm}
                />
                <CustomButton
                  text="Save Pitch"
                  className="btn-primary"
                  type="submit"
                  loading={isLoading}
                />
              </div>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        id={deleteConfirmationModal.pitchId}
        openConfirmationPopup={deleteConfirmationModal.open}
        setOpenConfirmationPopup={closeDeleteConfirmationModal}
        mainText={`Are you sure you want to delete "${deleteConfirmationModal.pitchName}"?`}
        mainStyling="text-lg font-semibold text-gray-900 text-center"
        subText="This action cannot be undone."
        subStyling="text-sm text-gray-500 text-center"
        confirmText="Delete"
        closeText="Cancel"
        action={confirmDeletePitch}
        type="danger"
      />
    </div>
  );
}

export default PitchTemplate;
