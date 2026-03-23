import { FileVideo, Image, Upload } from "lucide-react";
import Modal from "@/common/components/modal/modal.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import TextArea from "@/common/components/text-area/text-area.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import useUploadFileModal from "./use-upload-file-modal.hook";

export default function UploadFileModal({ show, onClose, niches = [] }) {
  const {
    formData,
    handleChange,
    handleSubmit,
    handleClose,
    handleFileSelect,
    handleBrowse,
    fileInputRef,
    selectedFile,
    filePreview,
    fileTypes,
    nicheOptions,
    isLoading,
  } = useUploadFileModal({ show, onClose, niches });

  return (
    <Modal show={show} title="Upload File" onClose={handleClose} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Type Toggle */}
        <div className="flex flex-col gap-[6px] text-xs font-medium capitalize not-italic leading-6 text-text-black">
          <span>File Type</span>
          <div className="grid grid-cols-2 gap-2">
            {fileTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => handleChange("file_type", type.value)}
                className={`py-2 px-4 border-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  formData.file_type === type.value
                    ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                {type.value === "video" ? (
                  <FileVideo className="w-4 h-4" />
                ) : (
                  <Image className="w-4 h-4" />
                )}
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* File Picker */}
        <div className="flex flex-col gap-[6px] text-xs font-medium capitalize not-italic leading-6 text-text-black">
          <span>
            File <span className="text-red-500">*</span>
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept={formData.file_type === "video" ? "video/*" : "image/*"}
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleBrowse}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 hover:bg-indigo-50 transition-all group"
          >
            {selectedFile ? (
              <div className="space-y-1">
                {filePreview ? (
                  <img
                    src={filePreview}
                    alt="preview"
                    className="mx-auto h-24 w-auto rounded object-cover mb-2"
                  />
                ) : (
                  <FileVideo className="mx-auto w-8 h-8 text-indigo-500 mb-2" />
                )}
                <p className="text-sm font-medium text-gray-800 normal-case">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500 normal-case">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB — click to change
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <Upload className="mx-auto w-8 h-8 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                <p className="text-sm font-medium text-gray-600 group-hover:text-indigo-600 normal-case">
                  Click to browse
                </p>
                <p className="text-xs text-gray-400 normal-case">
                  {formData.file_type === "video"
                    ? "MP4, MOV, AVI, WEBM up to 50MB"
                    : "JPEG, PNG, WEBP up to 50MB"}
                </p>
              </div>
            )}
          </button>
        </div>

        <CustomInput
          name="title"
          label="Title (Optional)"
          placeholder="Enter a title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />

        <TextArea
          name="caption"
          label="Caption (Optional)"
          placeholder="Enter a caption"
          value={formData.caption}
          onChange={(e) => handleChange("caption", e.target.value)}
          minRows={2}
        />

        <CustomInput
          name="tags"
          label="Tags (Optional)"
          placeholder="tag1, tag2, tag3"
          value={formData.tags}
          onChange={(e) => handleChange("tags", e.target.value)}
        />
        <p className="-mt-3 text-xs text-gray-500">Separate tags with commas</p>

        {formData.file_type === "video" && (
          <CustomInput
            name="duration"
            label="Duration in seconds (Optional)"
            type="number"
            placeholder="60"
            value={formData.duration}
            onChange={(e) => handleChange("duration", e.target.value)}
          />
        )}

        {nicheOptions.length > 0 && (
          <SimpleSelect
            label="Niche (Optional)"
            placeHolder="Select a niche"
            options={nicheOptions}
            value={formData.niche_id}
            onChange={(option) => handleChange("niche_id", option.value)}
          />
        )}

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-xs text-amber-800 normal-case">
            <strong>Note:</strong> Uploaded files are labeled as unpublished
            samples and will not display metrics.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200">
          <CustomButton
            className="btn-cancel"
            text="Cancel"
            onClick={handleClose}
            type="button"
          />
          <CustomButton
            className="btn-primary"
            text={isLoading ? "Uploading..." : "Upload"}
            type="submit"
            disabled={isLoading || !selectedFile}
          />
        </div>
      </form>
    </Modal>
  );
}
