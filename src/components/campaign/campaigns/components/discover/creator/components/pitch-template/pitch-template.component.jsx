"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { Copy, Trash2 } from "lucide-react";
import usePitchTemplate from "./use-pitch-template.hook";

function PitchTemplate() {
  const {
    pitchTemplates,
    copyPitchTemplate,
    createNewPitch,
    deletePitch,
    setShowPitchPopup,
    setShowNewPitchForm,
    showPitchPopup,
    showNewPitchForm,
    newPitchTitle,
    newPitchContent,
    setNewPitchTitle,
    setNewPitchContent,
  } = usePitchTemplate();

  return (
    <div className="w-1/4 border-l">
      <div className="bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">My Pitches</h2>

        <div className="space-y-3 mb-6 h-[calc(100vh-30vh)] overflow-y-auto">
          {pitchTemplates.map((pitch) => (
            <div
              key={pitch.id}
              className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
            >
              <button
                onClick={() => setShowPitchPopup(pitch)}
                className="flex-1 text-left text-sm font-medium text-gray-900 hover:text-blue-600"
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
        <CustomButton text="Create New Pitch" onClick={() => setShowNewPitchForm(true)} />
      </div>

      {/* Pitch View Modal */}
      <Modal
        show={showPitchPopup}
        title={showPitchPopup.name}
        onClose={() => setShowPitchPopup(false)}
      >
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center">
              <h1 className="block text-lg font-medium text-gray-900 mb-2">Pitch Content</h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyPitchTemplate(showPitchPopup.content)}
                  className="p-2 text-gray-600 hover:text-blue-600"
                  title="Copy pitch"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button
                  onClick={() => deletePitch(showPitchPopup.id)}
                  className="p-2 text-gray-600 hover:text-red-600"
                  title="Delete pitch"
                >
                  <Trash2 color="#f20707" className="w-5 h-5" />
                </button>
              </div>
            </div>
            <TextArea value={showPitchPopup.content} />
          </div>
          <div className="flex gap-3">
            <CustomButton
              text="Close"
              className="btn-cancel w-full"
              onClick={() => setShowPitchPopup(false)}
            />
            <CustomButton
              text="Copy & Use"
              onClick={() => {
                copyPitchTemplate(showPitchPopup.content);
                setShowPitchPopup(false);
              }}
            />
          </div>
        </div>
      </Modal>

      {/* New Pitch Modal */}
      <Modal
        show={showNewPitchForm}
        title="Create New Pitch"
        onClose={() => setShowNewPitchForm(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Pitch Name</label>
            <CustomInput
              type="text"
              value={newPitchTitle}
              onChange={(e) => setNewPitchTitle(e.target.value)}
              placeholder="e.g., Skincare Brand Pitch"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Pitch Content</label>
            <TextArea
              value={newPitchContent}
              onChange={(e) => setNewPitchContent(e.target.value)}
              placeholder="Write your pitch template here..."
            />
          </div>

          <div className="flex gap-3">
            <CustomButton
              text="Cancel"
              className="btn-cancel w-full"
              onClick={() => {
                setShowNewPitchForm(false);
                setNewPitchTitle("");
                setNewPitchContent("");
              }}
            />
            <CustomButton
              text="Save Pitch"
              className="btn-primary w-full"
              onClick={createNewPitch}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default PitchTemplate;
