"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import {
  Copy,
  Trash2,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Undo,
  Redo,
  Paperclip,
  Edit3,
} from "lucide-react";
import { AddCircle } from "@mui/icons-material";
import { useRef } from "react";
import usePitchTemplate from "./use-pitch-template.hook";
import FieldLabel from "@/common/components/field-label/field-label.component";

function PitchTemplate() {
  const {
    pitchTemplates,
    copyPitchTemplate,
    createNewPitch,
    deletePitch,
    updatePitch,
    setShowPitchPopup,
    setShowNewPitchForm,
    showPitchPopup,
    showNewPitchForm,
    newPitchTitle,
    newPitchContent,
    setNewPitchTitle,
    setNewPitchContent,
    isEditing,
    setIsEditing,
    editPitchTitle,
    editPitchContent,
    setEditPitchTitle,
    setEditPitchContent,
  } = usePitchTemplate();

  const pitchEditorRef = useRef(null);
  const editPitchEditorRef = useRef(null);

  const formatRichText = (command, editorType = "new") => {
    document.execCommand(command, false, null);
    if (editorType === "new") {
      pitchEditorRef.current?.focus();
    } else {
      editPitchEditorRef.current?.focus();
    }
  };

  const handleEditPitch = () => {
    if (showPitchPopup) {
      setEditPitchTitle(showPitchPopup.name);
      setEditPitchContent(showPitchPopup.content);
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    if (showPitchPopup && editPitchTitle && editPitchContent) {
      updatePitch(showPitchPopup.id, editPitchTitle, editPitchContent);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditPitchTitle("");
    setEditPitchContent("");
  };

  return (
    <div className="w-1/4 bg-white col-span-3 border-x p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">My Pitches</h2>
        <button className="bg-gray-200 p-2 rounded-full" onClick={() => setShowNewPitchForm(true)}>
          <AddCircle className="text-primary" />
        </button>
      </div>

      <div className="space-y-3 mb-6 h-[calc(100vh-30vh)] overflow-y-auto">
        {pitchTemplates.map((pitch) => (
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
              onClick={() => copyPitchTemplate(pitch.content)}
              className="p-1 text-gray-600 hover:text-blue-600"
              title="Copy pitch"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Pitch View Modal */}
      <Modal
        show={showPitchPopup}
        title={isEditing ? "Edit Pitch" : showPitchPopup?.name || ""}
        onClose={() => {
          setShowPitchPopup(false);
          setIsEditing(false);
          setEditPitchTitle("");
          setEditPitchContent("");
        }}
        size="lg"
      >
        <div className="flex h-[600px]">
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
                        onClick={() => copyPitchTemplate(showPitchPopup?.content || "")}
                        className="p-2 text-gray-600 hover:text-blue-600"
                        title="Copy pitch"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deletePitch(showPitchPopup?.id)}
                        className="p-2 text-gray-600 hover:text-red-600"
                        title="Delete pitch"
                      >
                        <Trash2 color="#f20707" className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div
                    className="border border-text-ultra-light-gray rounded-lg p-4 bg-gray-100 h-full min-h-[480px]"
                    dangerouslySetInnerHTML={{ __html: showPitchPopup?.content || "" }}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <CustomButton
                    text="Close"
                    className="btn-cancel"
                    onClick={() => setShowPitchPopup(false)}
                  />
                  <CustomButton
                    text="Copy & Use"
                    className="btn-primary"
                    onClick={() => {
                      copyPitchTemplate(showPitchPopup?.content || "");
                      setShowPitchPopup(false);
                    }}
                  />
                </div>
              </div>
            ) : (
              // Edit Mode
              <div className="space-y-4">
                <div className="mb-4">
                  <CustomInput
                    label="Pitch Name"
                    value={editPitchTitle}
                    onChange={(e) => setEditPitchTitle(e.target.value)}
                    placeholder="e.g., Skincare Brand Pitch"
                  />
                </div>

                <div className="mb-4">
                  <FieldLabel label="Pitch Content" />

                  {/* Rich Text Toolbar */}
                  <div className="border border-text-ultra-light-gray flex items-center mt-[6px] gap-2 p-2 rounded-t-lg bg-gray-50">
                    <button
                      onClick={() => formatRichText("bold", "edit")}
                      className="p-1 hover:bg-gray-200 rounded"
                      title="Bold"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => formatRichText("italic", "edit")}
                      className="p-1 hover:bg-gray-200 rounded"
                      title="Italic"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => formatRichText("underline", "edit")}
                      className="p-1 hover:bg-gray-200 rounded"
                      title="Underline"
                    >
                      <Underline className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                    <button
                      onClick={() => formatRichText("insertUnorderedList", "edit")}
                      className="p-1 hover:bg-gray-200 rounded"
                      title="Bullet List"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => formatRichText("insertOrderedList", "edit")}
                      className="p-1 hover:bg-gray-200 rounded"
                      title="Numbered List"
                    >
                      <ListOrdered className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                    <button
                      onClick={() => formatRichText("undo", "edit")}
                      className="p-1 hover:bg-gray-200 rounded"
                      title="Undo"
                    >
                      <Undo className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => formatRichText("redo", "edit")}
                      className="p-1 hover:bg-gray-200 rounded"
                      title="Redo"
                    >
                      <Redo className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                    <button className="p-1 hover:bg-gray-200 rounded" title="Add Image">
                      <Paperclip className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Rich Text Editor */}
                  <div
                    ref={editPitchEditorRef}
                    contentEditable
                    className="border border-text-ultra-light-gray w-full p-4 border-t-0 rounded-b-lg focus:outline-none bg-white overflow-y-auto"
                    style={{ minHeight: "360px" }}
                    dangerouslySetInnerHTML={{ __html: editPitchContent }}
                    onBlur={(e) => setEditPitchContent(e.target.innerHTML)}
                    onInput={(e) => setEditPitchContent(e.target.innerHTML)}
                    data-placeholder="Write your pitch template here..."
                  />
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500 mb-6">
                  <span>Auto-saved • Last updated: just now</span>
                  <button className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700">
                    <Paperclip className="w-3 h-3" />
                    Add Media
                  </button>
                </div>

                <div className="flex justify-end gap-3">
                  <CustomButton text="Cancel" className="btn-cancel" onClick={handleCancelEdit} />
                  <CustomButton
                    text="Save Changes"
                    className="btn-primary"
                    onClick={handleSaveEdit}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* New Pitch Modal */}
      <Modal
        show={showNewPitchForm}
        title="Create New Pitch"
        onClose={() => setShowNewPitchForm(false)}
        size="lg"
      >
        <div className="flex h-[600px]">
          <div className="flex-1">
            <div className="mb-4">
              <CustomInput
                label="Pitch Name"
                value={newPitchTitle}
                onChange={(e) => setNewPitchTitle(e.target.value)}
                placeholder="e.g., Skincare Brand Pitch"
              />
            </div>

            <div className="mb-4">
              <FieldLabel label="Pitch Content" />

              {/* Rich Text Toolbar */}
              <div className="border border-text-ultra-light-gray flex items-center mt-[6px] gap-2 p-2 rounded-t-lg bg-gray-50">
                <button
                  onClick={() => formatRichText("bold")}
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  onClick={() => formatRichText("italic")}
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => formatRichText("underline")}
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Underline"
                >
                  <Underline className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-gray-300 mx-1"></div>
                <button
                  onClick={() => formatRichText("insertUnorderedList")}
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => formatRichText("insertOrderedList")}
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Numbered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-gray-300 mx-1"></div>
                <button
                  onClick={() => formatRichText("undo")}
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Undo"
                >
                  <Undo className="w-4 h-4" />
                </button>
                <button
                  onClick={() => formatRichText("redo")}
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Redo"
                >
                  <Redo className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-gray-300 mx-1"></div>
                <button className="p-1 hover:bg-gray-200 rounded" title="Add Image">
                  <Paperclip className="w-4 h-4" />
                </button>
              </div>

              {/* Rich Text Editor */}
              <div
                ref={pitchEditorRef}
                contentEditable
                className="border border-text-ultra-light-gray w-full p-4 border-t-0 rounded-b-lg focus:outline-none bg-white overflow-y-auto"
                style={{ minHeight: "350px" }}
                dangerouslySetInnerHTML={{ __html: newPitchContent }}
                onBlur={(e) => setNewPitchContent(e.target.innerHTML)}
                onInput={(e) => setNewPitchContent(e.target.innerHTML)}
                data-placeholder="Write your pitch template here..."
              />
            </div>

            <div className="flex justify-between items-center text-xs text-gray-500 mb-6">
              <span>Auto-saved • Last updated: just now</span>
              <button className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700">
                <Paperclip className="w-3 h-3" />
                Add Media
              </button>
            </div>

            <div className="flex justify-end gap-3">
              <CustomButton
                text="Cancel"
                className="btn-cancel"
                onClick={() => {
                  setShowNewPitchForm(false);
                  setNewPitchTitle("");
                  setNewPitchContent("");
                }}
              />
              <CustomButton text="Save Pitch" className="btn-primary" onClick={createNewPitch} />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default PitchTemplate;
